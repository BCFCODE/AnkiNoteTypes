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
    `John's skin was burned (2w) overdose of sunshine.`,
    'from an',
    'from'
  ],
  [
    'Deceptive means misleading or giving a false )(3w) something is really like.',
    'impression of what ',
    'impression of'
  ],
  [
    'If you describe (1w) as sheer, it is complete and total.',
    'something ',
    'someone'
  ],
  [
    'When you put an emphasis (1w) prevention, you give special attention to prevention.',
    'on',
    'to'
  ],
  [
    'We are inclined to confuse freedom and democracy, which we regard as moral principles, with the way in which these are (1w) in America—with capitalism, federalism and the two-party system, which are not moral principles, but simply the accepted practices of the American people. (James William Fulbright)',
    'practiced ',
    'practices'
  ],
  [
    'Charity is (1w) act of giving help, usually money, to those who need it.',
    'an',
    'the'
  ],
  [
    'An interval is the time between two things (1w|1.)',
    'happening',
    'happened'
  ],
  [
    'To multiply is to increase (1w) number.',
    'in',
    'a'
  ]
];

/* 
  AIPRs.Sentence = {
    part: "trance",
    context: "The woman’s powerful eyes often put men in a trance.",
  };
*/
AIPRs.multipleSentence = [
  ["wicked ", "The judge had contempt for the wicked criminal."],
  [
    "conspiracy ",
    "Some people think that there was a conspiracy to kill American president John Kennedy.",
  ],
];

// AIPRs.Paraphrase = "The painting conveys a sense of peace and warmth.";
AIPRs.multipleParaphrase = [
  "The judge had contempt for the wicked criminal.",
  "To inspire is to encourage someone by making them feel confident and eager to do something.",
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
