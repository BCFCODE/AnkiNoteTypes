import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs = [];

  #counter = (i) => (Number.isInteger(i) ? " " + (i + 1) : "");

  #createQAMistakeAIPR = (Q, A, Mistake, i) =>
    `QAMistakeAIPR${this.#counter(i)}>${"-".repeat(50)}
  in "${Q}" how to find the only right answer is "${A}" and not "${Mistake}"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don't know in order to make my English better than before. Consider that I want to use it on Back field of my anki card as English tip or lesson.`;

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
    `SentenceAIPR${this.#counter(i)}>${"-".repeat(50)}
  Use "${part}" in a short memorable sentence that I can use it in my English speaking in the way natives use, and also that sentence helps me to find what "${part}" means in "${context}" too.`;

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
/* 
  ADD THIS PART: 
   Preserve the original meaning exactly and consider I don't know what (your word) means in this sentence, make your sentence to help me find out.
*/
  #createParaphraseAIPR = (sentence, i) =>
    `ParaphraseAIPR${this.#counter(i)}>${"-".repeat(50)}
Paraphrase the sentence below to help me learn English better.

Rules:

* Preserve the original meaning exactly.
* Use natural, idiomatic English that a native speaker would actually use.
* Change the wording and, when useful, the sentence structure.
* Do not make the sentence unnecessarily complicated.
* Prefer useful vocabulary and grammar patterns that I can reuse in other situations.
* Keep approximately the same level of difficulty unless a slightly more advanced version sounds significantly more natural.
* Do not explain the changes unless I ask.
* Return only the paraphrased sentence.

Sentence:
${sentence}
`;

  set Paraphrase(sentence) {
    const AIPR = this.#createParaphraseAIPR(sentence);
    this.#multipleInputs.push(AIPR);
  }

  set multipleParaphrase(inputs) {
    inputs.forEach((sentence, i) => {
      const AIPR = this.#createParaphraseAIPR(sentence, i);
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
    'Vanity is an excessive feeling (1w) being proud of yourself, especially about your appearance or the things you have done.',
    'of',
    'about'
  ],
  [
    'When something is toxic, it is poisonous and very (1w|1.)',
    'dangerous.',
    'danger.'
  ],
  [
    'If (1w) is susceptible to something like a disease, they are easily harmed by it.',
    'one',
    'someone'
  ],
  [
    'When someone is envious, they want something (1w) another person has.',
    'that',
    "without 'that'"
  ],
  [
    'If something is sacred, then (2w) worshipped and respected.',
    'it is', 
    'they are'
  ],
  [
    'Along means to (1w) from one part of a road, river etc. to another.',
    'move',
    'go'
  ],
  [
    'A component is a part of a (1w) machine.',
    'larger',
    'large'
  ],
  [
    'A grain is a food (1w) such as wheat, corn, rice, or oats.',
    'crop ',
    'crops'
  ],
  [
    'To warn someone is to make them know (1w) possible danger in the future.',
    'of',
    "without 'of'"
  ],
  [
    'When something is habitual, it is a behavior that (2w) usually does or has.',
    'a person ',
    'someone'
  ],
  [
    'When something is (1w|1,) it has been owned by someone else.',
    'secondhand,',
    'second-hand,'
  ],
  [
    'To found something on an idea or (1w) is to base it on that idea.',
    'principal ',
    'principle'
  ],
  [
    'To equate one thing (1w) another is to compare them and consider them very similar.',
    'with', 
    'to'
  ],
  [
    'To search for something or someone means to look for (1w) carefully.',
    'them',
    'it '
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
    "point out ",
    "When we indicate something, we show or point out our thoughts or plans.",
  ],
];

// AIPRs.Paraphrase = "The painting conveys a sense of peace and warmth.";
AIPRs.multipleParaphrase = [
  `Vanity is excessive pride or love of one's own appearance or things one has done.`,
  'A novelty is something that is new, original, or strange.',
  'Unrest is a state of anger about something among the people in a place.',
  'To manipulate something means to skillfully or unfairly control or affect it.'
  // "The judge had contempt for the wicked criminal.",
  // "To inspire is to encourage someone by making them feel confident and eager to do something.",
  // 'Courtesy is the excellence of manners or social conduct.'
  // "She is a benevolent leader who always helps people in need.",
  // "That picture of a crying child deprived of a feeling of sadness.",
  // "We had a huge banquet to celebrate the wedding.",
];

AIPRs.outputToFile("AIPRs.txt");

/* 
  TongueTwister:
    AIPR: give me a tongue twister and its meaning to help me speed up my English speaking
  Idiom:
    AIPR: give me a practical and common idiom that natives use in their conversations, and tell me when and where I can use it and where it comes from? what is its story?
*/
