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
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, height);

    const rowHeight = 10;
    const colWidth = 2;
    ctx.lineStyle = 'black';
    ctx.lineWidth = 3;
    let li = 0;
    for (let y = height; y >= -rowHeight; y -= rowHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= width; x += colWidth) {
        const lx = x + this.rnd(li) * this.lmap(li, 3, height / rowHeight, 0, 20);
        const ly =  y + 5 * Math.sin(this.lmap(x, 0, width / 6, 0, 2 * Math.PI)) + 
          this.rnd(li+5+y+x) * this.lmap(li, 0, height / rowHeight, 0, rowHeight);
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();
      li++;
    }

    const s = window.s ?? 12;
    for (let i = 0; i < 3; i++) {
      const x = this.rnd(s+i) * width;
      const y = this.rnd(s+i+5) * height;
      const w = this.lmap(this.rnd(s+i+6), 0, 1, 80, 200);
      const h = this.lmap(this.rnd(s+i+12), 0, 1, 80, 200);
      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, w, h);
    }
  }

};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
