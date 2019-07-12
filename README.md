I have a 2d array of fully-addressable RGB LEDs controlled by an Arduino running generative C routines that I wrote.

Before this project, to see the output of the code, I'd pretty much had to have the jacket hooked up to the computer.

Now, with this project, I can get instant previews of the LED program output through a hacky chain of `C` -> `Emscripten (C to JS via asm.js)` -> `JavaScript` -> `svg (via D3.js)`.
