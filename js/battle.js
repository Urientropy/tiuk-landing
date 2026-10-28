/* Escenario RPG: fondo con suelo continuo y sprites originales de ui_core.
 * Un único plano de apoyo alinea pies y sombras dentro del centro de la arena.
 */
(() => {
  "use strict";
  class TiukBattle {
    constructor(canvas, assetBase = "assets/game/") {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.assets = {};
      this.action = null;
      this.enemyVisible = true;
      this.paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.inView = true;
      const files = {
        arena: "arena-idiomas.webp",
        hero: "hero_idle_right.png",
        attack: "hero_attack1_right.png",
        run: "hero_run_right.png",
        goblin: "goblin_attack.png",
      };
      this.ready = Promise.all(
        Object.entries(files).map(
          ([key, file]) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                this.assets[key] = img;
                resolve();
              };
              img.onerror = resolve;
              img.src = assetBase + file;
            }),
        ),
      ).then(() => this.draw(0));
      this.observer = new IntersectionObserver(
        (entries) => {
          this.inView = entries[0].isIntersecting;
        },
        { rootMargin: "100px" },
      );
      this.observer.observe(canvas);
    }
    playAction(type) {
      this.action = { type, start: performance.now() / 1000 };
    }
    draw(time) {
      const ctx = this.ctx,
        w = this.canvas.width,
        h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#173643";
      ctx.fillRect(0, 0, w, h);
      if (this.assets.arena) ctx.drawImage(this.assets.arena, 0, 0, w, h);
      // Las motas quedan en el bosque, fuera de las siluetas del combate.
      for (let i = 0; i < 10; i++) {
        const x = (i * 113 + 33) % w,
          y = 15 + ((i * 37) % 65) + Math.sin(time + i) * 4;
        ctx.globalAlpha = 0.22 + Math.sin(time * 0.7 + i) * 0.1;
        ctx.fillStyle = "#d5f479";
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.imageSmoothingEnabled = false;
      const baseline = h * 0.69;
      let heroX = w * 0.36,
        enemyX = w * 0.64,
        heroFrame = Math.floor(time / 0.12) % 8,
        enemyFrame = Math.floor(time / 0.16) % 4;
      let heroImg = this.assets.hero;
      const progress = this.action ? Math.max(0, time - this.action.start) : 10;
      const actionType = this.action?.type;
      const distance = w * 0.28 - 20;
      if (progress < 1.2 && actionType === "attack") {
        const t = progress / 1.2;
        heroX += Math.sin(Math.min(1, t * 1.6) * Math.PI) * distance;
        heroImg = t < 0.25 ? this.assets.run : this.assets.attack;
        heroFrame = Math.floor(progress / 0.08) % 8;
        if (t > 0.3 && t < 0.65) enemyX += Math.sin(progress * 70) * 7;
      } else if (progress < 1.1 && actionType === "counter") {
        enemyX -= Math.sin((progress / 1.1) * Math.PI) * distance;
        enemyFrame = Math.floor(progress / 0.09) % 12;
        if (progress > 0.35 && progress < 0.7)
          heroX += Math.sin(progress * 60) * 7;
      }
      ctx.fillStyle = "#14232973";
      ctx.beginPath();
      ctx.ellipse(heroX, baseline + 2, 26, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // En el PNG del héroe, los pies están en y=58 (frame de 96×80).
      if (heroImg) {
        ctx.save();
        ctx.shadowColor = "#10233599";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(
          heroImg,
          heroFrame * 96,
          0,
          96,
          80,
          heroX - 139.5,
          baseline - 58 * 3,
          288,
          240,
        );
        ctx.restore();
      }
      if (this.enemyVisible && this.assets.goblin) {
        ctx.beginPath();
        ctx.ellipse(enemyX, baseline + 2, 29, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.translate(enemyX, 0);
        ctx.scale(-1, 1);
        ctx.shadowColor = "#10233599";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;
        // Los cuatro frames de reposo del goblin apoyan el pie en y=101.
        ctx.drawImage(
          this.assets.goblin,
          enemyFrame * 150,
          0,
          150,
          150,
          -198.75,
          baseline - 101 * 2.65,
          397.5,
          397.5,
        );
        ctx.restore();
      }
      ctx.imageSmoothingEnabled = true;
      if (progress > 0.37 && progress < 0.9 && actionType === "attack") {
        const p = (progress - 0.37) / 0.53;
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = "#e8ffe6";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(w * 0.64, baseline - 50, 17 + p * 55, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4,
            r = 20 + p * 70;
          ctx.fillStyle = i % 2 ? "#2dd4bf" : "#fff3b3";
          ctx.fillRect(
            w * 0.64 + Math.cos(a) * r,
            baseline - 50 + Math.sin(a) * r,
            5,
            5,
          );
        }
        ctx.globalAlpha = 1;
      }
    }
    start() {
      const frame = (now) => {
        if (this.inView && !document.hidden)
          this.draw(this.paused ? 0 : now / 1000);
        this.raf = requestAnimationFrame(frame);
      };
      this.raf = requestAnimationFrame(frame);
    }
  }
  window.TiukBattle = TiukBattle;
})();
