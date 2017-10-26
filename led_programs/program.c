#include "FastLED/pixeltypes.h"

#define Y_LENGTH 9
#define X_LENGTH 12

extern "C" {

CHSV leds[Y_LENGTH][X_LENGTH];

void loop() {
  for (int y = 0; y < Y_LENGTH; y++) {
    for (int x = 0; x < X_LENGTH; x++) {
      leds[y][x] = CHSV(HUE_ORANGE, 255, 255);
    }
  }
}

void loopAndPopulateArray(uint8_t *array) {
  loop();

  int i = 0;

  for (int y = 0; y < Y_LENGTH; y++) {
    for (int x = 0; x < X_LENGTH; x++) {
      CHSV led = leds[y][x];

      array[i++] = led.hue;
      array[i++] = led.sat;
      array[i++] = led.val;
    }
  }
}

}
