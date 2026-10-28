# Brag Plan — TIUK

## Product and nine-question rubric
1. TIUK turns lessons into RPG adventures and equips teachers with a narrative-first lesson constructor.
2. The impressive moment: an answer becomes a physical attack, and a teacher's topic becomes a playable story.
3. Visual hook: original Tuki mascot standing on the floating jungle island, cream paper and fresh green type. Combat uses an ImageGen forest courtyard with a clear warm stone floor.
4. Show the actual app's split RPG theatre/question layout, Tutor Tuki chat, Live question controls and lesson constructor, recreated from Flutter source with original assets.
5. 25 seconds, landscape 1920×1080. Embedded in the landing; no voice, music or SFX, as explicitly requested.
6. Tone: playful/polished. Direction: a school question opens a living world. Fast arrivals, readable holds, coherent green/off-white branding.
7. Intentionally silent. No audio asset or audio-reactive treatment.
8. Share copy: “Una pregunta se convierte en un ataque. Un tema de clase, en una aventura. Así se aprende con TIUK y Profe Tuki.”
9. User flow: choose Tingki → attack and earn XP; ask Tuki → receive an example and answer a Live question; enter a topic → generate narrative and lesson blocks.

## Source grounding
- ../Tiuk/frontend/packages/ui_core/lib/widgets/teatro_rpg.dart: split theatre, HP and feedback.
- ../Tiuk/frontend/packages/ui_core/lib/flame/componentes/: original animated hero/enemy assets.
- ../Tiuk/frontend/apps/estudiante/lib/features/tutor/: chat, speaking/thinking states and Live question/answer controls.
- ../Tiuk/frontend/apps/docente/lib/features/constructor/widgets/dialogo_generar_aventura_desktop.dart: topic, language, setting, narrative-first generation and insert blocks.
- Lesson scenarios are fictional; Miskito vocabulary and translations are transcribed from the source corpus. Chat replies are prepared locally. No personal data.

## Visual identity
LOOK: warm paper #f7f9f2, forest #19372c, green #258449, lime #d5f479. Nunito Black display / DM Sans body. Original islands, Tuki expressions, hero/goblin sprite sheets. Dark student UI remains #0f172a with #2dd4bf accents.

## Storyboard — 25 seconds
- 0–3.5s / Hook: “¿Otra tarea?” becomes “Otra aventura.” Tuki, jungle island and logo arrive with depth. Fully readable 1.8s.
- 3.5–10s / Battle: “Responde. Ataca. Aprende.” Original RPG sprites and Miskito greeting question. Select Tingki at 5.3s, advance hero at 6.0s, impact and +50 XP at 6.5s. Hold correct explanation and HP 4/5.
- 10–16s / Tutor: “La duda no termina la aventura.” Chat asks how to say thanks in Miskito; Tingki / Tingki pali use the source corpus. Tuki Live asks for the English translation of Buenos días; Good morning highlights. Two UI panels, short copy, hold.
- 16–21.5s / Teacher: “Un tema. Toda una misión.” “Saludos y despedidas” becomes “La puerta de los saludos” with narrative, question and battle blocks. Teacher review is visible. Hold output 2.6s.
- 21.5–25s / Outro: Tuki and island return. “De «no entiendo» a «otro nivel».” TIUK brand and “Una misión más.” hold to end.

## Transition and motion
Slide/lift panels with soft easing and readable holds. Tuki, original islands and sprites carry the motion. Text-stagger registry primitive informs heading entrances. No unrelated visual filler.

## Delivery
Local HyperFrames composition; validate runtime/layout/contrast, inspect all scenes, render MP4, choose settled battle poster, bake frame 0, embed in assets/video. User explicitly requested the completed video and embed; proceed through render autonomously.

## Revisión: idiomas y legibilidad
Todos los ejemplos se enfocan en inglés o miskito, con español como lengua de explicación. Fuente léxica: TIUK-All/backend/scripts/seed_miskito.py; copia auditable en assets/data/miskito-demo.json. No se inventa gramática miskito. El nuevo escenario de combate sustituye la isla por un suelo continuo; pies y sombras comparten plano dentro de la zona central.
