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
    const coloredAsterisk = this.#createColoredAsterisk("rgb(170, 255, 0);");
    return spacedNumber.replace(reg, (digit) => coloredAsterisk);
  };

  #createAnswerField = () => {
    const reg = this.#getReg(this.#digits);
    return `${this.#number}`.match(reg).join` `;
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

const digitMemory = new Warmup();

const inputs = [
  ["6 8 2 0 1 7 0 5 4 9", 70],
  ["8 4 7 4 5 7 3 8 5", 7],
  ["3 8 6 9 2 4 9 7 0", 8],
  ["6 3 8 5 1 0 2 5 3", 8510],
  ["4 0 4 7 3 4 3 2 9", 40],
  ["2 0 3 5 2 5", 2, true],
  ["0 8 6 3 6 1 3 7 9", 7],
  ["3 6 3 4 1 6 4 6 1", 6],
  ["6 8 2 0 1 7 0 5 4 9", 75],
  ["5 4 2 5 2 1", 25, true],
  ["3 2 8 4 5 0 6 2", 5062],
  ["3 8 6 9 2 4 9 7 0", 87],
  ["7 9 5 9 8 1 9 1", 19],
  ["7 6 1 0 7 8 6 9 0", 869],
  ["9 4 5 0 7 1 0 2 8 6", 108],
  ["6 7 8 0 9 6 2 4 8", 706],
  ["4 0 4 7 3 4 3 2 9", 43],
  ["6 4 3 2 5", 28, true],
  ["9 7 3 4 1 2 0 2 5 8", 123],
  ["3 6 3 4 1 6 4 6 1", 76],
  ["6 8 2 0 1 7 0 5 4 9", 64],
  ["7 6 1 0 7 8 6 9 0", 16],
  ["7 9 5 9 8 1 9 1", 519],
  ["6 7 8 0 9 6 2 4 8", 248],
  ["9 2 0 8 9 0 7 2 0 5", 208],
  ["6 7 2 6 5 8 7 1 4", 65],
  ["9 7 3 4 1 2 0 2 5 8", 12],
  ["8 4 7 4 5 7 3 8 5", 57],
  ["3 6 1 0 7 0 6 3 9", 106],
];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
