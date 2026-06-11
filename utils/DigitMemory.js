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
  ['8 5 2 6 3 4 1 9 0', 26425],
  ['7 1 4 6 8 9 0 3 2 5', 7146],
  ['4 6 8 9 1 3 7 2 0', 9137],
  ['8 4 5 1 2 9 6 7', 298, true],
  ['8 5 2 6 3 4 1 9 0',9341], 
  ['4 6 8 9 1 3 7 2 0', 720],
  ['7 6 9 2 1 5 4 8', 294],
  ['8 5 2 6 3 4 1 9 0', 341],
  ['7 1 4 6 8 9 0 3 2 5', 903],
  ['7 6 9 2 1 5 4 8', '7 6 9 2 1 5 4 8', true],
  ['7 6 9 2 1 5 4 8', 129, true],
  ['8 5 2 6 3 4 1 9 0', 3419],
  ['6 7 8 4 9 0 5 2', 509, true],
  ['2 7 5 3 7 3 1 7 5 4', 5371], 
  ['3 5 2 1 8 6 0 4 9 7', 60497],
  ['7 3 8 5 3 1 3 0', 7385], 
  ['6 8 2 0 1 7 0 5 4 9', 682], 
  ['3 5 9 2 1 6 8 4', 684],
  ['8 7 2 9 5 0 3 4', 503],
  ['3 7 4 6 5 0 6 8 0', 5068],
  ['8 7 2 9 5 0 3 4', 9503],
  ['2 5 0 1 2 0 4 2 7', 204],
  ['2 8 4 7 6 5 0 3 9', 7650], 
  ['7 5 3 4 2 6 9 0', 535, true],
  ['7 5 3 4 2 6 9 0', 624, true],
  '0 6 7 5 3 4 8 2', 
  ['2 5 0 1 2 0 4 2 7', 1204],
  ['7 4 1 2 1 7 0 5 1', 70512],
  ['7 5 3 4 2 6 9 0', 6243],
  ['7 6 9 2 1 5 4 8', 2967, true],
  ['9 7 6 3 1 9 1', '9 7 6 3 1 9 1', true],
  ['7 4 1 2 1 7 0 5 1', 127],
  ['3 4 2 0 1 6 9 5 7 8', 169],
  ['2 5 0 1 2 0 4 2 7', 120],
  ['3 1 9 5 8 6 2 4 0 7', 8624],
  ['7 3 1 2 3 9 6', 9321, true],
  ['7 3 1 2 3 9 6', 137, true],
  '3 8 6 9 2 4 9 7 0', 
  ['3 4 2 0 1 6 9 5 7 8', 1695],
  ['4 0 3 8 3 1 9 1 6 7', 319167],
  ['3 1 9 5 8 6 2 4 0 7', 86245],
  ['8 9 6 3 0 4 0', 6304],
  ['6 1 5 7 9 0 7 6', 9076],
  ['3 7 1 0 4 2', 173, true],
  ['7 5 6 4 0 1 9 2', 4019],
  '7 2 5 8 3 6 4 0', 
  ['5 2 3 9 6 8 7 1 0', 871],
  ['5 2 3 9 6 8 7 1 0', 6871],
  ['5 2 3 9 6 8 7 1 0', 8710],
  
];

warmup.outputToFile("warmup.txt");

export default Warmup;

