'use strict';

window.sketchClass = class extends Sketch {
  desc = "Everyone always asks \"Who let the dogs out?\" but nobody <br>ever asks \"From where were the dogs let out?\"."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    this.image = this.genImage('squareCanvas', 0, 0, 0, this.canvas.width, this.canvas.height);
  }

  genImage(type, depth, x0, y0, w, h) {
    const image = [];
    const nextDepth = depth + 1;

    switch (type) {
      case 'squareCanvas': {
        const options = [
          () => {
            //full circle
            image.push(this.genImage('fullCircle', nextDepth, x0, y0, w, h));
          },
          () => {
            //radius circle
            image.push(this.genImage('radiusCircle', nextDepth, x0, y0, w, h));
          },
          () => {
            //4 squares
            image.push(this.genImage('squareCanvas', nextDepth, x0        , y0        , w / 2, h / 2));
            image.push(this.genImage('squareCanvas', nextDepth, x0 + w / 2, y0        , w / 2, h / 2));
            image.push(this.genImage('squareCanvas', nextDepth, x0        , y0 + h / 2, w / 2, h / 2));
            image.push(this.genImage('squareCanvas', nextDepth, x0 + w / 2, y0 + h / 2, w / 2, h / 2));
          },
          () => {
            //h thirds
            image.push(this.genImage('rectCanvas', nextDepth, x0, y0        , w, h / 3));
            image.push(this.genImage('rectCanvas', nextDepth, x0, y0 + h/3  , w, h / 3));
            image.push(this.genImage('rectCanvas', nextDepth, x0, y0 + 2*h/3, w, h / 3));
          },
          () => {
            //v thirds
            image.push(this.genImage('rectCanvas', nextDepth, x0        , y0, w / 3, h));
            image.push(this.genImage('rectCanvas', nextDepth, x0 + w/3  , y0, w / 3, h));
            image.push(this.genImage('rectCanvas', nextDepth, x0 + 2*w/3, y0, w / 3, h));
          }
        ];

        let optionCount;
        let sel;
        if (depth < 2) {
          sel = options.length - 3;
        } else {
          if (depth > 3) {
            optionCount = options.length - 3;
          } else {
            optionCount = options.length;
          }
          sel = Math.floor(Math.random() * optionCount);
        }
        options[sel]();

        break;
      }
      case 'rectCanvas': {
        if (Math.random() < 0.5 || depth > 2) {
          image.push({type: 'rect', x0, y0, w, h, c: this.getRndC()});
        } else {
          if (w > h) {
            // [][][]
            image.push(this.genImage('squareCanvas', nextDepth, x0, y0, w / 3, h));
            image.push(this.genImage('squareCanvas', nextDepth, x0 + w / 3, y0, w / 3, h));
            image.push(this.genImage('squareCanvas', nextDepth, x0 + 2 * w / 3, y0, w / 3, h));
          } else {
            // []
            // []
            // []
            image.push(this.genImage('squareCanvas', nextDepth, x0, y0, w, h / 3));
            image.push(this.genImage('squareCanvas', nextDepth, x0, y0 + h / 3, w, h / 3));
            image.push(this.genImage('squareCanvas', nextDepth, x0, y0 + 2 * h / 3, w, h / 3));
          }
        }
        break;
      }
      case 'fullCircle': {
        //make a cirlce with 1/2 one color, 1/4 another color, 1/4 a final color with some 45degree rotation
        image.push({type: 'rect', x0, y0, w, h, c: this.getRndC()});
        const angle = Math.floor(Math.random() * 8) * Math.PI / 4;
        image.push({type: 'arc', x0: x0 + w/2, y0: y0 + h/2, r: w/2, a0: angle, a1: angle + Math.PI, c: this.getRndC()});
        image.push({type: 'arc', x0: x0 + w/2, y0: y0 + h/2, r: w/2, a0: angle + Math.PI, a1: angle + 3 * Math.PI / 2, c: this.getRndC()});
        image.push({type: 'arc', x0: x0 + w/2, y0: y0 + h/2, r: w/2, a0: angle + 3 * Math.PI / 2, a1: angle + 4 * Math.PI / 2, c: this.getRndC()});
        //add circle in middle of one of the sectors
        const circleAngle = angle + Math.PI / 4 + Math.floor(Math.random() * 4) * Math.PI / 2;
        image.push({
          type: 'arc', 
          x0: x0 + w/2 + Math.cos(circleAngle) * w/3, 
          y0: y0 + h/2 + Math.sin(circleAngle) * w/3, 
          r: w/8, 
          a0: 0, 
          a1: 2 * Math.PI, 
          c: this.getRndC()
        });
        break;
      }
      case 'radiusCircle': {
        image.push({type: 'rect', x0, y0, w, h, c: this.getRndC()});
        const corner = Math.floor(4 * Math.random());
        const cornerAngle = Math.PI / 4 + corner * Math.PI / 2;
        image.push({ type: 'arc', x0: x0 + w / 2 + (w/2) * Math.sqrt(2) * Math.cos(cornerAngle), y0: y0 + h / 2 + (h/2) * Math.sqrt(2) * Math.sin(cornerAngle), r: w, a0: cornerAngle + 3 * Math.PI / 4, a1: cornerAngle + 3 * Math.PI / 4 + Math.PI / 2, c: this.getRndC() });
        image.push({ type: 'arc', x0: x0 + w / 2 + (w/2) * Math.sqrt(2) * Math.cos(cornerAngle), y0: y0 + h / 2 + (h/2) * Math.sqrt(2) * Math.sin(cornerAngle), r: w * 2 / 3, a0: cornerAngle + 3 * Math.PI / 4, a1: cornerAngle + 3 * Math.PI / 4 + Math.PI / 2, c: this.getRndC() });
        image.push({ type: 'arc', x0: x0 + w / 2 + (w/2) * Math.sqrt(2) * Math.cos(cornerAngle), y0: y0 + h / 2 + (h/2) * Math.sqrt(2) * Math.sin(cornerAngle), r: w * 1 / 3, a0: cornerAngle + 3 * Math.PI / 4, a1: cornerAngle + 3 * Math.PI / 4 + Math.PI / 2, c: this.getRndC() });
        const circleAngle = cornerAngle + 3 * Math.PI / 4 + Math.PI / 4;
        const circleDist = (w/2) * Math.sqrt(2) - w/6 - Math.floor(Math.random() * 4) * w/3;
        image.push({ type: 'arc', x0: x0 + w / 2 - circleDist * Math.cos(circleAngle), y0: y0 + h / 2 - circleDist * Math.sin(circleAngle), r: w/10, a0: 0, a1: 2 * Math.PI, c: this.getRndC() });
        break;
      }
    }

    return image;
  }

  getRndC() {
    const colors = [
      '#e5592d',
      '#f5a71d',
      '#a7c685',
      '#669bb3',
      '#28335d'
    ];
    let i = Math.floor(Math.random() * colors.length);
    while (i === this.lastColor) {
      i = Math.floor(Math.random() * colors.length);
    }
    this.lastColor = i;
    return colors[i];
  }

  //runs once per frame. Time is this.t
  update() {
  }

  drawImage(ctx, unit) {
    if (unit.length !== undefined) {
      unit.forEach( subUnit => this.drawImage(ctx, subUnit) );
    } else {
      switch (unit.type) {
        case 'rect': {
          ctx.fillStyle = unit.c;
          ctx.fillRect(unit.x0, unit.y0, unit.w, unit.h);
          //ctx.strokeRect(unit.x0, unit.y0, unit.w, unit.h);
          break;
        }
        case 'arc': {
          ctx.fillStyle = unit.c;
          ctx.beginPath();
          ctx.moveTo(unit.x0, unit.y0);
          ctx.lineTo(unit.x0 + unit.r * Math.cos(unit.a0), unit.y0 + unit.r * Math.sin(unit.a0));
          ctx.arc(unit.x0, unit.y0, unit.r, unit.a0 - 0.01, unit.a1 + 0.01);
          ctx.lineTo(unit.x0, unit.y0);
          ctx.fill();
          //ctx.stroke();
          break;
        }
      }
    }
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    this.drawImage(ctx, this.image);
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
