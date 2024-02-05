'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsl(205, 46%, 68%)';
    ctx.fillRect(0, 0, width, height);

    const ball = '\u26bd';
 
    ctx.font = '20px sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const w = 2.346;
    const h = 9.345;
    let ballDrawn = false;
    for (let y0 = 50; y0 < (height - h); y0 += h) {
      let ts = 4;
      let ylast = y0;
      const xs = this.lmap(y0, 0, height, 1.0, 0.5);
      const ys = this.lmap(y0, 0, height, 0.1, 1.0);
      if (y0 + 2 *h >= height) {
        ts = 0;
      } else {
        ts =  ts / (xs * xs * 4 );
      }
      for (let x0 = -w; x0 < width; x0 += w) {
        const dy =  5 * Math.sin(0.1 * x0 * xs + 1.1 * t * ts +          Math.sin(0.3 * y0 + 0.4 * t * ts)) +
          2 * Math.sin(0.2   * x0 * xs + 1.1 * t * ts  +          Math.sin(0.2 * y0 + 0.4 * t * ts)) +
          5 * Math.sin(0.09 * y0 + 0.15 * t * ts + Math.sin(0.15 * x0 * xs + 0.55 * t * ts));
        const y = y0 + dy * ys;
        if (ts > 0) {
          const h = 205;
          const l = this.lmap(y0, 0, height, 20, 60);
          const lboost = this.clamp(this.lmap(dy, -7 * ys, -10 * ys, 1, 2), 1, 2);
          const satboost = dy < -8 ? 0.2 : 1;
          ctx.strokeStyle = `hsl(${h}, ${50 * satboost}%, ${l * lboost}%)`;
          ctx.fillStyle = `hsl(${h}, 40%, ${l * 0.4}%)`;
        } else {
          ctx.strokeStyle = `hsl(58, 58%, 66%)`;
          ctx.fillStyle = `hsl(58, 58%, 80%)`;
        }
        ctx.fillRect(x0, ylast, Math.ceil(w), height - ylast);
        ctx.beginPath();
        ctx.moveTo(x0, ylast);
        ctx.lineTo(x0 + w, y);
        ctx.stroke();
        ylast = y;

      }
      if (y0 > 400 && !ballDrawn) {
        ballDrawn = true;
        const x0 = width - ((t * 40) % width);
        const dy =  5 * Math.sin(0.1 * x0 * xs + 1.1 * t * ts +          Math.sin(0.3 * (y0+h) + 0.4 * t * ts)) +
          2 * Math.sin(0.2   * x0 * xs + 1.1 * t * ts  +          Math.sin(0.2 * (y0+h) + 0.4 * t * ts)) +
          5 * Math.sin(0.09 * (y0+h) + 0.15 * t * ts + Math.sin(0.15 * x0 * xs + 0.55 * t * ts));
        ctx.save();
        ctx.translate(x0, y0 + dy + 3 * h / 4);
        ctx.rotate(t);
        ctx.fillText(ball, 0, 0);
        ctx.restore();
      }
    }
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
