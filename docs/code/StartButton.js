import { canvasX, sample } from "./global.js";

export default class StartButton {
  #isStart = false;
  constructor(scene) {
    let obj = scene.add
      .text(canvasX / 2, 400, "start", {
        fontSize: "16px",
        fill: "#0",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (sample.length == 0) {
          this.#isStart = false;
          obj.setText("start: put dots!");
        } else {
          this.#isStart = true;
          obj.setText("start");
        }
      })
      .on("pointerover", () => obj.setStyle({ fill: "#880088" }));
  }
  get clicked() {
    return this.#isStart;
  }
}
