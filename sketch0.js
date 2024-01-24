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
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px Poppins';
    ctx.fillStyle = 'white';
    ctx.fillText('Please select a sketch from the list above', 10, 30);

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
