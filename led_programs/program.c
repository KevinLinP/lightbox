#include "FastLED/FastLED.h"

#include <stdio.h>

#define Y_LENGTH 9
#define X_LENGTH 12

extern "C" {

CHSV leds[Y_LENGTH][X_LENGTH];
uint16_t frameCounter = 0;

void sweepingRainbow() {
  uint8_t startHue = (frameCounter % 512);
  for (int y = 0; y < Y_LENGTH; y++) {
    uint8_t thisStartHue = startHue + (10 * y);

    fill_rainbow(leds[y], X_LENGTH, thisStartHue, 10);
  }
}

void rotatingRainbow() {
  /*uint8_t startHue = (frameCounter % 1024) / 4;*/
  uint8_t startHue = 0;
  uint8_t angle = (frameCounter % 512) / 2;
  uint8_t xHueDelta = cos8(angle);
  uint8_t yHueDelta = sin8(angle);

  if (yHueDelta >= 128) {
    yHueDelta = 255 - yHueDelta;
  }
  
  if (xHueDelta >= 128) {
    xHueDelta = 255 - xHueDelta;
  }

  CHSV rowStartColors[Y_LENGTH];
  if (angle >= 64 && angle <= 191) {
    fill_gradient(rowStartColors, 0, CHSV(startHue, 255, 255), Y_LENGTH, CHSV((startHue + yHueDelta), 255, 255));
  } else {
    fill_gradient(rowStartColors, 0, CHSV(startHue - yHueDelta, 255, 255), Y_LENGTH, CHSV((startHue), 255, 255));
  }

  for (int y = 0; y < Y_LENGTH; y++) {
    CHSV rowStartColor = rowStartColors[y];

    if (angle <= 127) {
      fill_gradient(leds[y], 0, rowStartColor, X_LENGTH, CHSV(rowStartColor.hue + xHueDelta, 255, 255));
    } else {
      fill_gradient(leds[y], 0, CHSV(rowStartColor.hue - xHueDelta, 255, 255), X_LENGTH, rowStartColor);
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
