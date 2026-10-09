/**
 * TIUK — JavaScript Principal
 * Funcionalidad interactiva: animación por frames de Tuki, menú móvil,
 * revelado al scroll, galería interactiva de poses con confeti y mejoras de accesibilidad.
 */
(function () {
  'use strict';

  // 1. Marcar JavaScript activo en el documento
  document.documentElement.classList.add('js');

  // Detección y seguimiento de preferencia de reducción de movimiento
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefiereReduccion = Boolean(reducirMovimiento.matches);

  const actualizarPreferenciaMovimiento = (evento) => {
    prefiereReduccion = Boolean(evento.matches);
  };

  if (typeof reducirMovimiento.addEventListener === 'function') {
    reducirMovimiento.addEventListener('change', actualizarPreferenciaMovimiento);
  } else if (typeof reducirMovimiento.addListener === 'function') {
    reducirMovimiento.addListener(actualizarPreferenciaMovimiento);
  }

  // 2. Rutas de frames y precarga
  const FRAMES = {
    idle: 'assets/img/tuki-idle.webp',
    'tuki-idle': 'assets/img/tuki-idle.webp',
    blink: 'assets/img/tuki-blink.webp',
    'tuki-blink': 'assets/img/tuki-blink.webp',
    hablando: 'assets/img/tuki-hablando.webp',
    'tuki-hablando': 'assets/img/tuki-hablando.webp',
    'hablando-boca-cerrada': 'assets/img/tuki-hablando-boca-cerrada.webp',
    hablandoBocaCerrada: 'assets/img/tuki-hablando-boca-cerrada.webp',
    'tuki-hablando-boca-cerrada': 'assets/img/tuki-hablando-boca-cerrada.webp',
    'hablando-blink': 'assets/img/tuki-hablando-blink.webp',
    hablandoBlink: 'assets/img/tuki-hablando-blink.webp',
    'tuki-hablando-blink': 'assets/img/tuki-hablando-blink.webp',
    'hablando-blink-boca-cerrada': 'assets/img/tuki-hablando-blink-boca-cerrada.webp',
    hablandoBlinkBocaCerrada: 'assets/img/tuki-hablando-blink-boca-cerrada.webp',
    'tuki-hablando-blink-boca-cerrada': 'assets/img/tuki-hablando-blink-boca-cerrada.webp',
    celebracion: 'assets/img/tuki-celebracion.webp',
    'tuki-celebracion': 'assets/img/tuki-celebracion.webp',
    pensando: 'assets/img/tuki-pensando.webp',
    'tuki-pensando': 'assets/img/tuki-pensando.webp',
    determinado: 'assets/img/tuki-determinado.webp',
    'tuki-determinado': 'assets/img/tuki-determinado.webp'
  };

  const POSES_GALERIA = [
    'assets/img/saludando.webp',
    'assets/img/bien-hecho.webp',
    'assets/img/curioso.webp',
    'assets/img/dormido.webp',
    'assets/img/cara-osado.webp',
    'assets/img/cara-asombro.webp'
  ];

  function precargarFrames() {
    const rutasUnicas = Array.from(new Set(Object.values(FRAMES).concat(POSES_GALERIA)));
    rutasUnicas.forEach((ruta) => {
      const img = new Image();
      img.src = ruta;
    });
  }

  precargarFrames();

  // ========================================================================
  // 3. ANIMADOR DEL HÉROE (#tuki-animado, #texto-burbuja, .tuki-escena)
  // ========================================================================
  const imgTuki = document.getElementById('tuki-animado');
  const textoBurbuja = document.getElementById('texto-burbuja');
  const burbujaTuki = document.getElementById('burbuja-tuki');
  const tukiEscena = document.querySelector('.tuki-escena');
  const botonSaludar = document.getElementById('boton-saludar');

  if (imgTuki && textoBurbuja && tukiEscena) {
    let estadoHeroe = 'reposo'; // 'reposo' | 'hablando' | 'celebrando' | 'pensando'
    let bocaAbierta = false;
    let parpadeando = false;
    let turnoHabla = 0;
    let temporizadorHabla = null;
    let intervaloBoca = null;
    let temporizadorFinalHabla = null;
    let temporizadorParpadeo = null;
    let temporizadorCelebracion = null;

    let temporizadorGuion = null;
    let indiceGuion = 0;
    let estaHeroeVisible = false;
    let estaPestanaVisible = document.visibilityState === 'visible';

    const regexPuntuacionOEspacio = /[\s.,;:!?¡¿—\-()[\]{}'"`«»]/;

    const FRASES_GUION = [
      '¡Hola! Soy Tuki 👋',
      'En TIUK aprender se siente como jugar 🎮',
      'Cualquier materia se vuelve una aventura 🗺️',
      'Gana XP, sube de nivel y mantén tu racha 🔥',
      '¡Funciono incluso sin internet! 📶',
      'Hablo Español, English y Miskito 🌎'
    ];

    const SALUDOS_INTERACTIVOS = [
      '¡Qué alegría verte por aquí! ✨',
      '¿Sabías que Tuki significa sabiduría en miskito? 🐸',
      '¡Hoy es un gran día para subir de nivel! 🚀',
      '¡Explora las islas y salva mundos de conocimiento! 🏝️',
      '¡Aprender jugando es el camino más divertido! 🎯',
      '¡No olvides mantener tu racha diaria! 🔥'
    ];

    // Accesibilidad en la imagen de Tuki
    if (!imgTuki.hasAttribute('tabindex')) {
      imgTuki.setAttribute('tabindex', '0');
    }
    imgTuki.setAttribute('role', 'button');
    imgTuki.setAttribute('aria-label', 'Hacer celebrar a Tuki');
    imgTuki.style.cursor = 'pointer';

    function mostrarFrame(nombre) {
      if (!imgTuki) return;
      const ruta = FRAMES[nombre] || nombre;
      const srcActual = imgTuki.getAttribute('src');
      if (srcActual !== ruta) {
        imgTuki.src = ruta;
        imgTuki.setAttribute('src', ruta);
      }
    }

    imgTuki.addEventListener('error', () => {
      if (imgTuki.getAttribute('src') !== FRAMES.idle) {
        mostrarFrame('idle');
      }
    });

    function programarParpadeo() {
      if (temporizadorParpadeo) {
        clearTimeout(temporizadorParpadeo);
      }

      if (prefiereReduccion) {
        return;
      }

      const tiempoEspera = Math.floor(Math.random() * (4500 - 2200 + 1)) + 2200;

      temporizadorParpadeo = setTimeout(() => {
        if (prefiereReduccion || !estaHeroeVisible || !estaPestanaVisible) {
          programarParpadeo();
          return;
        }

        if (estadoHeroe === 'reposo') {
          parpadeando = true;
          mostrarFrame('blink');

          setTimeout(() => {
            if (estadoHeroe !== 'reposo') {
              parpadeando = false;
              programarParpadeo();
              return;
            }

            const esDobleParpadeo = Math.random() < 0.2;
            if (esDobleParpadeo) {
              mostrarFrame('idle');
              setTimeout(() => {
                if (estadoHeroe === 'reposo') {
                  mostrarFrame('blink');
                  setTimeout(() => {
                    parpadeando = false;
                    if (estadoHeroe === 'reposo') {
                      mostrarFrame('idle');
                    }
                    programarParpadeo();
                  }, 140);
                } else {
                  parpadeando = false;
                  programarParpadeo();
                }
              }, 100);
            } else {
              parpadeando = false;
              mostrarFrame('idle');
              programarParpadeo();
            }
          }, 140);
        } else if (estadoHeroe === 'hablando') {
          parpadeando = true;
          const frameBlinkHablando = bocaAbierta ? 'hablandoBlink' : 'hablandoBlinkBocaCerrada';
          mostrarFrame(frameBlinkHablando);

          setTimeout(() => {
            parpadeando = false;
            if (estadoHeroe === 'hablando') {
              mostrarFrame(bocaAbierta ? 'hablando' : 'hablandoBocaCerrada');
            }
            programarParpadeo();
          }, 140);
        } else {
          programarParpadeo();
        }
      }, tiempoEspera);
    }

    function decir(texto, opciones = {}) {
      turnoHabla += 1;
      const turnoActual = turnoHabla;

      if (temporizadorHabla) {
        clearTimeout(temporizadorHabla);
        temporizadorHabla = null;
      }
      if (intervaloBoca) {
        clearInterval(intervaloBoca);
        intervaloBoca = null;
      }
      if (temporizadorFinalHabla) {
        clearTimeout(temporizadorFinalHabla);
        temporizadorFinalHabla = null;
      }

      return new Promise((resolve) => {
        if (prefiereReduccion) {
          textoBurbuja.textContent = texto;
          if (estadoHeroe !== 'celebrando') {
            estadoHeroe = 'reposo';
            mostrarFrame('idle');
          }
          resolve();
          return;
        }

        if (estadoHeroe !== 'celebrando') {
          estadoHeroe = 'hablando';
          mostrarFrame('hablando');
        }

        textoBurbuja.textContent = '';
        const caracteres = Array.from(texto);
        let indiceCaracter = 0;
        bocaAbierta = true;

        intervaloBoca = setInterval(() => {
          if (turnoActual !== turnoHabla) {
            clearInterval(intervaloBoca);
            intervaloBoca = null;
            return;
          }

          const charPrevio = caracteres[Math.max(0, indiceCaracter - 1)];
          if (charPrevio && regexPuntuacionOEspacio.test(charPrevio)) {
            bocaAbierta = false;
          } else {
            bocaAbierta = !bocaAbierta;
          }

          if (estadoHeroe === 'hablando' && !parpadeando) {
            mostrarFrame(bocaAbierta ? 'hablando' : 'hablandoBocaCerrada');
          }
        }, 130);

        function escribirSiguiente() {
          if (turnoActual !== turnoHabla) {
            return;
          }

          if (indiceCaracter < caracteres.length) {
            textoBurbuja.textContent += caracteres[indiceCaracter];
            const charActual = caracteres[indiceCaracter];
            indiceCaracter += 1;

            if (regexPuntuacionOEspacio.test(charActual)) {
              bocaAbierta = false;
              if (estadoHeroe === 'hablando' && !parpadeando) {
                mostrarFrame('hablandoBocaCerrada');
              }
            }

            temporizadorHabla = setTimeout(escribirSiguiente, 35);
          } else {
            if (intervaloBoca) {
              clearInterval(intervaloBoca);
              intervaloBoca = null;
            }

            bocaAbierta = false;
            if (estadoHeroe === 'hablando' && !parpadeando) {
              mostrarFrame('hablandoBocaCerrada');
            }

            temporizadorFinalHabla = setTimeout(() => {
              if (turnoActual === turnoHabla) {
                if (estadoHeroe !== 'celebrando') {
                  estadoHeroe = 'reposo';
                  mostrarFrame('idle');
                }
                resolve();
              }
            }, 300);
          }
        }

        escribirSiguiente();
      });
    }

    function celebrar() {
      if (temporizadorCelebracion) {
        clearTimeout(temporizadorCelebracion);
      }
      if (temporizadorGuion) {
        clearTimeout(temporizadorGuion);
      }

      estadoHeroe = 'celebrando';
      tukiEscena.classList.add('tuki-escena--celebrando');
      mostrarFrame('celebracion');

      decir('¡Bien hecho! +10 XP ⭐');

      temporizadorCelebracion = setTimeout(() => {
        tukiEscena.classList.remove('tuki-escena--celebrando');
        if (estadoHeroe === 'celebrando') {
          estadoHeroe = 'reposo';
          mostrarFrame('idle');
        }

        if (estaHeroeVisible && estaPestanaVisible) {
          temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
        }
      }, 900);
    }

    imgTuki.addEventListener('click', celebrar);
    imgTuki.addEventListener('keydown', (evento) => {
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        celebrar();
      }
    });

    function ejecutarPasoGuion() {
      if (!estaHeroeVisible || !estaPestanaVisible || estadoHeroe === 'celebrando') {
        return;
      }

      const esTercera = (indiceGuion > 0 && (indiceGuion % 3 === 2));
      const frase = FRASES_GUION[indiceGuion];
      indiceGuion = (indiceGuion + 1) % FRASES_GUION.length;

      if (esTercera && !prefiereReduccion) {
        estadoHeroe = 'pensando';
        mostrarFrame('pensando');

        temporizadorGuion = setTimeout(() => {
          if (!estaHeroeVisible || !estaPestanaVisible || estadoHeroe === 'celebrando') {
            return;
          }
          decir(frase).then(() => {
            if (estaHeroeVisible && estaPestanaVisible) {
              temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
            }
          });
        }, 700);
      } else {
        decir(frase).then(() => {
          if (estaHeroeVisible && estaPestanaVisible) {
            temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
          }
        });
      }
    }

    function reanudarGuion() {
      if (temporizadorGuion) {
        clearTimeout(temporizadorGuion);
      }
      programarParpadeo();
      if (estadoHeroe !== 'celebrando' && estadoHeroe !== 'hablando') {
        temporizadorGuion = setTimeout(ejecutarPasoGuion, 1200);
      }
    }

    function pausarGuion() {
      if (temporizadorGuion) {
        clearTimeout(temporizadorGuion);
        temporizadorGuion = null;
      }
      if (temporizadorParpadeo) {
        clearTimeout(temporizadorParpadeo);
        temporizadorParpadeo = null;
      }
    }

    // Observador para visibilidad de la sección héroe
    if ('IntersectionObserver' in window) {
      const observadorHeroe = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          estaHeroeVisible = entrada.isIntersecting;
          if (estaHeroeVisible && estaPestanaVisible) {
            reanudarGuion();
          } else {
            pausarGuion();
          }
        });
      }, { threshold: 0.2 });

      observadorHeroe.observe(tukiEscena);
    } else {
      estaHeroeVisible = true;
      reanudarGuion();
    }

    document.addEventListener('visibilitychange', () => {
      estaPestanaVisible = (document.visibilityState === 'visible');
      if (estaPestanaVisible && estaHeroeVisible) {
        reanudarGuion();
      } else {
        pausarGuion();
      }
    });

    if (botonSaludar) {
      botonSaludar.addEventListener('click', () => {
        if (temporizadorGuion) {
          clearTimeout(temporizadorGuion);
        }

        const rect = tukiEscena.getBoundingClientRect();
        const estaEnVentana = rect.top < window.innerHeight && rect.bottom > 0;
        if (!estaHeroeVisible || !estaEnVentana) {
          tukiEscena.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const indiceAleatorio = Math.floor(Math.random() * SALUDOS_INTERACTIVOS.length);
        const saludoElegido = SALUDOS_INTERACTIVOS[indiceAleatorio];

        decir(saludoElegido).then(() => {
          if (estaHeroeVisible && estaPestanaVisible) {
            temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
          }
        });
      });
    }

    programarParpadeo();
  }

  // ========================================================================
  // 4. MENÚ MÓVIL (button.cabecera__menu, header.cabecera, #navegacion)
  // ========================================================================
  const cabecera = document.querySelector('header.cabecera');
  const botonMenu = document.querySelector('button.cabecera__menu');
  const nav = document.getElementById('navegacion');

  if (cabecera && botonMenu) {
    function abrirMenu() {
      cabecera.classList.add('cabecera--abierta');
      botonMenu.setAttribute('aria-expanded', 'true');
      botonMenu.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('sin-scroll');
      document.body.style.overflow = 'hidden';
    }

    function cerrarMenu(devolverFoco = false) {
      if (!cabecera.classList.contains('cabecera--abierta')) {
        return;
      }
      cabecera.classList.remove('cabecera--abierta');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('sin-scroll');
      document.body.style.overflow = '';
      if (devolverFoco) {
        botonMenu.focus();
      }
    }

    botonMenu.addEventListener('click', () => {
      const estaAbierto = cabecera.classList.contains('cabecera--abierta');
      if (estaAbierto) {
        cerrarMenu(false);
      } else {
        abrirMenu();
      }
    });

    if (nav) {
      nav.addEventListener('click', (evento) => {
        if (evento.target.closest('a')) {
          cerrarMenu(false);
        }
      });
    }

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && cabecera.classList.contains('cabecera--abierta')) {
        cerrarMenu(true);
      }
    });

    document.addEventListener('click', (evento) => {
      if (cabecera.classList.contains('cabecera--abierta') && !cabecera.contains(evento.target)) {
        cerrarMenu(false);
      }
    });

    const mediaAncho900 = window.matchMedia('(min-width: 900px)');
    const comprobarCambioAncho = (evento) => {
      if (evento.matches) {
        cerrarMenu(false);
      }
    };

    if (typeof mediaAncho900.addEventListener === 'function') {
      mediaAncho900.addEventListener('change', comprobarCambioAncho);
    } else if (typeof mediaAncho900.addListener === 'function') {
      mediaAncho900.addListener(comprobarCambioAncho);
    }
  }

  // ========================================================================
  // 5. CABECERA: SOMBRA AL HACER SCROLL
  // ========================================================================
  if (cabecera) {
    let tickSombra = false;

    function actualizarSombraCabecera() {
      const haySombra = window.scrollY > 8;
      cabecera.classList.toggle('cabecera--con-sombra', haySombra);
      tickSombra = false;
    }

    window.addEventListener('scroll', () => {
      if (!tickSombra) {
        window.requestAnimationFrame(actualizarSombraCabecera);
        tickSombra = true;
      }
    }, { passive: true });

    actualizarSombraCabecera();
  }

  // ========================================================================
  // 6. REVELADO AL SCROLL (.revelar)
  // ========================================================================
  const elementosRevelar = document.querySelectorAll('.revelar');

  if (elementosRevelar.length > 0) {
    if (!('IntersectionObserver' in window) || prefiereReduccion) {
      elementosRevelar.forEach((elemento) => {
        elemento.classList.add('visible');
      });
    } else {
      elementosRevelar.forEach((elemento) => {
        const padre = elemento.parentElement;
        if (padre) {
          const hermanosRevelar = Array.from(padre.children).filter((hijo) => {
            return hijo.classList.contains('revelar');
          });
          const indice = hermanosRevelar.indexOf(elemento);
          if (indice > 0) {
            const retraso = Math.min(indice * 80, 320);
            elemento.style.transitionDelay = `${retraso}ms`;
          }
        }
      });

      const observadorRevelado = new IntersectionObserver((entradas, observador) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            observador.unobserve(entrada.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      elementosRevelar.forEach((elemento) => {
        observadorRevelado.observe(elemento);
      });
    }

    if (typeof reducirMovimiento.addEventListener === 'function') {
      reducirMovimiento.addEventListener('change', (evento) => {
        if (evento.matches) {
          elementosRevelar.forEach((elemento) => {
            elemento.classList.add('visible');
            elemento.style.transitionDelay = '';
          });
        }
      });
    }
  }

  // ========================================================================
  // 7. GALERÍA DE POSES Y CONFETI (#tuki-galeria, .opcion-pose, #boton-celebrar)
  // ========================================================================
  const imgGaleria = document.getElementById('tuki-galeria');
  const escenarioGaleria = document.querySelector('.galeria__escenario');
  const botonesPose = document.querySelectorAll('.opcion-pose');
  const botonCelebrar = document.getElementById('boton-celebrar');
  const confetiContenedor = document.getElementById('confeti');

  if (imgGaleria && escenarioGaleria && botonesPose.length > 0) {
    const botonInicial = document.querySelector('.opcion-pose[aria-pressed="true"]') || botonesPose[0];
    let ultimaPoseValida = {
      src: imgGaleria.getAttribute('src') || 'assets/img/saludando.webp',
      height: imgGaleria.getAttribute('height') || '549',
      width: '560',
      alt: imgGaleria.getAttribute('alt') || 'Tuki saludando alegremente',
      pose: botonInicial ? botonInicial.getAttribute('data-pose') : 'saludando'
    };

    let temporizadorCambioPose = null;
    let temporizadorCelebrarGaleria = null;
    let temporizadorLimpiezaConfeti = null;

    imgGaleria.addEventListener('error', () => {
      if (ultimaPoseValida) {
        imgGaleria.src = ultimaPoseValida.src;
        imgGaleria.setAttribute('height', ultimaPoseValida.height);
        imgGaleria.setAttribute('width', ultimaPoseValida.width);
        imgGaleria.setAttribute('alt', ultimaPoseValida.alt);
      }
      escenarioGaleria.classList.remove('galeria--cambiando');
    });

    botonesPose.forEach((boton) => {
      boton.addEventListener('click', () => {
        const pose = boton.getAttribute('data-pose');
        const alto = boton.getAttribute('data-alto') || '549';
        const textoBoton = boton.textContent.trim();
        const altTexto = 'Tuki: ' + textoBoton;

        botonesPose.forEach((b) => {
          b.setAttribute('aria-pressed', b === boton ? 'true' : 'false');
        });

        if (temporizadorCelebrarGaleria) {
          clearTimeout(temporizadorCelebrarGaleria);
          temporizadorCelebrarGaleria = null;
        }

        const nuevaSrc = 'assets/img/' + pose + '.webp';
        ultimaPoseValida = {
          src: nuevaSrc,
          height: alto,
          width: '560',
          alt: altTexto,
          pose: pose
        };

        if (prefiereReduccion) {
          imgGaleria.src = nuevaSrc;
          imgGaleria.setAttribute('src', nuevaSrc);
          imgGaleria.setAttribute('height', alto);
          imgGaleria.setAttribute('width', '560');
          imgGaleria.setAttribute('alt', altTexto);
          escenarioGaleria.classList.remove('galeria--cambiando');
          return;
        }

        escenarioGaleria.classList.add('galeria--cambiando');

        if (temporizadorCambioPose) {
          clearTimeout(temporizadorCambioPose);
        }

        temporizadorCambioPose = setTimeout(() => {
          imgGaleria.src = nuevaSrc;
          imgGaleria.setAttribute('src', nuevaSrc);
          imgGaleria.setAttribute('height', alto);
          imgGaleria.setAttribute('width', '560');
          imgGaleria.setAttribute('alt', altTexto);

          const respaldoCarga = setTimeout(() => {
            escenarioGaleria.classList.remove('galeria--cambiando');
          }, 400);

          function alCargar() {
            clearTimeout(respaldoCarga);
            escenarioGaleria.classList.remove('galeria--cambiando');
            imgGaleria.removeEventListener('load', alCargar);
          }

          imgGaleria.addEventListener('load', alCargar);
        }, 180);
      });
    });

    if (botonCelebrar) {
      const PALETA_CONFETI = ['#32CD32', '#2DD4BF', '#FFB02A', '#F43F5E', '#1F2937'];

      botonCelebrar.addEventListener('click', () => {
        if (temporizadorCelebrarGaleria) {
          clearTimeout(temporizadorCelebrarGaleria);
        }

        imgGaleria.src = 'assets/img/tuki-celebracion.webp';
        imgGaleria.setAttribute('src', 'assets/img/tuki-celebracion.webp');
        imgGaleria.setAttribute('height', '720');
        imgGaleria.setAttribute('width', '720');
        imgGaleria.setAttribute('alt', 'Tuki celebrando con confeti');

        temporizadorCelebrarGaleria = setTimeout(() => {
          if (ultimaPoseValida) {
            imgGaleria.src = ultimaPoseValida.src;
            imgGaleria.setAttribute('src', ultimaPoseValida.src);
            imgGaleria.setAttribute('height', ultimaPoseValida.height);
            imgGaleria.setAttribute('width', ultimaPoseValida.width);
            imgGaleria.setAttribute('alt', ultimaPoseValida.alt);
          }
          temporizadorCelebrarGaleria = null;
        }, 1500);

        if (!prefiereReduccion && confetiContenedor) {
          const piezasActuales = confetiContenedor.childElementCount;
          const cantidadNuevas = 36;
          const limiteMaximo = 120;

          if (piezasActuales + cantidadNuevas > limiteMaximo) {
            const sobrante = (piezasActuales + cantidadNuevas) - limiteMaximo;
            for (let i = 0; i < sobrante && confetiContenedor.firstElementChild; i++) {
              confetiContenedor.firstElementChild.remove();
            }
          }

          const fragmento = document.createDocumentFragment();

          for (let j = 0; j < cantidadNuevas; j++) {
            const pieza = document.createElement('span');
            pieza.className = 'confeti__pieza';

            const posX = `${(Math.random() * 100).toFixed(1)}%`;
            const color = PALETA_CONFETI[Math.floor(Math.random() * PALETA_CONFETI.length)];
            const retraso = `${(Math.random() * 0.4).toFixed(2)}s`;
            const giro = `${Math.floor(Math.random() * 360)}deg`;

            pieza.style.setProperty('--x', posX);
            pieza.style.setProperty('--color', color);
            pieza.style.setProperty('--retraso', retraso);
            pieza.style.setProperty('--giro', giro);

            pieza.addEventListener('animationend', (eventoAnim) => {
              if (eventoAnim.target && eventoAnim.target.parentNode) {
                eventoAnim.target.remove();
              }
            }, { once: true });

            fragmento.appendChild(pieza);
          }

          confetiContenedor.appendChild(fragmento);

          if (temporizadorLimpiezaConfeti) {
            clearTimeout(temporizadorLimpiezaConfeti);
          }
          temporizadorLimpiezaConfeti = setTimeout(() => {
            if (confetiContenedor) {
              confetiContenedor.textContent = '';
            }
            temporizadorLimpiezaConfeti = null;
          }, 2500);
        }
      });
    }
  }

  // ========================================================================
  // 8. AÑO DINÁMICO (id: anio-actual, opcional)
  // ========================================================================
  const elAnioActual = document.getElementById('anio-actual');
  if (elAnioActual) {
    elAnioActual.textContent = String(new Date().getFullYear());
  }

})();
