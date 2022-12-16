const buttons = [
  {
    name: "red",
    id: 0,
    color: 0xff0000,
    output: [1, 0, 0],
    light: "#880000",
    x: 0,
    y: 20,
  },
  {
    name: "green",
    id: 1,
    color: 0x00ff00,
    output: [0, 1, 0],
    light: "#008800",
    x: 0,
    y: 40,
  },
  {
    name: "blue",
    id: 2,
    color: 0x0000ff,
    output: [0, 0, 1],
    light: "#000088",
    x: 0,
    y: 60,
  },
];

export default class ColorButton {
  #currentID = 0;
  constructor(scene) {
    let reminder = scene.add.text(0, 100, "> red", {
      fontSize: "16px",
      fill: "#0",
    });

    for (let button of buttons) {
      let obj = scene.add
        .text(button.x, button.y, button.name, { fontSize: "16px", fill: "#0" })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          reminder.setText("> " + button.name);
          this.#currentID = button.id;
        })
        .on("pointerover", () => obj.setStyle({ fill: button.light }))
        .on("pointerout", () => obj.setStyle({ fill: "#0" }));
    }
  }

  get color() {
    return buttons[this.#currentID].color;
  }

  get output() {
    return buttons[this.#currentID].output;
  }
}
