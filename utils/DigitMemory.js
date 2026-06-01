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
  ['1 9 8 3 1 0 2 4 3 2', 3102],
  ['1 9 8 3 1 0 2 4 3 2', 10],
  ['4 0 3 8 3 1 9 1 6 7', 6],
  ['3 8 6 9 2 4 9 7 0', 8],
  ['1 9 8 3 1 0 2 4 3 2', 10243],
  '7 5 1 0 3 1 7 3 8', 
  ['3 8 6 9 2 4 9 7 0', 2768],
  ['9 8 2 3 3 4 4', 34],
  ['7 5 1 0 3 1 7 3 8', 70],
  ['1 9 8 3 1 0 2 4 3 2', 1],
  ['4 1 0 9 0 8 5 7 9', 8],
  ['4 7 1 4 5 6 7', 145],
  ['2 5 0 1 2 0 4 2 7', 120],
  ['1 9 8 3 1 0 2 4 3 2', 1024],
  ['4 0 9 7 9 4 0 5 1', 4190],
  ['6 3 5 1 3 0 7 3', 3703],
  ['4 9 3 8 7 5 1', 53, true],
  ['4 1 0 9 0 8 5 7 9', 805],
  ['1 9 8 3 1 0 2 4 3 2', 8310],
  '9 4 6 3 7 6 9 8 6 1',
  ['9 6 0 3 8 2 3 0', 382],
  ['7 4 0 5 4 0 9 6 1 9', 4096],
  '1 5 1 0 5 7 4 9 2', 
  ['9 6 0 3 8 2 3 0', 38230],
  ['7 4 0 5 4 0 9 6 1 9', 409619],
  ['3 1 9 5 8 6 2 4 0 7', 8602],
  ['4 8 7 4 6 4 2 3 1', 64231], 
  ['7 3 8 5 3 1 3 0', 873],
  ['9 4 6 3 7 6 9 8 6 1', 861],
  ['3 7 4 6 5 0 6 8 0', 560],
  ['7 4 0 5 4 0 9 6 1 9', 40],
  '3 1 9 5 8 6 2 4 0 7',
  '4 8 7 4 6 4 2 3 1',
  ['9 4 6 3 7 6 9 8 6 1', 6],
  '3 7 4 6 5 0 6 8 0', 
  ['6 4 3 9 1 7 1 3 6 5', 3],
  ['2 7 5 3 7 3 1 7 5 4', 731],
  ['9 7 3 4 1 2 0 2 5 8', 1205],
  ['7 3 8 5 3 1 3 0', 79],
  ['6 8 2 5 8 6 4 8 7 5', 586],
  ['9 4 6 3 7 6 9 8 6 1', 861],
  ['3 7 4 6 5 0 6 8 0', 680],
  ['3 1 9 5 8 6 2 4 0 7', 62407],
  ['6 4 3 9 1 7 1 3 6 5', 6431],
  '2 7 5 3 7 3 1 7 5 4', 
  ['9 7 3 4 1 2 0 2 5 8', 4120],
  ['3 7 4 6 5 0 6 8 0', 5068],
  ['3 1 9 5 8 6 2 4 0 7', 86240],
  ['1 6 9 4 3 6 3 8 6', 6386],
  ['8 3 1 4 5 3 1 2 7', 127],
  ['7 2 0 3 6 8 3 9', 2036], 
  ['6 4 3 9 1 7 1 3 6 5', 7136],
  ['3 6 5 2 3 6 0 6 2', 3602],
  ['3 1 9 5 8 6 2 4 0 7', 62407],
  ['1 6 9 4 3 6 3 8 6', 6384],
  ['7 2 0 3 6 8 3 9', 30],
  '8 3 1 4 5 3 1 2 7', 
  ['8 3 1 4 5 3 1 2 7', 147],
  '1 5 1 2 8 5 8 3 9', 
  ['6 8 0 6 7 1 5 6', 7106],
  '8 2 1 4 9 7 5 6', 
  ['5 9 4 9 1 0 3 5 6', 104],
  ['5 8 1 5 8 9 7 6 9', 971],
  ['3 7 4 6 5 0 6 8 0', 680],
  ['1 0 5 3 6 3 9 8 1', 389],
  ['5 9 4 9 1 0 3 5 6', 9103],
  ['5 8 1 5 8 9 7 6 9', 9],
  ['7 1 2 1 4 3 8', 12, true],
  '8 6 1 8 4 1 5 8 1',
  ['1 5 3 6 2 8 3 0 1', 3],
  
];

warmup.outputToFile();

export default Warmup;
