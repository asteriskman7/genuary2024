'use strict';

window.sketchClass = class extends Sketch {
  desc = "Is your mind not mystified?!?!"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.makeNewShape(0);
    this.lastDraw = -Infinity;
    this.drawTime = false;
    this.resetTime = 10;
    this.reset = false;
  }

  makeNewShape(t0) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.t0 = t0;
    this.P = this.rndPalette(Math.random());
    this.shape = [];
    const points = this.lmap(Math.random(), 0, 1, 4, 8);
    const v = 4;

    for (let i = 0; i < points; i++) {
      const p = {};
      p.x = Math.random() * this.canvas.width;
      p.y = Math.random() * this.canvas.height;
      p.a = Math.random() * 2 * Math.PI;
      //const rgb = this.cosineGradient(this.P, i / points);
      //const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
      //p.c = `hsl(${hsl.h}, ${Math.max(20,hsl.s)}%, ${Math.max(30, hsl.l)}%)`;
      //p.c = `hsl(${hsl.h}, 50%, 50%)`;
      p.c = `hsl(${Math.random() * 360}, 50%, 50%)`;
      p.vx = v * Math.cos(p.a);
      p.vy = v * Math.sin(p.a);

      this.shape.push(p);
    }
  }

  //runs once per frame. Time is this.t
  update() {

    if (this.t > this.resetTime) {
      this.makeNewShape(this.t);
      this.resetTime = this.t + 10;
      this.reset = true;
    }
    const timeLeft = this.resetTime - this.t;
    const gravity = this.lmap(timeLeft, 10, 0, 0, 7);

    const drawDelta = this.t - this.lastDraw;
    if (drawDelta > 0.05) {
      this.drawTime = true;
    }

    const v = 1;
    this.shape.forEach( p => {
      p.x += p.vx;
      p.y += p.vy + gravity;

      if (p.x <= 0) {
        p.x = 0;
        p.vx *= -1;
      }
      if (p.x >= this.canvas.width) {
        p.x = this.canvas.width - 1;
        p.vx *= -1;
      }
      if (p.y <= 0) {
        p.y = 0;
        p.vy *= -1;
      }
      if (p.y >= this.canvas.height) {
        p.y = this.canvas.height - 1;
        p.vy *= -1;
      }
    });
  }

  draw(ctx, width, height, t) {

    if (!this.drawTime) {return;}
    if (this.reset) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      this.reset = false;
    }

    ctx.globalCompositeOperation = 'screen';

    this.lastDraw = this.t;
    this.drawTime = false;

    ctx.beginPath();
    ctx.moveTo(this.shape[0].x, this.shape[0].y);

    for (let i = 1; i < this.shape.length; i++) {
      ctx.strokeStyle = this.shape[i].c;
      ctx.beginPath();
      ctx.moveTo(this.shape[i-1].x, this.shape[i-1].y);
      ctx.lineTo(this.shape[i].x, this.shape[i].y);
      ctx.stroke();
    }


  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
