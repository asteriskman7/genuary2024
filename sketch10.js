'use strict';

window.sketchClass = class extends Sketch {
  desc = "The hexagonal shape of beehive cells is an emergent<br> property of their creation and maintenence."; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    const buildCount = 100;
    const fixCount = 2;
    this.bees = [];

    for (let i = 0; i < buildCount; i++) {
      this.bees.push({goal: 'build', state: 'start', failCount: 0, x: this.lmap(Math.random(), 0, 1, -100, 100), y: this.lmap(Math.random(), 0, 1, -100, 100)});
    } 

    for (let i = 0; i < fixCount; i++) {
      this.bees.push({goal: 'fix', state: 'start', failCount: 0, x: this.lmap(Math.random(), 0, 1, -100, 100), y: this.lmap(Math.random(), 0, 1, -100, 100)});
    } 

    this.buildingSize = 40;
    this.wax = [];
    this.completeBuildings = [];
    this.incompleteBuildings = [
      this.getHexPos(0, 0),
      this.getHexPos(1, 0),
      this.getHexPos(-1, 0),
      this.getHexPos(0, 1),
      this.getHexPos(0, -1),
      this.getHexPos(-1, 1),
      this.getHexPos(-1, -1),

      this.getHexPos(2, 0),
      this.getHexPos(1, -1),
      this.getHexPos(1, 1),
      this.getHexPos(-2, -1),
      this.getHexPos(-2, 1),
      this.getHexPos(-2, 0),
      this.getHexPos(0, 2),
      this.getHexPos(1, 2),
      this.getHexPos(-1, 2),
      this.getHexPos(2, 2),
      this.getHexPos(-2, 2),

      this.getHexPos(0, -2),
      this.getHexPos(1, -2),
      this.getHexPos(-1, -2),
      this.getHexPos(2, -2),
      this.getHexPos(-2, -2),
    ];

    this.buildingCount = 60;
    this.buildingTarget = this.getNewBuildingTarget();

  }

  getHexPos(xi, yi) {
    const x = (xi + (yi % 2 === 0 ? 0 : 0.5)) * this.buildingSize * Math.sqrt(3);
    const y = yi * (3/2) * this.buildingSize;
    return {x, y};
  }

  getNewBuildingTarget() {
    const target = this.incompleteBuildings.shift();
    if (target === undefined) {
      return undefined;
    } 
    target.r = this.buildingSize * Math.sqrt(3) / 2;
    target.taken = 0;
    target.complete = 0;
    target.wax = [];
    return target;
  }

  moveTowardsTarget(b, target, speed) {
    const dx = target.x - b.x;
    const dy = target.y - b.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d <= speed) {
      b.x = target.x;
      b.y = target.y;
      return true;
    }
    const a = Math.atan2(dy, dx);
    b.a = a - Math.PI;
    b.x = b.x + speed * Math.cos(a);
    b.y = b.y + speed * Math.sin(a);
    return false;
  }

  //runs once per frame. Time is this.t
  update() {
    const beeSpeed = 5;
    this.bees.forEach( b => {
      switch (b.goal) {
        case 'build': {
          switch (b.state) {
            case 'start': {
              //determine target location
              b.building = this.buildingTarget;
              if (b.building === undefined) {
                b.goal = 'fix';
                b.state = 'start';
                return;
              }
              const targetAngle = 2 * Math.PI * this.buildingTarget.taken / this.buildingCount;
              b.waxAngle = targetAngle;
              b.buildTarget = {x: this.buildingTarget.x + this.buildingTarget.r * Math.cos(targetAngle),
                y: this.buildingTarget.y + this.buildingTarget.r * Math.sin(targetAngle)};
              this.buildingTarget.taken += 1;
              if (this.buildingTarget.taken === this.buildingCount) {
                this.buildingTarget = this.getNewBuildingTarget();
              }
              b.target = {x: this.gaussianRandom(b.x, 20), y: this.gaussianRandom(this.canvas.height / 2 - 10, 5)};
              b.state = 'get';
              break;
            }
            case 'get': {
              const targetResult = this.moveTowardsTarget(b, b.target, beeSpeed);
              if (targetResult) {
                b.target = b.buildTarget;
                b.state = 'place';
              }
              break;
            }
            case 'place': {
              const targetResult = this.moveTowardsTarget(b, b.target, beeSpeed);
              if (targetResult) {
                b.target.fixing = false;
                b.target.waxAngle = b.waxAngle;
                b.target.c = `hsl(60, 100%, ${this.gaussianRandom(40, 10)}%)`;
                this.wax.push(b.target);
                b.building.wax.push(b.target);
                b.building.complete += 1;
                if (b.building.complete === this.buildingCount) {
                  this.completeBuildings.push(b.building);
                }
                b.state = 'start';
              }
              break;
            }
          }
          break;
        }
        case 'fix': {
          switch (b.state) {
            case 'start': {
              if (this.completeBuildings.length === 0) {break;}

              for (let tries = 0; tries < 100; tries++) {
                //pick a completed target
                b.targetIndex = Math.floor(Math.random() * this.completeBuildings.length);
                const building = this.completeBuildings[b.targetIndex];

                //pick a piece of wax in the target
                for (let waxTries = 0; waxTries < this.buildingCount; waxTries++) {
                  b.waxIndex = Math.floor(Math.random() * this.buildingCount);
                  const wax = building.wax[b.waxIndex];
                  b.wax = wax;
                  if (wax.fixing) {
                    b.waxIndex = -1;
                    continue;
                  }
                  const dx = wax.x - building.x;
                  const dy = wax.y - building.y;
                  const d = Math.sqrt(dx * dx + dy * dy);
                  if (d > this.buildingSize) {
                    b.waxIndex = -1;
                    continue;
                  }
                  break;
                }
                if (b.waxIndex === -1) {
                  continue;
                }
                b.wax.fixing = true;
                b.target = b.wax;
                b.state = 'travel';
                break;
              }
              break;
            }
            case 'travel': {
              const targetResult = this.moveTowardsTarget(b, b.target, beeSpeed);
              if (targetResult) {
                b.state = 'move';
              }
              break;
            }
            case 'move': {
              //move the wax 1 unit away from the completed target
              const dx = Math.cos(b.wax.waxAngle);
              const dy = Math.sin(b.wax.waxAngle);
              const newx = b.wax.x + dx;
              const newy = b.wax.y + dy;
 
              //make sure there is no overlap in the new position
              let collision = false;
              for (let bi = 0; bi < this.completeBuildings.length; bi++) {
                if (bi === b.targetIndex) {continue;}
                for (let wi = 0; wi < this.completeBuildings[bi].wax.length; wi++) {
                  const wax2 = this.completeBuildings[bi].wax[wi];
                  const dx = newx - wax2.x;
                  const dy = newy - wax2.y;
                  const d = Math.sqrt(dx * dx + dy * dy);
                  if (d < 2) {
                    collision = true;
                    break;
                  }
                }
                if (collision) {break;}
              }
              if (!collision) {
                b.wax.x = newx;
                b.wax.y = newy;
                b.failCount = 0;
              } else {
                b.failCount += 1;
              }

              b.wax.fixing = false;

              //return to start
              if (b.failCount < 10) {
                b.state = 'start';
              } else {
                b.goal = 'flee';
                b.state = 'start';
              }
              break;
            }              
          }
          break;
        }
        case 'flee': {
          switch (b.state) {
            case 'start': {
              b.target = {x: this.lmap(Math.random(), 0, 1, -800, 800), y: -800};
              b.state = 'travel';
              break;
            }
            case 'travel': {
              const targetResult = this.moveTowardsTarget(b, b.target, beeSpeed);
              if (targetResult) {
                b.state = 'dead';
              }
              break;
            }
          }
          break;
        }
      }
    });

    this.bees = this.bees.filter( b => b.state !== 'dead' );
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    const beeEmoji = '\uD83D\uDC1D';
    const flowerEmoji = [ '\uD83C\uDF3C', '\uD83C\uDF3B', '\uD83C\uDF37' ];

    ctx.font = '20px Arial';
    const flowerDist = 20;
    for (let x = -flowerDist/3; x <= width; x += flowerDist) {
      const emoji = flowerEmoji[Math.floor(this.rnd(x + 44) * flowerEmoji.length)];
      ctx.fillText(emoji, x, height - 5);
    }

    ctx.translate(width / 2, height / 2);
    const waxSize = 4;
    ctx.fillStyle = 'yellow';
    this.wax.forEach( w => {
      ctx.fillStyle = w.c;
      ctx.fillRect(w.x - waxSize / 2, w.y - waxSize / 2, waxSize, waxSize);
    });

    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'orange';
    this.bees.forEach( b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.a);
      ctx.fillText(beeEmoji, 0, 0);
      ctx.restore();
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
