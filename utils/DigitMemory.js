import fs from "fs";

export class Warmup {
  #isBackward = false;
  #multipleInputs = [];
  #number;
  #digits;

  #inputValidation = (obj) => {
    for (const property in obj) {
      const propsThatShouldHaveNumberType = ["number", "digits"];
      propsThatShouldHaveNumberType.forEach((numberProp) => {
        if (property === numberProp && typeof obj[property] === "string") {
          const convertedNumber = Number(obj[numberProp].replace(/\s/g, ""));
          if (isNaN(convertedNumber))
            throw new Error(
              `Your ${property} input property (${obj[property]}) is invalid, it must be a number or a string that can be converted to a number.`,
            );
          obj[numberProp] = Number(obj[numberProp].replace(/\s/g, ""));
        }
      });
    }
  };

  set input(obj) {
    this.#inputValidation(obj);
    this.#multipleInputs.push(obj);
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
    if (!reg.test(spacedNumber)) return "";
    const coloredAsterisk = this.#createColoredAsterisk("rgb(170, 255, 0);");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createAnswerField = () => {
    const reg = this.#getReg(this.#digits);
    const answerFieldDigits = `${this.#number}`.match(reg);
    if (answerFieldDigits === null) return this.#addSpace(this.#number);

    return answerFieldDigits.join` `;
  };

  #createTTSFrontField = () => {
    if (this.#isBackward) {
      const reversedNumber = [...this.#number.toString()].reverse().join``;
      return this.#addSpace(reversedNumber);
    }
    return this.#addSpace(this.#number);
  };

  #createTTSBackField = () => {
    return this.#addSpace(this.#number);
  };

  #createNumberOfDigitsTag = () => {
    const numberOf = this.#number.toString().length;
    return `${numberOf}Digits`;
  };

  #createTagsField = () => {
    const nOfDigitsTag = this.#createNumberOfDigitsTag();
    const directionTag = this.#isBackward ? "Backward" : "Forward";
    return `Memo DigitMemory Warmup ${directionTag} ${nOfDigitsTag}`;
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
  ["6 5 8 9 0 5 4 2", 85],
  ["2 7 5 3 7 3 1 7 5 4", 734],
  ["2 7 5 3 7 3 1 7 5 4", 75],
  ["6 5 8 9 0 5 4 2", 582],
  ["2 7 5 3 7 3 1 7 5 4", 352],
  ["2 7 5 3 7 3 1 7 5 4", 731],
  ["6 5 8 9 0 5 4 2", 54],
  ["2 7 5 3 7 3 1 7 5 4", 73],
  ["2 7 5 3 7 3 1 7 5 4", 735],
  ["8 5 2 0 2 1 4 3 7 9", 4120],
  ["3 2 0 7 4 5 8", 40, true],
  ["3 2 0 7 4 5 8", 50, true],
  ["5 6 3 1 7 1 9 3 4 6", 17],
  ["8 2 4 8 7 6 8 3 6", 8795],
  ["6 3 8 5 1 0 2 5 3", 8510],
  ["4 0 8 9 5 3 8 0", 8953],
  ["5 6 3 1 7 1 9 3 4 6", 945],
  ["8 4 7 4 5 7 3 8 5", 78],
  ["5 6 3 1 7 1 9 3 4 6", 14],
  ["5 8 9 1 8 7 3 8 5 9", 59],
  ["2 7 5 3 7 3 1 7 5 4", 73542],
  ["5 6 3 1 7 1 9 3 4 6", 194],
  ["5 8 9 1 8 7 3 8 5 9", 591],
  ["5 8 2 1 6 7 3 1 7", 731],
  ["2 6 5 4 8 4 3 8 0", 84],
  ["8 4 1 2 9 7", 47, true],
  ["3 2 8 2 1 3 2 8 5", 1328],
  ["6 4 3 9 1 7 1 3 6 5", 1],
  ["2 7 5 3 7 3 1 7 5 4", 173],
  ["7 4 1 2 1 7 0 5 1", 75],
  ["9 7 1 7 9 1 7 8", 91],
  ["5 8 2 1 6 7 3 1 7", 873],
  ["5 8 9 1 8 7 3 8 5 9", 5],
  ["2 3 4 2 0 1 3 8 9 1", 10],
  ["2 7 5 3 7 3 1 7 5 4", 5],
  ["1 7 5 9 1 6 3", 19, true],
  ["5 8 2 1 6 7 3 1 7", 23],
  ["5 8 9 1 8 7 3 8 5 9", 15],
  ["6 4 3 9 1 7 1 3 6 5", 16],
  ["9 7 3 4 1 2 0 2 5 8", 302],
  ["4 2 4 1 3 9 7", 3],
  ["7 4 1 2 1 7 0 5 1", 1217],
  ["5 8 2 1 6 7 3 1 7", 317],
  ["5 8 9 1 8 7 3 8 5 9", 51],
  ["6 4 3 9 1 7 1 3 6 5", 19],
  ["9 7 3 4 1 2 0 2 5 8", 30],
  ["9 0 2 1 9 2 9 4", 5],
  // ['2 3 4 2 0 1 3 8 9 1', 20],
  // ['0 4 3 0 8 2 5 7', 4],
  // ['9 7 3 4 1 2 0 2 5 8', 30],
  // ['7 1 9 7 5 7 2 8', 13],
  // ['6 4 3 9 1 7 1 3 6 5', 139],
  // ['5 8 9 1 8 7 3 8 5 9', 59],
  // ['9 7 3 4 1 2 0 2 5 8', 30],
  // ['7 4 1 2 1 7 0 5 1', 751],
  // ['6 4 3 9 1 7 1 3 6 5', 16],
  // ['4 0 9 7 9 4 0 5 1', 405],
  // ['8 7 9 0 5 1 2 7 3 3', 691],
  // ['3 6 3 7 4 4 7 0 4', 70],
  // ['7 0 8 6 4 2 6', 6842],
  // ['8 4 8 7 2 4 6 0', 76]
];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
