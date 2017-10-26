#include "FastLED/pixeltypes.h"
#include "FastLED/colorutils.h"
#include "FastLED/colorutils.cpp"

#define Y_LENGTH 9
#define X_LENGTH 12

extern "C" {

CHSV leds[Y_LENGTH][X_LENGTH];
int startHue = 0;

void loop() {
  for (int y = 0; y < Y_LENGTH; y++) {
    fill_rainbow(leds[y], X_LENGTH, startHue);
  }

  startHue = (startHue + 2) % 256;
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
