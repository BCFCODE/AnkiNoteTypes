import fs from "fs";

export class Warmup {
  #color = 
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
        const TTSFront = this.#createTTSFrontField();
        const TTSBack = this.#createTTSBackField();
        const Tags = this.#createTagsField();
        return [Front, Answer, TTSFront, TTSBack, Tags].join`|`;
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
  ["4 7 8 7 5 3 0 2 1", 53],
  ["4 9 4 1 7", 19, true],
  ["5 9 3 9 8 5 1 6 9", 13],
  ["6 5 8 7 3 6 4 0", 430],
  ["4 0 4 7 3 4 3 2 9", 43],
  ["9 1 4 9 0 9 1", 19],
  ["0 4 3 0 8 2 5 7", 8342],
  ["5 9 7 9 4 5 6 1 6", 451],
  ["8 5 2 0 2 1 4 3 7 9", 3],
  ["6 9 4 9 7 4 1", 1],
  ["6 8 9 2 8 0 8", 820],
  ["4 1 5 4 5 7 6 8", 5478],
  ["9 8 5 6 1 8", 951, true],
  ["3 8 6 9 2 4 9 7 0", 87],
  ["6 2 6 1 6 2 5 3 7", 925],
];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
