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
  ["2 0 9 7 6 4 5 3 8 1 8", 38],
  ["8 0 9 3 5 2 1 6 4 7", 521836],
  ["3 9 2 1 8 5 6 7 0 4", 216],
  ["8 0 9 3 5 2 1 6 4 7", 326],
  ["7 1 5 2 8 0 3 4 6 9", 804],
  ["8 0 9 3 5 2 1 6 4 7", 263],
  ["8 0 9 3 5 2 1 6 4 7", 219],
  ["5 4 9 0 1 7 2 3 8 6", 720],
  ["5 4 9 0 1 7 2 3 8 6", 170],
  ["8 0 9 3 5 2 1 6 4 7", 148],
  ["8 0 9 3 5 2 1 6 4 7", 2160],
  ["2 0 9 7 6 4 5 3 8 1 8", 6438],
  ["2 0 9 7 6 4 5 3 8 1 8", 58],
  ["8 6 2 7 0 1 9 5 4", 21],
  ["9 2 3 8 4 7 6 5 1 0", 761],
  ["1 4 2 5 7 0 3 6 8 9", 238],
  ["4 5 8 7 3 9 1 2 0 6", 89],
  ["3 1 6 7 2 9 0 5 4 8", 40],
  ["9 2 3 8 4 7 6 5 1 0", 75],
  ["6 5 9 0 3 8 4 7 1 2 6", 470],
  ["5 9 2 8 6 4 3 0 7 1 2", 308],
  ["9 2 1 6 5 7 4 3 0 8 9", 743],
  ["2 0 9 7 6 4 5 3 8 1 8", 3175],
  ["4 5 8 7 3 9 1 2 0 6", 92],
  ["9 2 3 8 4 7 6 5 1 0", 758],
  ["6 5 9 0 3 8 4 7 1 2 6", 870],
  ["9 2 1 6 5 7 4 3 0 8 9", 743],
  ["5 9 2 8 6 4 3 0 7 1 2", 30],
  ["9 2 3 8 4 7 6 5 1 0", 47],
  ["4 5 2 8 7 9 3 6 0", 9326],
  ["9 2 1 6 5 7 4 3 0 8 9", 74],
  ["9 2 3 8 4 7 6 5 1 0", 475],
  ["4 5 2 8 7 9 3 6 0", 32],
  ["3 1 6 7 2 9 0 5 4 8", 295472],
  ["5 9 2 8 6 4 3 0 7 1 2", 78],
  ["9 2 3 8 4 7 6 5 1 0", 47],
  ["4 5 2 8 7 9 3 6 0", 98],
  ["9 2 3 8 4 7 6 5 1 0", 47],
  ["8 7 2 1 0 6 5 3 9", 2136],
  ["9 2 3 8 4 7 6 5 1 0", 471],
  ["8 1 4 9 3 2 7 0 5 6 6", 2705],
  ["8 7 2 1 0 6 5 3 9", 53921],
  ["2 0 9 7 6 4 5 3 8 1 8", 43],
  ["9 2 3 8 4 7 6 5 1 0", 4756],
  ["2 0 9 7 6 4 5 3 8 1 8", 38],
  ["8 1 7 6 9 3 2 0 4 5", 20],
  ["6 1 9 3 2 5 7 0 4 8", 256],
  ["9 5 4 8 6 1 7 3 0 2", 83],
  ["9 2 3 8 4 7 6 5 1 0", 4781],
  ["5 9 4 9 1 0 3 5 6", 713],
  ["5 1 0 7 9 6 2 3 8", 20],
  ["5 9 4 9 1 0 3 5 6", 73],
  ["0 2 5 4 9 6 1 8 7", 61840],
  ["5 0 4 9 3 8 7", 891],
  ["8 7 6 0 4 9 2 1 5", 491],
  ["2 5 7 0 6 1 3 9 4 8 1", 139],
  ["9 5 4 8 6 1 7 3 0 2", 613],
  ["5 3 6 8 9 0 1 2 4 7 4", 903],
  ["6 0 2 1 7 9 8 4 5 3 6", 7945321],
  ["1 2 6 3 4 0 8 5 9 7", 5803],
  ["6 0 2 1 7 9 8 4 5 3 6", 98517],
  ["1 7 2 0 4 5 3 9 6 8", 3927],
  ["6 0 2 1 7 9 8 4 5 3 6", 41],
  ["6 0 2 1 7 9 8 4 5 3 6", 42],
  ["6 0 2 1 7 9 8 4 5 3 6", 8452],
  ["9 6 4 0 2 5 1 7 3 8", 174],
  ["9 6 4 0 2 5 1 7 3 8", 9017],
  ["3 0 9 8 4 2 1 6 7", 19],
  ["3 8 4 6 9 0 7 2 1 5", 140],
  ["5 2 6 4 0 8 7 3 1", 80],
  ["3 8 4 6 9 0 7 2 1 5", 10],
  ["3 8 4 6 9 0 7 2 1 5", 214],
  ["9 6 4 0 2 5 1 7 3 8", 730],
  ["9 6 4 0 2 5 1 7 3 8", 210],
  ["3 8 4 6 9 0 7 2 1 5", 10],
  ["9 6 4 0 2 5 1 7 3 8", 70],
  ["6 2 5 3 9 8 7 4 0 1", 48],
  ["6 2 5 3 9 8 7 4 0 1", 24],
  ["9 6 4 0 2 5 1 7 3 8", 730],
  ["5 8 4 3 0 6 1 7 2 9 3", 1748],
  ["9 2 0 8 9 0 7 2 0 5", 280],
  ["7 2 5 3 8 4 1 0 6", 270],
  ["9 6 4 0 2 5 1 7 3 8", 25149],
  ["7 4 1 9 0 5 3 6 8", 73],
  ["7 3 9 8 6 4 1 5 0", 981],
  ["0 3 1 2 5 4 6 9 7 8 8", 25],
  ["1 4 8 6 2 7 5 0 3 9", 23],
  ["0 3 1 2 5 4 6 9 7 8 8", 69],
  ["7 3 9 8 6 4 1 5 0", 85],
  ["3 5 0 7 1 6 4 2 8 9", 642],
  ["5 8 4 3 0 6 1 7 2 9 3", 178],
  ["1 4 8 6 2 7 5 0 3 9", 753],
  ["9 6 4 0 2 5 1 7 3 8", 31920],
  ["3 5 0 7 1 6 4 2 8 9", 648],
  ["3 5 0 7 1 6 4 2 8 9", 64],
  ["4 9 6 1 3 0 5 2 7 8", 50],
  ["9 6 4 0 2 5 1 7 3 8", 407],
  ["5 2 9 0 8 3 6 4 1 7", 64],
  ["3 5 0 7 1 6 4 2 8 9", 64],
  ["3 5 0 7 1 6 4 2 8 9", 1645],
  ["5 7 8 6 1 3 2 4 0 9", 407],
  ["9 0 3 2 1 7 5 8", 9315],
  ["5 7 9 8 1 8 0 7 2", 67],
  ["0 3 5 4 1 8 6 9 7 2", 180],
  ["1 6 7 4 8 3 5 2 9 0", 75],
  ["0 6 4 5 3 7 2 8 9 1", 607],
  ["0 3 5 4 1 8 6 9 7 2", 863],
  ["1 0 7 2 5 4 9 6", 42],
  ["1 4 8 0 9 7 5 2 3 6 7", 75234],
  ["1 5 3 6 2 8 3 0 1", 368],
  ["3 1 7 4 8 0 2 5 9 6", 48257],
  ["5 4 9 0 1 7 2 3 8 6", 7280],
  ["5 4 9 0 1 7 2 3 8 6", 80],
  ["9 6 4 0 2 5 1 7 3 8", 573],
  ["5 4 9 0 1 7 2 3 8 6", 52803],
  ["5 4 9 0 1 7 2 3 8 6", 720],
  ["6 8 4 3 9 7 5 2 1 0", 951],
  ["6 8 4 3 9 7 5 2 1 0", 35],
  ["3 9 2 1 8 5 6 7 0 4", 186],
  ["3 9 2 1 8 5 6 7 0 4", 21670],
  ["1 6 5 0 9 7 3 2 8", 50736],
  ["2 3 7 5 4 9 6 8 0 1", 2368],
  ["6 8 2 5 8 6 4 8 7 5", 6487],
  ["8 2 1 6 5 9 7 3 4 0 5", 341],
  ["2 3 7 5 4 9 6 8 0 1", 241],
  ["8 2 1 6 5 9 7 3 4 0 5", 345],
  ["9 6 4 0 2 5 1 7 3 8", 57340],
  ["8 9 0 1 6 3 4 5 7 2", 31],
  ["8 2 1 6 5 9 7 3 4 0 5", 341],
  ["9 0 2 6 1 4 8 7 5 3", 14],
  ["5 9 2 8 6 4 3 0 7 1 2", 78],
  ["2 7 6 0 3 4 1 9 5 8 6", 93],
  ["8 2 1 6 5 9 7 3 4 0 5", 731],
  ["5 9 2 8 6 4 3 0 7 1 2", 30],
  ["0 9 5 7 8 4 1 6 2", 8416],
  ["2 7 6 0 3 4 1 9 5 8 6", 9307],
  ["8 2 1 6 5 9 7 3 4 0 5", 34],
  ["5 9 2 8 6 4 3 0 7 1 2", 30],
  ['6 4 3 9 1 7 1 3 6 5', 17549], 
  ['9 4 6 2 8 3 0 5 7 1', 2570], 
  ['1 9 2 3 0 7 5 6 8 4', 765], 
  ['9 2 3 8 4 7 6 5 1 0', 475], 
  ['9 2 1 6 5 7 4 3 0 8 9', 7419], 
  ['9 4 6 2 8 3 0 5 7 1', 50], 
  ['2 5 7 0 6 1 3 9 4 8 1', 1309], 
  ['9 2 3 8 4 7 6 5 1 0', 476], 
  ['9 4 6 2 8 3 0 5 7 1', 901], 
  ['2 5 7 0 6 1 3 9 4 8 1', 134907], 
  ['0 5 8 4 1 6 9 7 3', 698], 
  ['9 2 1 6 5 7 4 3 0 8 9', 7401], 
  ['2 5 7 0 6 1 3 9 4 8 1', 139], 
  ['3 0 9 8 4 2 1 6 7', 91], 
  ['4 2 5 0 1 9 6 8 3 7', 168], 
  ['3 5 4 2 7 1 9 6 0', 71], 
  ['3 5 2 0 7 8 6 1 4 9 0', 352], 
  ['9 2 1 6 5 7 4 3 0 8 9', 74], 
  ['1 9 2 3 0 7 5 6 8 4', 750], 
  ['4 2 5 0 1 9 6 8 3 7', 82], 
  ['6 2 5 3 9 8 7 4 0 1', 42], 
  ['0 2 5 4 9 6 1 8 7', 3278], 
  ['3 5 2 0 7 8 6 1 4 9 0', 3524], 
  ['2 0 9 7 6 4 5 3 8 1 8', 381], 
  ['9 2 1 6 5 7 4 3 0 8 9', 6439], 
  ['3 2 8 4 5 0 6 2', 8450], 
  ['8 1 4 9 3 2 7 0 5 6 6', 27], 
  ['9 5 4 8 0 7 1 3 2', 60], 
  ['2 0 9 7 6 4 5 3 8 1 8', 317], 
  ['6 2 5 3 9 8 7 4 0 1', 740639], 
  ['6 2 5 3 9 8 7 4 0 1', 84], 
  ['8 1 7 6 9 3 2 0 4 5', 208], 
  ['2 6 5 4 7 1 3 9 8 0', 713980], 
  ['2 4 5 1 8 0 6 3 9 7', 69], 
  ['2 6 5 4 7 1 3 9 8 0', 71980], 
  ['2 0 9 7 6 4 5 3 8 1 8', 64589], 
  ['2 4 5 1 8 0 6 3 9 7', 80], 
  ['2 0 9 7 6 4 5 3 8 1 8', 4538], 
  ['6 3 0 2 7 9 4 5 1', 42307], 
  ['8 3 9 1 0 2 6 7 5', 9051], 
  ['5 4 8 7 0 1 3 9 2', 10], 
  ['8 5 2 6 7 1 3 9 4 0', 714], 
  ['5 4 8 7 0 1 3 9 2', 50], 
  ['2 0 9 7 6 4 5 3 8 1 8', 458], 
  ['2 0 9 7 6 4 5 3 8 1 8', 718], 
  ['2 6 5 4 7 1 3 9 8 0', 139], 
  ['2 0 9 7 6 4 5 3 8 1 8', 6403], 
  ['1 2 0 9 6 8 5 3 7 4', 687], 
  ['8 0 5 9 1 3 2 4 6 7', 40], 
  ['2 3 4 9 8 6 0 7 1 5', 10], 
  ['4 9 6 7 8 0 5 3 1 2', 80153], 
  ['2 3 5 6 9 7 0 1', 3971], 
  ['2 6 5 4 7 1 3 9 8 0', 139], 
  ['2 0 9 7 6 4 5 3 8 1 8', 5389], 
  ['4 9 6 7 8 0 5 3 1 2', 159], 
  ['4 3 7 1 0 5 9 2 8', 5013], 
  ['8 5 1 9 0 2 4 6 7 3', 27], 
  ['5 8 4 3 0 6 1 7 2 9 3', 17957], 
  ['2 0 9 7 6 4 5 3 8 1 8', 3187],
  ['9 6 4 0 2 5 1 7 3 8', 574], 
  ['6 2 6 0 6 8 4 3 1 7', 43], 
  ['7 5 9 2 0 1 6 3 4 8', 139], 
  ['2 0 9 7 6 4 5 3 8 1 8', 641843], 
  ['7 1 5 2 8 0 3 4 6 9', 8036], 
  ['8 9 0 3 1 7 3 2 7', 7302], 
  ['6 5 7 4 3 2 1 8 9', 43170], 
  ['4 7 6 3 1 5 2 0 8 9 9', 30], 
  ['5 7 8 6 1 3 2 4 0 9', 301], 
  ['5 7 9 8 1 8 0 7 2', 60], 
  ['7 2 5 3 8 4 1 0 6', 41], 
  ['7 2 5 3 8 4 1 0 6', 20], 
  ['3 9 2 1 8 5 6 7 0 4', 67], 
  ['7 2 6 5 0 4 3 1 9', 46], 
  ['4 8 0 2 1 5 6 9 7 3', 60], 
  ['7 3 9 8 6 4 1 5 0', 41], 
  ['9 6 4 0 2 5 1 7 3 8', 730], 
  ['9 6 4 0 2 5 1 7 3 8', 25170], 
  ['1 4 2 5 7 0 3 6 8 9', 308], 
  ['4 8 3 4 2 7 9 6 5', 8403],
  ['4 0 7 8 6 1 2 5 9', 612], 
  ['4 0 8 5 2 7 6 3 1 9', 857],
  ['9 6 4 0 2 5 1 7 3 8', 70], 
  ['5 4 8 7 0 1 3 9 2', 10], 
  ['6 7 3 9 1 8 5 0', 65, true], 
  ['1 9 2 3 0 7 5 6 8 4', 58], 
  ['5 0 2 7 0 9 8 0 2 9', 60], 
  ['4 0 8 5 2 7 6 3 1 9', 7631], 
  ['3 5 2 0 7 8 6 1 4 9 0', 2854], 
  ['5 4 8 7 0 1 3 9 2', 710], 
  ['4 0 8 5 2 7 6 3 1 9', 63], 
  ['5 0 6 4 3 7 1 8 2 9', 823], 
  ['5 0 6 4 3 7 1 8 2 9', 18], 
  ['9 5 4 8 6 1 7 3 0 2', 61], 
  ['8 2 1 6 5 9 7 3 4 0 5', 594071], 
  ['9 6 4 0 2 5 1 7 3 8', 9017], 
  ['5 0 6 4 3 7 1 8 2 9', 80], 
  ['9 6 7 0 2 4 5 8 1 3', 48], 
  ['8 0 9 3 5 2 1 6 4 7', 21], 
  ['9 6 7 0 2 4 5 8 1 3', 58], 
  ['3 1 4 8 5 6 0 7 2', 410], 
  ['6 8 0 3 2 5 4 1 7 9', 2512], 
  ['6 2 5 3 9 8 7 4 0 1', 78], 
  ['0 2 5 4 9 6 1 8 7', 40618], 
  ['8 0 9 3 5 2 1 6 4 7', 251429], 
  ['8 1 4 9 3 2 7 0 5 6 6', 273], 
  ['3 9 7 6 2 1 4 5 8', 91], 
  ['0 2 5 4 9 6 1 8 7', 9681], 
  ['8 0 9 3 5 2 1 6 4 7', 91], 
  ['0 4 1 9 3 6 8 5 2 7', 365], 
  ['3 9 7 6 2 1 4 5 8', 91], 
  ['0 2 5 4 9 6 1 8 7', 46], 
  ['8 0 9 3 5 2 1 6 4 7', 91], 
  ['2 7 6 0 3 4 1 9 5 8 6', 17], 
  ['0 4 1 9 3 6 8 5 2 7', 8203], 
  ['8 0 9 3 5 2 1 6 4 7', 21], 
  ['8 0 9 3 5 2 1 6 4 7', 901], 
  ['9 1 5 7 4 3 2 8 6 0', 28], 
  ['2 7 6 0 3 4 1 9 5 8 6', 897], 
  ['7 4 1 2 1 7 0 5 1', 79], 
  ['8 5 2 3 0 7 9 6', 71], 
  ['6 2 5 3 9 8 7 4 0 1', 3948], 
  ['6 5 9 0 3 8 4 7 1 2 6', 4708], 
  ['0 5 9 2 6 1 3 4 8 7', 82], 
  ['3 8 4 6 9 0 7 2 1 5', 104], 
  ['2 7 6 0 3 4 1 9 5 8 6', 197], 
  ['0 2 1 9 6 4 3 5 7 8 5', 34], 
  ['7 4 1 2 1 7 0 5 1', 72], 
  ['0 5 8 4 1 6 9 7 3', 16], 
  ['3 7 6 1 5 4 2 9 0', 47], 
  ['6 2 5 3 9 8 7 4 0 1', 843], 
  ['6 5 9 0 3 8 4 7 1 2 6', 734], 
  ['8 5 2 6 7 1 3 9 4 0', 134], 
  ['4 1 6 7 8 0 3 9 2', 809], 
  ['2 7 6 0 3 4 1 9 5 8 6', 34], 
  ['9 4 6 2 8 3 0 5 7 1', 7501], 
  ['8 5 2 3 0 7 9 6', 953], 
  ['9 5 4 8 0 7 1 3 2', 60], 
  ['8 5 2 6 7 1 3 9 4 0', 134], 
  ['2 7 6 0 3 4 1 9 5 8 6', 19], 
  ['0 5 9 2 6 1 3 4 8 7', 94], 
  ['8 5 2 6 7 1 3 9 4 0', 1349], 
  ['5 8 4 3 1 0 2 6 9 7 5', 12], 
  ['9 1 5 7 4 3 2 8 6 0', 28], 
  ['0 7 8 4 5 9 2 1 3 6', 21], 
  ['8 5 2 6 7 1 3 9 4 0', 134], 
  ['3 0 4 0 3 4 0 8 2', 408], 
  ['5 8 4 3 1 0 2 6 9 7 5', 10697], 
  ['9 3 8 2 1 7 0 4 6', 937], 
  ['6 0 2 3 8 9 4 5 1 7', 192380], 
  ['6 0 2 3 8 9 4 5 1 7', 410], 
  ['6 0 2 3 8 9 4 5 1 7', 31], 
  ['6 0 2 3 8 9 4 5 1 7', 91], 
  
];

warmup.outputToFile("warmup.txt");
