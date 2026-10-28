# TIUK — Un mundo por entender

Landing estática en español, rediseñada con fondo claro, verde bosque, superficies menta y recursos originales de TIUK. No necesita compilación ni backend.

## Ver en local

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Sirve `index.html`, `css/`, `js/` y `assets/` directamente con GitHub Pages. Este trabajo local no publica ni modifica los repositorios de referencia.

## Demos interactivas

- Islas con parallax por scroll y puntero. Tuki parpadea, habla y celebra usando sus frames originales.
- Batalla con héroe y Bestia del Valle: ataques, HP, vidas, XP, explicaciones, victoria, derrota y reinicio.
- Preguntas de opción múltiple, completar y ordenar. Pestañas accesibles con flechas, Inicio y Fin.
- Chat con escritura progresiva, sugerencias y respuestas preparadas sobre saludos, cortesía y presentación en inglés y miskito.
- Tuki Live: sesión silenciosa con estados, contador, preguntas y feedback; permite terminar y repetir.
- Constructor docente con tres temas, grado, idioma a aprender Miskito/English y ambientación. Vista previa de narrativa, pregunta y batalla, edición e inserción simulada.
- Video promocional de 25 segundos, 1920×1080, 30 fps, sin audio, con controles y póster.

Las demos son recreaciones locales con contenido educativo de ejemplo, identificadas como simulaciones. No ejecutan las apps Flutter, no conectan con una IA ni solicitan micrófono. Los textos reflejan las condiciones reales: lecciones descargadas, modelo instalado para chat local y conexión para voz en vivo.

## Referencias

Se consultaron `Urientropy/Tiuk` y `Urientropy/TIUK-All`. Flujos y recursos provienen de:

| Experiencia | Ruta en el monorepo Tiuk |
| --- | --- |
| Escenario, HP y sprites | `frontend/packages/ui_core/lib/widgets/teatro_rpg.dart` y `lib/flame/` |
| Ejercicios | `frontend/packages/ui_core/lib/widgets/ejercicio/` |
| Tutor y Live | `frontend/apps/estudiante/lib/features/tutor/` |
| Constructor | `frontend/apps/docente/lib/features/constructor/widgets/dialogo_generar_aventura_desktop.dart` |
| Marca y gráficos | `frontend/packages/ui_core/assets/` |

## Video: Brag + HyperFrames

Se siguió [latent-spaces/brag](https://github.com/latent-spaces/brag) con música, SFX y narración desactivados. `brag-output/` contiene el plan, brief, texto para compartir, MP4, póster y composición editable.

Para modificar el video, edita `brag-output/composition/source/index.template`, `film.css` y `film.js`:

```bash
cd brag-output/composition
python3 build-composition.py
npm run check
npx hyperframes preview --background
npm run render -- --quality delivery --fps 30 --output ../brag.mp4
```

La composición usa fuentes y assets locales y un timeline GSAP determinista. El CLI está fijado en `package.json`. La copia para la web y su póster están en `assets/video/`. Brag y HyperFrames no son necesarios para servir la landing.

## Accesibilidad y rendimiento

Navegación semántica, formularios etiquetados y foco visible. Se respeta `prefers-reduced-motion` y se puede pausar el movimiento. El canvas no dibuja fuera de vista ni con la pestaña oculta. Fuentes locales, islas WebP y sprites PNG. Video sin autoplay, con `preload="none"`, pausado al salir de vista. Los mensajes del visitante se renderizan como texto, sin interpretar HTML.

## Verificación

```bash
node --check js/principal.js
node --check js/battle.js
python3 scripts/verify.py
```

`docs/VERIFICACION.md` documenta los flujos comprobados en navegador y las condiciones de las demos.

Mascota, marca y gráficos: © TIUK. Nunito y DM Sans: SIL Open Font License, incluida en `assets/fonts/`.

El léxico miskito está documentado en `docs/LEXICO-DEMO.md`. El fondo de combate generado, su prompt y las coordenadas de apoyo se documentan en `docs/ARENA-IMAGEN.md`.

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica `index.html`, `css/`, `js/` y `assets/` cuando se actualiza `main`. También se puede ejecutar manualmente. La documentación, el proyecto editable del video y el servicio antiguo de descargas no forman parte del sitio publicado.

Pages debe estar habilitado con GitHub Actions como origen. Si GitHub no permite activarlo por el plan o la visibilidad del repositorio, el workflow informa que está pendiente y omite la publicación. Tras habilitar Pages, basta con ejecutar el workflow manualmente o hacer un nuevo push.
