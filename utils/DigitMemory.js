import fs from "fs";

class DigitMemory {
  #number;
  #digits;
  isBackward = false;

  set number(num) {
    if (typeof num === "string") {
      this.#number = Number(num.replace(/\s/, ""));
    }
    this.#number = num;
  }

  set digits(digits) {
    this.#digits = digits;
  }

  #addSpace = (n) => [...`${n}`].join` `;

  #getReg = (n) => {
    return new RegExp(`[${n}]`, "g");
  };

  #createColoredAsterisk = (color) => {
    return `<span style="color: ${color}">*</span>`;
  };

  #createFrontField = () => {
    const reg = this.#getReg(this.#digits);
    const spacedNumber = this.#addSpace(this.#number);
    const coloredAsterisk = this.#createColoredAsterisk("rgb(170, 255, 0);");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createAnswerField = () => {
    const reg = this.#getReg(this.#digits);
    return `${this.#number}`.match(reg).join` `;
  };

  #createTTSFront = () => {
    if (this.isBackward) {
      const reversedNumber = [...this.#number.toString()].reverse().join``;
      return this.#addSpace(reversedNumber);
    }
    return this.#addSpace(this.#number);
  };

  #createTTSBack = () => {
    return this.#addSpace(this.#number);
  };

  #createOutput = () => {
    const Front = this.#createFrontField();
    const Answer = this.#createAnswerField();
    const TTSFront = this.#createTTSFront();
    const TTSBack = this.#createTTSBack();

    return (
      [Front, Answer, TTSFront, TTSBack].map((str) => JSON.stringify(str))
        .join`, ` + "\n"
    );
  };

  get output() {
    const output = this.#createOutput();
    fs.writeFileSync("outputs/Anki.txt", output, "utf8");
    return output;
  }
}

export default DigitMemory;

const digitMemory = new DigitMemory();
digitMemory.output;
