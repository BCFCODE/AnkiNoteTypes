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
    'A contingent is a (2w) people that are part of a larger group.',
    'part', 
    'set'
  ],
  [
    `John's skin was burned (2w) overdose of sunshine.`,
    'from an',
    'from the'
  ],
  [
    'Mike was upset because of the omission of his name during (1w) ceremony.',
    'the',
    "without 'the'"
  ],
  [
    'To sting is to cause pain by pushing (2w) part into the skin.',
    'a sharp ',
    'the hard'
  ],
  [
    'A field is (1w) subject that people study or an area of activity that they are involved in as part of their work.',
    'a',
    'the'
  ],
  [
    'To manipulate something means (2w) or unfairly control or affect it.',
    'to skillfully ',
    'skillfully '
  ],
  [
    'To chew is to (2w) food by using the mouth and teeth.',
    'break up ' ,
    'break of'
  ],
  [
    'Leather is a material made from animal skin that is used (2w) clothing.',
    'to make ',
    'for'
  ],
  [
    `A temper is someone's mood or (2w) that they might get angry.`,
    'a chance ',
    'chance '
  ],
  [
    'Dignity is the ability (2w) calm and worthy of respect.',
    'to be', 
    'to'
  ],
  [
    'To critique (2w) an opinion about the good and the bad parts of something.',
    'means express ',
    'means to express '
  ],
  [
    'To flank is to be (1w) at the side of something or someone.',
    'positioned ',
    'position'
  ],
  [
    'Peas are a vegetable that (1w) small, round, and green.', 
    'is', 
    'are '
  ],
  [
    'A review of something is a formal inspection of it by people in (1w|1.)',
    'authority.',
    'society'
  ],
  [
    'The teacher degraded Bob when (1w) announced his poor performance to the class.',
    'she',
    'he'
  ],
  [
    'If someone is pessimistic, they believe that the (1w) will happen.',
    'worst ', 
    'worse '
  ],
  [
    'When something happened prior to something else, it happened (1w|1.)',
    'earlier.',
    'early'
  ],
  [
    'The air was thin (1w) such a high altitude on the mountain.', 
    'at',
    "without 'at'"
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
