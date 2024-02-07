'use strict';

window.sketchClass = class extends Sketch {
  desc = "10k colors just trying to get home after a long day at the office"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.s = 5;
    this.w = 100;
    this.h = 100;
    this.grid = [];
    for (let y = 0; y < this.h; y++) {
      const row = [];
      for (let x = 0; x < this.w; x++) {
        const c = `hsl(${this.lmap(x, 0, this.w, 0, 360)}, 50%, ${this.lmap(y, 0, this.h, 20, 80)}%)`;
        const square = {x, y, targetx: x, targety: y, c};
        row.push(square);
      }
      this.grid.push(row);
    }
    for (let i = this.w * this.h - 1; i >= 0; i--) {
      const swapIndex = Math.floor(Math.random() * i + 1);
      this.swapSquares(i, swapIndex);
    }
  }

  swapSquares(src, dst) {
    const srcx = (src % this.w);
    const dstx = (dst % this.w);
    const srcy = Math.floor(src / this.w);
    const dsty = Math.floor(dst / this.w);
    this.swapSquaresXY(srcx, srcy, dstx, dsty);
  }

  swapSquaresXY(srcx, srcy, dstx, dsty) {
    const ss = this.grid[srcy][srcx];
    const ds = this.grid[dsty][dstx];
    this.grid[srcy][srcx] = ds;
    this.grid[dsty][dstx] = ss;
  }

  //runs once per frame. Time is this.t
  update() {

    for (let j = 0; j < 1000; j++) {
    for (let i = 0; i < 1000; i++) {
      const srcx = Math.floor(Math.random() * this.w);
      const srcy = Math.floor(Math.random() * this.h);
      const square = this.grid[srcy][srcx];
      if (srcx !== square.targetx || srcy !== square.targety) {
        const swapX = Math.random() > 0.5;
        if (swapX) {
          const xDir = Math.sign(square.targetx - srcx);
          this.swapSquaresXY(srcx, srcy, srcx + xDir, srcy);
        } else {
          const yDir = Math.sign(square.targety - srcy);
          this.swapSquaresXY(srcx, srcy, srcx, srcy + yDir);
        }
  
        break;
      }
    }
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    let totalDist = 0;
    for (let y = 0; y < this.h; y++) {
      const row = this.grid[y];
      for (let x = 0; x < this.w; x++) {
        const s = row[x];
        ctx.fillStyle = s.c;
        ctx.fillRect(x * this.s, y * this.s, this.s, this.s);
        const dx = x - s.targetx;
        const dy = y - s.targety;
        const d = Math.sqrt(dx * dx + dy * dy);
        totalDist += d;
      }
    }

    ctx.fillStyle = 'white';
    ctx.textBaseline = 'bottom';
    ctx.font = '20px Poppins';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText(`dist=${Math.round(totalDist)}`, 2, height);
    ctx.fillText(`dist=${Math.round(totalDist)}`, 2, height);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
