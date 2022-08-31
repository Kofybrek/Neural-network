import { ActivationFunctionDerivative } from "./ActivationFunction.js";
import { ErrorFunctionDerivative } from "./ErrorFunction.js";

export function BackPropagation(sampleOutput, predictOutput) {
  const lastLayer = this.weights.length - 1;
  for (let iWei = lastLayer; iWei >= 0; iWei--) {
    // output layer error
    const iErr = iWei;
    const iNet = iWei + 1;
    if (iWei == lastLayer) {
      for (let j = 0; j < this.errors[lastLayer].length; j++) {
        this.errors[lastLayer][j] = ErrorFunctionDerivative(
          sampleOutput[j],
          predictOutput[j]
        );
      }
    } else {
      // others layer error
      for (let j = 0; j < this.errors[iErr].length; j++) {
        let err = 0;
        for (let k = 0; k < this.errors[iErr + 1].length; k++) {
          err +=
            this.errors[iErr + 1][k] *
            ActivationFunctionDerivative(this.network[iNet + 1][k + 1].input) *
            this.weights[iWei + 1][j][k];
        }
        this.errors[iErr][j] = err;
      }
    }

    // calculate weight change
    for (let j = 0; j < this.weights[iWei].length; j++) {
      let errErrDivIn =
        this.errors[iErr][j] *
        ActivationFunctionDerivative(this.network[iNet][j + 1].input);

      for (let k = 0; k < this.weights[iWei][j].length; k++) {
        this.weights[iWei][j][k] -=
          this.learningRate * errErrDivIn * this.network[iNet - 1][k].output;
      }
    }
  }
}
