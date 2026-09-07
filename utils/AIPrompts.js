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
    'She opened the curtains to let (1w) into the room.',
    'light',
    'lights'
  ],
  [
    'Santa Claus proposed that I (1w) to be a good boy all year.',
    'try ',
    'tried'
  ],
  [
    'Sometimes (4w) bed because I am not tired.',
    'I lay awake in ',
    'I lay away from my'
  ],
  [
    'Sometimes I lay awake (2w) because I am not tired.',
    'in bed ',
    'in my bed '
  ],
  [
    'Hygiene is (2w) or methods needed for health and cleanliness.',
    'the conditions ',
    'the the conditions '
  ],
  [
    'A standard is what people (1w) normal or good.',
    'consider ',
    'considered'
  ],
  [
    `A sector is a part of a country's economy in (1w) specific type of industry.`,
    'a',
    'the'
  ],
  [
    'Preserved (2w) in good condition or prevented from spoiling, especially so it can last longer.',
    'means kept ',
    'means to kept '
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
    "rituals",
    "Ken was very interested to learn about the religious rituals of the natives."
  ],
  [
    'capitalism',
    'Most industries in the world today are based on capitalism.'
  ],
  [
    'symptom ',
    'A symptom of a bad condition or illness is a sign that it is happening.'
  ],
  [
    'notorious',
    'When something is notorious, it is well known because of something bad.'
  ],
  [
    'commute ',
    'I usually commute to work on a train.'
  ],
  [
    'ethics',
    `The act of stealing certainly doesn't go against some people's ethics.`
  ],
  [
    'revenue',
    `The new products really increased the business's monthly revenue.`
  ],
  [
    'primeval ',
    'Whatever interrupts the even flow and luxurious monotony of organic life is odious to the primeval animal.'
  ],
  [
    'slippery',
    'The repairman fell down on the floor because it was too slippery.'
  ]
];

AIPRs.outputToFile("AIPRs.txt");

/* 
  TongueTwister:
    AIPR: give me a tongue twister and its meaning to help me speed up my English speaking
  Idiom:
    AIPR: give me a practical and common idiom that natives use in their conversations, and tell me when and where I can use it and where it comes from? what is its story?
*/
