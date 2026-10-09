import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import logging
import os
import re
import secrets
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import time

from azure.storage.blob import BlobSasPermissions, generate_blob_sas
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logger = logging.getLogger("descargas_api")
logging.basicConfig(level=logging.INFO)

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587") or 587)
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "")
SMTP_TLS = os.environ.get("SMTP_TLS", "true").lower() == "true"
ORIGEN_PERMITIDO = os.environ.get("ORIGEN_PERMITIDO", "*")
AZURE_STORAGE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING", "")
CONTENEDOR = os.environ.get("CONTENEDOR", "apk")
BLOB = os.environ.get("BLOB", "tiuk-estudiante.apk")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGEN_PERMITIDO],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Estructuras de almacenamiento en memoria
codigos: dict[str, dict] = {}
solicitudes_por_correo: dict[str, list[float]] = {}
solicitudes_por_ip: dict[str, list[float]] = {}

PATRON_CORREO = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class SolicitarRequest(BaseModel):
    correo: str


class VerificarRequest(BaseModel):
    correo: str
    codigo: str


def generar_codigo() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def enviar_correo(destino: str, codigo: str) -> None:
    smtp_host = os.environ.get("SMTP_HOST", SMTP_HOST)
    if not smtp_host:
        logger.info("Modo local: código para %s es %s", destino, codigo)
        return

    port_str = os.environ.get("SMTP_PORT", str(SMTP_PORT))
    smtp_port = int(port_str or 587)
    smtp_user = os.environ.get("SMTP_USER", SMTP_USER)
    smtp_password = os.environ.get("SMTP_PASSWORD", SMTP_PASSWORD)
    smtp_from = os.environ.get("SMTP_FROM", SMTP_FROM) or smtp_user
    smtp_tls = os.environ.get("SMTP_TLS", "true" if SMTP_TLS else "false").lower() == "true"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Tu código de descarga TIUK: {codigo}"
    msg["From"] = smtp_from
    msg["To"] = destino

    texto = f"Tu código de descarga TIUK: {codigo}\nVálido por 10 minutos."
    html = f"""<!DOCTYPE html>
<html>
<body>
    <p>Tu código de descarga TIUK: <strong>{codigo}</strong></p>
    <p>Válido por 10 minutos.</p>
</body>
</html>"""

    msg.attach(MIMEText(texto, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        if smtp_tls:
            server.starttls()
        if smtp_user and smtp_password:
            server.login(smtp_user, smtp_password)
        server.send_message(msg)


def generar_url_descarga() -> str:
    conn_str = os.environ.get("AZURE_STORAGE_CONNECTION_STRING", AZURE_STORAGE_CONNECTION_STRING)
    contenedor = os.environ.get("CONTENEDOR", CONTENEDOR)
    blob = os.environ.get("BLOB", BLOB)

    conn_dict = {}
    if conn_str:
        for item in conn_str.split(";"):
            if "=" in item:
                k, v = item.split("=", 1)
                conn_dict[k] = v

    account_name = conn_dict.get("AccountName", "")
    account_key = conn_dict.get("AccountKey", "")
    endpoint_suffix = conn_dict.get("EndpointSuffix", "core.windows.net")

    sas_token = generate_blob_sas(
        account_name=account_name,
        container_name=contenedor,
        blob_name=blob,
        account_key=account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.now(timezone.utc) + timedelta(minutes=10),
        content_disposition='attachment; filename="Tiuk Estudiante.apk"',
    )

    return f"https://{account_name}.blob.{endpoint_suffix}/{contenedor}/{blob}?{sas_token}"


def obtener_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


@app.get("/salud")
def salud():
    return {"ok": True}


@app.post("/solicitar")
async def solicitar(req: SolicitarRequest, request: Request):
    correo_normalizado = req.correo.strip().lower()
    if not PATRON_CORREO.match(correo_normalizado):
        raise HTTPException(status_code=422, detail="Correo inválido")

    ip = obtener_ip(request)
    ahora = time.time()
    limite = ahora - 3600

    timestamps_correo = [t for t in solicitudes_por_correo.get(correo_normalizado, []) if t > limite]
    timestamps_ip = [t for t in solicitudes_por_ip.get(ip, []) if t > limite]

    if len(timestamps_correo) >= 5 or len(timestamps_ip) >= 5:
        solicitudes_por_correo[correo_normalizado] = timestamps_correo
        solicitudes_por_ip[ip] = timestamps_ip
        raise HTTPException(status_code=429, detail="Límite de solicitudes excedido")

    timestamps_correo.append(ahora)
    timestamps_ip.append(ahora)
    solicitudes_por_correo[correo_normalizado] = timestamps_correo
    solicitudes_por_ip[ip] = timestamps_ip

    codigo = generar_codigo()
    hash_codigo = hashlib.sha256(f"{correo_normalizado}:{codigo}".encode("utf-8")).hexdigest()
    codigos[correo_normalizado] = {
        "hash": hash_codigo,
        "expira": ahora + 600,
        "intentos": 0,
    }

    try:
        await asyncio.to_thread(enviar_correo, correo_normalizado, codigo)
    except Exception as exc:
        logger.error("Error al enviar correo: %s", exc)

    return {"enviado": True}


@app.post("/verificar")
def verificar(req: VerificarRequest):
    correo_normalizado = req.correo.strip().lower()
    codigo = req.codigo.strip()

    if correo_normalizado not in codigos:
        raise HTTPException(status_code=400, detail="Código incorrecto o vencido")

    datos = codigos[correo_normalizado]
    if time.time() > datos["expira"]:
        del codigos[correo_normalizado]
        raise HTTPException(status_code=400, detail="Código incorrecto o vencido")

    hash_candidato = hashlib.sha256(f"{correo_normalizado}:{codigo}".encode("utf-8")).hexdigest()
    if hmac.compare_digest(datos["hash"], hash_candidato):
        del codigos[correo_normalizado]
        url = generar_url_descarga()
        return {"url": url}

    datos["intentos"] += 1
    if datos["intentos"] >= 5:
        del codigos[correo_normalizado]
        raise HTTPException(status_code=429, detail="Máximo de intentos alcanzado")

    raise HTTPException(status_code=400, detail="Código incorrecto o vencido")
