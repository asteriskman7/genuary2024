'use strict';

window.sketchClass = class extends Sketch {
  desc = "Anyone else find it weird that the archetypal system used to demonstrate<br> the butterfly effect results in an image that looks like a butterfly?"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.points = [];
    this.scale = this.canvas.width / 50;


    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.nextReset = 0;
  }

  //runs once per frame. Time is this.t
  update() {

    if (this.t >= this.nextReset) {
      this.nextReset = this.t + 30;
      this.points = [];
      this.clear = true;
      this.rho = this.gaussianRandom(20, 5);
      this.sigma = this.gaussianRandom(10, 2);
      this.beta = this.gaussianRandom(8/3, 1);
    }

    const d = 20;
    while (this.points.length < 5000) {
      const p = {c: `hsl(${Math.random() * 360}, 50%, 50%)`,
        x: this.gaussianRandom(0, d), 
        y: this.gaussianRandom(0, d),
        z: this.gaussianRandom(0, d)
      };
      p.xl = p.x;
      p.yl = p.y;
      p.zl = p.z;
      this.points.push(p);
    }

    const rho = this.rho;
    const sigma = this.sigma;
    const beta = this.beta;
    const steps = 1;
    const limit = this.canvas.width;
    for (let i = 0; i < steps; i++) {
      this.points.forEach( p => {
        p.lx = p.x;
        p.ly = p.y;
        p.lz = p.z;
        const dx = sigma * (p.y - p.x);
        const dy = p.x * (rho - p.z) - p.y;
        const dz = p.x * p.y - beta * p.z;
        p.x += dx /600;
        p.y += dy /600;
        p.z += dz /600;
        if (Math.abs(p.x * this.scale) > limit || Math.abs(p.y * this.scale) > limit || Math.abs(p.z * this.scale) > limit) {
          p.dead = true;
        }
      });

    }

    this.points = this.points.filter( p => p.dead !== true );
  }

  draw(ctx, width, height, t) {
    if (this.clear) {
      ctx.fillStyle = `hsla(0, 0%, 0%, 1)`;
      this.clear = false;
    } else {
      ctx.fillStyle = `hsla(0, 0%, 0%, 0.05)`;
    }
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 153, 20);
    ctx.fillStyle = 'white';
    ctx.font = '11px monospace';
    ctx.fillText(`\u03c1=${this.rho.toFixed(2)},\u03c3=${this.sigma.toFixed(2)},\u03b2=${this.beta.toFixed(2)}`, 0, 15);

    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(width / 2, height / 2);
    const scale = this.scale;
    this.points.forEach( p => {
      ctx.strokeStyle = p.c;
      ctx.beginPath();
      const fx = p.lx * scale;
      const fy = p.ly * scale;
      const tx = p.x * scale;
      const ty = p.y * scale;
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    });
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
