export function ActivationFunction(input) {
  if (input < 0) {
    return 2 ** (-1 - Math.abs(input));
  }
  return 1 - 2 ** (-1 - Math.abs(input));
}

export function ActivationFunctionDerivative(input) {
  return Math.log(2) * 2 ** (-1 - Math.abs(input));
}
