////////////////////////////////
// canvas
export const canvasX = 120;
export const canvasY = 0;
export const canvasWidth = 512;
export const canvasHeight = 512;
export const sampleWidth = 64;
export const sampleHeight = 64;

////////////////////////////////
// game
export const screenWidth = canvasX + canvasWidth;
export const screenHeight = canvasY + canvasHeight;

////////////////////////////////
// neuron

export const sample = new Array();
export const learnigRate = 0.03125;
export const inputSize = 2;
export const hiddenSize = [3, 3];
export const outputSize = 3;
export const biasSize = [1, 0, 0, 0];
export const trainNumPerFrame = 1024;

////////////////////////////////
// pointer
export const dotRadius = (0.5 * canvasWidth) / sampleWidth;
