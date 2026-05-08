import fs from "fs";

class DigitMemory {
  isBackward = false;
  #number;
  #digits;

  set number(num) {
    if (typeof num === "string") {
      this.#number = Number(num.replace(/\s/, ""));
    }
    this.#number = num;
  }

  set multipleInputs(inputs) {}

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

  #createTTSFrontField = () => {
    if (this.isBackward) {
      const reversedNumber = [...this.#number.toString()].reverse().join``;
      return this.#addSpace(reversedNumber);
    }
    return this.#addSpace(this.#number);
  };

  #createTTSBackField = () => {
    return this.#addSpace(this.#number);
  };

  #createNumberOfDigitsTag = () => {
    const tagMap = {
      4: "4Digits",
      5: "5Digits",
      6: "6Digits",
      7: "7Digits",
      8: "8Digits",
      9: "9Digits",
      10: "10Digits",
    };
    return tagMap[this.#number.toString().length];
  };

  #createTagsField = () => {
    const nOfDigitsTag = this.#createNumberOfDigitsTag();
    const directionTag = this.isBackward ? "Backward" : "Forward";
    return `Memo DigitMemory Warmup ${directionTag} ${nOfDigitsTag}`;
  };

  #createOutput = () => {
    const Front = this.#createFrontField();
    const Answer = this.#createAnswerField();
    const TTSFront = this.#createTTSFrontField();
    const TTSBack = this.#createTTSBackField();
    const Tags = this.#createTagsField();

    return (
      [Front, Answer, TTSFront, TTSBack, Tags].map((str) => JSON.stringify(str))
        .join`, ` + "\n"
    );
  };

  get output() {
    return this.#createOutput();
  }

  outputToFile = () =>
    fs.writeFileSync("outputs/Anki.txt", this.#createOutput(), "utf8");
}

export default DigitMemory;



const output = [
  [123456, 35],
  [12356, 23, true],
].map(([number, digits, isBackward = false]) => {
 const digitMemory = new DigitMemory();
  digitMemory.number = number;
  digitMemory.digits = digits;
  digitMemory.isBackward = isBackward;
  return digitMemory.output
}).join``;

fs.writeFileSync("outputs/multiple-inputs.txt", output, "utf8");
