import Utils from ".";

class Random extends Utils {
  #output = [];
  #numberOfDigits;
  #isBackward;
  #numberOfOutputs;
  #number;

  set config({ numberOfDigits = 4, isBackward = false, numberOfOutputs = 10 }) {
    this.#numberOfDigits = numberOfDigits;
    this.#isBackward = isBackward;
    this.#numberOfOutputs = numberOfOutputs;
  }

  #getRandomNumber = () => {
    this.#output = [];
    let digits = "";
    for (let i = 0; i < this.#numberOfDigits; i++) {
      if (digits === "") digits = "1234567890"
      const randomIndex = Math.floor(Math.random() * digits.length);
      const chosenDigit = digits[randomIndex];
      digits = digits.replace(this.getReg(chosenDigit), "");
      this.#output.push(chosenDigit);
    }
    this.#number = this.#output.join``;
  };

  #createFrontField = () => {
    const spacedNumber = this.addSpaceBetweenDigits(this.#number);
    return `<span style="opacity: 0">${spacedNumber}</span>`;
  };

  #createAnswerField = () => {
    const spacedNumber = this.addSpaceBetweenDigits(this.#number);
    const coloredNumber = this.addColorToEachDigit(spacedNumber);
    return coloredNumber;
  };

  #createTTSFront = () => {
    if (this.#isBackward) {
      const reversedNumber = this.reverseDigits(this.#number);
      return this.addSpaceBetweenDigits(reversedNumber);
    }
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createTTSBackField = () => {
    return this.addSpaceBetweenDigits(this.#number);
  };

  #createTagsField = () =>
    this.createTagsField(this.#numberOfDigits, this.#isBackward);

  #createAnkiCard = () => {
    this.#getRandomNumber();
    const Front = this.#createFrontField()
    const Answer = this.#createAnswerField();
    const Back = null;
    const Image = null;
    const AudioBothSides = null;
    const AudioFront = null;
    const AudioBack = null;
    const VideoFront = null;
    const VideoBack = null;
    const Links = null;
    const TTSFront = this.#createTTSFront();
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
  };

  #createOutput = () => {
    const ankiCards = [];
    for (let i = 0; i < this.#numberOfOutputs; i++) {
      const newAnkiCard = this.#createAnkiCard();
      ankiCards.push(newAnkiCard);
    }
    this.#output = ankiCards.join`\n`;
  };

  get output() {
    this.#createOutput();
    return this.#output;
  }
}

const random = new Random();

random.config = {
  numberOfDigits: 7 ,
  isBackward: true,
  numberOfOutputs: 5,
};

random.outputToFile("random.txt");

export default Random;
