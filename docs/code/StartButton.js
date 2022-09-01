import { sample } from "./global.js";

export default class StartButton {
  #isStart = false;
  constructor(scene) {
    let obj = scene.add
      .text(0, 80, "start", {
        fontSize: "16px",
        fill: "#0",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.#isStart = !this.#isStart;
        if (this.#isStart) {
          if (sample.length == 0) {
            this.#isStart = false;
            obj.setText("start: empty");
          } else {
            obj.setText("stop");
          }
        } else {
          obj.setText("start");
        }
      })
      .on("pointerover", () => obj.setStyle({ fill: "#880088" }))
      .on("pointerout", () => obj.setStyle({ fill: "#0" }));
  }
  get started() {
    return this.#isStart;
  }
}
