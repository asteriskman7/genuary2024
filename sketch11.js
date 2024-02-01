'use strict';

window.sketchClass = class extends Sketch {
  desc = "\"Not Machine Washable\""; // jshint ignore:line

  //runs once every time the sketch starts
  load() {

    this.canvas.style.filter = 'blur(0.5px)';
    const colPalette = this.rndPalette(Math.random());
    const rowPalette = this.rndPalette(Math.random());

    this.cols = this.makeStrips(this.canvas.width, colPalette, 10, 3, 0.1);
    this.rows = this.makeStrips(this.canvas.height, rowPalette, 10, 3, 0.1);
    this.angle = this.lmap(Math.random(), 0, 1, -0.01, 0.01);

  }

  unload() {
    this.canvas.style.filter = '';
  }

  makeStrips(maxStart, palette, sizeA, sizeD, domRatio) {
    const strips = [];
    let i = 0;
    let size = this.gaussianRandom(sizeA, sizeD);
    let maxT = Math.max(0.5, this.gaussianRandom(4, 2));
    while (i <= maxStart) {
      //const rgb = this.cosineGradient(palette, i / maxStart);
      const rgb = this.cosineGradient(palette, i / maxT);
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      const c = `hsla(${hsl.h},${hsl.s * 0.2}%,${hsl.l}%, 0.8)`;
      const dom = Math.random() < domRatio;
      const strip = {i, size, c, dom};
      strips.push(strip);
      i += size;
      size = this.gaussianRandom(sizeA, sizeD);
    }
    return strips;
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width/2, height/2);
    ctx.rotate(this.angle);
    ctx.scale(1.25, 1.25);
    ctx.translate(-width/2, -height/2);

    const enlarge = 2;

    for (let xi = 0; xi < this.cols.length; xi++) {
      const col = this.cols[xi];
      for (let yi = 0; yi < this.rows.length; yi++) {
        const row = this.rows[yi];
        let colVisible;
        switch (`${col.dom},${row.dom}`) {
          case 'true,true':
          case 'false,false': {
            colVisible = (yi % 2 === 0) ? (xi % 2 === 0) : (xi % 2 === 1);
            break;
          }
          case 'false,true': 
          case 'true,false': {
            colVisible = col.dom;
            break;
          }
        }

            

        ctx.fillStyle = colVisible ? col.c : row.c;
        //ctx.fillStyle = colVisible ? 'red' : 'blue';
        const rx = col.i + this.lmap(this.rnd(xi * 100 + yi), 0, 1, -enlarge/2, enlarge/2);
        const width = col.size;
        const ry = row.i + this.lmap(this.rnd(xi * 200 + yi * 3), 0, 1, -enlarge/2, enlarge/2);
        const height = row.size;
        ctx.fillRect(rx - enlarge/2, ry - enlarge/2, width + enlarge, height + enlarge);
      }
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
