/* Ejemplos locales de aprendizaje de idiomas.
 * El léxico miskito se transcribe de DATOS_CORPUS_SEED en
 * TIUK-All/backend/scripts/seed_miskito.py. No se inventan formas ni gramática.
 */
(() => {
  const questions = {
    choice: [
      {
        meta: "MISKITO · SALUDOS Y CORTESÍA",
        title: "¿Cómo dices «Gracias» en miskito?",
        answers: ["Naksa", "Tingki", "Kaisina", "Yamni sa"],
        correct: 1,
        explanation:
          "Tingki significa «Gracias». Naksa es «Hola / ¿Cómo estás?».",
      },
      {
        meta: "MISKITO · SALUDOS",
        title: "¿Qué significa «Yua yamni»?",
        answers: ["Buenas noches", "Adiós", "Buenos días", "Gracias"],
        correct: 2,
        explanation:
          "Yua yamni significa «Buenos días». Para «Buenas noches», el corpus recoge Tihmia yamni.",
      },
      {
        meta: "MISKITO · CORTESÍA",
        title: "¿Qué expresión significa «Muchas gracias»?",
        answers: ["Naksa", "Kaisina", "Tingki pali", "Yua yamni"],
        correct: 2,
        explanation:
          "Tingki pali significa «Muchas gracias». Tingki significa «Gracias».",
      },
    ],
    complete: [
      {
        meta: "ENGLISH · GREETINGS",
        title:
          'En inglés, «Buenos días» se dice <span class="blank">___</span>.',
        answers: ["Good morning", "Good night", "Thank you"],
        correct: 0,
        explanation:
          "Good morning significa «Buenos días». Good night significa «Buenas noches».",
      },
      {
        meta: "ENGLISH · POLITE EXPRESSIONS",
        title:
          'Para dar las gracias en inglés, di <span class="blank">___</span>.',
        answers: ["Goodbye", "Thank you", "Hello"],
        correct: 1,
        explanation:
          "Thank you significa «Gracias». Usa Hello para saludar y Goodbye para despedirte.",
      },
    ],
    order: [
      {
        meta: "ENGLISH · INTRODUCING YOURSELF",
        title: "Ordena las palabras para decir «Yo soy Tuki».",
        answers: ["am", "I", "Tuki"],
        correct: [1, 0, 2],
        explanation: "I + am + Tuki → I am Tuki. Así te presentas en inglés.",
      },
      {
        meta: "ENGLISH · ASKING A NAME",
        title: "Ordena los fragmentos: «¿Cómo te llamas?».",
        answers: ["your name?", "What", "is"],
        correct: [1, 2, 0],
        explanation:
          "What + is + your name? → What is your name? Significa «¿Cómo te llamas?».",
      },
    ],
  };
  const chatReplies = {
    ejemplo:
      "Imagina que llegas a clase: en inglés puedes decir «Good morning» («Buenos días»). En el corpus miskito de TIUK, «Yua yamni» tiene esa misma traducción. Dos idiomas para abrir una conversación.",
    explica:
      "El corpus distingue «Tingki» («Gracias») y «Tingki pali» («Muchas gracias»). Para saludar recoge «Naksa» («Hola / ¿Cómo estás?»). En esta demo usamos esas formas tal como aparecen en el corpus.",
    reto: "¡Tu turno! ¿Cómo dices «Gracias» en miskito? Escribe «Tingki». Después podemos practicar «Buenos días» en inglés.",
    miskito:
      "Practiquemos el corpus miskito: Naksa → Hola / ¿Cómo estás?; Yua yamni → Buenos días; Tihmia yamni → Buenas noches; Tingki → Gracias; Kaisina → Adiós / Nos vemos. ¿Cuál usarías para agradecer?",
    ingles:
      "Para empezar en inglés: Hello → Hola; Good morning → Buenos días; Good night → Buenas noches; Thank you → Gracias. Y para presentarte: «I am Tuki» significa «Yo soy Tuki».",
    correct:
      "¡Tingki! Esa es la palabra que el corpus de TIUK traduce como «Gracias». «Tingki pali» significa «Muchas gracias». Ya tienes dos expresiones para practicar.",
    correctEnglish:
      "¡Good morning! Significa «Buenos días». «Good night» es «Buenas noches». ¿Probamos ahora cómo dar las gracias: «Thank you»?",
    fallback:
      "En esta demo practicamos inglés y miskito con ejemplos preparados. Prueba «saludos en miskito», «presentarme en inglés», «Tingki» o los botones de ejemplo. En la app, el tutor trabaja con el contenido de tus lecciones.",
  };
  const liveSteps = [
    {
      question: "¿Cómo dices «Gracias» en miskito?",
      answers: ["Naksa", "Tingki", "Kaisina"],
      correct: 1,
      feedback: "¡Tingki! El corpus de TIUK recoge esa palabra para «Gracias».",
    },
    {
      question: "¿Qué saludo en inglés significa «Buenos días»?",
      answers: ["Good night", "Good morning", "Goodbye"],
      correct: 1,
      feedback:
        "¡Good morning! Significa «Buenos días». Un saludo más para tu próxima conversación.",
    },
  ];
  const lessonExamples = {
    saludos: {
      title: "La puerta de los saludos",
      narrative:
        "Tuki llega a una comunidad del reino. Para abrir la conversación, practica Naksa, Yua yamni y Tihmia yamni con sus traducciones del corpus.",
      question: "¿Qué significa «Yua yamni»?",
      answer: "Buenos días",
      goal: "Relacionar tres saludos del corpus con su traducción.",
      battle:
        "Abre la puerta del reino asociando Naksa con «Hola / ¿Cómo estás?» y Tihmia yamni con «Buenas noches».",
      en: {
        title: "La puerta de los saludos",
        narrative:
          "Tuki llega a una nueva clase. Ayúdalo a saludar en inglés: Hello, Good morning y Good night. Elige la expresión que corresponde a cada traducción.",
        question: "¿Cómo dices «Buenos días» en inglés?",
        answer: "Good morning",
        goal: "Reconocer y elegir saludos en inglés.",
        battle:
          "Abre la puerta del reino asociando Hello, Good morning y Good night con sus traducciones.",
      },
    },
    cortesia: {
      title: "El puente de las palabras amables",
      narrative:
        "Después de recibir ayuda para cruzar el puente, Tuki quiere agradecer. Explora Tingki y Tingki pali: dos expresiones que ya están en el corpus miskito.",
      question: "¿Cómo dices «Muchas gracias» en miskito?",
      answer: "Tingki pali",
      goal: "Distinguir «Gracias» y «Muchas gracias» con léxico del corpus.",
      battle:
        "Supera al guardián eligiendo Tingki para «Gracias» y Tingki pali para «Muchas gracias».",
      en: {
        title: "El puente de las palabras amables",
        narrative:
          "Un compañero ayuda a Tuki a cruzar el puente. Practica Thank you, Please y You are welcome para responder con cortesía en inglés.",
        question: "¿Qué expresión en inglés significa «Gracias»?",
        answer: "Thank you",
        goal: "Usar expresiones de cortesía en inglés.",
        battle:
          "Supera al guardián asociando Thank you, Please y You are welcome con sus traducciones.",
      },
    },
    presentaciones: {
      title: "Un nombre para empezar la aventura",
      narrative:
        "Tuki conoce a sus compañeros de expedición. Consulta la entrada Man nini ya? y su traducción «¿Cómo te llamas?», sin inventar frases fuera del corpus.",
      question: "¿Qué significa «Man nini ya?»?",
      answer: "¿Cómo te llamas?",
      goal: "Reconocer una pregunta de presentación registrada en el corpus.",
      battle:
        "Desbloquea el camino identificando Man nini ya? («¿Cómo te llamas?») y Kaisina («Adiós / Nos vemos»).",
      en: {
        title: "Un nombre para empezar la aventura",
        narrative:
          "Tuki conoce a un compañero de expedición. Practica What is your name? y ordena I am Tuki para aprender a preguntar y presentarte en inglés.",
        question: "¿Qué frase significa «Yo soy Tuki»?",
        answer: "I am Tuki",
        goal: "Preguntar un nombre y presentarse en inglés.",
        battle:
          "Desbloquea el camino ordenando What / is / your name? y I / am / Tuki.",
      },
    },
  };
  const defaultSettings = {
    saludos: "La entrada a un reino se abre con un saludo.",
    cortesia: "Un puente que se cruza con palabras amables.",
    presentaciones: "Una expedición comienza conociendo a tus compañeros.",
  };
  window.TiukLessons = Object.freeze({
    questions,
    chatReplies,
    liveSteps,
    lessonExamples,
    defaultSettings,
  });
})();
