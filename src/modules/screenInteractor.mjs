// src/modules/screenInteractor.js
import robot from 'robotjs';

// Click in the middle of the screen
export function clickMiddle() {
  const { width, height } = robot.getScreenSize();
  const x = Math.floor(width / 2);
  const y = Math.floor(height / 2);
  robot.moveMouse(x, y);
  robot.mouseClick();
  console.log(`Clicked at (${x}, ${y})`);
}

// Perform Tab multiple times with optional modifier
export function keyTapMultipleTimes(key, modifier, count) {
  for (let i = 0; i < count; i++) {
    if (modifier) robot.keyTap(key, modifier);
    else robot.keyTap(key);
  }
  console.log(`Performed ${modifier ? modifier + '+' : ''}${key} ${count} times`);
}

// Type a string
export function typeString(text) {
  robot.typeString(text);
}

// Key tap with optional modifier
export function keyTap(key, modifier = null) {
  robot.keyTap(key, modifier);
}
