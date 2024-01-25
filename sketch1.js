'use strict';

window.sketchClass = class extends Sketch {
  desc = "Celebrate!"; // jshint ignore:line

  load() {
    this.particles = [];

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.pal = [
      [0.660,0.560,0.680],
      [0.718,0.438,0.720],
      [0.520,0.800,0.520],
      [-1.101,-0.391,0.5884]
    ];
  }

  update() {
    //time is this.t in seconds
    const w = this.canvas.width;
    const h = this.canvas.height;

    const fountains = [];
    const fcount = 2;

    for (let i = 0; i < fcount; i++) {
      fountains.push( i * (w/2) / fcount);
    }
    fountains.push( w / 2 );
    for (let i = 0; i < fcount; i++) {
      fountains.push( w / 2 + (i + 1) * (w/2) / fcount);
    }

    fountains.forEach( (f, i) => {
      for (let j = 0; j < 50; j++) {
        const p = {};
        p.x = f;
        p.y = h ;
        const center = i === Math.floor(fountains.length / 2);
        const dir = i < Math.floor(fountains.length / 2) ? 1 : -1;
        const a0 = (3 * Math.PI / 2) + (center ? 0 : dir ) * this.lmap(this.t % 3, 0, 3, -0.2, 0.5);
        const a = this.gaussianRandom( a0, 0.06 ); 
        const v = this.gaussianRandom( 15, 2);
        p.vx = v * Math.cos(a);
        p.vy = v * Math.sin(a);
        p.rgb = this.cosineGradient(this.pal, (this.t % 3) / 3);
        p.s = Math.max(0, this.gaussianRandom(1, 0.5));
        p.t0 = this.t;
        this.particles.push(p);
      }
    });

    this.particles.forEach( p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5;

      const dt = this.t - p.t0;
      const lifetime = 2;
      p.c = `rgba(${p.rgb.r},${p.rgb.g},${p.rgb.b}, ${this.lmap(dt, 0, lifetime, 1, 0)})`;

      p.alive = (p.x < this.canvas.width && p.y < this.canvas.height && p.x >= 0 && p.y >= 0) && dt < lifetime; 
    });

    this.particles = this.particles.filter( p => p.alive );
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'hsla(0, 0%, 0%, 0.5)';
    ctx.fillRect(0, 0, width, height);
    //ctx.font = '20px Poppins';

    ctx.globalCompositeOperation = 'lighter';

    this.particles.forEach( p => {
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
