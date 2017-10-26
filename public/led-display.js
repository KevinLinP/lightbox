class LedDisplay {
  constructor() {
    this.nDataBytes = 9 * 12 * 3;

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

    this.intervalId = window.setInterval(this.loop.bind(this), 1000);
  }

  loop() {
    this.wrappedLoopFunc(this.dataBuffer.byteOffset);
    const ledArray = new Uint8Array(this.dataBuffer.buffer, this.dataBuffer.byteOffset, 9 * 12 * 3);
  }
}

window.ledDisplay = new LedDisplay();
