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
    "If someone is neutral, then they do not help either of (2w) fighting sides.",
    "the two",
    "two"
  ],
  [
    'An incentive is what (4w) to do something.',
    'makes a person want',
    'make a person wants'
  ],
  [
    'The cat slowly crept (2w) tree.', 
    'down the',
    'down on the'
  ],
  [
    'The boy grabbed his shovel and got all of the snow (1w) of the sidewalk.',
    'off',
    "without 'off'"
  ],
  [
    'A continent is one of the seven large areas of (1w) on the Earth.',
    'land',
    'lands'
  ],
  [
    'When something is spatial, (2w) to the position and size of things.',
    'it relates',
    'it is related'
  ],
  [
    `By using calculus, scientists (1w) small changes in the stars' brightness.`,
    'determined ',
    'determines'
  ],
  [
    'A hospital is where sick or hurt people (1w) care or treatment.',
    'receive',
    'received'
  ],
  [
    'In anthropology class, I learned about (2w) that ancient cultures used.',
    'simple tools',
    'the simple tools'
  ]
];

/* 
  AIPRs.Sentence = {
    part: "trance",
    context: "The woman’s powerful eyes often put men in a trance.",
  };
*/
AIPRs.multipleSentence = [
  [
    "trait ",
    "If something is hereditary, it is a trait passed onto children from their parents.",
  ],
  [
    'ground',
    'A mill is a building in which wheat is ground into flour.'
  ],
  [
    'impulse',
    'Because of the scary noise, she had an impulse to run somewhere and hide.'
  ],
  [
    'tenacious',
    `I'm sure that he'll finish that difficult sale. He is very tenacious.`
  ],
  [
    'overboard',
    'Tom and Gary slipped on the wet floor and fell overboard.'
  ]
];

AIPRs.outputToFile("AIPRs.txt");

/* 
  TongueTwister:
    AIPR: give me a tongue twister and its meaning to help me speed up my English speaking
  Idiom:
    AIPR: give me a practical and common idiom that natives use in their conversations, and tell me when and where I can use it and where it comes from? what is its story?
*/
