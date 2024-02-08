'use strict';

window.sketchClass = class extends Sketch {
  desc = "The deeper we go, the deeper we go!"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.units = [];
    const unitCount = 10;
    for (let i = 0; i < unitCount; i++) {
      const unit = {
        c: i * 360 / unitCount,
        d: 1,
        r: 100 * Math.pow(0.4, i)
      };
      this.units.unshift(unit);
    }

    this.scale = 1;
  }

  //runs once per frame. Time is this.t
  update() {
    this.scale *= 1.01;
    const lastUnit = this.units[this.units.length - 1];
    if (lastUnit.r * this.scale > 500) {
      this.units.pop();
      lastUnit.r *= Math.pow(0.4, this.units.length + 1);
      this.units.unshift(lastUnit);
    }
  }

  drawUnit(ctx, config, scale, f) {
    const c = config.c;
    const d = config.d + 1 * Math.cos(this.t);
    const r = config.r * scale;
    const n = 8;
    const rx = this.canvas.width * 2;

    ctx.strokeStyle = `hsla(${c}, 50%, 50%, ${this.lmap(r / 400, 0, 1, 0, 10)})`;
    ctx.lineWidth = 100 * r / 400;
    for (let i = 0; i < n; i++) {
      const x0 = r * Math.cos(2 * Math.PI * i / n);
      const y0 = r * Math.sin(2 * Math.PI * i / n);
      const x1 = r * Math.cos(2 * Math.PI * (i + d) / n);
      const y1 = r * Math.sin(2 * Math.PI * (i + d) / n);

      const a = Math.atan2(y1 - y0, x1 - x0);
      const xx0 = x0 + rx * Math.cos(a);
      const xx1 = x0 - rx * Math.cos(a);
      const xy0 = y0 + rx * Math.sin(a);
      const xy1 = y0 - rx * Math.sin(a);

      ctx.beginPath();
      ctx.moveTo(xx0, xy0);
      ctx.lineTo(xx1, xy1);
      ctx.stroke();
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(width / 2, height / 2);
    ctx.globalCompositeOperation = 'lighter'
    this.units.forEach( (u, i) => {
      this.drawUnit(ctx, u, this.scale, i / this.units.length);
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
