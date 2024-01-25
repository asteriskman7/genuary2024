'use strict';

window.sketchClass = class extends Sketch {
  desc = "Recursively mapping the Mandelbrot set into itself"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.s = 2;
    this.w = Math.ceil(this.canvas.width / this.s);
    this.h = Math.ceil(this.canvas.height / this.s);

    this.height = [];
    for (let x = 0; x < this.w; x++) {
      this.height.push(1.5);
    }

    this.P = [[0.520, 0.048, 0.724], [0.673, 0.914, 0.089], [0.621, 1.240, 1.414], [3.443, 1.933, 1.584]];
  }

  //runs once per frame. Time is this.t
  update() {
  }

  getMVal(x, y, maxIter) {
    let z = [0, 0];

    let i = 1;
    while (true) {

      //z=z^2 + c
      z = [z[0] * z[0] - z[1] * z[1] + x, 2 * z[0] * z[1] + y];

      const d2 = z[0] * z[0] + z[1] * z[1];
      if (d2 >= 4) {
        //return i;
        return i + 1 - Math.log(Math.log2(Math.sqrt(d2)));
      }
      i++;
      if (i >= maxIter) {
        return i;
      }
    }

    return 0;
  }

  draw(ctx, width, height, t) {

    const maxIter = 20;

    for (let x = 0; x < this.w; x++) {
      const hx = this.height[x];
      const ymin = this.lmap(hx, 0, 1.5, this.h / 2, 0);
      const ymax = this.lmap(hx, 0, 1.5, this.h / 2, this.h);
      let seenMaxHeight = 0;
      for (let y = 0; y < this.h; y++) {
        const mx = this.lmap(x, 0, this.w - 1, -2, 1);
        const my = this.lmap(y, 0, this.h - 1, -1.5, 1.5);

        const mVal = this.getMVal(mx, my, maxIter);

        //ctx.fillStyle = `rgb(${this.lmap(mVal, 0, maxIter, 0, 255)}, 0, 0)`;
        ctx.fillStyle = this.cosineGradientC(this.P, this.lmap(mVal, 0, maxIter, 0, 1));
        const ay = this.lmap(y, 0, this.h, ymin, ymax); 
        if (mVal === maxIter) {
          
          seenMaxHeight = Math.max(seenMaxHeight, this.lmap(my, -1.5, 1.5, -hx, hx));
        }
        ctx.fillRect(x * this.s, ay * this.s, this.s, this.s);
      }
      this.height[x] = seenMaxHeight;
    }
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
