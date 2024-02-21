'use strict';

window.sketchClass = class extends Sketch {
  desc = "A straight line to the touch is worth a circle to the sight."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.state = 'start';
    this.lastC = 'black';
    this.nextC = 'black';
  }

  //runs once per frame. Time is this.t
  update() {
    const linePointCount = Math.ceil(5 / this.pointR);
    switch (this.state) {
      case 'start': {
        this.points = [{x: 0, y: 0, i: 0}];

        this.state = 'growPoint';
        this.drawType = 'circle';
        this.pointR = 0;
        this.lastC = this.nextC;
        this.nextC = `hsl(${Math.random() * 360}, 50%, 50%)`;
        break; 
      }
      case 'growPoint': {
        if (this.pointR < 0.1) {
          this.pointR += 0.001;
        } else {
          this.state = 'splitToLine';
        }
        break;
      } 
      case 'splitToLine': {
        this.points = [];
        for (let i = 0; i < linePointCount; i++) {
          const targetx = -1 + i * 2 / (linePointCount - 1);
          const vx = targetx * 33 / 1000;
          this.points.push({
            x: 0,
            y: 0,
            targetx,
            targety: 0,
            vx
          });
        }
        this.remainingTicks = 1000 / 33;
        this.state = 'growLine';
        break;
      }
      case 'growLine': {
        this.points.forEach( p => {
          p.x += p.vx;
        });
        this.remainingTicks--;
        if (this.remainingTicks <= 0) {
          this.state = 'splitToPlane';
        }
        break;
      }
      case 'splitToPlane': {
        this.drawType = 'square';
        const newPoints = [];
        this.points.forEach( p => {
          for (let i = 0; i < linePointCount; i++) {
            const targety = -1 + i * 2 / (linePointCount - 1);
            const vy = targety * 33 / 1000;
            newPoints.push({
              x: p.x,
              y: 0,
              targetx: p.x,
              targety,
              vy
            });
          }
        });
        this.remainingTicks = 1000 / 33;
        this.state = 'growPlane';
        this.points = newPoints;
        break;
      }
      case 'growPlane': {
        this.points.forEach( p => {
          p.y += p.vy;
        });
        this.remainingTicks--;
        if (this.remainingTicks <= 0) {
          this.state = 'start';
        }
        break;
      }
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = this.lastC;
    ctx.fillRect(0, 0, width, height);

    /*
      -1,-1      1,-1
            0,0
      -1,1       1,1
    */
    ctx.translate(width / 2, height / 2);
    ctx.scale(width / 2, height / 2);

    ctx.fillStyle = this.nextC;
    this.points.forEach( p => {
      if (this.drawType === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, this.pointR, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.fillRect(p.x - this.pointR, p.y - this.pointR, this.pointR * 2, this.pointR * 2);
      }
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
