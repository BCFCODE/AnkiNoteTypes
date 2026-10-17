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
  ['8 7 6 0 4 9 2 1 5', 49215],
  ['8 0 9 3 5 2 1 6 4 7', 21], 
  ['2 6 1 5 0 9 4 8 7 3', 48], 
  ['9 1 5 4 7 3 8 2 0 6', 38], 
  ['8 0 5 9 1 3 2 4 6 7', 132467], 
  ['5 0 6 4 3 7 1 8 2 9', 158],
  ['3 1 9 2 6 8 7 5 4 0', 74],
  ['4 5 3 6 7 2 8 1', 370, true],
  ['5 7 3 1 6 0 8 4 9', 731], 
  ['0 9 3 6 4 2 1 5 7 8', 25],
  ['0 5 1 2 7 9 8 6', 95, true],
  ['0 5 1 2 7 9 8 6', 14, true],
  ['9 7 3 4 1 2 0 2 5 8', 1242], 
  ['2 4 0 1 9 5 3', 542, true],
  ['5 7 8 6 1 3 2 4 0 9', 7140],
  ['1 3 6 8 7 2 4 9 5 0', 19], 
  ['1 5 3 7 9 2 0 6 7', 79064],
  ['8 0 3 9 2 6 7 5 4', 397], 
  ['8 4 7 5 0 3 6 1', 507, true],
  ['6 8 4 0 5 9 7 2 3 1', 590],
  ['5 7 1 3 2 6 8 0 9', 5760], 
  ['0 2 5 4 9 6 1 8 7', 591],
  ['2 6 5 4 7 1 3 9 8 0', 138],
  ['6 1 4 7 0 8 3 5', 73410, true],
  ['2 1 0 5 9 8 6 3 4 7', 9840],
  ['6 4 3 5 0 1 9 7 2 8', 90], 
  ['0 6 7 8 3 2 9 4 1 5', 8394],
  ['3 9 6 0 8 7 5 1 2 4', 51940],
  ['0 7 8 9 1 5 3 4 2', 53],
  ['8 3 0 9 7 5 2 4 6 1', 7561], 
  ['5 0 1 7 9 4 3 8 2', 17],
  ['8 3 0 9 7 5 2 4 6 1', 75491],
  ['8 3 0 9 7 5 2 4 6 1', 52],
  ['7 2 1 6 0 3 9 4 5', 34],
  ['1 8 6 3 2 0 7 5', 82],
  ['8 7 3 6 2 5 4 9 0', 14], 
  ['9 7 0 6 5 1 2 4', 19, true],
  ['9 2 3 4 1 7 0 5 6 8', 50], 
  ['9 4 3 8 5 1 0 7', 41, true],
  ['3 6 2 9 8 4 5 7 0 1', 74],
  ['3 6 2 9 8 4 5 7 0 1', 702],
  ['1 3 7 9 4 2 0 8', 321, true],
  ['5 2 8 7 9 3 4 0', 4378, true],
  ['8 1 9 0 9 3 9', 13, true],
  ['7 3 4 2 1 6 5 0 9', 65],
  ['4 2 1 5 6 0 7 9', 95, true],
  ['0 7 8 9 1 5 3 4 2', 1542],
  ['7 3 4 2 1 6 5 0 9', 356],
  ['7 4 1 2 8 5 0 3', 40, true],
  ['0 7 3 8 1 6 4', 74, true],
  ['7 4 1 2 8 5 0 3', 40, true],
  ['6 2 8 9 5 0 4 7', 64],
  ['9 2 7 5 1 4 0 6 3', 54],
  ['5 0 3 4 2 6 7 8', 80],
  ['2 7 3 1 6 0 1', 3160],
  ['5 7 6 1 8 2 9', 169, true],
  ['8 4 6 3 9 0 5 1 2 7', 90], 
  ['8 4 0 1 6 9 5 3', 16],
  ['4 5 2 1 6 0 7 9 8', 30], 
  ['9 5 7 4 2 1 3 6 0 8', 367],
  ['8 4 6 3 9 0 5 1 2 7', 123], 
  ['0 3 7 6 8 4 1 9 2 5', 84],
  ['9 1 5 4 7 3 8 2 0 6', 380], 
  ['0 3 6 8 9 7 4 1 2 5', 410], 
  ['1 4 9 6 0 7 2 5 3', 402],
  ['4 7 5 9 6 1 8 0 2', 741],
  ['7 0 1 5 8 3 4 9', 40],
  ['0 7 3 8 1 6 4', 74, true], 
  ['6 4 3 8 5 9 7', 51, true],
  ['9 6 5 4 8 1 7 3', 65, true],
  ['3 8 0 7 1 5 9 6 4', 71587],
  ['0 8 9 2 4 6 1 5 3', 98214],
  ['7 6 0 1 8 3 9 2 4', 210],
  ['5 4 6 2 9 7 1', 324, true], 
  ['0 1 5 7 3 2 4', 14, true],
  ['5 8 0 1 3 9 4 7', 749, true],
  ['2 3 7 5 4 9 6 8 0 1', 4987],
  ['2 7 5 3 7 3 1 7 5 4', 3170],
  ['5 0 4 1 8 7 6 3 2 9', 87],
  ['8 2 7 0 9 4 5 3 6', 23], 
  ['4 9 6 1 3 0 5 2 7 8', 50], 
  ['6 4 2 0 9 3 8 7 1', 38],
  ['0 4 5 6 8 1 9 3 7 2', 193],
  ['8 2 7 0 9 4 5 3 6', 42], 
  ['3 9 7 4 2 6 8', 703, true],
  ['6 9 5 1 7 0 3', 150],
  ['8 9 0 3 1 7 3 2 7', 7203],
  ['6 9 5 1 7 0 3', 150, true],
  ['8 9 0 3 1 7 3 2 7', 70],
  ['7 4 3 2 1 8 5 6 9 0', 83],
  ['5 2 5 1 0 9 6 9', 601],
  ['4 9 8 0 7 1 3 6', 91, true],
  ['0 7 3 8 1 6 4', 47, true],
  ['1 3 4 0 4 6 1 2', 64],
  ['0 1 5 8 3 7 2 4', 70],
  ['6 7 5 3 2 1 4 8', 374, true],
  ['8 3 4 6 0 1 2 7', 164, true],
  ['8 4 3 1 2 0 9', 312, true],
  ['9 0 1 2 5 8 7 4 6 3', 5860],
  ['5 6 1 7 0 3 4 9 2', 6792],
  ['4 2 5 3 1 8 0 6 9', 30],
  ['6 0 2 7 4 5 3 8 1 9', 14],
  ['4 3 6 0 7 2 9 5 1 8', 723],
  ['4 2 5 3 1 8 0 6 9', 8069],
    
];

warmup.outputToFile("warmup.txt");
