import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).parent))

import main
from main import app, codigos, solicitudes_por_correo, solicitudes_por_ip


@pytest.fixture(autouse=True)
def limpiar_estado():
    codigos.clear()
    solicitudes_por_correo.clear()
    solicitudes_por_ip.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_salud(client):
    response = client.get("/salud")
    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_solicitud_valida(client, monkeypatch):
    enviados = []
    monkeypatch.setattr(main, "enviar_correo", lambda d, c: enviados.append((d, c)))

    response = client.post("/solicitar", json={"correo": "usuario@example.com"})
    assert response.status_code == 200
    assert response.json() == {"enviado": True}
    assert len(enviados) == 1
    assert enviados[0][0] == "usuario@example.com"
    assert len(enviados[0][1]) == 6


def test_correo_invalido_422(client):
    response = client.post("/solicitar", json={"correo": "correo-invalido"})
    assert response.status_code == 422

    response2 = client.post("/solicitar", json={"correo": "@sinusuario.com"})
    assert response2.status_code == 422

    response3 = client.post("/solicitar", json={"correo": "usuario@sindominio"})
    assert response3.status_code == 422


def test_codigo_correcto_devuelve_url_y_es_de_un_solo_uso(client, monkeypatch):
    monkeypatch.setattr(main, "generar_codigo", lambda: "123456")
    test_url = "https://azure.storage/apk/tiuk-estudiante.apk?sas=token"
    monkeypatch.setattr(main, "generar_url_descarga", lambda: test_url)
    monkeypatch.setattr(main, "enviar_correo", lambda d, c: None)

    solicitud = client.post("/solicitar", json={"correo": "descarga@example.com"})
    assert solicitud.status_code == 200

    # Primer intento: código correcto devuelve la URL SAS
    res_verificar = client.post(
        "/verificar",
        json={"correo": "descarga@example.com", "codigo": "123456"},
    )
    assert res_verificar.status_code == 200
    assert res_verificar.json() == {"url": test_url}

    # Segundo intento con el mismo código: debe haber sido consumido (de un solo uso)
    res_reintento = client.post(
        "/verificar",
        json={"correo": "descarga@example.com", "codigo": "123456"},
    )
    assert res_reintento.status_code == 400
    assert res_reintento.json() == {"detail": "Código incorrecto o vencido"}


def test_codigo_incorrecto_400(client, monkeypatch):
    monkeypatch.setattr(main, "generar_codigo", lambda: "123456")
    monkeypatch.setattr(main, "enviar_correo", lambda d, c: None)

    client.post("/solicitar", json={"correo": "fallo@example.com"})

    response = client.post(
        "/verificar",
        json={"correo": "fallo@example.com", "codigo": "999999"},
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Código incorrecto o vencido"}


def test_5_intentos_fallidos_429(client, monkeypatch):
    monkeypatch.setattr(main, "generar_codigo", lambda: "123456")
    monkeypatch.setattr(main, "enviar_correo", lambda d, c: None)

    client.post("/solicitar", json={"correo": "bloqueo@example.com"})

    # Los primeros 4 intentos incorrectos devuelven 400
    for _ in range(4):
        res = client.post(
            "/verificar",
            json={"correo": "bloqueo@example.com", "codigo": "000000"},
        )
        assert res.status_code == 400
        assert res.json() == {"detail": "Código incorrecto o vencido"}

    # El 5º intento fallido alcanza el límite, invalida el código y responde 429
    res_5 = client.post(
        "/verificar",
        json={"correo": "bloqueo@example.com", "codigo": "000000"},
    )
    assert res_5.status_code == 429

    # Verificamos que el código fue invalidado (incluso enviando el código correcto)
    res_invalido = client.post(
        "/verificar",
        json={"correo": "bloqueo@example.com", "codigo": "123456"},
    )
    assert res_invalido.status_code == 400
    assert res_invalido.json() == {"detail": "Código incorrecto o vencido"}


def test_limite_6a_solicitud_429(client, monkeypatch):
    monkeypatch.setattr(main, "enviar_correo", lambda d, c: None)

    correo = "rate_limit@example.com"
    for _ in range(5):
        res = client.post("/solicitar", json={"correo": correo})
        assert res.status_code == 200
        assert res.json() == {"enviado": True}

    # La 6ª solicitud para el mismo correo/IP debe responder 429
    res_6 = client.post("/solicitar", json={"correo": correo})
    assert res_6.status_code == 429
