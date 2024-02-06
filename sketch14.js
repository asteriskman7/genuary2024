'use strict';

window.sketchClass = class extends Sketch {
  desc = "The draw function is 1024 bytes (not including leading/trailing spaces)"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    const scale = 20 * Math.sin(t * 10.1 + Math.tan(t / 1.2));
    ctx.drawImage(this.canvas, 0, 0, width, height, -scale, -scale, width + 2 * scale, height + 2 * scale); 
    ctx.fillStyle = `hsla(${(t * 1000.68) % 360}, 50%, ${(t * 500.2) % 100}%, ${this.lmap(Math.sin(t * 5.43), -1, 1, 0.05, 0.15)})`;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    const fontSize = 100.0 + 50.0 * Math.sin(t * 4.3 + Math.tan(t / 0.8));
    ctx.font = `${fontSize}px Poppins`;
    ctx.fillStyle = `hsl(${(this.t * 94.4) % 360}, 50%, 50%)`;
    const xBase = width / 2 + width * 0.25 * Math.sin(t * 6.24);
    const yBase = height / 2 + height * 0.25 * Math.sin(t * 8.53);
    ctx.translate(xBase, yBase);
    ctx.rotate(0.5 * Math.sin(t * 2.42));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = '1' + ((t % 1 > 0.5) ? 'k' : 'K') + ((t % 2 > 1) ? 'b' : 'B');
    ctx.fillText(text, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = fontSize / 40;
    ctx.strokeStyle = 'hsl(0, 0%, 0%)';
    ctx.strokeText(text, 0, 0);
  } //end draw
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();

