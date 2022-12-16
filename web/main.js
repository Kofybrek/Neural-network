import Phaser from "./lib/phaser.js";
import { screenWidth, screenHeight } from "./global.js";
import ColorButton from "./ColorButton.js";
import StartButton from "./StartButton.js";
import Canvas from "./Canvas.js";
import Brain from "./Brain.js";
import Pointer from "./Pointer.js";

////////////////////////////////
// object
export let colorButton;
export let startButton;
export let brain;
export let pointer;
export let canvas;

class neuronExample extends Phaser.Scene {
  constructor() {
    super("neuron example");
  }

  create() {
    brain = new Brain(this);
    canvas = new Canvas(this, "background");
    colorButton = new ColorButton(this);
    startButton = new StartButton(this);
    pointer = new Pointer(this);
  }
  update() {
    brain.update(startButton.started);
    canvas.update(brain);
  }
}

let config = {
  width: screenWidth,
  height: screenHeight,
  type: Phaser.AUTO,
  backgroundColor: "#ffffff",
  scene: neuronExample,
};

new Phaser.Game(config);
