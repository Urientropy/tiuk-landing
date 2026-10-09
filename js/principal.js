/**
 * TIUK — JavaScript Principal
 *
 * Funcionalidad interactiva completa:
 * - Detección de JS y accesibilidad para movimiento reducido
 * - Barra de progreso de lectura al scroll
 * - Halo suave del cursor con seguimiento lerp
 * - Cabecera responsiva: menú móvil accesible y sombra al scroll
 * - Campo de estrellas en canvas con capas de profundidad y estrellas fugaces
 * - Parallax por scroll y puntero combinado
 * - Título con revelado tipográfico palabra por palabra
 * - Animación por estados y máquina de escribir de Tuki en el héroe
 * - Scroll narrativo interactivo con progreso continuo
 * - Tarjetas 3D con foco de luz y rotación de perspectiva
 * - Botones magnéticos con atracción y suavizado
 * - Contadores numéricos animados con easeOutCubic
 * - Marquesina sensible a la velocidad de scroll
 * - Revelado escalonado de secciones
 * - Galería interactiva de poses y celebración con confeti
 * - Bucle de animación unificado mediante un único requestAnimationFrame
 */
(function () {
  'use strict';

  // 1. Indicar soporte de JavaScript en el documento
  document.documentElement.classList.add('js');

  // Detección de preferencia de movimiento reducido
  const mediaReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefiereReduccion = Boolean(mediaReducirMovimiento.matches);

  // Detección de puntero fino y cursor con hover
  const mediaPunteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');
  let tienePunteroFino = Boolean(mediaPunteroFino.matches);

  // Estado de visibilidad de la pestaña
  let pestanaVisible = document.visibilityState === 'visible';

  // Detección de soporte para la propiedad CSS individual 'translate'
  const soportaCssTranslate = 'translate' in document.documentElement.style;

  // ========================================================================
  // 2. PRECARGA DE ASSETS DE TUKI
  // ========================================================================
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

  function precargarImagenes() {
    const rutasUnicas = Array.from(new Set(Object.values(FRAMES).concat(POSES_GALERIA)));
    rutasUnicas.forEach((ruta) => {
      const img = new Image();
      img.src = ruta;
    });
  }

  precargarImagenes();

  // ========================================================================
  // 3. BARRA DE PROGRESO DE SCROLL (.progreso-scroll__barra)
  // ========================================================================
  const barraProgreso = document.querySelector('.progreso-scroll__barra');

  // ========================================================================
  // 4. CABECERA Y MENÚ MÓVIL
  // ========================================================================
  const cabecera = document.querySelector('header.cabecera');
  const botonMenu = document.querySelector('button.cabecera__menu');
  const nav = document.getElementById('navegacion');

  if (cabecera && botonMenu) {
    function abrirMenu() {
      cabecera.classList.add('cabecera--abierta');
      botonMenu.setAttribute('aria-expanded', 'true');
      botonMenu.setAttribute('aria-label', 'Cerrar menú');
      document.body.style.overflow = 'hidden';
    }

    function cerrarMenu(devolverFoco) {
      if (!cabecera.classList.contains('cabecera--abierta')) return;
      cabecera.classList.remove('cabecera--abierta');
      botonMenu.setAttribute('aria-expanded', 'false');
      botonMenu.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
      if (devolverFoco) {
        botonMenu.focus();
      }
    }

    botonMenu.addEventListener('click', () => {
      if (cabecera.classList.contains('cabecera--abierta')) {
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
  // 5. HALO DEL CURSOR (.cursor-brillo)
  // ========================================================================
  const elCursor = document.querySelector('.cursor-brillo');
  let mitadCursor = 20;
  let cursorObjetivoX = window.innerWidth / 2;
  let cursorObjetivoY = window.innerHeight / 2;
  let cursorActualX = cursorObjetivoX;
  let cursorActualY = cursorObjetivoY;
  let cursorActivo = false;

  if (elCursor) {
    mitadCursor = (elCursor.offsetWidth || 40) / 2;

    document.addEventListener('pointermove', (evento) => {
      cursorObjetivoX = evento.clientX;
      cursorObjetivoY = evento.clientY;

      if (!cursorActivo && tienePunteroFino && !prefiereReduccion) {
        cursorActivo = true;
        cursorActualX = cursorObjetivoX;
        cursorActualY = cursorObjetivoY;
        elCursor.classList.add('activo');
      }
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      if (cursorActivo) {
        cursorActivo = false;
        elCursor.classList.remove('activo');
      }
    });
  }

  // ========================================================================
  // 6. CAMPO DE ESTRELLAS EN CANVAS (canvas.heroe__estrellas)
  // ========================================================================
  const canvasEstrellas = document.querySelector('canvas.heroe__estrellas');
  let ctxEstrellas = null;
  let estrellas = [];
  let dprCanvas = 1;
  let anchoCanvas = 0;
  let altoCanvas = 0;
  let heroeVisible = true;
  let proximaEstrellaFugaz = performance.now() + 4000 + Math.random() * 3000;
  let estrellaFugaz = null;

  if (canvasEstrellas) {
    ctxEstrellas = canvasEstrellas.getContext('2d');

    function generarEstrellas() {
      if (anchoCanvas <= 0 || altoCanvas <= 0) return;
      const cantidad = Math.min(Math.max(Math.round((anchoCanvas * altoCanvas) / 9000), 20), 220);
      estrellas = [];
      const colores = ['#2DD4BF', '#A78BFA'];

      for (let i = 0; i < cantidad; i++) {
        const rndColor = Math.random();
        let color = '#FFFFFF';
        if (rndColor < 0.12) {
          color = colores[0];
        } else if (rndColor < 0.24) {
          color = colores[1];
        }

        estrellas.push({
          x: Math.random() * anchoCanvas,
          y: Math.random() * altoCanvas,
          radio: 0.4 + Math.random() * 1.2,
          profundidad: Math.floor(Math.random() * 3) + 1, // 1, 2 o 3
          fase: Math.random() * Math.PI * 2,
          velocidadTitileo: 0.8 + Math.random() * 1.6,
          opacidadBase: 0.35 + Math.random() * 0.45,
          color: color
        });
      }
    }

    function ajustarTamanoCanvas() {
      const rect = canvasEstrellas.getBoundingClientRect();
      dprCanvas = Math.min(window.devicePixelRatio || 1, 2);
      anchoCanvas = rect.width;
      altoCanvas = rect.height;

      canvasEstrellas.width = Math.round(anchoCanvas * dprCanvas);
      canvasEstrellas.height = Math.round(altoCanvas * dprCanvas);

      generarEstrellas();

      if (prefiereReduccion && ctxEstrellas) {
        dibujarEstrellasEstaticas();
      }
    }

    function dibujarEstrellasEstaticas() {
      if (!ctxEstrellas || anchoCanvas <= 0 || altoCanvas <= 0) return;
      ctxEstrellas.clearRect(0, 0, canvasEstrellas.width, canvasEstrellas.height);
      ctxEstrellas.save();
      ctxEstrellas.scale(dprCanvas, dprCanvas);

      for (let i = 0; i < estrellas.length; i++) {
        const s = estrellas[i];
        ctxEstrellas.globalAlpha = s.opacidadBase;
        ctxEstrellas.fillStyle = s.color;
        ctxEstrellas.beginPath();
        ctxEstrellas.arc(s.x, s.y, s.radio, 0, Math.PI * 2);
        ctxEstrellas.fill();
      }

      ctxEstrellas.restore();
    }

    if (window.ResizeObserver) {
      const roCanvas = new ResizeObserver(() => {
        ajustarTamanoCanvas();
      });
      roCanvas.observe(canvasEstrellas);
    } else {
      ajustarTamanoCanvas();
      window.addEventListener('resize', ajustarTamanoCanvas, { passive: true });
    }

    const seccionHeroe = canvasEstrellas.closest('header, section, .heroe') || canvasEstrellas;
    if ('IntersectionObserver' in window) {
      const observadorHeroeCanvas = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          heroeVisible = entrada.isIntersecting;
        });
      }, { threshold: 0 });
      observadorHeroeCanvas.observe(seccionHeroe);
    }
  }

  // ========================================================================
  // 7. PARALLAX ([data-paralaje], [data-puntero])
  // ========================================================================
  const nodosParalaje = document.querySelectorAll('[data-paralaje], [data-puntero]');
  const listaParalaje = [];

  nodosParalaje.forEach((el) => {
    const attrParalaje = el.getAttribute('data-paralaje');
    const attrPuntero = el.getAttribute('data-puntero');
    const f = attrParalaje !== null ? parseFloat(attrParalaje) : 0;
    const n = attrPuntero !== null ? parseFloat(attrPuntero) : 0;

    listaParalaje.push({
      elemento: el,
      tieneParalaje: attrParalaje !== null && !isNaN(f),
      factorParalaje: isNaN(f) ? 0 : f,
      tienePuntero: attrPuntero !== null && !isNaN(n),
      factorPuntero: isNaN(n) ? 0 : n,
      baseCenterDocY: 0,
      visible: true
    });
  });

  if ('IntersectionObserver' in window && listaParalaje.length > 0) {
    const observadorVisibilidadParalaje = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        const item = listaParalaje.find((p) => p.elemento === entrada.target);
        if (item) {
          item.visible = entrada.isIntersecting;
        }
      });
    }, { rootMargin: '200px' });

    listaParalaje.forEach((item) => {
      observadorVisibilidadParalaje.observe(item.elemento);
    });
  }

  // Variables normalizadas del puntero para parallax
  let punteroNormalizadoX = 0; // -1 .. 1
  let punteroNormalizadoY = 0; // -1 .. 1
  let punteroSuaveX = 0;
  let punteroSuaveY = 0;
  let punteroEnDocumento = false;

  document.addEventListener('pointermove', (evento) => {
    punteroEnDocumento = true;
    const centroX = window.innerWidth / 2 || 1;
    const centroY = window.innerHeight / 2 || 1;
    punteroNormalizadoX = Math.max(-1, Math.min(1, (evento.clientX - centroX) / centroX));
    punteroNormalizadoY = Math.max(-1, Math.min(1, (evento.clientY - centroY) / centroY));
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    punteroEnDocumento = false;
  });

  // ========================================================================
  // 8. TÍTULO DIVIDIDO (h1.titulo-dividido)
  // ========================================================================
  const elTituloDividido = document.querySelector('h1.titulo-dividido');

  if (elTituloDividido) {
    let indicePalabraTitulo = 0;
    const fragmentoTitulo = document.createDocumentFragment();

    function crearMascaraPalabra(palabra) {
      const spanMascara = document.createElement('span');
      spanMascara.className = 'palabra-mascara';

      const spanPalabra = document.createElement('span');
      spanPalabra.className = 'palabra';
      spanPalabra.style.setProperty('--i', String(indicePalabraTitulo));
      spanPalabra.textContent = palabra;
      indicePalabraTitulo += 1;

      spanMascara.appendChild(spanPalabra);
      return spanMascara;
    }

    function procesarNodosTitulo(nodos, contenedorDestino) {
      Array.from(nodos).forEach((nodo) => {
        if (nodo.nodeType === Node.TEXT_NODE) {
          const texto = nodo.nodeValue || '';
          const palabras = texto.trim().split(/\s+/).filter(Boolean);

          palabras.forEach((palabra) => {
            if (contenedorDestino.lastChild) {
              contenedorDestino.appendChild(document.createTextNode(' '));
            }
            contenedorDestino.appendChild(crearMascaraPalabra(palabra));
          });
        } else if (nodo.nodeType === Node.ELEMENT_NODE) {
          if (contenedorDestino.lastChild) {
            contenedorDestino.appendChild(document.createTextNode(' '));
          }
          const clonElemento = nodo.cloneNode(false);
          procesarNodosTitulo(nodo.childNodes, clonElemento);
          contenedorDestino.appendChild(clonElemento);
        }
      });
    }

    procesarNodosTitulo(elTituloDividido.childNodes, fragmentoTitulo);
    elTituloDividido.textContent = '';
    elTituloDividido.appendChild(fragmentoTitulo);

    if (prefiereReduccion) {
      elTituloDividido.classList.add('listo');
    } else {
      window.requestAnimationFrame(() => {
        elTituloDividido.classList.add('listo');
      });
    }
  }

  // ========================================================================
  // 9. ANIMADOR DE TUKI EN EL HÉROE
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
    let heroeTukiVisible = false;

    const regexPuntuacionOEspacio = /[\s.,;:!?¡¿—\-()[\]{}'"`«»]/;

    const FRASES_GUION = [
      'Hola, soy Tuki',
      'Aprender se siente como jugar',
      'Cualquier materia es una aventura',
      'Gana XP y sube de nivel',
      'Funciono sin internet',
      'Hablo español, English y miskito'
    ];

    const SALUDOS_INTERACTIVOS = [
      'Qué bueno verte',
      'Hoy toca aventura',
      'Lista tu racha de hoy',
      'Vamos por más XP',
      'Te ayudo con cualquier materia'
    ];

    if (!imgTuki.hasAttribute('tabindex')) {
      imgTuki.setAttribute('tabindex', '0');
    }
    imgTuki.setAttribute('role', 'button');
    imgTuki.setAttribute('aria-label', 'Hacer celebrar a Tuki');
    imgTuki.style.cursor = 'pointer';

    function mostrarFrame(nombre) {
      if (!imgTuki) return;
      const ruta = FRAMES[nombre] || nombre;
      if (imgTuki.getAttribute('src') !== ruta) {
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
      if (prefiereReduccion) return;

      const tiempoEspera = Math.floor(Math.random() * (4500 - 2200 + 1)) + 2200;

      temporizadorParpadeo = setTimeout(() => {
        if (prefiereReduccion || !heroeTukiVisible || !pestanaVisible) {
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

    function decir(texto) {
      turnoHabla += 1;
      const turnoActual = turnoHabla;

      if (temporizadorHabla) clearTimeout(temporizadorHabla);
      if (intervaloBoca) clearInterval(intervaloBoca);
      if (temporizadorFinalHabla) clearTimeout(temporizadorFinalHabla);

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
          if (turnoActual !== turnoHabla) return;

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

    function lanzarConfetiHeroe() {
      if (prefiereReduccion || !tukiEscena) return;
      const paleta = ['#32CD32', '#2DD4BF', '#FFB02A', '#F43F5E', '#A78BFA'];
      const fragmento = document.createDocumentFragment();
      const piezas = [];

      for (let i = 0; i < 14; i++) {
        const pieza = document.createElement('span');
        pieza.className = 'confeti__pieza';
        pieza.style.setProperty('--x', `${(15 + Math.random() * 70).toFixed(1)}%`);
        pieza.style.setProperty('--color', paleta[Math.floor(Math.random() * paleta.length)]);
        pieza.style.setProperty('--retraso', `${(Math.random() * 0.3).toFixed(2)}s`);
        pieza.style.setProperty('--giro', `${Math.floor(Math.random() * 360)}deg`);

        pieza.addEventListener('animationend', () => {
          pieza.remove();
        }, { once: true });

        piezas.push(pieza);
        fragmento.appendChild(pieza);
      }

      tukiEscena.appendChild(fragmento);

      setTimeout(() => {
        piezas.forEach((p) => p.remove());
      }, 1600);
    }

    function celebrar() {
      if (temporizadorCelebracion) clearTimeout(temporizadorCelebracion);
      if (temporizadorGuion) clearTimeout(temporizadorGuion);

      estadoHeroe = 'celebrando';
      tukiEscena.classList.add('tuki-escena--celebrando');
      mostrarFrame('celebracion');
      lanzarConfetiHeroe();

      decir('Bien hecho, +10 XP');

      temporizadorCelebracion = setTimeout(() => {
        tukiEscena.classList.remove('tuki-escena--celebrando');
        if (estadoHeroe === 'celebrando') {
          estadoHeroe = 'reposo';
          mostrarFrame('idle');
        }

        if (heroeTukiVisible && pestanaVisible) {
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
      if (!heroeTukiVisible || !pestanaVisible || estadoHeroe === 'celebrando') return;

      const esTercera = (indiceGuion > 0 && indiceGuion % 3 === 2);
      const frase = FRASES_GUION[indiceGuion];
      indiceGuion = (indiceGuion + 1) % FRASES_GUION.length;

      if (esTercera && !prefiereReduccion) {
        estadoHeroe = 'pensando';
        mostrarFrame('pensando');

        temporizadorGuion = setTimeout(() => {
          if (!heroeTukiVisible || !pestanaVisible || estadoHeroe === 'celebrando') return;
          decir(frase).then(() => {
            if (heroeTukiVisible && pestanaVisible) {
              temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
            }
          });
        }, 700);
      } else {
        decir(frase).then(() => {
          if (heroeTukiVisible && pestanaVisible) {
            temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
          }
        });
      }
    }

    function reanudarGuion() {
      if (temporizadorGuion) clearTimeout(temporizadorGuion);
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

    if ('IntersectionObserver' in window) {
      const observadorHeroeTuki = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          heroeTukiVisible = entrada.isIntersecting;
          if (heroeTukiVisible && pestanaVisible) {
            reanudarGuion();
          } else {
            pausarGuion();
          }
        });
      }, { threshold: 0.2 });

      observadorHeroeTuki.observe(tukiEscena);
    } else {
      heroeTukiVisible = true;
      reanudarGuion();
    }

    if (botonSaludar) {
      botonSaludar.addEventListener('click', () => {
        if (temporizadorGuion) clearTimeout(temporizadorGuion);

        const rect = tukiEscena.getBoundingClientRect();
        const estaEnVentana = rect.top < window.innerHeight && rect.bottom > 0;
        if (!heroeTukiVisible || !estaEnVentana) {
          tukiEscena.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const indiceAleatorio = Math.floor(Math.random() * SALUDOS_INTERACTIVOS.length);
        const saludoElegido = SALUDOS_INTERACTIVOS[indiceAleatorio];

        decir(saludoElegido).then(() => {
          if (heroeTukiVisible && pestanaVisible) {
            temporizadorGuion = setTimeout(ejecutarPasoGuion, 2600);
          }
        });
      });
    }

    programarParpadeo();
  }

  // ========================================================================
  // 10. SCROLL NARRATIVO (section.historia)
  // ========================================================================
  const seccionHistoria = document.querySelector('section.historia');
  let topHistoriaDoc = 0;
  let altoHistoria = 0;

  if (seccionHistoria) {
    const pasosHistoria = seccionHistoria.querySelectorAll('.historia__paso[data-paso]');
    const imagenesHistoria = seccionHistoria.querySelectorAll('.historia__imagen[data-paso]');

    function activarPasoHistoria(valorPaso) {
      if (!valorPaso) return;
      pasosHistoria.forEach((p) => {
        p.classList.toggle('activo', p.getAttribute('data-paso') === valorPaso);
      });
      imagenesHistoria.forEach((img) => {
        img.classList.toggle('activa', img.getAttribute('data-paso') === valorPaso);
      });
      seccionHistoria.dataset.pasoActivo = valorPaso;
    }

    if ('IntersectionObserver' in window && pasosHistoria.length > 0) {
      const observadorPasos = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const pasoValor = entrada.target.getAttribute('data-paso');
            activarPasoHistoria(pasoValor);
          }
        });
      }, {
        rootMargin: '-45% 0px -45% 0px'
      });

      pasosHistoria.forEach((paso) => observadorPasos.observe(paso));
    } else if (pasosHistoria.length > 0) {
      activarPasoHistoria(pasosHistoria[0].getAttribute('data-paso'));
    }
  }

  // ========================================================================
  // 11. TARJETAS 3D (.tarjeta-3d)
  // ========================================================================
  const tarjetas3D = document.querySelectorAll('.tarjeta-3d');

  tarjetas3D.forEach((tarjeta) => {
    let rafTarjeta = null;

    tarjeta.addEventListener('pointermove', (evento) => {
      if (prefiereReduccion || !tienePunteroFino) return;
      const rect = tarjeta.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const px = Math.min(Math.max((evento.clientX - rect.left) / rect.width, 0), 1);
      const py = Math.min(Math.max((evento.clientY - rect.top) / rect.height, 0), 1);

      if (!rafTarjeta) {
        rafTarjeta = window.requestAnimationFrame(() => {
          tarjeta.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
          tarjeta.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
          tarjeta.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
          tarjeta.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
          rafTarjeta = null;
        });
      }
    }, { passive: true });

    tarjeta.addEventListener('pointerleave', () => {
      if (rafTarjeta) {
        window.cancelAnimationFrame(rafTarjeta);
        rafTarjeta = null;
      }
      tarjeta.style.setProperty('--mx', '50%');
      tarjeta.style.setProperty('--my', '50%');
      tarjeta.style.setProperty('--ry', '0deg');
      tarjeta.style.setProperty('--rx', '0deg');
    });
  });

  // ========================================================================
  // 12. BOTONES MAGNÉTICOS (.magnetico)
  // ========================================================================
  const nodosMagneticos = document.querySelectorAll('.magnetico');
  const listaMagneticos = [];

  nodosMagneticos.forEach((el) => {
    listaMagneticos.push({
      elemento: el,
      baseDocX: 0,
      baseDocY: 0,
      ancho: 0,
      alto: 0,
      radio: 0,
      actualTx: 0,
      actualTy: 0,
      objTx: 0,
      objTy: 0
    });
  });

  // ========================================================================
  // 13. CONTADORES ([data-contador])
  // ========================================================================
  const contadores = document.querySelectorAll('[data-contador]');

  if (contadores.length > 0) {
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animarContador(elemento) {
      const meta = parseInt(elemento.getAttribute('data-contador'), 10);
      if (isNaN(meta)) return;

      if (prefiereReduccion) {
        elemento.textContent = String(meta);
        return;
      }

      const duracion = 1400;
      let tiempoInicio = null;

      function frameContador(tiempoActual) {
        if (!tiempoInicio) tiempoInicio = tiempoActual;
        const transcurrido = tiempoActual - tiempoInicio;
        const progreso = Math.min(transcurrido / duracion, 1);
        const valorActual = Math.round(easeOutCubic(progreso) * meta);
        elemento.textContent = String(valorActual);

        if (progreso < 1) {
          window.requestAnimationFrame(frameContador);
        } else {
          elemento.textContent = String(meta);
        }
      }

      window.requestAnimationFrame(frameContador);
    }

    if (!('IntersectionObserver' in window) || prefiereReduccion) {
      contadores.forEach((el) => {
        const meta = parseInt(el.getAttribute('data-contador'), 10);
        if (!isNaN(meta)) el.textContent = String(meta);
      });
    } else {
      const observadorContadores = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            obs.unobserve(entrada.target);
            animarContador(entrada.target);
          }
        });
      }, { threshold: 0.6 });

      contadores.forEach((el) => observadorContadores.observe(el));
    }
  }

  // ========================================================================
  // 14. MARQUESINA SENSIBLE AL SCROLL (.cinta__pista)
  // ========================================================================
  const pistasCinta = document.querySelectorAll('.cinta__pista');
  let velocidadScrollSuave = 0;
  let tasaPlaybackActual = 1;
  let anteriorScrollY = window.scrollY || 0;

  // ========================================================================
  // 15. REVELADO AL SCROLL (.revelar)
  // ========================================================================
  const elementosRevelar = document.querySelectorAll('.revelar');

  if (elementosRevelar.length > 0) {
    if (!('IntersectionObserver' in window) || prefiereReduccion) {
      elementosRevelar.forEach((el) => el.classList.add('visible'));
    } else {
      elementosRevelar.forEach((elemento) => {
        const padre = elemento.parentElement;
        if (padre) {
          const hermanos = Array.from(padre.children).filter((h) => h.classList.contains('revelar'));
          const indice = hermanos.indexOf(elemento);
          if (indice > 0) {
            const retraso = Math.min(indice * 80, 320);
            elemento.style.transitionDelay = `${retraso}ms`;
          }
        }
      });

      const observadorRevelado = new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
            obs.unobserve(entrada.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      elementosRevelar.forEach((el) => observadorRevelado.observe(el));
    }
  }

  // ========================================================================
  // 16. GALERÍA DE POSES Y CONFETI
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
      const PALETA_CONFETI = ['#32CD32', '#2DD4BF', '#FFB02A', '#F43F5E', '#A78BFA'];

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
  // 17. AÑO DINÁMICO (#anio-actual)
  // ========================================================================
  const elAnioActual = document.getElementById('anio-actual');
  if (elAnioActual) {
    elAnioActual.textContent = String(new Date().getFullYear());
  }

  // ========================================================================
  // 18. MEDICIONES AGRUPADAS DE LAYOUT (Sin retroalimentación de transform)
  // ========================================================================
  let innerHeightCache = window.innerHeight;
  let scrollHeightCache = document.documentElement.scrollHeight;

  function recalcularMedidas() {
    innerHeightCache = window.innerHeight;
    scrollHeightCache = document.documentElement.scrollHeight;
    const scrollYActual = window.scrollY || window.pageYOffset || 0;
    const scrollXActual = window.scrollX || window.pageXOffset || 0;

    // Medición de parallax sin transform aplicado
    listaParalaje.forEach((item) => {
      if (soportaCssTranslate) {
        item.elemento.style.translate = '';
      } else {
        item.elemento.style.transform = '';
      }
    });

    listaParalaje.forEach((item) => {
      const rect = item.elemento.getBoundingClientRect();
      item.baseCenterDocY = rect.top + scrollYActual + rect.height / 2;
    });

    // Medición de sección historia
    if (seccionHistoria) {
      const rectH = seccionHistoria.getBoundingClientRect();
      topHistoriaDoc = rectH.top + scrollYActual;
      altoHistoria = rectH.height;
    }

    // Medición de botones magnéticos
    listaMagneticos.forEach((btn) => {
      const rectB = btn.elemento.getBoundingClientRect();
      btn.baseDocX = rectB.left + scrollXActual;
      btn.baseDocY = rectB.top + scrollYActual;
      btn.ancho = rectB.width;
      btn.alto = rectB.height;
      btn.radio = 1.4 * Math.max(rectB.width, rectB.height);
    });

    if (elCursor) {
      mitadCursor = (elCursor.offsetWidth || 40) / 2;
    }
  }

  recalcularMedidas();
  window.addEventListener('resize', recalcularMedidas, { passive: true });
  window.addEventListener('load', recalcularMedidas, { passive: true });

  // ========================================================================
  // 19. BUCLE ÚNICO requestAnimationFrame
  // ========================================================================
  let rafBucleId = null;

  function buclePrincipal(tiempo) {
    const scrollYActual = window.scrollY || window.pageYOffset || 0;
    const centroViewport = innerHeightCache / 2;

    // A. Barra de progreso de lectura
    if (barraProgreso) {
      const maxScroll = Math.max(1, scrollHeightCache - innerHeightCache);
      const p = Math.min(Math.max(scrollYActual / maxScroll, 0), 1);
      barraProgreso.style.transform = `scaleX(${p})`;
    }

    // B. Sombra de cabecera
    if (cabecera) {
      cabecera.classList.toggle('cabecera--con-sombra', scrollYActual > 8);
    }

    // C. Halo del cursor (lerp 0.15)
    if (elCursor && tienePunteroFino && !prefiereReduccion && cursorActivo) {
      cursorActualX += (cursorObjetivoX - cursorActualX) * 0.15;
      cursorActualY += (cursorObjetivoY - cursorActualY) * 0.15;
      elCursor.style.transform = `translate3d(${(cursorActualX - mitadCursor).toFixed(2)}px, ${(cursorActualY - mitadCursor).toFixed(2)}px, 0)`;
    }

    // D. Campo de estrellas en canvas
    if (canvasEstrellas && ctxEstrellas && heroeVisible && pestanaVisible && !prefiereReduccion && anchoCanvas > 0 && altoCanvas > 0) {
      ctxEstrellas.clearRect(0, 0, canvasEstrellas.width, canvasEstrellas.height);
      ctxEstrellas.save();
      ctxEstrellas.scale(dprCanvas, dprCanvas);

      const tiempoSeg = tiempo * 0.001;

      for (let i = 0; i < estrellas.length; i++) {
        const s = estrellas[i];
        const desplazamientoPunteroX = punteroNormalizadoX * s.profundidad * 12;
        const desplazamientoPunteroY = punteroNormalizadoY * s.profundidad * 12;
        const desplazamientoScrollY = s.profundidad * 0.3 * scrollYActual;

        const posX = ((s.x + desplazamientoPunteroX) % anchoCanvas + anchoCanvas) % anchoCanvas;
        const posY = ((s.y + desplazamientoPunteroY + desplazamientoScrollY) % altoCanvas + altoCanvas) % altoCanvas;

        const opacidad = Math.max(0.1, Math.min(1.0, s.opacidadBase + 0.35 * Math.sin(tiempoSeg * s.velocidadTitileo + s.fase)));

        ctxEstrellas.globalAlpha = opacidad;
        ctxEstrellas.fillStyle = s.color;
        ctxEstrellas.beginPath();
        ctxEstrellas.arc(posX, posY, s.radio, 0, Math.PI * 2);
        ctxEstrellas.fill();
      }

      // Estrella fugaz periódica (cada ~4-7 s)
      const ahora = performance.now();
      if (!estrellaFugaz && ahora >= proximaEstrellaFugaz) {
        const startX = Math.random() * (anchoCanvas * 0.65);
        const startY = Math.random() * (altoCanvas * 0.35);
        const angulo = (25 + Math.random() * 20) * (Math.PI / 180);
        const distancia = 240 + Math.random() * 160;

        estrellaFugaz = {
          startX: startX,
          startY: startY,
          dx: Math.cos(angulo) * distancia,
          dy: Math.sin(angulo) * distancia,
          longitud: 80 + Math.random() * 60,
          angulo: angulo,
          tiempoInicio: ahora,
          duracion: 650 + Math.random() * 350
        };

        proximaEstrellaFugaz = ahora + 4000 + Math.random() * 3000;
      }

      if (estrellaFugaz) {
        const progreso = (ahora - estrellaFugaz.tiempoInicio) / estrellaFugaz.duracion;
        if (progreso >= 1) {
          estrellaFugaz = null;
        } else {
          const cabezaX = estrellaFugaz.startX + estrellaFugaz.dx * progreso;
          const cabezaY = estrellaFugaz.startY + estrellaFugaz.dy * progreso;
          const colaX = cabezaX - Math.cos(estrellaFugaz.angulo) * estrellaFugaz.longitud;
          const colaY = cabezaY - Math.sin(estrellaFugaz.angulo) * estrellaFugaz.longitud;
          const alfa = Math.sin(progreso * Math.PI);

          const gradiente = ctxEstrellas.createLinearGradient(colaX, colaY, cabezaX, cabezaY);
          gradiente.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradiente.addColorStop(0.7, `rgba(45, 212, 191, ${(alfa * 0.8).toFixed(3)})`);
          gradiente.addColorStop(1, `rgba(255, 255, 255, ${alfa.toFixed(3)})`);

          ctxEstrellas.strokeStyle = gradiente;
          ctxEstrellas.lineWidth = 1.8;
          ctxEstrellas.beginPath();
          ctxEstrellas.moveTo(colaX, colaY);
          ctxEstrellas.lineTo(cabezaX, cabezaY);
          ctxEstrellas.stroke();

          ctxEstrellas.fillStyle = `rgba(255, 255, 255, ${alfa.toFixed(3)})`;
          ctxEstrellas.beginPath();
          ctxEstrellas.arc(cabezaX, cabezaY, 1.2, 0, Math.PI * 2);
          ctxEstrellas.fill();
        }
      }

      ctxEstrellas.restore();
    }

    // E. Parallax por scroll y puntero
    if (!prefiereReduccion && listaParalaje.length > 0) {
      punteroSuaveX += (punteroNormalizadoX - punteroSuaveX) * 0.08;
      punteroSuaveY += (punteroNormalizadoY - punteroSuaveY) * 0.08;

      for (let i = 0; i < listaParalaje.length; i++) {
        const item = listaParalaje[i];
        if (!item.visible) continue;

        const despYParalaje = item.tieneParalaje ? (item.baseCenterDocY - scrollYActual - centroViewport) * item.factorParalaje * -1 : 0;
        const despPunteroX = item.tienePuntero ? punteroSuaveX * item.factorPuntero : 0;
        const despPunteroY = item.tienePuntero ? punteroSuaveY * item.factorPuntero : 0;

        const totalX = despPunteroX;
        const totalY = despYParalaje + despPunteroY;

        if (soportaCssTranslate) {
          item.elemento.style.translate = `${totalX.toFixed(2)}px ${totalY.toFixed(2)}px`;
        } else {
          item.elemento.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)`;
        }
      }
    }

    // F. Progreso continuo del scroll narrativo
    if (seccionHistoria) {
      const denom = altoHistoria - innerHeightCache;
      const progresoH = denom > 0 ? Math.min(Math.max((scrollYActual - topHistoriaDoc) / denom, 0), 1) : 0;
      seccionHistoria.style.setProperty('--progreso-historia', progresoH.toFixed(4));
    }

    // G. Botones magnéticos
    if (tienePunteroFino && !prefiereReduccion && listaMagneticos.length > 0) {
      for (let i = 0; i < listaMagneticos.length; i++) {
        const btn = listaMagneticos[i];
        if (punteroEnDocumento) {
          const centroX = btn.baseDocX - (window.scrollX || 0) + btn.ancho / 2;
          const centroY = btn.baseDocY - scrollYActual + btn.alto / 2;
          const dx = cursorObjetivoX - centroX;
          const dy = cursorObjetivoY - centroY;
          const dist = Math.hypot(dx, dy);

          if (dist < btn.radio) {
            let despX = dx * 0.25;
            let despY = dy * 0.25;
            const mag = Math.hypot(despX, despY);
            if (mag > 12) {
              const esc = 12 / mag;
              despX *= esc;
              despY *= esc;
            }
            btn.objTx = despX;
            btn.objTy = despY;
          } else {
            btn.objTx = 0;
            btn.objTy = 0;
          }
        } else {
          btn.objTx = 0;
          btn.objTy = 0;
        }

        btn.actualTx += (btn.objTx - btn.actualTx) * 0.15;
        btn.actualTy += (btn.objTy - btn.actualTy) * 0.15;

        if (Math.abs(btn.actualTx) < 0.05 && btn.objTx === 0) btn.actualTx = 0;
        if (Math.abs(btn.actualTy) < 0.05 && btn.objTy === 0) btn.actualTy = 0;

        btn.elemento.style.setProperty('--tx', `${btn.actualTx.toFixed(2)}px`);
        btn.elemento.style.setProperty('--ty', `${btn.actualTy.toFixed(2)}px`);
      }
    }

    // H. Aceleración de marquesina por scroll
    const deltaScroll = Math.abs(scrollYActual - anteriorScrollY);
    anteriorScrollY = scrollYActual;
    velocidadScrollSuave += (deltaScroll - velocidadScrollSuave) * 0.1;

    const tasaObjetivo = prefiereReduccion ? 1 : (1 + Math.min(velocidadScrollSuave * 0.08, 4));
    tasaPlaybackActual += (tasaObjetivo - tasaPlaybackActual) * 0.1;

    if (pistasCinta.length > 0) {
      for (let i = 0; i < pistasCinta.length; i++) {
        const pista = pistasCinta[i];
        if (typeof pista.getAnimations === 'function') {
          const anims = pista.getAnimations();
          if (anims && anims.length > 0 && anims[0]) {
            anims[0].playbackRate = tasaPlaybackActual;
          }
        }
      }
    }

    // Continuar ciclo si la pestaña sigue visible
    if (pestanaVisible) {
      rafBucleId = window.requestAnimationFrame(buclePrincipal);
    } else {
      rafBucleId = null;
    }
  }

  function iniciarBucle() {
    if (!rafBucleId && pestanaVisible) {
      rafBucleId = window.requestAnimationFrame(buclePrincipal);
    }
  }

  function detenerBucle() {
    if (rafBucleId) {
      window.cancelAnimationFrame(rafBucleId);
      rafBucleId = null;
    }
  }

  iniciarBucle();

  // ========================================================================
  // 20. GESTIÓN DE VISIBILIDAD DE PESTAÑA Y CAMBIO DE PREFERENCIAS
  // ========================================================================
  document.addEventListener('visibilitychange', () => {
    pestanaVisible = (document.visibilityState === 'visible');
    if (pestanaVisible) {
      iniciarBucle();
    } else {
      detenerBucle();
    }
  });

  const alCambiarPreferenciaMovimiento = (evento) => {
    prefiereReduccion = Boolean(evento.matches);

    if (prefiereReduccion) {
      // Resetear transformaciones de parallax
      listaParalaje.forEach((item) => {
        if (soportaCssTranslate) {
          item.elemento.style.translate = '';
        } else {
          item.elemento.style.transform = '';
        }
      });

      // Ocultar halo de cursor
      if (elCursor) {
        elCursor.classList.remove('activo');
        elCursor.style.transform = '';
        cursorActivo = false;
      }

      // Resetear inclinación de tarjetas 3D
      tarjetas3D.forEach((tarjeta) => {
        tarjeta.style.setProperty('--mx', '50%');
        tarjeta.style.setProperty('--my', '50%');
        tarjeta.style.setProperty('--ry', '0deg');
        tarjeta.style.setProperty('--rx', '0deg');
      });

      // Resetear botones magnéticos
      listaMagneticos.forEach((btn) => {
        btn.elemento.style.removeProperty('--tx');
        btn.elemento.style.removeProperty('--ty');
        btn.actualTx = 0;
        btn.actualTy = 0;
        btn.objTx = 0;
        btn.objTy = 0;
      });

      // Dibujar estrellas estáticas
      if (canvasEstrellas && ctxEstrellas) {
        dibujarEstrellasEstaticas();
      }

      // Revelar elementos pendientes
      elementosRevelar.forEach((el) => {
        el.classList.add('visible');
        el.style.transitionDelay = '';
      });

      // Restablecer velocidad normal de marquesina
      pistasCinta.forEach((pista) => {
        if (typeof pista.getAnimations === 'function') {
          const anims = pista.getAnimations();
          if (anims && anims.length > 0 && anims[0]) {
            anims[0].playbackRate = 1;
          }
        }
      });
      tasaPlaybackActual = 1;
    } else {
      recalcularMedidas();
    }
  };

  if (typeof mediaReducirMovimiento.addEventListener === 'function') {
    mediaReducirMovimiento.addEventListener('change', alCambiarPreferenciaMovimiento);
  } else if (typeof mediaReducirMovimiento.addListener === 'function') {
    mediaReducirMovimiento.addListener(alCambiarPreferenciaMovimiento);
  }

  const alCambiarPunteroFino = (evento) => {
    tienePunteroFino = Boolean(evento.matches);
    if (!tienePunteroFino) {
      if (elCursor) {
        elCursor.classList.remove('activo');
        elCursor.style.transform = '';
        cursorActivo = false;
      }
      listaMagneticos.forEach((btn) => {
        btn.elemento.style.removeProperty('--tx');
        btn.elemento.style.removeProperty('--ty');
        btn.actualTx = 0;
        btn.actualTy = 0;
        btn.objTx = 0;
        btn.objTy = 0;
      });
    }
  };

  if (typeof mediaPunteroFino.addEventListener === 'function') {
    mediaPunteroFino.addEventListener('change', alCambiarPunteroFino);
  } else if (typeof mediaPunteroFino.addListener === 'function') {
    mediaPunteroFino.addListener(alCambiarPunteroFino);
  }

})();
