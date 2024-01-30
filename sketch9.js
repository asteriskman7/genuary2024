'use strict';

window.sketchClass = class extends Sketch {
  desc = "Extracted 2x2-grams from 5x5 A-Z font and<br> re-created 26 new glyphs via markov model"; // jshint ignore:line

  //runs once every time the sketch starts
  load() {

    this.font = [
      ['.xxx.',
       'x...x',
       'xxxxx',
       'x...x',
       'x...x'],
      ['xxxx.',
       'x...x',
       'xxxxx',
       'x...x',
       'xxxx.'],
      ['.xxxx',
       'x....',
       'x....',
       'x....',
       '.xxxx'],
      ['xxxx.',
       'x...x',
       'x...x',
       'x...x',
       'xxxx.'],
      ['xxxxx',
       'x....',
       'xxxx.',
       'x....',
       'xxxxx'],
      ['xxxxx',
       'x....',
       'xxxx.',
       'x....',
       'x....'],
      ['.xxxx',
       'x....',
       'x..xx',
       'x...x',
       '.xxx.'],
      ['x...x',
       'x...x',
       'xxxxx',
       'x...x',
       'x...x'],
      ['xxxxx',
       '..x..',
       '..x..',
       '..x..',
       'xxxxx'],
      ['....x',
       '....x',
       '....x',
       'x...x',
       '.xxx.'],
      ['x...x',
       'x..x.',
       'xxx..',
       'x..x.',
       'x...x'],
      ['x....',
       'x....',
       'x....',
       'x....',
       'xxxxx'],
      ['xxxxx',
       'x.x.x',
       'x.x.x',
       'x.x.x',
       'x...x'],
      ['xx..x',
       'xx..x',
       'x.x.x',
       'x.x.x',
       'x..xx'],
      ['.xxx.',
       'x...x',
       'x...x',
       'x...x',
       '.xxx.'],
      ['xxxx.',
       'x...x',
       'xxxx.',
       'x....',
       'x....'],
      ['.xxx.',
       'x...x',
       'x...x',
       'x..xx',
       '.xxxx'],
      ['xxxx.',
       'x...x',
       'xxxx.',
       'x..x.',
       'x...x'],
      ['.xxxx',
       'x....',
       '.xxx.',
       '....x',
       'xxxx.'],
      ['xxxxx',
       '..x..',
       '..x..',
       '..x..',
       '..x..'],
      ['x...x',
       'x...x',
       'x...x',
       'x...x',
       'xxxxx'],
      ['x...x',
       'x...x',
       'x...x',
       '.x.x.',
       '..x..'],
      ['x...x',
       'x.x.x',
       'x.x.x',
       'x.x.x',
       '.xxx.'],
      ['x...x',
       '.x.x.',
       '..x..',
       '.x.x.',
       'x...x'],
      ['x...x',
       '.x.x.',
       '..x..',
       '..x..',
       '..x..'],
      ['xxxxx',
       '...x.',
       '..x..',
       '.x...',
       'xxxxx'],
    ];

    this.grams = this.makeGrams(this.font);

    this.newFont = this.makeFont(this.grams, 26, 5, 5);
  }

  growGlyph(glyph) {
    const result = new Array(glyph.length + 2);

    result[0] = (new Array(glyph[0].length + 2)).fill('^');
    result[result.length - 1] = (new Array(glyph[0].length + 2)).fill('$');
    result[0][glyph[0].length + 1] = '$';

    for (let y = 0; y < glyph.length; y++) {
      const row = [];
      row.push('^');
      for (let x = 0; x < glyph[0].length; x++) {
        row.push(glyph[y][x]);
      }
      row.push('$');
      result[y+1] = row;
    }

    return result;
  }

  shrinkGlyph(glyph) {
    const result = [...glyph];
    result.shift();
    result.pop();
    for (let y = 0; y < result.length; y++) {
      result[y] = [...result[y]];
      result[y].shift();
      result[y].pop();
    }
    return result;
  }

  makeGrams(font) {
    const grams = {};

    font.forEach( glyph => {
      const grownGlyph = this.growGlyph(glyph);
      for (let x0 = 0; x0 < grownGlyph[0].length - 1; x0++) {
        for (let y0 = 0; y0 < grownGlyph.length - 1; y0++) {
          const key = grownGlyph[y0][x0] + 
            grownGlyph[y0][x0 + 1] + 
            grownGlyph[y0 + 1][x0];
          const val = grownGlyph[y0 + 1][x0 + 1];

          if (grams[key] === undefined) {
            grams[key] = {total: 0, x: 0}
          }
          const info = grams[key];
          grams[key].total += 1;
          grams[key].x += val === 'x' ? 1 : 0;
        }
      }

    });

    return grams;
  }

  makeFont(grams, glyphCount, width, height) {
    const font = [];

    //add space first
    font.push(['.....','.....','.....','.....','.....']);

    for (let i = 0; i < glyphCount; i++) {
      const glyph = new Array(height + 2);
      glyph[0] = (new Array(width + 2)).fill('^');
      for (let y = 1; y < height + 2; y++) {
        glyph[y] = new Array(width + 2);
        glyph[y][0] = '^';
      }

      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const key = glyph[y][x] + 
            glyph[y][x + 1] + 
            glyph[y + 1][x];
          const gram = grams[key];
          if (gram === undefined) {
            glyph[y+1][x+1] = (Math.random() > 0.5) ? 'x' : '.';
          } else {
            glyph[y+1][x+1] = (Math.random() > (gram.x / gram.total)) ? '.' : 'x';
          }
        }
      }

      const shrunkenGlyph = this.shrinkGlyph(glyph);
      font.push(shrunkenGlyph);
    }

    return font;
  }

  //runs once per frame. Time is this.t
  update() {
  }

  draw(ctx, width, height, t) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    const font = this.newFont;
    //const font = this.font;

    const s = 10;
    const gw = 9;
    const gh = 9;
    const fw = 5;
    const fh = 5;
    const gap = 4;
    const text = 'markov mybeloved  abcdefghijklmnopqrstuvwxyz';

    text.split('').forEach( (c, i) => {
      const xi = i % gw;
      const yi = Math.floor(i / gw);
      ctx.save();
      ctx.translate(20 + xi * s * fw + gap * (xi - 1), 130 + yi * s * fh + gap * (yi - 1));
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.fillRect(0, 0, s * fw, s * fh);

      let glyphIndex;
      if (c === ' ') {
        glyphIndex = 0;
      } else {
        glyphIndex = c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      }
      
      const glyph = font[glyphIndex];

      for (let y = 0; y < fh; y++) {
        const glyphRow = glyph[y];
        for (let x = 0; x < fw; x++) {
          const glyphVal = glyphRow[x];
          ctx.fillStyle = glyphVal === 'x' ? 'white' : 'grey';
          ctx.fillRect(x * s, y * s, s, s);
        }
      }
      ctx.restore();
    });
  }
};

window.sketchNumber = document.currentScript.dataset.index;
app.sketches[window.sketchNumber] = new window.sketchClass();
