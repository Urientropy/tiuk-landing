# Léxico de las demostraciones

Las entradas se transcriben del corpus de TIUK-All, `backend/scripts/seed_miskito.py` (`DATOS_CORPUS_SEED`). `semilla_corpus_oficial.py` usa estas entradas para el corpus oficial. Se conservan la ortografía y las traducciones. No se genera gramática ni pronunciación miskito.

| Miskito | Traducción del corpus |
| --- | --- |
| Naksa | Hola / ¿Cómo estás? |
| Yamni sa | Estoy bien / Bien |
| Yua yamni | Buenos días |
| Tihmia yamni | Buenas noches |
| Kaisina | Adiós / Nos vemos |
| Man nini ya? | ¿Cómo te llamas? |
| Tingki | Gracias |
| Tingki pali | Muchas gracias |

Los ejemplos ingleses cubren saludos, cortesía y presentación personal. El español es la lengua de explicación. El constructor permite elegir Miskito o English como idioma a aprender.

La copia auditable del léxico está en `assets/data/miskito-demo.json`; las preguntas, respuestas y aventuras viven en `js/idiomas.js`.
