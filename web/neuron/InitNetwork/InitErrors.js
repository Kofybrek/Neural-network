export function InitErrors(weights) {
  let errors = new Array(weights.length);
  for (let iError = 0; iError < errors.length; iError++) {
    const iWeight = iError;
    errors[iError] = new Array(weights[iWeight].length);
  }
  return errors;
}
