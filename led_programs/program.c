#include "FastLED/FastLED.h"

#define Y_LENGTH 9
#define X_LENGTH 12

extern "C" {

CHSV leds[Y_LENGTH][X_LENGTH];
int startHue = 0;

void loop() {
  for (int y = 0; y < Y_LENGTH; y++) {
    fill_rainbow(leds[y], X_LENGTH, startHue);
  }

  startHue = (startHue + 1) % 256;
}

void loopAndPopulateArray(uint8_t *array) {
  loop();

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

}
