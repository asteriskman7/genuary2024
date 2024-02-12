'use strict';

window.sketchClass = class extends Sketch {
  desc = "-"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.targetCanvas = document.createElement('canvas');
    this.targetCanvas.width = this.canvas.width;
    this.targetCanvas.height = this.canvas.height;
    this.targetCtx = this.targetCanvas.getContext('2d');

    const ctx = this.targetCtx;
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 75px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '10px';

    ctx.fillText("Simulated", this.targetCanvas.width / 2, 150);
    ctx.fillText("Annealing", this.targetCanvas.width / 2, 300);

    this.points = [];
    for (let i = 0; i < 1000; i++) {
      this.points.push({
        x: this.canvas.width * Math.random(),
        y: this.canvas.width * Math.random(),
        r: 5, //this.lmap(Math.random(), 0, 1, 2, 5)
      });
    }

    this.targetData = ctx.getImageData(0, 0, this.targetCanvas.width, this.targetCanvas.height).data;

    this.testCanvas = document.createElement('canvas');
    this.testCanvas.width = this.targetCanvas.width;
    this.testCanvas.height = this.targetCanvas.height;
    this.testCanvasCtx = this.testCanvas.getContext('2d', {willReadFrequently: true});

  }

  drawPoints(ctx) {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);

    ctx.fillStyle = 'white';
    this.points.forEach( p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  getScore() {
    const ctx = this.testCanvasCtx;

    this.drawPoints(ctx);

    const imgData = ctx.getImageData(0, 0, this.testCanvas.width, this.testCanvas.height).data;

    const skipSize = 2; //actually skips [1:skipSize]

    let score = 0;

    let y = Math.floor(Math.random() * skipSize + 1);
    while (y < this.testCanvas.width) {
      let x = Math.floor(Math.random() * skipSize + 1);
      while (x < this.testCanvas.height) {
        //const tgtr = this.targetData[(x + y * this.testCanvas.width) * 4 + 0];
        const tgtg = this.targetData[(x + y * this.testCanvas.width) * 4 + 1];
        //const tgtb = this.targetData[(x + y * this.testCanvas.width) * 4 + 2];
        //const tstr = imgData[(x + y * this.testCanvas.width) * 4 + 0];
        const tstg = imgData[(x + y * this.testCanvas.width) * 4 + 1];
        //const tstb = imgData[(x + y * this.testCanvas.width) * 4 + 2];

        //score += Math.abs(tgtr - tstr) + Math.abs(tgtg - tstg) + Math.abs(tgtb - tstb);
        score += Math.abs(tgtg - tstg);

        x += skipSize;
      }

      y += skipSize;
    }
    return score;
  }

  //runs once per frame. Time is this.t
  update() {

    const temp = (this.lastBestScore === undefined || this.lastBestScore === Infinity) ? 10 : Math.log(this.lastBestScore);
    this.temp = temp;
    const iterCount = 50;
    let bestScore = this.lastBestScore === undefined ? Infinity : this.lastBestScore;
    for (let iter = 0; iter < iterCount; iter++) {
      //pick a point
      const point = this.points[Math.floor(Math.random() * this.points.length)];

      //move it randomly based on temp
      const angle = Math.random() * 2 * Math.PI;
      const moveDist = Math.random() * temp;
      const dx = moveDist * Math.cos(angle);
      const dy = moveDist * Math.sin(angle);
      const oldx = point.x;
      const oldy = point.y;
      point.x = Math.min(this.canvas.width, Math.max(0, point.x + dx));
      point.y = Math.min(this.canvas.height, Math.max(0, point.y + dy));

      //check if it's better
      const newScore = this.getScore();

      //move it back if it isn't
      const scoreMargin = this.lmap(temp, 14, 0, 500, 0);// temp * 10;
      if ((newScore - scoreMargin) > bestScore) {
        point.x = oldx;
        point.y = oldy;
      } else {
        bestScore = newScore;
      }

    }
    this.lastBestScore = bestScore;
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    this.drawPoints(ctx);

    /*
    ctx.globalAlpha = 0.5;
    ctx.drawImage(this.targetCanvas, 0, 0, this.canvas.width, this.canvas.height);
    ctx.globalAlpha = 1.0;
    */

    ctx.font = '20px Poppins';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(this.temp, 10, 10);


  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
