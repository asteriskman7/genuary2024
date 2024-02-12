'use strict';

window.sketchClass = class extends Sketch {
  desc = "TADA! Flocking!"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {
    const birdCount = 2000;
    //this.birds = new Array(birdCount);
    this.birds = [];

    this.gridS = 20;
    this.gridW = Math.ceil(this.canvas.width / this.gridS);
    this.gridH = Math.ceil(this.canvas.height / this.gridS);
    this.grid = new Array(this.gridW * this.gridH);
    for (let i = 0; i < this.gridW * this.gridH; i++) {
      this.grid[i] = [];
    }

    
    for (let i = 0; i < birdCount; i++) {
      const bird = {
        i,
        x: 500 * Math.random(),
        y: 500 * Math.random(),
        a: 2 * Math.PI * Math.random(),
      };
      bird.gridi = Math.floor(bird.x / this.gridS) + Math.floor(bird.y / this.gridS) * this.gridW;
      this.birds.push(bird);
      this.addToGrid(bird);
    }
    
     this.circles = [];

     for (let i = 0; i < 10; i++) {
       this.circles.push({x0: this.canvas.width / 2, y0: this.canvas.height / 2, r0: 100, r: 10, a0: i * 2 * Math.PI / 10});
     }

  }

  addToGrid(bird) {
    const gridx = Math.floor(bird.x / this.gridS);
    const gridy = Math.floor(bird.y / this.gridS);
    const gridi = gridx + gridy * this.gridW;
    const gridCell = this.grid[gridi];
    gridCell.push(bird);
  }

  removeFromGrid(bird) {
    const gridx = Math.floor(bird.x / this.gridS);
    const gridy = Math.floor(bird.y / this.gridS);
    const gridi = gridx + gridy * this.gridW;
    const gridCell = this.grid[gridi];
    const cellIndex = gridCell.findIndex( e => e.i === bird.i );
    gridCell.splice(cellIndex, 1);
  }

  updateGrid(bird, newx, newy) {
    const gridxnew = Math.floor(newx / this.gridS);
    const gridynew = Math.floor(newy / this.gridS);
    const gridinew = gridxnew + gridynew * this.gridW;
    if (gridinew !== bird.gridi) {
      const gridCellOld = this.grid[bird.gridi];
      const cellIndex = gridCellOld.findIndex( e => e.i === bird.i );
      gridCellOld.splice(cellIndex, 1);

      bird.gridi = gridinew;
      this.grid[gridinew].push(bird);
    }
  }

  getMinAngle(a0, a1) {
    const x0 = Math.cos(a0);
    const y0 = Math.sin(a0);
    const x1 = Math.cos(a1);
    const y1 = Math.sin(a1);
    return -Math.atan2(Math.sin(a0 - a1), Math.cos(a0 - a1));
  }

  //runs once per frame. Time is this.t
  update() {

    this.circles.forEach( c => {
      c.x = c.x0 + c.r0 * Math.cos(c.a0 + this.t / 2);
      c.y = c.y0 + c.r0 * Math.sin(c.a0 + this.t / 2);
    });
    
    let groupSumX = 0;
    let groupSumY = 0;
    this.birds.forEach( b => {
      groupSumX += b.x;
      groupSumY += b.y;
    });
    const groupAvgX = groupSumX / this.birds.length;
    const groupAvgY = groupSumY / this.birds.length;


    this.birds.forEach( (b, bi) => {
      //separation - avoid crowding
      //alignment - towards average heading of neighbors
      //cohesion - towards average position of neighbors
      let minDist = Infinity;
      let minX;
      let minY;
      let sumX = 0;
      let sumY = 0;
      let gbCount = 0;
      const birdgx = Math.floor(b.x / this.gridS);
      const birdgy = Math.floor(b.y / this.gridS);
      for (let gdx = -1; gdx <= 1; gdx++) {
        const gx = birdgx + gdx;
        if (gx < 0 || gx >= this.gridW) {continue;}
        for (let gdy = -1; gdy <= 1; gdy++) {
          const gy = birdgy + gdy;
          if (gy < 0 || gy >= this.gridH) {continue;}
          const gi = gx + gy * this.gridW;
          const gridBirds = this.grid[gi];
      if (b.i === 10) {
        let debug = 1;
      }
          gridBirds.forEach( gb => { 
            if (gb.i === b.i) {return;}
            const gbdx = b.x - gb.x;
            const gbdy = b.y - gb.y;
            const dist = Math.sqrt(gbdx * gbdx + gbdy * gbdy);
            if (dist < minDist) {
              minDist = dist;
              minX = gb.x;
              minY = gb.y;
            }
            sumX += Math.cos(gb.a);
            sumY += Math.sin(gb.a);
            gbCount++;
          });
        }
      }

      const alignmentStr = 0.05;
      const cohesionStr = 0.05;
      const separationStr = 0.4;

      //alignment
      if (gbCount > 0) {
        const avgX = sumX / gbCount;
        const avgY = sumY / gbCount;
        const avgA = Math.atan2(avgY, avgX);
        let da = this.getMinAngle(b.a, avgA);
        b.a = b.a + da * alignmentStr;
        //b.a = avgA;
      }

      //cohesion
      const groupAvgA = Math.atan2(b.y - groupAvgY, b.x - groupAvgX);
      const groupDa = -this.getMinAngle(b.a, groupAvgA);
      b.a = b.a + groupDa * cohesionStr;

      //separation
      const crowdDist = 50;
      if (minDist < crowdDist) {
        const targetx = minX;
        const targety = minY;
        const targetAngle = Math.atan2(targety - b.y, targetx - b.x);
        let da = -this.getMinAngle(b.a, targetAngle) ;
        b.a = b.a + da * separationStr;
      }



      let newX = Math.min(this.canvas.width, Math.max(0, b.x + Math.cos(b.a)));
      let newY = Math.min(this.canvas.height, Math.max(0, b.y + Math.sin(b.a)));

      this.circles.forEach( c => {
        const dx = newX - c.x;
        const dy = newY - c.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= c.r) {
          const a = Math.atan2(dy, dx);
          newX = c.x + c.r * Math.cos(a);
          newY = c.y + c.r * Math.sin(a);
        }
      });

        b.x = newX;
        b.y = newY;
        if (isNaN(newX) || isNaN(newY) || isNaN(b.a)) {
          throw 'NAN';
        }
        this.updateGrid(b, newX, newY);
    });

  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'yellow';

    this.circles.forEach( c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
      ctx.stroke();
    });

    const frontDist = 4;
    const pointAngle = Math.PI / 6;
    this.birds.forEach( b => {
      ctx.beginPath();
      ctx.moveTo(b.x + frontDist * Math.cos(b.a), b.y + frontDist * Math.sin(b.a));
      ctx.lineTo(b.x + frontDist * Math.cos(b.a + Math.PI - pointAngle/2), b.y + frontDist * Math.sin(b.a + Math.PI - pointAngle/2));
      ctx.lineTo(b.x + frontDist * Math.cos(b.a + Math.PI + pointAngle/2), b.y + frontDist * Math.sin(b.a + Math.PI + pointAngle/2));
      ctx.fill();
    });

  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
