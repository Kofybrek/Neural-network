import Phaser from "./lib/phaser.js";
import Neuron from "./neuron/index.js";
////////////////////////////////////////////////////////////////
// Global
const canvasX = 0;
const canvasY = 0;
const canvasWidth = 512;
const canvasHeight = 512;
const screenWidth = canvasX + canvasWidth;
const screenHeight = canvasY + canvasHeight;

////////////////////////////////////////////////////////////////
// input
let keyR;
let keyG;
let keyB;

////////////////////////////////////////////////////////////////
// msg
let isTrain = false;
let errText;
let sample = new Set();

////////////////////////////////////////////////////////////////
// draw
let graphics;
let circle;
const testWidth = 64;
const testHeight = 64;
const dotRadius = (0.5 * canvasWidth) / testWidth;
let testCanvas;

////////////////////////////////////////////////////////////////
// neuron
const learnigRate = 0.03125;
let brain = new Neuron(2, [3, 3], 3, [1, 0, 0, 0], learnigRate);
const trainNumPerFrame = 1024;

class neuronExample extends Phaser.Scene {
  constructor() {
    super("neuron example");
  }

  create() {
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
      .on("down", () => (isTrain = true));
    errText = this.add.text(0, 0, "", { fontSize: "16px", fill: "#00ff00" });

    circle = new Phaser.Geom.Circle(0, 0, dotRadius);
    testCanvas = this.textures.createCanvas(
      "testCanvas",
      testWidth,
      testHeight
    );

    testCanvas.context.createImageData(testWidth, testHeight);

    this.add
      .image(
        canvasX + canvasWidth / 2,
        canvasY + canvasHeight / 2,
        "testCanvas"
      )
      .setScale(canvasWidth / testWidth);

    graphics = this.add.graphics();
    graphics.lineStyle(1, 0x0, 1);
    this.input.on("pointerdown", (pointer) => Click.call(this, pointer));
  }
  update() {
    // gameInput();
    gameDeal();
    gameOutput();
  }
}

let config = {
  width: screenWidth,
  height: screenHeight,
  type: Phaser.AUTO,
  scene: neuronExample,
};

let game = new Phaser.Game(config);

function normalizePointerXY(poniterX, poniterY) {
  return [
    (poniterX - canvasX) / canvasWidth,
    (poniterY - canvasY) / canvasHeight,
  ];
}

function gameDeal() {
  if (isTrain) {
    let sampleArray = Array.from(sample);
    brain.train(
      sampleArray.map((value) => normalizePointerXY(...value.input)),
      sampleArray.map((value) => value.output),
      trainNumPerFrame
    );
  }
}

function gameOutput() {
  drawImg();
}

function drawDots() {
  function drawCircle(x, y, CircleColor) {
    graphics.fillStyle(CircleColor, 1);
    circle.setTo(x, y, dotRadius);
    graphics.fillCircleShape(circle);
    graphics.strokeCircleShape(circle);
  }
  for (let cir of sample) {
    let [x, y] = cir.input;
    let color = Phaser.Display.Color.GetColor(
      255 * cir.output[0],
      255 * cir.output[1],
      255 * cir.output[2]
    );
    drawCircle(x, y, color);
  }
}

function drawImg() {
  const width = testCanvas.width;
  const height = testCanvas.height;
  let pixels = testCanvas.context.getImageData(0, 0, width, height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
      let [r, g, b] = brain.predit([i / width, j / height]);
      pixels.data[index] = Math.round(255 * r);
      pixels.data[index + 1] = Math.round(255 * g);
      pixels.data[index + 2] = Math.round(255 * b);
      pixels.data[index + 3] = 255;
    }
  }
  testCanvas.context.putImageData(pixels, 0, 0);
  testCanvas.refresh();
}

function Click(pointer) {
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
      if (keyR.isDown) {
        this.add.circle(x, y, dotRadius, 0xff0000).setStrokeStyle(1, 0x0);
        this.add;
        sample.add({
          input: [x, y],
          output: [1, 0, 0],
        });
      } else if (keyG.isDown) {
        this.add.circle(x, y, dotRadius, 0x00ff00).setStrokeStyle(1, 0x0);
        sample.add({
          input: [x, y],
          output: [0, 1, 0],
        });
      } else if (keyB.isDown) {
        this.add.circle(x, y, dotRadius, 0x0000ff).setStrokeStyle(1, 0x0);
        sample.add({
          input: [x, y],
          output: [0, 0, 1],
        });
      }
    }
  }
}
