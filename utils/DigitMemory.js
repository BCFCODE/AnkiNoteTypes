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
    this.#number = spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  get number() {
    this.#replaceDigitsWithAsterisk();
    return this.#number;
  }
}

export default DigitMemory;
