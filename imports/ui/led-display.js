export default class LedDisplay {
  constructor() {
    this.width = 12;
    this.height = 9;
    this.nDataBytes = this.width * this.height * 3;
  }

  reset(emscripten) {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    this.emscripten = emscripten;
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

  applyMbostockMagic(leds) {
    const svg = d3.select('#led-svg').attr('viewBox', '0 0 1200 900').style('background-color', 'black');
    const ledContainer = svg.select('#led-container').attr('transform', 'translate(37, 37)'); // .style('filter', 'url(#blur)');
    const rowGroups = ledContainer.selectAll('g').data(leds);
    rowGroups.enter().append('g').attr('transform', (d, i) => {return `translate(0, ${i * 100})`});

    const squares = rowGroups.merge(rowGroups).selectAll('rect').data((d) => { return d;});
    squares.enter().append('rect').attr('width', 25).attr('height', 25).attr('x', (d, i) => {return i * 100;});
    squares.merge(squares).attr('fill', (d) => {
      return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
    });
  }

  loop() {
    const leds = this.getLeds();
    this.applyMbostockMagic(leds);
  }
}

this.window.ledDisplay = new LedDisplay(); // TODO: wtf -_-
