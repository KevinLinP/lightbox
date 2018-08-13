#include "FastLED/FastLED.h"

#include <stdio.h>

#define Y_LENGTH 9
#define X_LENGTH 12

extern "C" {

CHSV leds[Y_LENGTH][X_LENGTH];
uint16_t frameCounter = 0;

void sweepingRainbow() {
  uint8_t startHue = (frameCounter % 256);
  for (int y = 0; y < Y_LENGTH; y++) {
    uint8_t thisStartHue = startHue + (10 * y);

    fill_rainbow(leds[y], X_LENGTH, thisStartHue, 10);
  }
}

void rotatingRainbow() {
  const uint8_t HUE_VARIANCE = 20;
  uint8_t angle = 256 - (frameCounter % 1792) / 7;
  uint8_t startHue = (frameCounter % 512) / 2;
  float yHueDist = ((-128.0 + cos8(angle)) / 128.0) * HUE_VARIANCE;
  float xHueDist = ((-128.0 + sin8(angle)) / 128.0) * HUE_VARIANCE;

  for (int y = 0; y < Y_LENGTH; y++) {
    uint8_t thisStartHue = startHue + (yHueDist * y);
    for (int x = 0; x < X_LENGTH; x++) {
      uint8_t thisHue = thisStartHue + (xHueDist * x);
      leds[y][x] = CHSV(thisHue, 255, 255);
    }
  }
}

void generateFrame() {
  rotatingRainbow();
}

void translateToLinear(uint8_t *array) {
  int i = 0;

  for (int y = 0; y < Y_LENGTH; y++) {
    for (int x = 0; x < X_LENGTH; x++) {
      CRGB led = leds[y][x]; // converting here!

      array[i++] = led.r;
      array[i++] = led.g;
      array[i++] = led.b;
    }
  }
}

void loopAndPopulateArray(uint8_t *array) {
  frameCounter++;
  generateFrame();
  translateToLinear(array);
}

}
