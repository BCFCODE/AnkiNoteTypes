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

export const digitMemory = new Warmup();

const inputs = [["1234", "12"]];

inputs.forEach(([number, digits, isBackward]) => {
  digitMemory.input = { number, digits, isBackward };
});

digitMemory.outputToFile();
