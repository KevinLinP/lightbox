class LedDisplay {
  constructor() {
    this.width = 12;
    this.height = 9;
    this.nDataBytes = this.width * this.height * 3;

    this.reset();
  }

  reset() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.emscripten = window.emscripten;
    this.dataPtr = this.emscripten._malloc(this.nDataBytes);
    this.dataBuffer = new Uint8Array(this.emscripten.HEAPU8.buffer, this.dataPtr, this.nDataBytes);
    this.wrappedLoopFunc = this.emscripten.cwrap('loopAndPopulateArray', 'number', ['number'], [this.dataBuffer.byteOffset]);

    this.intervalId = window.setInterval(this.loop.bind(this), 16);
  }

  getLeds() {
    this.wrappedLoopFunc(this.dataBuffer.byteOffset);
    const rawData = new Uint8Array(this.dataBuffer.buffer, this.dataBuffer.byteOffset, this.nDataBytes);

    const leds = new Array(this.height);

    let offset = 0;
    for (let y = 0; y < this.height; y++) {
      leds[y] = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        leds[y][x] = rawData.slice(offset, offset + 3);
        offset += 3;
      }
    }

    return leds;
  }

  // ripped from https://github.com/bgrins/TinyColor
  // Converts an HSV color value to RGB.
  // *Assumes:* h is contained in [0, 1] and s and v are contained in [0, 1]
  // *Returns:* { r, g, b } in the set [0, 255]
  hsvToRgb(h, s, v) {
    h = h * 6;
    s = s;
    v = v;

    var i = Math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  applyMbostockMagic(hsvLeds) {
    const svgContainer = d3.select('#led-svg').attr('viewBox', '0 0 1200 900').style('background-color', 'black');
    const rowGroups = svgContainer.selectAll('g').data(hsvLeds)
    rowGroups.enter().append('g').attr('transform', (d, i) => {return `translate(50, ${50 + (i * 100)})`});

    const circles = rowGroups.merge(rowGroups).selectAll('circle').data((d) => { return d;});
    circles.enter().append('circle').attr('r', 25).attr('cx', (d, i) => {return i * 100;});
    circles.merge(circles).attr('fill', (d) => {
      const {r, g, b} = this.hsvToRgb(d[0] / 255.0, d[1] / 255.0, d[2] / 255.0);
      return `rgb(${r}, ${g}, ${b})`;
    });
  }

  loop() {
    const hsvLeds = this.getLeds();
    this.applyMbostockMagic(hsvLeds);
  }
}

window.ledDisplay = new LedDisplay();
