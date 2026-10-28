#!/usr/bin/env python3
"""Verifica el paquete estático y el contrato del video integrado, sin dependencias."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
errors = []
references = []
ids = []
anchors = []

class Page(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            ids.append(attrs['id'])
        for key in ('src', 'href', 'poster'):
            value = attrs.get(key, '')
            if value.startswith('#'):
                anchors.append(value[1:])
            elif value and not urlsplit(value).scheme and not value.startswith('//'):
                references.append(ROOT / unquote(urlsplit(value).path))
        if tag == 'img' and 'alt' not in attrs:
            errors.append('Imagen sin texto alternativo, incluso decorativo.')

Page().feed((ROOT / 'index.html').read_text())
for path in references:
    if not path.is_file() or path.stat().st_size == 0:
        errors.append(f'Recurso ausente o vacío: {path.relative_to(ROOT)}')
for anchor in anchors:
    if anchor not in ids:
        errors.append(f'Ancla sin destino: #{anchor}')
if len(ids) != len(set(ids)):
    errors.append('IDs duplicados en la página.')
css = ROOT / 'css/estilos.css'
for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)', css.read_text()):
    if not urlsplit(url).scheme and not (css.parent / url).is_file():
        errors.append(f'Recurso CSS ausente: {url}')
for script in ('principal.js', 'battle.js', 'idiomas.js'):
    result = subprocess.run(['node', '--check', str(ROOT / 'js' / script)], capture_output=True, text=True)
    if result.returncode:
        errors.append(result.stderr)
video = ROOT / 'assets/video/tiuk-promo.mp4'
if video.exists():
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(video)], capture_output=True, text=True)
    if result.returncode:
        errors.append(result.stderr)
    else:
        data = json.loads(result.stdout)
        streams = data['streams']
        if any(s['codec_type'] == 'audio' for s in streams):
            errors.append('El video contiene audio.')
        picture = next((s for s in streams if s['codec_type'] == 'video'), {})
        if (picture.get('width'), picture.get('height')) != (1920, 1080):
            errors.append('La resolución no es Full HD.')
        if picture.get('r_frame_rate') != '30/1':
            errors.append('El video no tiene 30 fps.')
        if abs(float(data['format']['duration']) - 25) > .1:
            errors.append('La duración del video no es de 25 segundos.')
# Evitar que regresen ejemplos de otras materias a la interfaz o al video.
for relative in ('index.html', 'js/idiomas.js', 'js/principal.js',
                 'brag-output/composition/source/index.template',
                 'brag-output/composition/index.html'):
    content = (ROOT / relative).read_text().lower()
    if re.search(r'fracci[oó]n|matem[aá]tica|ciclo del agua|evaporaci[oó]n|condensaci[oó]n|pizza|[½¼¾]', content):
        errors.append(f'Ejemplo ajeno a idiomas en {relative}')
if not (ROOT / 'assets/game/arena-idiomas.webp').is_file():
    errors.append('Falta el fondo de combate generado.')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'OK: {len(references)} recursos HTML, {len(anchors)} anclas, IDs únicos, recursos CSS, JavaScript y video Full HD/30 fps/25 s/sin audio.')
