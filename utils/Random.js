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
      if (digits === "") digits = "1234567890";
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

    const finalCard = `<div style="text-align: center; margin: 30px 0; font-family: system-ui, sans-serif;"><h2 style="color: #00ff9d; text-shadow: 0 0 20px rgba(0, 255, 157, 0.6); margin-bottom: 12px;">🎉 Congratulations! 🎉</h2><p style="color: #e0e0e0; font-size: 1.15rem; margin: 10px 0 25px 0;">You finished all the cards!<br><span style="color: #ffd700;">Ready to add new ones?</span></p><p style="color: #888; font-size: 0.95rem;">Created by <a href="https://x.com/bcfcode" target="_blank" style="color: #00ddff; text-decoration: none;">Morteza Bakhshandeh (@bcfcode)</a> © 2026<br><a href="https://www.bcfcode.com" target="_blank" style="color: #00aaff; text-decoration: none;">www.BCFCODE.com</a></p></div>`;

    ankiCards.push(finalCard);
    this.#output = ankiCards.join`\n`;
  };

  get output() {
    this.#createOutput();
    return this.#output;
  }
}

const random = new Random();

random.config = {
  numberOfDigits: 8,
  isBackward: false,
  numberOfOutputs: 100,
};

random.outputToFile("random.txt");

export default Random;
