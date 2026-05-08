import fs from "fs";

class DigitMemory {
  #number;
  #digits;

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

  #replaceDigitsWithAsterisk = () => {
    const reg = this.#getReg(this.#digits);
    const spacedNumber = this.#addSpace(this.#number);
    const coloredAsterisk = this.#createColoredAsterisk("rgb(170, 255, 0);");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createOutput = () => {
    const replacedWithAsterisk = this.#replaceDigitsWithAsterisk();
    return `${JSON.stringify(replacedWithAsterisk)}`;
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
