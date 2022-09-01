import {
  dotRadius,
  sample,
  canvasX,
  canvasY,
  canvasWidth,
  canvasHeight,
} from "./global.js";
import { colorButton } from "./main.js";
export default class Pointer {
  constructor(scene) {
    scene.input.on("pointerdown", (pointer) =>
      pionterDown.call(scene, pointer)
    );
  }
}

function pionterDown(pointer) {
  let mousePointer = pointer;
  if (mousePointer.isDown) {
    function isBelongToCanvas() {
      return (
        mousePointer.x > canvasX &&
        mousePointer.x < canvasX + canvasWidth &&
        mousePointer.y > canvasY &&
        mousePointer.y < canvasY + canvasHeight
      );
    }
    if (isBelongToCanvas()) {
      const x = mousePointer.x;
      const y = mousePointer.y;

      function drawDot(scene, x, y, color) {
        scene.add.circle(x, y, dotRadius, color).setStrokeStyle(1, 0x0);
      }

      drawDot(this, x, y, colorButton.color);

      sample.push({
        input: [x, y],
        output: colorButton.output,
      });
    }
  }
}
