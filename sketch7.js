'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.startTime = 0;
    this.fraction = 0;
  }

  //runs once per frame. Time is this.t
  update() {
    const totalTime = 60;
    const deltaTime = this.t - this.startTime;
    //this.fraction = Math.min(1, this.fraction + Math.max(0,this.gaussianRandom(0.0001, 0.001))); 
    this.fraction = Math.min(1, deltaTime / totalTime);
    const pieces = 100;
    this.pieces = Math.floor(this.fraction * pieces);
    this.pieceFraction = (this.fraction * pieces  - this.pieces) ;

    if (deltaTime >= totalTime) { //this.fraction >= 1) {
      //this.fraction = 0;
      this.startTime = this.t;
    }
  }
  /*
    x, y is the top front corner of box
    width goes \
    depth goes /
    height goes |
  */
  drawBox(ctx, angle, x, y, width, depth, height, fill, line) {
    //const angle = Math.PI / 6;
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
    //ctx.font = '40px Poppins';
    ctx.font = '40px monospace';
    ctx.fillStyle = `hsl(${this.lmap(this.fraction, 0, 1, 0, 120)},100%,50%)`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    const ptext = (this.fraction * 100).toFixed(1).padStart(4, ' ') + '%';
    ctx.strokeText(ptext, width / 2, 130);
    ctx.fillText(ptext, width / 2, 130);
    ctx.lineWidth = 2;

    const s = 28;
    const a = Math.PI / 6;
    const w = Math.floor(((width/2)/Math.cos(a))/s);
    const h = Math.floor(((height/2)/Math.cos(a))/s);

    const x0 = width / 2;
    const y0 = 200;
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const deltat = 0;
        const deltay = deltat > 0 ? 5 * Math.sin(this.lmap(deltat, 0, moving.life, 0, Math.PI)) : 0;
        const bx = x0 + x * s * Math.cos(a) - y * s * Math.cos(a);
        const by = y0 + y * s * Math.sin(a) + x * s * Math.sin(a) - deltay; 

        //const c = 'red';
        //const c = `rgb(${(x + y) * 255 / (w + h)}, 0, 0)`;

        const hsl = this.rgbToHsl(0, 255, 0);

        const cellIndex = (y % 2 === 0) ? (x + y * w) : (((w-1) - x) + y * w) ;
        let cellHeight;
        if (cellIndex < this.pieces) {
          cellHeight = s;
          hsl.s = 100;
          hsl.h = 120;
        } else {
          if (cellIndex === this.pieces) {
            cellHeight = this.pieceFraction * s;
            hsl.h = 120 * this.pieceFraction;
            hsl.s = 100;
          } else {
            cellHeight = 0;
            hsl.s = 100;
            hsl.h = 0;
          }
        }
        const c = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        const cline = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l * 0.3}%)`;
        this.drawBox(ctx, a, bx, by-cellHeight, s, s, cellHeight, c, cline);
      }
    }
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
