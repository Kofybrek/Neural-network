export function InitNetwork(inputSize, arrHiddenSize, outputSize, arrBiasSize) {
  let network = new Array(2 + arrHiddenSize.length);

  network[0] = CreateInputLayer(inputSize, arrBiasSize[0]);

  CreateHiddenLayer(network, arrHiddenSize, arrBiasSize);

  const posOutputLayer = network.length - 1;
  network[posOutputLayer] = CreateOutputLayer(
    outputSize,
    arrBiasSize[posOutputLayer]
  );
  return network;
}

function CreateInputLayer(inputSize, biasSize) {
  let netInputLayer = new Array(inputSize + 1);
  if (biasSize == 1) {
    netInputLayer[0] = { input: 1, output: 1 };
  } else {
    netInputLayer[0] = { input: 0, output: 0 };
  }
  return netInputLayer;
}

function CreateHiddenLayer(network, arrHiddenSize, arrBiasSize) {
  const lenArrHidden = arrHiddenSize.length;
  for (let iHiddenLayer = 0; iHiddenLayer < lenArrHidden; iHiddenLayer++) {
    const iBiasLayer = iHiddenLayer + 1;
    const iNetWorkLayer = iBiasLayer;
    network[iNetWorkLayer] = new Array(arrHiddenSize[iHiddenLayer] + 1);
    if (arrBiasSize[iBiasLayer] == 1) {
      network[iNetWorkLayer][0] = { input: 1, output: 1 };
    } else {
      network[iNetWorkLayer][0] = { input: 0, output: 0 };
    }
  }
}

function CreateOutputLayer(outputSize, biasSize) {
  let netOutputLayer = new Array(outputSize + 1);
  if (biasSize == 1) {
    netOutputLayer[0] = { input: 1, output: 1 };
  } else {
    netOutputLayer[0] = { input: 0, output: 0 };
  }
  return netOutputLayer;
}
