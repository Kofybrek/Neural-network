import Neuron from "./neuron/index.js";
import {
  sample,
  learnigRate,
  trainNumPerFrame,
  inputSize,
  outputSize,
  hiddenSize,
  biasSize,
  canvasX,
  canvasY,
  canvasWidth,
  canvasHeight,
} from "./global.js";

let neuron = new Neuron(
  inputSize,
  hiddenSize,
  outputSize,
  biasSize,
  learnigRate
);

export default class Brain {
  #errText;
  constructor(scene) {
    this.#errText = scene.add.text(0, 0, "Error: 0", {
      fontSize: "16px",
      fill: "#00ff00",
    });
  }
  predict(input) {
    return neuron.predict(input);
  }
  update(isTrain) {
    if (isTrain) {
      neuron.train(
        sample.map((value) => normalizeXY(...value.input)),
        sample.map((value) => value.output),
        trainNumPerFrame
      );
      this.#showError();
    }
  }
  #showError() {
    let totalError = 0;
    for (let sam of sample) {
      let pre = neuron.predict(normalizeXY(...sam.input));
      for (let i = 0; i < pre.length; i++) {
        totalError += Math.abs(pre[i] - sam.output[i]);
      }
    }
    this.#errText.setText("Error: " + totalError.toFixed(2));
  }
}

function normalizeXY(x, y) {
  return [(x - canvasX) / canvasWidth, (y - canvasY) / canvasHeight];
}
