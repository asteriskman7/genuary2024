'use strict';

window.sketchClass = class extends Sketch {
  desc = "(wait for it)"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {

    this.scale = 10;
    this.w = Math.round(this.canvas.width / this.scale);
    this.h = Math.round(this.canvas.height / this.scale);
    this.maxCount = 2000;

    if (app.physicsLoaded !== true) {
      const tag = document.createElement('script');
      tag.onload = () => this.scriptLoaded();
      tag.src = './Box2dWeb-2.1.a.3.js';
      document.querySelector('body').appendChild(tag);
    } else {
      this.calculateBoxColors();
      this.initWorld();
    }

  }

  scriptLoaded() {
    app.physicsLoaded = true;
    this.calculateBoxColors();
    this.initWorld();
  }

  createWall(world, x, y, width, height) {
    const userData = {width, height, type: 'wall'};

    const fDef = new Box2D.Dynamics.b2FixtureDef();
    fDef.density = 1.0;
    fDef.friction = 0.5;
    fDef.friction = 0.1;
    fDef.restitution = 0.2;
    fDef.restitution = 0.1;
    fDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fDef.shape.SetAsBox(width / 2, height / 2);

    const bDef = new Box2D.Dynamics.b2BodyDef();
    bDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

    bDef.position.x = x;
    bDef.position.y = y;

    const newBody = world.CreateBody(bDef);
    newBody.CreateFixture(fDef);
    newBody.SetUserData(userData);

    return newBody;
  }

  createBox(world, x, y, width, height, n, c) {
    const userData = {width, height, type: 'box', n, c};

    const fDef = new Box2D.Dynamics.b2FixtureDef();
    fDef.density = 1.0;
    fDef.friction = 0.1;
    fDef.restitution = 0.1;
    fDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fDef.shape.SetAsBox(width / 2, height / 2);

    const bDef = new Box2D.Dynamics.b2BodyDef();
    bDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bDef.position.x = x;
    bDef.position.y = y;

    const newBody = world.CreateBody(bDef);
    newBody.CreateFixture(fDef);
    newBody.SetUserData(userData);

    return newBody;
  }

  initWorld() {
    const world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, -10), true);
    this.world = world;
    this.objects = [];

    this.objects.push(this.createWall(world, this.w / 2, 0, this.w, 5));
    this.objects.push(this.createWall(world, 0, this.h / 2, 5, this.h));
    this.objects.push(this.createWall(world, this.w, this.h / 2, 5, this.h));

  }

  createBoxN(world, n, c) {
    const x = 5 + this.rnd(n) * (this.w - 10);
    const y = 55;
    const box = this.createBox(world, x, y, 1, 1, n, c ?? n);
    this.objects.push(box);
  }

  //needs 68 seconds to settle
  calculateBoxColors() {
    console.log('CALCULATE START');

    const bufC = document.createElement('canvas');
    bufC.width = this.w;
    bufC.height = this.h;
    const ctx = bufC.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, bufC.width, bufC.height);
    ctx.font = '40px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    const emoji = '\ud83e\udd2d'
    ctx.scale(1.0, -1.0);
    ctx.fillText(emoji, this.w/2, -this.h/2 + 4);
    const imgData = ctx.getImageData(0, 0, this.w, this.h).data;

    this.initWorld();

    let t = 0;
    const tmax = 68;
    //const tmax = 10;
    let nextLog = 1;
    while (t < tmax) {
      this.world.Step(1/30, 6, 2);
      this.world.ClearForces();

      if (this.objects.length < this.maxCount) {
        this.createBoxN(this.world, this.objects.length);
      }
      t += 1/30;
      if (t > nextLog) {
        console.log(t);
        nextLog += 1;
      }
    }

    const colors = [];
    this.objects.forEach( o => {
      const userData = o.GetUserData();
      if (userData.type === 'box') {
        const pos = o.GetPosition();
        const px = Math.round(pos.x);
        const py = Math.round(pos.y);
        const r = imgData[py * (this.w * 4) + px * 4 + 0];
        const g = imgData[py * (this.w * 4) + px * 4 + 1];
        const b = imgData[py * (this.w * 4) + px * 4 + 2];
        colors[userData.n] = `rgb(${r},${g},${b})`;
      }
    });
    this.colors = colors;
    console.log('CALCULATE END');
  }


  //runs once per frame. Time is this.t
  update() {
    if (app.physicsLoaded !== true) {return;}
    this.world.Step(1/30, 6, 2);
    this.world.ClearForces();

    if (this.objects.length < this.maxCount) {
      this.createBoxN(this.world, this.objects.length, this.colors[this.objects.length]);
    }
  }

  draw(ctx, width, height, t) {
    if (app.physicsLoaded !== true) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '20px Poppins';
      ctx.fillStyle = 'white';
      ctx.fillText('LOADING', 10, 30);
      return;
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    //make lower left corner of canvas 0, 0
    ctx.scale(1.0, -1.0);
    ctx.translate(0, -height);
    ctx.scale(this.scale, this.scale);

    this.objects.forEach( o => {
      const userData = o.GetUserData();
      switch (userData.type) {
        case 'wall': {
          ctx.fillStyle = 'red';
          const pos = o.GetPosition();
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(o.GetAngle());
          ctx.fillRect(-userData.width / 2, -userData.height / 2, userData.width, userData.height);
          ctx.restore();
          break;
        }
        case 'box': {
          ctx.fillStyle = userData.c;
          const pos = o.GetPosition();
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(o.GetAngle());
          ctx.fillRect(-userData.width / 2, -userData.height / 2, userData.width, userData.height);
          ctx.restore();
          break;
        }
        default: {
          throw `unhandled object type ${userData.type}`;
        }
      }
    });
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
