import Phaser from "./lib/phaser.js";
import Neuron from "./neuron/index.js";
////////////////////////////////////////////////////////////////
// Global
let canvasX = 512;
let canvasY = 0;
let canvasWidth = 512;
let canvasHeight = 512;
let screenWidth = canvasX + canvasWidth;
let screenHeight = canvasY + canvasHeight;

////////////////////////////////////////////////////////////////
// input
let keyR;
let keyG;
let keyB;
let keyS;
let mousePointer;

////////////////////////////////////////////////////////////////
// msg
let isTrain = false;
let errText;
let sample = new Set();

////////////////////////////////////////////////////////////////
// draw
let graphics;
let circle;
let testWidth = 64;
let testHeight = 64;
let dotRadius = (0.5 * canvasWidth) / testWidth;
let testCanvas;

////////////////////////////////////////////////////////////////
// neuron
let brain = new Neuron(2, [3, 3], 3, [1, 0, 0]);
let trainNumPerFrame = 1024;

class neuronExample extends Phaser.Scene {
  constructor() {
    super();
  }

  create() {
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    keyB = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    mousePointer = this.input.mousePointer;
    errText = this.add.text(0, 0, "", { fontSize: "16px", fill: "#00ff00" });

    circle = new Phaser.Geom.Circle(0, 0, dotRadius);
    testCanvas = this.textures.createCanvas(
      "testCanvas",
      testWidth,
      testHeight
    );

    graphics = this.add.graphics();

    testCanvas.context.createImageData(testWidth, testHeight);

    this.add
      .sprite(
        canvasX + canvasWidth / 2,
        canvasY + canvasHeight / 2,
        "testCanvas"
      )
      .setScale(canvasWidth / testWidth);
  }
  update() {
    gameInput();
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

function gameInput() {
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
      if (keyR.isDown) {
        sample.add({
          input: [mousePointer.x, mousePointer.y],
          output: [1, 0, 0],
        });
      } else if (keyG.isDown) {
        sample.add({
          input: [mousePointer.x, mousePointer.y],
          output: [0, 1, 0],
        });
      } else if (keyB.isDown) {
        sample.add({
          input: [mousePointer.x, mousePointer.y],
          output: [0, 0, 1],
        });
      }
    }
  }
  if (keyS.isDown) {
    isTrain = true;
  }
}

function normalizePointerXY(poniterX, poniterY) {
  return [(poniterX - canvasWidth) / canvasWidth, poniterY / canvasHeight];
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
  drawDots();
  drawImg();
}

function drawDots() {
  function drawCircle(x, y, CircleColor) {
    graphics.fillStyle(CircleColor, 1);
    circle.setTo(x, y, dotRadius);
    graphics.fillCircleShape(circle);
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
      pixels.data[index] = Math.floor(255 * r);
      pixels.data[index + 1] = Math.floor(255 * g);
      pixels.data[index + 2] = Math.floor(255 * b);
      pixels.data[index + 3] = 255;
    }
  }
  testCanvas.context.putImageData(pixels, 0, 0);
  testCanvas.refresh();
}
