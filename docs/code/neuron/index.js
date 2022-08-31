export default class NeuralNetwork {
  constructor(inputSize, hiddenSize, outputSize, biasSize = [0]) {
    this.errors = [];
    this.weights = [];
    this.network = [];
    this.learningRate = 0.03125;

    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.biasSize = biasSize;

    ////////////////////////////////
    // create network
    this.network.length = 2 + hiddenSize.length;
    // create input
    const inputLayer = 0;
    if (this.biasSize.length == 0 || this.biasSize[inputLayer] == 0) {
      this.network[inputLayer] = new Array(this.inputSize);
    } else {
      this.network[inputLayer] = new Array(this.inputSize + 1);
      this.network[inputLayer][0] = { input: 1, output: 1 };
    }
    // create hidden
    for (
      let iHiddenLayer = 0;
      iHiddenLayer < this.hiddenSize.length;
      iHiddenLayer++
    ) {
      const iBiasLayer = iHiddenLayer + 1;
      const iNetWorkLayer = iBiasLayer;
      if (iBiasLayer < this.biasSize.length) {
        if (biasSize[iBiasLayer] == 0) {
          this.network[iNetWorkLayer] = new Array(
            this.hiddenSize[iHiddenLayer]
          );
        } else {
          this.network[iNetWorkLayer] = new Array(
            this.hiddenSize[iHiddenLayer] + 1
          );
          this.network[iNetWorkLayer][0] = { input: 1, output: 1 };
        }
      } else {
        this.network[iNetWorkLayer] = new Array(this.hiddenSize[iHiddenLayer]);
      }
    }

    // create output
    const outputLayer = this.network.length - 1;
    this.network[outputLayer] = new Array(this.outputSize);

    ////////////////////////////////
    // create weights
    // 权重随机为(-1, 1)
    this.weights.length = this.hiddenSize.length + 1;
    for (
      let iNetWorkLayer = 1;
      iNetWorkLayer < this.network.length;
      iNetWorkLayer++
    ) {
      let colLen = this.network[iNetWorkLayer].length;
      const ibiasLayer = iNetWorkLayer;
      const iWeightLayer = iNetWorkLayer - 1;
      if (ibiasLayer < this.biasSize.length && this.biasSize[ibiasLayer] == 1) {
        colLen -= 1;
      }
      this.weights[iWeightLayer] = new Array(colLen);
      for (let j = 0; j < this.weights[iWeightLayer].length; j++) {
        this.weights[iWeightLayer][j] = new Array(
          this.network[iNetWorkLayer - 1].length // previous network layer
        );
        for (let k = 0; k < this.weights[iWeightLayer][j].length; k++) {
          this.weights[iWeightLayer][j][k] = Phaser.Math.FloatBetween(-1, 1);
        }
      }
    }

    ////////////////////////////////
    // create errors
    this.errors.length = this.weights.length;
    for (let iError = 0; iError < this.errors.length; iError++) {
      const iWeight = iError;
      this.errors[iError] = new Array(this.weights[iWeight].length);
    }
  }

  forwardPropagation(inputList) {
    const inputLayer = 0;
    const outputLayer = this.network.length - 1;

    // set Input
    for (let i = 0; i < inputList.length; i++) {
      let biasNum = 0;
      if (this.biasSize.length > 0 && this.biasSize[0] == 1) {
        biasNum = 1;
      }
      this.network[inputLayer][i + biasNum] = {
        input: inputList[i],
        output: inputList[i],
      };
    }

    // forward
    for (
      let iWeightLayer = 0;
      iWeightLayer < this.weights.length;
      iWeightLayer++
    ) {
      const iBiasLayer = iWeightLayer + 1;
      const iNetWorkLayer = iBiasLayer;
      let biasNum = 0;
      if (this.biasSize.length > iBiasLayer && this.biasSize[iBiasLayer] == 1) {
        biasNum = 1;
      }
      for (let j = 0; j < this.weights[iWeightLayer].length; j++) {
        let ceilIn = 0;
        for (let k = 0; k < this.weights[iWeightLayer][j].length; k++) {
          ceilIn +=
            this.network[iNetWorkLayer - 1][k].output *
            this.weights[iWeightLayer][j][k];
        }
        let ceilOut = ActivationFunction(ceilIn);
        this.network[iNetWorkLayer][j + biasNum] = {
          input: ceilIn,
          output: ceilOut,
        };
      }
    }
    return this.network[outputLayer].map((ceil) => ceil.output);
  }

  backPropagation(sampleOutput, predictOutput) {
    ////////////////////////////////
    // adjust weights
    for (
      let iWeightLayer = this.weights.length - 1;
      iWeightLayer >= 0;
      iWeightLayer--
    ) {
      ////////////////////////////////
      // calculate error
      // output layer error
      const iErrorLayer = iWeightLayer;
      const iBiasLayer = iErrorLayer + 1;
      const iNetWorkLayer = iBiasLayer;
      if (iWeightLayer == this.weights.length - 1) {
        for (let j = 0; j < this.errors[this.errors.length - 1].length; j++) {
          this.errors[this.errors.length - 1][j] = ErrorFunctionDerivative(
            sampleOutput[j],
            predictOutput[j]
          );
        }
      } else {
        // others layer error
        for (let j = 0; j < this.errors[iErrorLayer].length; j++) {
          let nxtBiasNum = 0;
          if (
            this.biasSize.length > iBiasLayer + 1 &&
            this.biasSize[iBiasLayer + 1] == 1
          ) {
            nxtBiasNum = 1;
          }
          let err = 0;
          for (
            let k = nxtBiasNum;
            k < this.network[iNetWorkLayer + 1].length;
            k++
          ) {
            err +=
              this.errors[iErrorLayer + 1][k - nxtBiasNum] *
              ActivationFunctionDerivative(
                this.network[iNetWorkLayer + 1][k].input
              ) *
              this.weights[iWeightLayer + 1][j][k - nxtBiasNum];
          }
          this.errors[iErrorLayer][j] = err;
        }
      }
      ////////////////////////////////
      // calculate weight change
      for (let j = 0; j < this.weights[iWeightLayer].length; j++) {
        let biasNum = 0;
        if (
          iBiasLayer < this.biasSize.length &&
          this.biasSize[iBiasLayer] == 1
        ) {
          biasNum = 1;
        }
        let errErrDivIn =
          this.errors[iErrorLayer][j] *
          ActivationFunctionDerivative(
            this.network[iNetWorkLayer][j + biasNum].input
          );

        for (let k = 0; k < this.weights[iWeightLayer][j].length; k++) {
          this.weights[iWeightLayer][j][k] -=
            this.learningRate *
            errErrDivIn *
            this.network[iNetWorkLayer - 1][k].output;
        }
      }
    }
  }

  train(input, output, times) {
    for (let i = 0; i < times; i++) {
      const randomIndex = Math.floor(Math.random() * input.length);
      const predictOutput = this.forwardPropagation(input[randomIndex]);
      this.backPropagation(output[randomIndex], predictOutput);
    }
  }

  predit(input) {
    return this.forwardPropagation(input);
  }
}

function ActivationFunction(input) {
  if (input < 0) {
    return 2 ** (-1 - Math.abs(input));
  }
  return 1 - 2 ** (-1 - Math.abs(input));
}

function ActivationFunctionDerivative(input) {
  return Math.log(2) * 2 ** (-1 - Math.abs(input));
}

function ErrorFunctionDerivative(sampleOutput, predictOutput) {
  return (predictOutput - sampleOutput) ** 3;
}
