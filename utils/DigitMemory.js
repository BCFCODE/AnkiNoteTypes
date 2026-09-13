import Utils from ".";

export default class Warmup extends Utils {
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
    return spacedNumber.replace(reg, (digit) => this.addColor(digit, "*"));
  };

  #createAnswerField = () => {
    const reg = this.getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`
      .match(reg)
      .map((digit) => this.addColor(digit));
    return answerFieldDigits.join` `;
  };

  #createTTSFrontField = () => {
    if (this.#isBackward) {
      const reversedNumber = this.reverseDigits(this.#number);
      return this.addSpaceBetweenDigits(reversedNumber);
    }
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createTTSBackField = () => {
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createHiddenStarsTag = () => {
    const reg = this.getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    if (answerFieldDigits === null) return "";
    return "*".repeat(answerFieldDigits.length);
  };

  #createTagsField = () => {
    const numberOfDigits = this.getNumberOfDigits(this.#number);
    const generalTags = this.createTagsField(numberOfDigits, this.#isBackward);
    const hiddenStarsTag = this.#createHiddenStarsTag();
    return `${generalTags} ${hiddenStarsTag} Warmup`;
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
        const BackPersian = null;
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
          BackPersian,
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
  ['0 2 8 6 4 1 5 7 3 9', 253],
  ['0 2 5 4 9 6 1 8 7', 519], 
  ['2 7 6 9 0 3 8 5 1 4', 95],
  ['9 5 4 8 6 1 7 3 0 2', 61], 
  ['1 4 2 5 7 0 3 6 8 9', 238], 
  ['6 2 0 9 8 4 7 1 5', 1804], 
  ['7 3 9 1 2 8 5', 31, true], 
  ['6 2 9 4 8 5 3', 24509, true], 
  ['6 2 9 4 8 5 3', 8510, true], 
  ['4 1 0 9 6 7 8', 64, true], 
  ['1 8 9 6 4 5 7 3 2 0', 945], 
  ['1 8 9 6 4 5 7 3 2 0', 453],
  ['9 6 4 0 2 5 1 7 3 8', 70], 
  ['1 8 9 6 4 5 7 3 2 0', 963], 
  ['7 2 2 4 8 1 2 3 6 9', 124],
  ['1 6 7 4 8 3 5 2 9 0', 485],
  ['4 7 6 3 1 5 2 0 8 9 9', 754], 
  
];

warmup.outputToFile("warmup.txt");
