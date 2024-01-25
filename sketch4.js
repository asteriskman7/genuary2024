'use strict';

window.sketchClass = class extends Sketch {
  desc = "mmm pixels"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    const canvasB = document.createElement('canvas');
    canvasB.width = 64;
    canvasB.height = 64;
    const ctx = canvasB.getContext('2d');

    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = 'black';
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\ud83e\uddc1', 18, 18);



    const imageData = ctx.getImageData(0, 0, 64, 64);
    this.data = imageData.data;


    this.moving = {};


  }

  //runs once per frame. Time is this.t
  update() {
    const newx = Math.floor(Math.random() * 36);
    const newy = Math.floor(Math.random() * 36);

    if (this.moving[`${newx},${newy}`] === undefined) {
      const m = {t0: this.t, life: this.lmap(Math.random(), 0, 1, 0.5, 2.5)};
      this.moving[`${newx},${newy}`] = m;
    }

    Object.keys(this.moving).forEach( k => {
      const delta = this.t - this.moving[k].t0;
      if (delta >= this.moving[k].life) {
        delete this.moving[k];
      }
    });
  }

  /*
    x, y is the top front corner of box
    width goes \
    depth goes /
    height goes |
  */
  drawBox(ctx, x, y, width, depth, height, fill, line) {
    const angle = Math.PI / 6;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = fill;
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.lineTo(depth * Math.cos(angle), height - depth * Math.sin(angle));
    ctx.lineTo(depth * Math.cos(angle), -depth * Math.sin(angle));
    ctx.lineTo(0, 0);
    ctx.lineTo(-width * Math.cos(angle), -width * Math.sin(angle));
    ctx.lineTo(-width * Math.cos(angle), height - width * Math.sin(angle));
    ctx.lineTo(0, height);
    ctx.moveTo(-width * Math.cos(angle), -width * Math.sin(angle));
    ctx.lineTo(-width * Math.cos(angle) + depth * Math.cos(angle), -width * Math.sin(angle) - depth * Math.sin(angle));
    ctx.lineTo(depth * Math.cos(angle), -depth * Math.sin(angle));
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    const s = 8;
    const a = Math.PI / 6;
    const w = Math.floor(((width/2)/Math.cos(a))/s);
    const h = Math.floor(((height/2)/Math.cos(a))/s);

    const x0 = width / 2;
    const y0 = 100;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const moving = this.moving[`${x},${y}`];
        const deltat = (moving === undefined) ? 0 : t - moving.t0;
        const deltay = deltat > 0 ? 5 * Math.sin(this.lmap(deltat, 0, moving.life, 0, Math.PI)) : 0;
        const bx = x0 + x * s * Math.cos(a) - y * s * Math.cos(a);
        const by = y0 + y * s * Math.sin(a) + x * s * Math.sin(a) - deltay; 

        //const c = 'red';
        //const c = `rgb(${(x + y) * 255 / (w + h)}, 0, 0)`;
        const r = this.data[4 * (x + y * 64) + 0];
        const g = this.data[4 * (x + y * 64) + 1];
        const b = this.data[4 * (x + y * 64) + 2];

        const hsl = this.rgbToHsl(r, g, b);
        const c = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        const cline = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l * 0.3}%)`;

        this.drawBox(ctx, bx, by, s, s, s, c, cline);
      }
    }

    //this.drawBox(ctx, 0, 0, s, s, s, 'red', 'black');

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
