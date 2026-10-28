# Verificación del rediseño TIUK

Revisión local: 27 de octubre de 2026 (America/Managua).

## Producto y contenido

Se contrastaron las capacidades con los README y el código Flutter de Tiuk y TIUK-All. Los ejemplos educativos son ficticios. La landing distingue las demos de las funciones de la app y explica las condiciones de conectividad. El enlace de exploración usa la página de releases existente; v0.7.0 no tenía instaladores adjuntos y no se fabricaron enlaces de descarga.

## Flujos comprobados en navegador

| Caso | Resultado observado |
| --- | --- |
| Opción múltiple correcta | HP 5 → 4; XP 0 → 50; ataque y explicación |
| Completar «Good morning» | Relleno del espacio, ataque, reducción de HP y suma de XP |
| Ordenar I / am / Tuki | Numeración por selección, comprobación y explicación |
| Cinco aciertos | HP 0/5, 250 XP, enemigo oculto, celebración y «Jugar de nuevo» |
| Tres errores | 0 vidas, HP 5/5, explicaciones y «Reintentar» |
| Cambiar tipo y reiniciar | Selección limpia sin respuestas anteriores |
| Chat «Dame un ejemplo» | Estado pensando, escritura gradual y saludos en inglés y miskito |
| Tuki Live | Pregunta sin respuesta anticipada, feedback, segunda pregunta y sesión completada |
| Live en móvil | Opciones largas se distribuyen en varias filas sin recortarse |
| Constructor | Saludos, cortesía o presentación + Miskito/English → narrativa, pregunta y batalla con parámetros elegidos |
| Editar e insertar | Cambio de narrativa, guardado y confirmación de inserción simulada |
| Menú móvil | Apertura, navegación y cierre con estado aria-expanded coherente |

## Diseño responsive

Revisado en navegador de escritorio y viewport móvil de 390×844. Se corrigió la expansión de las columnas CSS Grid causada por los recursos de ancho fijo. En móvil, `scrollWidth` y `clientWidth` coinciden: no hay desplazamiento horizontal de la página. Las islas se recortan dentro de la escena de forma intencional.

## Video

Flujo de Brag con composición HyperFrames y recursos locales. El check final pasó con 0 errores de ejecución, 0 errores de layout y 84/84 comprobaciones de contraste. Las advertencias estructurales restantes corresponden al montaje monolítico de cinco escenas y reutilización del logo; no afectan la reproducción. Las posiciones fuera de las máscaras del escenario se marcaron como recortes intencionales después de revisar los fotogramas.

Se inspeccionaron fotogramas del MP4 decodificado a los 2, 8, 14, 19.5 y 23.5 segundos. El póster es el momento asentado de batalla a los 8 segundos y también reemplaza el frame 0. FFprobe confirma H.264, 1920×1080, 30 fps, 25.000 s y ausencia de streams de audio. Copia web aproximada: 3 MB.

## Comprobación reproducible

`python3 scripts/verify.py` comprueba recursos HTML y CSS, anclas, IDs únicos, sintaxis JavaScript y el contrato del video. No se requiere instalar dependencias para servir la landing.

## Alcance de las simulaciones

Las demos son implementaciones web inspiradas en los componentes originales; no ejecutan Flutter. Las respuestas del chat y las aventuras se prepararon localmente. La sesión Live es silenciosa y no usa micrófono. No se valida la operación del backend ni de los modelos de IA desde esta landing.

## Ajuste de idiomas y escenario

Las ocho entradas miskito utilizadas se contrastaron con `DATOS_CORPUS_SEED` y la semilla del corpus oficial. Se eliminaron los ejemplos de matemáticas y ciencias tanto de la web como del video. El fondo generado tiene suelo cálido claro, con el bosque azul oscuro al fondo. Los pies y sombras del héroe y enemigo usan el mismo plano y posiciones interiores x=36% / x=64%.
