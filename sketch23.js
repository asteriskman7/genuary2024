'use strict';

window.sketchClass = class extends Sketch {
  desc = "It would take nearly 45 years to place 128x128 pixels at a rate of 1 per day,<br>about 30 years to fill the entire 512x512 canvas at 1 per hour."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.blocki = -1;
    this.duration = 0.1;
    this.genNewBlock();
  }

  genNewBlock() {
    this.block = {
      p: this.rndPalette(Math.random()),
      type: Math.floor(Math.random() * 4),
      xwm: Math.random() * 5,
      xwf: this.lmap(Math.random(), 0, 1, 1/3, 3),
      ywm: Math.random() * 5,
      ywf: this.lmap(Math.random(), 0, 1, 1/3, 3),
      aphase: Math.random() * 2 * Math.PI,
      sspread: Math.random() * 8,
      diagDir: Math.floor(Math.random() * 2)
    };
    this.nextBlock = this.t + this.duration;
    this.blocki = (this.blocki + 1) % 16;
  }

  //runs once per frame. Time is this.t
  update() {
    if (this.t >= this.nextBlock) {
      this.genNewBlock();
    }
  }

  draw(ctx, width, height, t) {

    if (this.block !== undefined) {
      const x0 = (this.blocki % 4) * 128;
      const y0 = Math.floor(this.blocki / 4) * 128;
      ctx.translate(x0, y0);

      for (let xi = 0; xi < 128; xi++) {
        for (let yi = 0; yi < 128; yi++) {
          const x = xi + this.block.xwm * Math.sin(yi * this.block.xwf);
          const y = yi + this.block.ywm * Math.sin(xi * this.block.ywf);
          switch (this.block.type) {
            case 0: {
              //h
              ctx.fillStyle = this.cosineGradientC(this.block.p, x / 128);
              break;
            }
            case 1: {
              //v
              ctx.fillStyle = this.cosineGradientC(this.block.p, y / 128);
              break;
            }
            case 2: {
              //circle
              const dx = 64 - x;
              const dy = 64 - y;
              const a = (Math.atan2(dy, dx) + this.block.aphase + Math.PI) % (2 * Math.PI);
              //const d = Math.sqrt(dx * dx + dy * dy) * this.lmap(a / (2 * Math.PI), 0, 1, 1, this.block.sspread);
              const d = Math.sqrt(dx * dx + dy * dy) * (1 + this.block.sspread + (this.block.sspread * Math.sin(a)));
              const t = this.lmap(d, 0, Math.sqrt(2) * 64, 0, 1);
              ctx.fillStyle = this.cosineGradientC(this.block.p, t);
              break;
            }
            case 3: {
              //digonal
              const d = x + (this.block.diagDir === 0 ? y : 128 - y);
              const t = this.lmap(d, 0, 128 + 128, 0, 1);
              ctx.fillStyle = this.cosineGradientC(this.block.p, t);
              break;
            }

          }
          ctx.fillRect(xi, yi, 1, 1);
        }
      }

      this.block = undefined;
    }

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
