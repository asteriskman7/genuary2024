'use strict';

window.sketchClass = class extends Sketch {
  desc = "slewing between cosine gradient palettes with rnd weights"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.P0 = [
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()]
    ];
    this.P1 = [
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()],
      [Math.random(),Math.random(),Math.random()]
    ];
    this.t0 = 0;
  }

  //runs once per frame. Time is this.t
  update() {
    this.delta = this.t - this.t0;
    if (this.delta >= 1) {
      this.P0 = this.P1;
      this.P1 = [
        [Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random()],
        [Math.random(),Math.random(),Math.random()]
      ];
      this.t0 = this.t;
      this.delta = 0;
    }
  }

  draw(ctx, width, height, t) {
    //ctx.fillStyle = 'black';
    //ctx.fillRect(0, 0, width, height);

    const s = 4;
    const w = Math.ceil( width / s);
    const h = Math.ceil( height / s);
    const P = [
      [this.lmap(this.delta, 0, 1, this.P0[0][0], this.P1[0][0]), 
       this.lmap(this.delta, 0, 1, this.P0[0][1], this.P1[0][1]),
       this.lmap(this.delta, 0, 1, this.P0[0][2], this.P1[0][2])],
      [this.lmap(this.delta, 0, 1, this.P0[1][0], this.P1[1][0]), 
       this.lmap(this.delta, 0, 1, this.P0[1][1], this.P1[1][1]),
       this.lmap(this.delta, 0, 1, this.P0[1][2], this.P1[1][2])],
      [this.lmap(this.delta, 0, 1, this.P0[2][0], this.P1[2][0]), 
       this.lmap(this.delta, 0, 1, this.P0[2][1], this.P1[2][1]),
       this.lmap(this.delta, 0, 1, this.P0[2][2], this.P1[2][2])],
      [this.lmap(this.delta, 0, 1, this.P0[3][0], this.P1[3][0]), 
       this.lmap(this.delta, 0, 1, this.P0[3][1], this.P1[3][1]),
       this.lmap(this.delta, 0, 1, this.P0[3][2], this.P1[3][2])]
    ];

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {

        const bs = 24;
        const dx = (x - w/2) % bs;
        const dy = (y - h/2) % bs;
        const xi = Math.floor((x - w/2) / bs);
        const yi = Math.floor((y - w/2) / bs);
        const d = yi + xi + this.lmap(Math.sin(this.t), -1, 1, 0.25, 1) * (Math.sqrt(dx * dx + dy * dy)) / (Math.sqrt(2) * bs / 2);

        const rgb = this.cosineGradient(P, d);
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fillRect(x * s, y * s, s, s);
      }
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
