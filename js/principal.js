(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let motionPaused = reducedMotion.matches;
  if (!motionPaused) document.body.classList.add("js-motion");
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          reveal.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  $$(".reveal").forEach((el) => reveal.observe(el));
  const menu = $(".menu-toggle");
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    $(".nav").classList.remove("open");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    $(".nav").classList.toggle("open", open);
  });
  $$(".nav a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });

  let scrollScheduled = false;
  const onScroll = () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      $(".scroll-progress").style.transform =
        `scaleX(${max > 0 ? scrollY / max : 0})`;
      if (!motionPaused && innerWidth > 600) {
        const y = Math.min(scrollY, 850);
        $$("[data-depth]").forEach((el) => {
          el.style.setProperty(
            "--scroll-y",
            `${y * Number(el.dataset.depth)}px`,
          );
        });
      }
      scrollScheduled = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  $("#hero-world").addEventListener("pointermove", (e) => {
    if (motionPaused || e.pointerType !== "mouse" || innerWidth < 900) return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.rotate = `${x * 1.3}deg`;
    e.currentTarget.querySelectorAll("[data-depth]").forEach((el) => {
      const depth = Number(el.dataset.depth) * 200;
      el.style.setProperty("--pointer-x", `${x * depth}px`);
      el.style.setProperty("--pointer-y", `${y * depth}px`);
    });
  });
  $("#hero-world").addEventListener("pointerleave", (e) => {
    e.currentTarget.style.rotate = "0deg";
    e.currentTarget.querySelectorAll("[data-depth]").forEach((el) => {
      el.style.setProperty("--pointer-x", "0px");
      el.style.setProperty("--pointer-y", "0px");
    });
  });
  const tuki = $("#tuki-animado");
  const poses = {
    idle: "tuki-idle",
    blink: "tuki-blink",
    talk: "tuki-hablando",
    closed: "tuki-hablando-boca-cerrada",
    think: "tuki-pensando",
    celebrate: "tuki-celebracion",
  };
  Object.values(poses).forEach((name) => {
    const im = new Image();
    im.src = `assets/img/${name}.webp`;
  });
  let talking = false,
    talkTimer,
    blinkTimeout;
  setInterval(() => {
    if (motionPaused || talking || document.hidden || scrollY > 950) return;
    tuki.src = `assets/img/${poses.blink}.webp`;
    blinkTimeout = setTimeout(() => {
      if (!talking) tuki.src = `assets/img/${poses.idle}.webp`;
    }, 150);
  }, 3500);
  const greetings = [
    "¡Tu curiosidad es tu superpoder!",
    "Una pregunta puede abrir todo un mundo.",
    "¿Probamos una batalla? ¡Tú eliges!",
    "Si te equivocas, lo intentamos juntos.",
  ];
  let greetingIndex = 0;
  $("#saludar").addEventListener("click", () => {
    clearInterval(talkTimer);
    clearTimeout(blinkTimeout);
    talking = true;
    const text = greetings[++greetingIndex % greetings.length];
    $("#hero-speech").textContent = text;
    $("#saludar").classList.remove("celebrating");
    if (!motionPaused) {
      void tuki.offsetWidth;
      $("#saludar").classList.add("celebrating");
    }
    tuki.src = `assets/img/${poses.celebrate}.webp`;
    setTimeout(() => {
      let count = 0;
      if (motionPaused) {
        tuki.src = `assets/img/${poses.idle}.webp`;
        talking = false;
        return;
      }
      talkTimer = setInterval(() => {
        tuki.src = `assets/img/${++count % 2 ? poses.talk : poses.closed}.webp`;
        if (count > 12) {
          clearInterval(talkTimer);
          talking = false;
          tuki.src = `assets/img/${poses.idle}.webp`;
        }
      }, 140);
    }, 650);
  });

  const battle = new window.TiukBattle($("#battle-canvas"));
  battle.start();
  $("#motion-toggle").setAttribute("aria-pressed", String(motionPaused));
  function updateMotion() {
    document.body.classList.toggle("motion-paused", motionPaused);
    $("#motion-toggle").setAttribute("aria-pressed", String(motionPaused));
    $("#motion-toggle").innerHTML = motionPaused
      ? "Activar movimiento <span>▶</span>"
      : "Pausar movimiento <span>Ⅱ</span>";
    battle.paused = motionPaused;
    $$("[data-depth]").forEach((el) => {
      el.style.setProperty("--scroll-y", "0px");
      el.style.setProperty("--pointer-x", "0px");
      el.style.setProperty("--pointer-y", "0px");
    });
    if (motionPaused) {
      clearInterval(talkTimer);
      talking = false;
      $("#promo-video").pause();
      tuki.src = `assets/img/${poses.idle}.webp`;
    }
  }
  updateMotion();
  $("#motion-toggle").addEventListener("click", () => {
    motionPaused = !motionPaused;
    updateMotion();
  });
  reducedMotion.addEventListener("change", (e) => {
    motionPaused = e.matches;
    updateMotion();
  });

  function celebrate() {
    if (motionPaused) return;
    const colors = ["#b8de65", "#258449", "#ffcb79", "#2dd4bf"];
    for (let i = 0; i < 32; i++) {
      const piece = document.createElement("i");
      piece.className = "confetti";
      const angle = (i / 32) * Math.PI * 2;
      piece.style.setProperty(
        "--dx",
        `${Math.cos(angle) * (120 + (i % 5) * 45)}px`,
      );
      piece.style.setProperty("--dy", `${Math.sin(angle) * 180 + 220}px`);
      piece.style.setProperty("--rotation", `${i * 67}deg`);
      piece.style.background = colors[i % colors.length];
      $("#celebration").append(piece);
      setTimeout(() => piece.remove(), 1400);
    }
  }
  const { questions, chatReplies, liveSteps, lessonExamples, defaultSettings } =
    window.TiukLessons;
  let exerciseType = "choice",
    questionIndex = 0,
    selected = null,
    order = [],
    hp = 5,
    lives = 3,
    xp = 0,
    gameState = "question",
    gameTimer;
  const currentQuestion = () =>
    questions[exerciseType][questionIndex % questions[exerciseType].length];
  function renderQuestion() {
    clearTimeout(gameTimer);
    gameState = "question";
    selected = null;
    order = [];
    const q = currentQuestion(),
      panel = $("#exercise-panel");
    $(".game-hud small").textContent = q.meta.startsWith("ENGLISH")
      ? "REINO DE INGLÉS"
      : "REINO MISKITO";
    panel.setAttribute("aria-labelledby", `tab-${exerciseType}`);
    panel.innerHTML = `<div class="question-meta"><span>${q.meta}</span><span>RETO ${questionIndex + 1}</span></div><h4 class="question-title">${q.title}</h4><div class="${exerciseType === "choice" ? "answer-grid" : exerciseType === "complete" ? "word-bank" : "sequence"}">${q.answers.map((answer, i) => `<button class="${exerciseType === "choice" ? "answer" : "word-chip"}" type="button" data-answer="${i}" aria-pressed="false">${exerciseType === "choice" ? `<span>${String.fromCharCode(65 + i)}</span>` : ""}${answer}</button>`).join("")}</div>`;
    $("#check-answer").textContent = "Comprobar →";
    $("#check-answer").disabled = false;
    $("#game-feedback").textContent =
      exerciseType === "order"
        ? "Toca los fragmentos en el orden correcto."
        : "Elige tu respuesta para lanzar un ataque.";
    panel.querySelectorAll("[data-answer]").forEach((button) =>
      button.addEventListener("click", () => {
        if (gameState !== "question") return;
        const i = Number(button.dataset.answer);
        if (exerciseType === "order") {
          if (order.includes(i)) order = order.filter((n) => n !== i);
          else order.push(i);
          panel.querySelectorAll("[data-answer]").forEach((b) => {
            const idx = order.indexOf(Number(b.dataset.answer));
            b.classList.toggle("selected", idx !== -1);
            b.setAttribute("aria-pressed", String(idx !== -1));
            b.innerHTML = `${idx !== -1 ? `<span class="order-index">${idx + 1}</span>` : ""}${q.answers[Number(b.dataset.answer)]}`;
          });
        } else {
          selected = i;
          panel.querySelectorAll("[data-answer]").forEach((b) => {
            b.classList.toggle("selected", b === button);
            b.setAttribute("aria-pressed", String(b === button));
          });
          if (exerciseType === "complete")
            panel.querySelector(".blank").textContent = q.answers[i];
        }
      }),
    );
  }
  function updateHud() {
    $("#hp-label").textContent = `HP ${hp}/5`;
    $("#hp-bar").style.width = `${(hp / 5) * 100}%`;
    $("#game-hearts").textContent =
      "♥ ".repeat(lives) + "♡ ".repeat(3 - lives);
    $("#game-hearts").setAttribute("aria-label", `${lives} vidas`);
    $("#game-xp").textContent = `✦ ${xp} XP`;
  }
  function toast(text) {
    const el = $("#battle-toast");
    el.textContent = text;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 1800);
  }
  $("#check-answer").addEventListener("click", () => {
    if (gameState === "done" || gameState === "lost") {
      resetGame();
      return;
    }
    if (gameState === "feedback") {
      questionIndex++;
      renderQuestion();
      return;
    }
    if (gameState !== "question") return;
    if (exerciseType === "order" ? order.length !== 3 : selected === null) {
      $("#game-feedback").textContent =
        exerciseType === "order"
          ? "Selecciona los tres pasos antes de comprobar."
          : "Primero elige una respuesta.";
      return;
    }
    const q = currentQuestion(),
      correct =
        exerciseType === "order"
          ? order.every((n, i) => n === q.correct[i])
          : selected === q.correct;
    gameState = "animating";
    $("#check-answer").disabled = true;
    $$("#exercise-panel [data-answer]").forEach((b) => {
      const i = Number(b.dataset.answer);
      if (exerciseType !== "order") {
        b.classList.toggle("correct", i === q.correct);
        b.classList.toggle("wrong", i === selected && !correct);
      }
    });
    if (correct) {
      hp = Math.max(0, hp - 1);
      xp += 50;
      battle.playAction("attack");
      toast("+50 XP · ¡Buen ataque!");
      $("#game-feedback").textContent = q.explanation;
    } else {
      lives = Math.max(0, lives - 1);
      battle.playAction("counter");
      toast("¡El enemigo contraataca!");
      $("#game-feedback").textContent =
        `Aprendamos del intento: ${q.explanation}`;
    }
    updateHud();
    gameTimer = setTimeout(
      () => {
        $("#check-answer").disabled = false;
        if (hp === 0) {
          gameState = "done";
          battle.enemyVisible = false;
          toast("¡Misión completada!");
          $("#game-feedback").textContent =
            `¡Victoria! Ganaste ${xp} XP. Tu conocimiento abrió el camino.`;
          $("#check-answer").textContent = "Jugar de nuevo ↻";
          celebrate();
        } else if (lives === 0) {
          gameState = "lost";
          toast("Cada intento enseña");
          $("#game-feedback").textContent =
            "No quedan vidas. Vuelve a intentarlo: ahora sabes un poco más.";
          $("#check-answer").textContent = "Reintentar ↻";
        } else {
          gameState = "feedback";
          $("#check-answer").textContent = "Siguiente →";
        }
      },
      motionPaused ? 100 : 1200,
    );
  });
  function resetGame() {
    hp = 5;
    lives = 3;
    xp = 0;
    questionIndex = 0;
    battle.enemyVisible = true;
    battle.action = null;
    updateHud();
    renderQuestion();
  }
  $("#game-reset").addEventListener("click", resetGame);
  function selectExercise(button) {
    if (gameState === "animating") return;
    exerciseType = button.dataset.exercise;
    questionIndex = 0;
    $$(".exercise-tabs button").forEach((b) => {
      b.setAttribute("aria-selected", String(b === button));
      b.tabIndex = b === button ? 0 : -1;
    });
    if (gameState === "done" || gameState === "lost") resetGame();
    else renderQuestion();
  }
  $$(".exercise-tabs button").forEach((button) => {
    button.addEventListener("click", () => selectExercise(button));
    button.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
      e.preventDefault();
      const tabs = $$(".exercise-tabs button");
      const at = tabs.indexOf(button);
      const next =
        e.key === "Home"
          ? tabs[0]
          : e.key === "End"
            ? tabs.at(-1)
            : tabs[
                (at + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) %
                  tabs.length
              ];
      selectExercise(next);
      next.focus();
    });
  });
  renderQuestion();

  // Chat guiado, explícitamente local. No se envían mensajes a un servicio.
  let chatBusy = false;
  function appendMessage(text, who) {
    const el = document.createElement("div");
    el.className = `message ${who}`;
    if (who === "bot") {
      const label = document.createElement("small");
      label.textContent = "PROFE TUKI";
      el.append(label);
    }
    const content = document.createElement("span");
    content.textContent = text;
    el.append(content);
    $("#chat-messages").append(el);
    el.scrollIntoView({ behavior: "instant", block: "nearest" });
    return content;
  }
  function findReply(input) {
    const s = input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (/^tingki[!. ]*$/.test(s)) return chatReplies.correct;
    if (/^good morning[!. ]*$/.test(s)) return chatReplies.correctEnglish;
    if (/ejemplo/.test(s)) return chatReplies.ejemplo;
    if (/reto|pregunta|ejercicio/.test(s)) return chatReplies.reto;
    if (/ingles|english|hello|presentar|good night/.test(s))
      return chatReplies.ingles;
    if (/miskito|miskitu|naksa|yamni|kaisina|tingki/.test(s))
      return chatReplies.miskito;
    if (/explica|gracias|cortesia/.test(s)) return chatReplies.explica;
    return chatReplies.fallback;
  }
  function sendChat(text, kind) {
    if (chatBusy || !text.trim()) return;
    chatBusy = true;
    appendMessage(text.trim().slice(0, 180), "user");
    $("#chat-input").value = "";
    $("#chat-state").textContent = "Tuki está pensando…";
    $$(".chat-suggestions button").forEach((b) => (b.disabled = true));
    $(".chat-composer button").disabled = true;
    const reply = chatReplies[kind] || findReply(text);
    setTimeout(
      () => {
        const content = appendMessage("", "bot");
        let count = 0;
        const write = () => {
          count = motionPaused
            ? reply.length
            : Math.min(count + 3, reply.length);
          content.textContent = reply.slice(0, count);
          $("#chat-messages").scrollTop = $("#chat-messages").scrollHeight;
          if (count < reply.length) setTimeout(write, 22);
          else {
            chatBusy = false;
            $("#chat-state").innerHTML =
              '<span class="status-dot"></span> Listo para ayudarte';
            $$(".chat-suggestions button").forEach((b) => (b.disabled = false));
            $(".chat-composer button").disabled = false;
          }
        };
        write();
      },
      motionPaused ? 100 : 650,
    );
  }
  $("#chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    sendChat($("#chat-input").value);
  });
  $$("[data-chat]").forEach((b) =>
    b.addEventListener("click", () => sendChat(b.textContent, b.dataset.chat)),
  );

  let liveRunning = false,
    liveSeconds = 0,
    liveInterval,
    liveTimeout,
    liveFrameTimer;
  let liveStep = 0;
  function stopLive(finished = false) {
    liveRunning = false;
    clearInterval(liveInterval);
    clearInterval(liveFrameTimer);
    clearTimeout(liveTimeout);
    $("#live-app").classList.remove("running");
    $("#live-tuki").src = "assets/img/tuki-idle.webp";
    $("#live-start").textContent = finished
      ? "↻ Repetir sesión de ejemplo"
      : "◉ Iniciar demo de Tuki Live";
    $("#live-state").textContent = finished
      ? "Sesión completada · Sigue preguntando"
      : "Sesión pausada · Tú marcas el ritmo";
    if (!finished)
      $("#live-content").innerHTML =
        "<p>Cuando quieras, volvemos a descubrir juntos.</p>";
  }
  function showLiveQuestion() {
    const q = liveSteps[liveStep];
    $("#live-state").textContent = "Tuki te plantea una pregunta";
    $("#live-content").replaceChildren();
    const p = document.createElement("p");
    p.textContent = q.question;
    $("#live-content").append(p);
    const choices = document.createElement("div");
    choices.className = "live-options";
    q.answers.forEach((answer, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = answer;
      button.addEventListener("click", () => {
        if (!liveRunning) return;
        if (i !== q.correct) {
          button.classList.add("wrong");
          $("#live-state").textContent =
            "Piensa un poquito más. ¡Puedes intentarlo!";
          return;
        }
        button.classList.add("correct");
        choices.querySelectorAll("button").forEach((b) => (b.disabled = true));
        $("#live-state").textContent = "¡Bien pensado!";
        p.textContent = q.feedback;
        $("#live-tuki").src = "assets/img/tuki-celebracion.webp";
        liveTimeout = setTimeout(() => {
          if (++liveStep < liveSteps.length) showLiveQuestion();
          else {
            $("#live-content").innerHTML =
              "<p>Dos preguntas, dos descubrimientos. En la app, esta conversación continúa con tu voz.</p>";
            stopLive(true);
          }
        }, 2200);
      });
      choices.append(button);
    });
    $("#live-content").append(choices);
  }
  $("#live-start").addEventListener("click", () => {
    if (liveRunning) {
      stopLive();
      return;
    }
    liveRunning = true;
    liveStep = 0;
    liveSeconds = 0;
    $("#live-timer").textContent = "00:00";
    $("#live-app").classList.add("running");
    $("#live-start").textContent = "■ Terminar sesión de ejemplo";
    let frame = false;
    liveFrameTimer = setInterval(() => {
      if (liveRunning && !motionPaused && !document.hidden)
        $("#live-tuki").src =
          `assets/img/${(frame = !frame) ? poses.talk : poses.closed}.webp`;
    }, 200);
    liveInterval = setInterval(() => {
      if (!document.hidden) {
        liveSeconds++;
        $("#live-timer").textContent =
          `${String(Math.floor(liveSeconds / 60)).padStart(2, "0")}:${String(liveSeconds % 60).padStart(2, "0")}`;
      }
    }, 1000);
    showLiveQuestion();
  });

  $("#lesson-topic").addEventListener("change", () => {
    $("#lesson-setting").value = defaultSettings[$("#lesson-topic").value];
  });
  let generating = false,
    currentLesson;
  $("#generator-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (generating) return;
    generating = true;
    const button = $("#generate");
    button.disabled = true;
    button.textContent = "✧ Imaginando la aventura…";
    const base = lessonExamples[$("#lesson-topic").value];
    const lang = $("#lesson-language").value;
    currentLesson = {
      ...(lang === "en" ? base.en : base),
      grade: $("#lesson-grade").value,
      lang,
      setting: $("#lesson-setting").value.trim().slice(0, 180),
    };
    $("#lesson-preview").innerHTML =
      '<div class="generation-progress"><div class="generation-spinner"></div><strong id="generation-label">Conectando el tema con una historia…</strong><span>Narrativa → Ejercicios → Misión</span></div>';
    const stages = [
      "Diseñando el desafío de aprendizaje…",
      "Preparando narrativa y ejercicios…",
    ];
    stages.forEach((text, i) =>
      setTimeout(
        () => {
          if ($("#generation-label")) $("#generation-label").textContent = text;
        },
        700 * (i + 1),
      ),
    );
    setTimeout(
      () => {
        generating = false;
        button.disabled = false;
        button.innerHTML = "✧ Generar otra aventura <span>↗</span>";
        renderLesson();
      },
      motionPaused ? 150 : 2300,
    );
  });
  function textNode(tag, text, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    return el;
  }
  function renderLesson() {
    const l = currentLesson,
      root = $("#lesson-preview");
    root.replaceChildren();
    const result = document.createElement("div");
    result.className = "lesson-result";
    result.append(
      textNode("span", "✦ VISTA PREVIA DE TU AVENTURA", "result-kicker"),
      textNode("h4", l.title),
    );
    result.append(
      textNode(
        "div",
        `${l.grade} · ${l.lang === "en" ? "English" : "Miskito"} · 3 bloques`,
        "result-meta",
      ),
    );
    const blocks = [
      ["01 / ESCENA NARRATIVA", l.narrative, "narrative"],
      ["02 / OPCIÓN MÚLTIPLE", `${l.question} → ${l.answer}`, "question"],
      ["03 / BATALLA RPG", l.battle, "battle"],
    ];
    blocks.forEach(([title, text, key]) => {
      const block = document.createElement("div");
      block.className = "lesson-block";
      block.dataset.key = key;
      block.append(textNode("small", title), textNode("p", text));
      result.append(block);
    });
    if (l.setting) {
      const setting = document.createElement("div");
      setting.className = "lesson-block";
      setting.append(
        textNode("small", "TU AMBIENTACIÓN"),
        textNode("p", l.setting),
      );
      result.append(setting);
    }
    const actions = document.createElement("div");
    actions.className = "lesson-result-actions";
    const insert = textNode("button", "Insertar aventura (3 bloques)");
    insert.type = "button";
    const edit = textNode("button", "Editar", "secondary");
    edit.type = "button";
    const status = textNode("p", "", "result-status");
    status.setAttribute("role", "status");
    insert.addEventListener("click", () => {
      insert.textContent = "✓ Aventura insertada";
      insert.disabled = true;
      status.textContent =
        "En esta demo quedó lista para revisar. En la app puedes asignarla a tu clase.";
    });
    edit.addEventListener("click", () => {
      if (edit.textContent === "Guardar") {
        result.querySelectorAll(".lesson-block textarea").forEach((field) => {
          const key = field.dataset.key;
          currentLesson[key] = field.value;
          field.replaceWith(textNode("p", field.value));
        });
        edit.textContent = "Editar";
        status.textContent = "Cambios guardados en esta vista previa.";
        return;
      }
      result.querySelectorAll(".lesson-block[data-key]").forEach((block) => {
        const key = block.dataset.key,
          p = block.querySelector("p");
        const field = document.createElement("textarea");
        field.dataset.key = key;
        field.value = key === "question" ? l.question : l[key];
        field.rows = 3;
        field.maxLength = 600;
        field.setAttribute(
          "aria-label",
          `Editar ${block.querySelector("small").textContent}`,
        );
        p.replaceWith(field);
      });
      edit.textContent = "Guardar";
      status.textContent =
        "Edita los bloques: tu criterio tiene la última palabra.";
    });
    actions.append(insert, edit);
    result.append(actions, status);
    root.append(result);
  }
  $("#year").textContent = new Date().getFullYear();
  // Deja el video en reposo hasta que el visitante decida reproducirlo.
  new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) e.target.pause();
      }),
    { threshold: 0.1 },
  ).observe($("#promo-video"));
})();
