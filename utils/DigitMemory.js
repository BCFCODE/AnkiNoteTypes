import fs from "fs";

export class Warmup {
  #isBackward = false;
  #multipleInputs = [];
  #number;
  #digits;

  set input(obj) {
    this.#multipleInputs.push(obj);
  }

  #addSpace = (n) => [...`${n}`].join` `;

  #removeSpace = (n) => `${n}`.replace(/ /g, "");

  #getReg = (n) => {
    return new RegExp(`[${n}]`, "g");
  };

  #createColoredAsterisk = (color) => {
    return `<span style="color: ${color}">*</span>`;
  };

  #canNotConvertToNumber = (number) => {
    if (!/number|string/.test(typeof number)) return true;
    if (typeof number === "string") {
      if (number === "") return true;
      const cleanNumber = this.#removeSpace(number);
      const hasNoneDigit = /\D/.test(cleanNumber);
      if (hasNoneDigit) return true;
    }
    return false;
  };

  #isValidInputs = () => {
    if ([this.#number, this.#digits].some(this.#canNotConvertToNumber))
      return false;

    const reg = this.#getReg(this.#digits);
    const numberHasDigits = reg.test(`${this.#number}`);
    if (!numberHasDigits) return false;

    return true;
  };

  #createFrontField = () => {
    if (!this.#isValidInputs()) return null;
    const reg = this.#getReg(this.#digits);
    const spacedNumber = this.#addSpace(this.#number);
    const coloredAsterisk = this.#createColoredAsterisk("rgb(170, 255, 0);");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createAnswerField = () => {
    if (!this.#isValidInputs()) return null;
    const reg = this.#getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    return answerFieldDigits.join` `;
  };

  #createTTSFrontField = () => {
    if (!this.#isValidInputs()) return null;
    if (this.#isBackward) {
      const reversedNumber = [...this.#number.toString()].reverse().join``;
      return this.#addSpace(reversedNumber);
    }
    return this.#addSpace(this.#number);
  };

  #createTTSBackField = () => {
    if (!this.#isValidInputs()) return null;
    return this.#addSpace(this.#number);
  };

  #createNumberOfDigitsTag = () => {
    const numberOf = this.#removeSpace(this.#number).toString().length;
    return ` ${numberOf}Digits`;
  };

  #createHiddenStarsTag = () => {
    const reg = this.#getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    if (answerFieldDigits === null) return "";
    return " " + "*".repeat(answerFieldDigits.length);
  };

  #createTagsField = () => {
    if (!this.#isValidInputs()) return null;
    const nOfDigitsTag = this.#createNumberOfDigitsTag();
    const directionTag = this.#isBackward ? " Backward" : " Forward";
    const hiddenStarsTag = this.#createHiddenStarsTag();
    return `Memo DigitMemory Warmup${directionTag}${nOfDigitsTag}${hiddenStarsTag}`;
  };

  #createOutput = () => {
    const outputs = this.#multipleInputs.map(
      ({ number, digits, isBackward = false }) => {
        this.#number = number;
        this.#digits = digits;
        this.#isBackward = isBackward;
        const Front = this.#createFrontField();
        const Answer = this.#createAnswerField();
        const Back = null;
        const Image = null;
        const AudioBothSides = null;
        const AudioFront = null;
        const AudioBack = null;
        const VideoFront = null;
        const VideoBack = null;
        const Links = null;
        const TTSFront = this.#createTTSFrontField();
        const TTSBack = this.#createTTSBackField();
        const FrontPersian = null;
        const Tags = this.#createTagsField();
        const Fields = [
          Front,
          Answer,
          Back,
          Image,
          AudioBothSides,
          AudioFront,
          AudioBack,
          VideoFront,
          VideoBack,
          Links,
          TTSFront,
          TTSBack,
          FrontPersian,
          Tags,
        ];
        return Fields.join`|`;
      },
    );
    return outputs.join`\n`;
  };

  get output() {
    return this.#createOutput();
  }

  outputToFile = (path = "Anki.txt") =>
    fs.writeFileSync(`outputs/${path}`, this.#createOutput(), "utf8");
}

export const digitMemory = new Warmup();

const inputs = [
  ["9 2 5 6 8 3 7 1 4", 3],
  ["4 0 9 7 9 4 0 5 1", 49],
  ["3 2 3 8 2 9 5 3 6 2", 293682],
  ["6 8 0 6 7 1 5 6", 7],
  ["7 1 3 4 8 6 0 6 2 6", 87],
  ["4 0 9 7 9 4 0 5 1", 74],
  ["3 2 3 8 2 9 5 3 6 2", 82519],
  ["7 1 3 4 8 6 0 6 2 6", 54],
  ["4 0 9 7 9 4 0 5 1", 4],
  ["6 8 0 6 7 1 5 6", 7],
  ["4 0 9 7 9 4 0 5 1", 47],
  ["7 6 1 0 7 8 6 9 0", 71],
  ["4 0 9 7 9 4 0 5 1", 74],
  ["8 3 1 4 5 3 1 2 7", 5314],
  ["0 8 6 3 6 1 3 7 9", 67],
  ["4 7 1 9 0 8 3 7 8", 837],
  ["8 9 0 5 8 6 4 3 6", 40],
  ["8 3 1 4 5 3 1 2 7", 8143],
  ["8 9 0 5 8 6 4 3 6", 95],
  ["3 8 6 9 2 4 9 7 0", 467],
  ["8 5 2 0 2 1 4 3 7 9", 4],
  ["9 4 6 5 1 8 5 1 9", 45],
  ["8 3 1 4 5 3 1 2 7", 5],
  ["6 4 3 9 1 7 1 3 6 5", 1],
  ["7 5 1 6 4 3 9 0 4", 16370],
  ["8 5 2 0 2 1 4 3 7 9", 4],
  ["8 3 1 4 5 3 1 2 7", 462],
  ["8 5 6 5 3 9 7 0", 973],
  ["8 2 1 3 5 6 3 7 5", 67],
  ["5 9 3 9 8 5 1 6 9", 853],
  ["8 3 1 4 5 3 1 2 7", 4351],
  ["8 5 6 5 3 9 7 0", 973],
  ["1 9 2 8 6 4 5 3", 46],
  ["8 2 1 3 5 6 3 7 5", 6],
  ["8 9 7 1 6 0 3 0 6", 79630],
  ["1 3 6 8 9 6 8 5 3 9", 91],
  ["8 9 7 1 6 0 3 0 6", 91],
  ["8 9 7 1 6 0 3 0 6", 790],
  ["1 3 6 8 9 6 8 5 3 9", 59],
  ["9 4 5 0 7 1 0 2 8 6", 102],
];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
