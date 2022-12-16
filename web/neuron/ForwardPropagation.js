import { ActivationFunction } from "./ActivationFunction.js";

export function ForwardPropagation(input) {
  const inputLayer = 0;
  const outputLayer = this.network.length - 1;

  // set Input
  for (let i = 0; i < input.length; i++) {
    this.network[inputLayer][i + 1] = {
      input: input[i],
      output: input[i],
    };
  }

  // forward
  const lenWei = this.weights.length;
  for (let iWei = 0; iWei < lenWei; iWei++) {
    const iNet = iWei + 1;
    for (let j = 0; j < this.weights[iWei].length; j++) {
      let ceilIn = 0;
      for (let k = 0; k < this.weights[iWei][j].length; k++) {
        ceilIn += this.network[iNet - 1][k].output * this.weights[iWei][j][k];
      }
      let ceilOut = ActivationFunction(ceilIn);
      this.network[iNet][j + 1] = {
        input: ceilIn,
        output: ceilOut,
      };
    }
  }
  // 切除bias
  return this.network[outputLayer].slice(1).map((ceil) => ceil.output);
}
