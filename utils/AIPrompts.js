import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs = [];

  #counter = (i) => (Number.isInteger(i) ? " " + (i + 1) : "");

  #createQAMistakeAIPR = (Q, A, Mistake, i) =>
    `QAMistakeAIPR${this.#counter(i)}: in "${Q}" how to find the only right answer is "${A}" and not "${Mistake}"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don't know in order to make my English better than before. Consider that I want to use it on Back field of my anki card as English tip or lesson.`;

  set QAMistake({ Q, A, Mistake }) {
    const AIPR = this.#createQAMistakeAIPR(Q, A, Mistake);
    this.#multipleInputs.push(AIPR);
  }

  set multipleQAMistake(inputs) {
    inputs.forEach(([Q, A, Mistake], i) => {
      const AIPR = this.#createQAMistakeAIPR(Q, A, Mistake, i);
      this.#multipleInputs.push(AIPR);
    });
  }

  #createSentenceAIPR = (part, context, i) =>
    `SentenceAIPR${this.#counter(i)}: Use "${part}" in a short memorable sentence that I can use it in my English speaking in the way natives use, and also that sentence helps me to find what "${part}" means in "${context}" too.`;

  set Sentence({ part, context }) {
    const AIPR = this.#createSentenceAIPR(part, context);
    this.#multipleInputs.push(AIPR);
  }

  set multipleSentence(inputs) {
    inputs.forEach(([part, context], i) => {
      const AIPR = this.#createSentenceAIPR(part, context, i);
      this.#multipleInputs.push(AIPR);
    });
  }

  #createOutput() {
    return this.#multipleInputs.join`\n\n`;
  }

  get output() {
    return this.#createOutput();
  }
}

export const AIPRs = new AIPrompts();
/* 
  AIPRs.QAMistake = {
    Q: "“Inn” means a small hotel or lodging place, especially in (1w) countryside.",
    A: "the",
    Mistake: "a",
  };
*/
AIPRs.multipleQAMistake = [
  [
    "“Inn” means a small hotel or lodging place, especially in (1w) countryside.",
    "the",
    "a",
  ],
];

/* 
  AIPRs.Sentence = {
    part: "trance",
    context: "The woman’s powerful eyes often put men in a trance.",
  };
*/
AIPRs.multipleSentence = [
  ["trance", "The woman’s powerful eyes often put men in a trance."],
];

AIPRs.outputToFile("AIPRs.txt");

/* 
  Sentence:
    AIPR: Use "" in a short memorable sentence that I can use it in my English speaking in the way natives use, and I find what it means in t his context: 
  TongueTwister:
    AIPR: give me a tongue twister and its meaning to help me speed up my English speaking
  Idiom:
    AIPR: give me a practical and common idiom that natives use in their conversations, and tell me when and where I can use it and where it comes from? what is its story?
*/
