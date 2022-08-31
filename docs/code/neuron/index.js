import { ForwardPropagation } from "./ForwardPropagation.js";
import { BackPropagation } from "./BackPropagation.js";
import { InitNetwork, InitWeights, InitErrors } from "./InitNetwork/index.js";

export default class NeuralNetwork {
  errors;
  weights;
  network;
  learningRate;
  constructor(
    inputSize,
    hiddenSize,
    outputSize,
    biasSize = [0],
    learningRate = 0.1
  ) {
    this.learningRate = learningRate;

    this.network = InitNetwork(inputSize, hiddenSize, outputSize, biasSize);
    this.weights = InitWeights(this.network);
    this.errors = InitErrors(this.weights);
  }

  forwardPropagation(input) {
    return ForwardPropagation.call(this, input);
  }

  backPropagation(output, predictOutput) {
    return BackPropagation.call(this, output, predictOutput);
  }

  train(input, output, times) {
    for (let i = 0; i < times; i++) {
      const randomIndex = Math.floor(Math.random() * input.length);
      const predictOutput = this.forwardPropagation(input[randomIndex]);
      this.backPropagation(output[randomIndex], predictOutput);
    }
  }

  predict(input) {
    return this.forwardPropagation(input);
  }
}
