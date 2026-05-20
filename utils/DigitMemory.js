import fs from "fs";

export class Warmup {
  #isBackward = false;
  #multipleInputs = [];
  #number;
  #digits;

  #sortDigits = (n) => {
    return [...this.#removeSpace(n)].sort((a, b) => a - b).join``;
  };

  #isDuplicatedInputObj = (oldObj, newObj) => {
    const isNumberDuplicated =
      this.#removeSpace(oldObj.number) === this.#removeSpace(newObj.number);
    const isDigitsDuplicated =
      this.#sortDigits(oldObj.digits) === this.#sortDigits(newObj.digits);
    const isBackwardDuplicated = oldObj.isBackward === newObj.isBackward;
    return [isNumberDuplicated, isDigitsDuplicated, isBackwardDuplicated].every(
      (is) => is === true,
    );
  };

  #isDuplicatedInput = (newObj) =>
    this.#multipleInputs.some((oldObj) =>
      this.#isDuplicatedInputObj(oldObj, newObj),
    );

  set input(obj) {
    if (!this.#isDuplicatedInput(obj)) this.#multipleInputs.push(obj);
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
  [1234, 14],
  [1234, 41],
  [1234, 14, true],
  [1234, 41, true],
];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
