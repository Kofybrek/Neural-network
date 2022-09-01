import {
  canvasX,
  canvasY,
  canvasWidth,
  canvasHeight,
  sampleWidth,
  sampleHeight,
} from "./global.js";

export default class Canvas {
  #texture;
  constructor(scene, name) {
    this.#texture = scene.textures.createCanvas(
      name,
      sampleWidth,
      sampleHeight
    );

    this.#texture.context.createImageData(sampleWidth, sampleHeight);

    scene.add
      .image(canvasX + canvasWidth / 2, canvasY + canvasHeight / 2, name)
      .setScale(canvasWidth / sampleWidth);
  }

  update(brain) {
    const width = this.#texture.width;
    const height = this.#texture.height;
    let pixels = this.#texture.context.getImageData(0, 0, width, height);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let index = (i + j * width) * 4;
        let [r, g, b] = brain.predict([i / width, j / height]);
        pixels.data[index] = Math.round(255 * r);
        pixels.data[index + 1] = Math.round(255 * g);
        pixels.data[index + 2] = Math.round(255 * b);
        pixels.data[index + 3] = 255;
      }
    }
    this.#texture.context.putImageData(pixels, 0, 0);
    this.#texture.refresh();
  }
}
