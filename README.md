# TIUK — Landing page

Landing page oficial de presentación para **TIUK**, la plataforma educativa gamificada que convierte cualquier asignatura escolar en una aventura interactiva estilo RPG. Los estudiantes exploran islas de conocimiento, superan desafíos pedagógicos y aprenden de la mano de **Profe Tuki**, un tutor carismático con voz que funciona plenamente sin conexión a internet y en tres idiomas: Español, English y Miskito.

🌐 **Demo en vivo:** [https://urientropy.github.io/tiuk-landing/](https://urientropy.github.io/tiuk-landing/)

---

## 📁 Estructura del proyecto

```text
tiuk-landing/
├── .nojekyll              # Configuración para despliegue estático en GitHub Pages
├── README.md              # Documentación del proyecto
├── index.html             # Estructura semántica accesible de la landing
├── css/
│   └── estilos.css        # Hoja de estilos (estilo soft-neobrutalismo mobile-first)
├── js/
│   └── principal.js       # Lógica vanilla JS: animador de Tuki, menú, scroll y galería
└── assets/
    ├── img/               # Poses y frames de animación WebP optimizados de Tuki
    └── marca/             # Símbolo y wordmark vectoriales en formato SVG
```

---

## 🚀 Cómo verla en local

Para ejecutar la landing localmente no se requieren herramientas de compilación complejas ni dependencias de terceros; cualquier servidor web estático local es suficiente:

```bash
# Navegar a la raíz del proyecto
cd tiuk-landing

# Levantar un servidor HTTP con Python 3
python3 -m http.server 8000
```

Luego abre en tu navegador preferido:
👉 [http://localhost:8000](http://localhost:8000)

---

## 🐸 Animaciones de Tuki (Animación por frames)

La expresividad de Tuki cobra vida mediante una técnica ligera y eficiente de **intercambio dinámico de frames precargados** en formato WebP:

1. **Precarga proactiva:** Al cargar el script diferido, se inicializan instancias en memoria de `new Image()` con todos los frames del héroe y las poses de la galería. De esta forma, el navegador almacena en caché los assets y los cambios de `src` ocurren al instante sin parpadeos blancos.
2. **Reposo y parpadeo natural (`idle` / `blink`):** En reposo, Tuki parpadea a intervalos semialeatorios (entre 2.2 s y 4.5 s) durante 140 ms, con una probabilidad del 20% de ejecutar un doble parpadeo más expresivo.
3. **Habla sincronizada con texto (`hablando` / `hablando-boca-cerrada`):**
   - El globo de diálogo escribe los mensajes mediante un efecto máquina de escribir (~35 ms por carácter, utilizando `Array.from` para respetar secuencias de emojis compuestas).
   - La boca de Tuki alterna entre abierta y cerrada (~110–150 ms) únicamente al pronunciar palabras o caracteres alfanuméricos, deteniéndose con boca cerrada al procesar espacios y signos de puntuación.
   - Si parpadea mientras habla, utiliza variantes contextuales específicas (`hablando-blink` y `hablando-blink-boca-cerrada`).
   - Al finalizar cada frase, mantiene la boca cerrada 300 ms antes de regresar al estado de reposo.
4. **Celebración y estados adicionales (`celebracion` / `pensando`):**
   - Al hacer clic o presionar la imagen de Tuki, ejecuta un salto de celebración por 900 ms con feedback visual y felicitación en su globo.
   - En el guion automático que corre cuando la sección y la pestaña están activas, Tuki reflexiona brevemente en pose pensativa antes de ciertas frases.

---

## ♿ Accesibilidad y `prefers-reduced-motion`

La landing cumple con principios de diseño universal y accesibilidad web:

- **Reducción de movimiento (`prefers-reduced-motion: reduce`):**
  - Se desactiva el parpadeo automático y la alternancia de boca.
  - El texto de la burbuja se renderiza por completo de inmediato sin efecto máquina de escribir.
  - Se omiten las explosiones de confeti en la galería y las animaciones de flotación continua.
  - Los elementos con efecto de revelado por scroll (`.revelar`) se muestran inmediatamente al 100% de opacidad y posición final.
  - Los cambios de poses e imágenes siguen funcionando de forma estática y directa.
- **Navegación por teclado y lectores de pantalla:**
  - Tuki cuenta con atributos `role="button"`, `tabindex="0"`, etiquetas ARIA descriptivas (`aria-label`, `aria-live="polite"`, `aria-pressed`, `aria-expanded`) y control mediante teclas <kbd>Enter</kbd> y <kbd>Espacio</kbd>.
  - El menú móvil se cierra con la tecla <kbd>Escape</kbd>, devolviendo el foco de manera accesible al botón disparador.

---

## 🎨 Créditos y derechos de autor

- **Mascota Tuki:** © TIUK. Todos los derechos reservados.
- **Diseño y desarrollo:** Equipo de desarrollo de TIUK.
