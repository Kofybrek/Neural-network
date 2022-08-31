export function InitWeights(network) {
  let weights = new Array(network.length - 1);

  const lenWeights = weights.length;

  for (let iWeiLayer = 0; iWeiLayer < lenWeights; iWeiLayer++) {
    const iNetLayer = iWeiLayer + 1;

    // 减去bias
    weights[iWeiLayer] = new Array(network[iNetLayer].length - 1);

    for (let j = 0; j < weights[iWeiLayer].length; j++) {
      weights[iWeiLayer][j] = new Array(
        network[iNetLayer - 1].length // previous network layer
      );

      for (let k = 0; k < weights[iWeiLayer][j].length; k++) {
        weights[iWeiLayer][j][k] = Phaser.Math.FloatBetween(-1, 1);
      }
    }
  }
  return weights;
}
