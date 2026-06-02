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

  #createCongratulationCard = () => {
    return `
<div style="text-align: center; margin: 30px 0; font-family: system-ui, sans-serif;">
  <h2 style="color: #00ff9d; text-shadow: 0 0 20px rgba(0, 255, 157, 0.6); margin-bottom: 12px;">
    🎉 Congratulations! 🎉
  </h2>

  <p style="color: #e0e0e0; font-size: 1.15rem; margin: 10px 0 25px 0;">
    You finished all the cards!
    <br>
    <span style="color: #ffd700;">Ready to add new ones?</span>
  </p>

  <div style="
    margin: 25px auto;
    max-width: 650px;
    padding: 18px 22px;
    border-radius: 14px;
    background: rgba(0,255,157,0.08);
    border: 1px solid rgba(0,255,157,0.25);
    box-shadow: 0 0 25px rgba(0,255,157,0.12);
  ">
    <p style="color: #d7fdf0; font-size: 1rem; line-height: 1.7; margin: 0;">
      📚 On <span style="color:#00ff9d; font-weight:700;">${this.currentFormattedDate}</span>,
      you imported <span style="color:#ffd700; font-weight:700;">${this.#numberOfOutputs} new cards</span>.
      <br>
      Today, you completed <span style="color:#00ff9d; font-weight:700;">every single one of them</span>.
      <br><br>
      Consistency beats motivation. Keep showing up, and your future self will thank you.
      🚀
    </p>
  </div>

  <p style="color: #888; font-size: 0.95rem;">
    Created by
    <a href="${this.twitterUrl}" target="_blank" style="color: #00ddff; text-decoration: none;">
      ${this.authorName}
    </a>
    © ${this.currentYear}
    <br>
    <a href="${this.websiteUrl}" target="_blank" style="color: #00aaff; text-decoration: none;">
      Click here to visit my website!
    </a>
    <br>
    <a href="${this.githubUrl}" target="_blank" style="color: #00cc88; text-decoration: none;">
      ⭐ Star on GitHub
    </a>
  </p>
</div>
|||||||||||||${this.#createTagsField()}
`.replace(/\n/g, "");
  };

  #createOutput = () => {
    const ankiCards = [];
    for (let i = 0; i < this.#numberOfOutputs; i++) {
      const newAnkiCard = this.#createAnkiCard();
      ankiCards.push(newAnkiCard);
    }

    const finalCard = this.#createCongratulationCard();

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
  isBackward: true,
  numberOfOutputs: 30,
};

random.outputToFile("random.txt");

export default Random;
