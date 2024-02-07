'use strict';

window.sketchClass = class extends Sketch {
   desc = "I can't decide if I want to drink it or swim in it."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.points = [];

    const pointCount = 6;
    for (let i = 0; i < pointCount; i++) {
      const point = {
        x: this.lmap(Math.random(), 0, 1, 100, 400),
        y: this.lmap(Math.random(), 0, 1, 400, 500),
        vx: this.lmap(Math.random(), 0, 1, -5, 5),
        vy: this.lmap(Math.random(), 0, 1, -1, 1),
        t: this.lmap(Math.random(), 0, 1, 0, 50)
      };
      this.points.push(point);
    }
    this.lightHue = this.lmap(Math.random(), 0, 1, 0, 360);
    this.lavaHue = this.lmap(Math.random(), 0, 1, 0, 360);
  }

  //runs once per frame. Time is this.t
  update() {
    const sideForce = 5;
    const hForce = 1;
    const heatRange = 75;
    const gForce = 0.1;
    this.points.forEach( p => {
      const fLeft = sideForce / Math.pow(p.x, 2);
      const fRight = sideForce / Math.pow(this.canvas.width - p.x, 2);
      const fTop = sideForce / Math.pow(p.y, 2);
      const fBot = sideForce / Math.pow(this.canvas.height - p.y, 2);
      const fHeat = -p.t / 300;

      if (p.y > this.canvas.height / 2) {
        p.t = Math.min(100, p.t + 0.5 * this.gaussianRandom(0.1, 0.05));
      } else {
        p.t = Math.max(0, p.t - 0.5 * this.gaussianRandom(0.1, 0.05));
      }
      
      p.vx += (fLeft - fRight) - p.vx * 0.01;
      p.vy += (fTop - fBot + fHeat + gForce) - p.vy * 0.01;
      //p.x += p.vx;
      p.y += p.vy;

      p.x = Math.min(this.canvas.width - 5, Math.max(5, p.x));
      p.y = Math.min(this.canvas.height - 5, Math.max(5, p.y));

      if (isNaN(p.x) || isNaN(p.y)) {
        console.log('oops');
      }
    });
  }

  draw(ctx, width, height, t) {
    const s = 3;
    const w = Math.ceil(width / s);
    const h = Math.ceil(height / s);

    for (let xi = 0; xi < w; xi++) {
      for (let yi = 0; yi < h; yi++) {
        const x = xi * s;
        const y = yi * s;

        let d = Infinity;
        this.points.forEach( (p1, i) => {
          const dx1 = x - p1.x;
          const dy1 = y - p1.y;
          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

          if (d1 <= 50) {
            d = Math.min(d, d1);
          }

          this.points.forEach( (p2, j) => {
            if (i === j) {return;}
            const dx2 = x - p2.x;
            const dy2 = y - p2.y;
            const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (d1 * d2 <= 10000) {
              d = Math.min(d, Math.sqrt(d1 * d2) / 2);
            }

          });
          
        });

        const l = this.clamp(this.lmap(d * d, 0, 4000, 100, 0), 0, 100);
        if (l < 10) {
          ctx.fillStyle = `hsl(${this.lightHue}, 50%, ${this.lmap(y*y, 0, height*height, 10, 70)}%)`;
        } else {
          const hue = this.lmap(y, 0, height, this.lavaHue, this.lightHue);
          ctx.fillStyle = `hsl(${hue}, 30%, ${this.lmap(l, 0, 100, 0, 50)}%)`;
        }
        ctx.fillRect(xi * s, yi * s, s, s);
      }
    }


  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
