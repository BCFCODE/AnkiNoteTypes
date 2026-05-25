import fs from "fs";

export class Warmup {
  #isBackward = false;
  #multipleInputs = [];
  #number;
  #digits;

  #getUniqueDigits = (digits) => [...new Set(this.#removeNoneDigits(digits))];

  #getSortedUniqueDigits = (digits) => {
    const uniqueDigits = this.#getUniqueDigits(digits);
    return uniqueDigits.sort((a, b) => a - b).join``;
  };

  #removeNotIncludedDigits = ({ number, digits }) => {
    const reg = new RegExp(`[^${this.#removeNoneDigits(number)}]`, "g");
    return this.#removeNoneDigits(digits).replace(reg, "");
  };

  #setCleanNumber = (obj) => {
    obj.number = this.#removeNoneDigits(obj.number);
  };

  #setCleanDigits = (obj) => {
    const cleanDigits = this.#removeNotIncludedDigits(obj);
    obj.digits = this.#getSortedUniqueDigits(cleanDigits);
  };

  #isDuplicatedInputObj = (oldObj, newObj) => {
    const isNumberDuplicated = oldObj.number === newObj.number;

    const isDigitsDuplicated = oldObj.digits === newObj.digits;

    const isBackwardDuplicated = oldObj.isBackward === newObj.isBackward;

    const conditions = [
      isNumberDuplicated,
      isDigitsDuplicated,
      isBackwardDuplicated,
    ];
    const isEverythingDuplicated = conditions.every((is) => is === true);
    return isEverythingDuplicated;
  };

  #isDuplicatedInput = (newObj) =>
    this.#multipleInputs.some((oldObj) =>
      this.#isDuplicatedInputObj(oldObj, newObj),
    );

  #generateInputs = (obj) => {
    const splittedDigits = obj.digits.match(/\d/g) ?? [];
    const individualDigits = [...splittedDigits, obj.digits];
    return individualDigits.map((digits) => ({ ...obj, digits }));
  };

  #checkForDuplicatesAndPushToMultipleInputs = (obj) => {
    const objIsNotADuplicatedInput = !this.#isDuplicatedInput(obj);
    if (objIsNotADuplicatedInput) this.#multipleInputs.push(obj);
  };

  #addInputs = (obj) => {
    const inputs = this.#generateInputs(obj);
    inputs.forEach(this.#checkForDuplicatesAndPushToMultipleInputs);
  };

  #createInputObj = (input = {}) => {
    let obj = input;

    if (Array.isArray(input)) {
      const [number, digits, isBackward] = input;
      obj = { number, digits, isBackward };
    }

    if (typeof input === "number" || typeof input === "string") {
      obj = { number: input, digits: input };
    }
    return obj;
  };

  set singleInput(input) {
    const obj = this.#createInputObj(input);
    this.#setCleanNumber(obj);
    this.#setCleanDigits(obj);
    this.#addInputs(obj);
  }

  #addSpace = (n) => [...`${n}`].join` `;

  #removeNoneDigits = (n) => `${n}`.replace(/\D/g, "");

  #getReg = (n) => {
    return new RegExp(`[${this.#removeNoneDigits(n)}]`, "g");
  };

  #createColoredAsterisk = (color) => {
    return `<span style="color: ${color}">*</span>`;
  };

  #canNotConvertToNumber = (number) => {
    if (!/number|string/.test(typeof number)) return true;
    if (typeof number === "string") {
      if (number === "") return true;
      const cleanNumber = this.#removeNoneDigits(number);
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
    const numberOf = this.#removeNoneDigits(this.#number).toString().length;
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
  ["2 5 0 1 2 0 4 2 7", 30],
  ["2 5 0 1 2 0 4 2 7", 42],
];

inputs.forEach((input) => {
  digitMemory.singleInput = input;
});

digitMemory.outputToFile();
