import Utils from ".";

class Warmup extends Utils {
  #isBackward = false;
  #multipleInputs = [];
  #number;
  #digits;

  #getSortedUniqueDigits = (digits) => {
    const uniqueDigits = this.getUniqueDigits(digits);
    return uniqueDigits.sort((a, b) => a - b).join``;
  };

  #removeNotIncludedDigits = ({ number, digits }) => {
    const reg = new RegExp(`[^${this.removeNoneDigits(number)}]`, "g");
    return this.removeNoneDigits(digits).replace(reg, "");
  };

  #setCleanNumber = (obj) => {
    obj.number = this.removeNoneDigits(obj.number);
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

  #inputValidationAndPushToMultipleInputs = (obj) => {
    const isValidInput = this.#isValidInputs(obj);
    if (isValidInput) this.#multipleInputs.push(obj);
  };

  #addInput = (obj) => {
    const inputs = this.#generateInputs(obj);
    inputs.forEach(this.#inputValidationAndPushToMultipleInputs);
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

    this.#setCleanNumber(obj);
    this.#setCleanDigits(obj);

    return obj;
  };

  #createAndAddInputToMultipleInputs = (input) => {
    const obj = this.#createInputObj(input);
    this.#addInput(obj);
  };

  set singleInput(input) {
    this.#createAndAddInputToMultipleInputs(input);
  }

  set multipleInputs(inputs) {
    inputs.forEach(this.#createAndAddInputToMultipleInputs);
  }

  #canNotConvertToNumber = (number) => {
    if (!/number|string/.test(typeof number)) return true;
    if (typeof number === "string") {
      if (number === "") return true;
      const cleanNumber = this.removeNoneDigits(number);
      const hasNoneDigit = /\D/.test(cleanNumber);
      if (hasNoneDigit) return true;
    }
    return false;
  };

  #isValidInputs = (obj) => {
    const isDuplicatedInput = this.#isDuplicatedInput(obj);
    const numberOrDigitsCanNotConvertedToNumber = [obj.number, obj.digits].some(
      this.#canNotConvertToNumber,
    );

    const [uniqueNumber, uniqueDigits] = [obj.number, obj.digits].map(
      this.#getSortedUniqueDigits,
    );

    if (isDuplicatedInput) return false;
    if (numberOrDigitsCanNotConvertedToNumber) return false;
    if (uniqueNumber === uniqueDigits) return false;

    return true;
  };

  #createFrontField = () => {
    const reg = this.getReg(this.#digits);
    const spacedNumber = this.addSpaceBetweenDigits(this.#number);
    const coloredAsterisk = this.addColor("*");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createAnswerField = () => {
    const reg = this.getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    return answerFieldDigits.join` `;
  };

  #createTTSFrontField = () => {
    if (this.#isBackward) {
      const reversedNumber = [...this.#number.toString()].reverse().join``;
      return this.addSpaceBetweenDigits(reversedNumber);
    }
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createTTSBackField = () => {
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createNumberOfDigitsTag = () => {
    const numberOf = this.removeNoneDigits(this.#number).toString().length;
    return ` ${numberOf}Digits`;
  };

  #createHiddenStarsTag = () => {
    const reg = this.getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    if (answerFieldDigits === null) return "";
    return " " + "*".repeat(answerFieldDigits.length);
  };

  #createTagsField = () => {
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
}

export const warmup = new Warmup();

warmup.multipleInputs = [
  ["7 5 1 0 3 1 7 3 8", 310],
  ["3 7 4 6 5 0 6 8 0", 506],
];

warmup.outputToFile();

export default Warmup;
