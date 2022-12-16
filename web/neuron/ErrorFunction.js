export function ErrorFunction(sampleOutput, predictOutput) {
  return (1 / 4) * (sampleOutput - predictOutput) ** 4;
}

export function ErrorFunctionDerivative(sampleOutput, predictOutput) {
  return (predictOutput - sampleOutput) ** 3;
}
