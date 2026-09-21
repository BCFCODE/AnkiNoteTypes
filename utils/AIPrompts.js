import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs = [];

  #counter = (i) => (Number.isInteger(i) ? " " + (i + 1) : "");

  #createQAMistakeAIPR = (Q, A, mistake, i) =>
    `QAMistakeAIPR${this.#counter(i)}>${"-".repeat(50)}

In "${Q}", determine whether "${A}" is truly the only correct answer, and explain why "${mistake}" is wrong, less natural, or less appropriate.

Rules:
- Do NOT assume "${A}" is the only correct answer. Check this first.
- If "${mistake}" is also grammatical or natural, say so clearly and explain the difference.
- Distinguish grammar, meaning, collocation, naturalness, and the exercise's intended answer.
- Explain the key clue that lets a learner choose the best answer.
- Keep the entire explanation under 60 seconds when read aloud.
- Only if it adds genuinely useful new knowledge, give ONE concise grammar, usage, or Latin tip for the Anki Back field; otherwise omit the tip.
- Make the explanation clear, practical, and reusable for future English questions.
`;

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
    "Insomnia is a condition in which a person has (1w) sleeping.",
    "difficulty ",
    "a difficult",
  ],
  [
    "To (2w) or something is to have an influence over them.",
    "affect someone ",
    "affect to someone ",
  ],
  [
    "To affect someone or something is to have (1w) influence over them.",
    "an",
    "without 'an'",
  ],
  [
    "A shiver is a shaking movement the body makes when someone (1w) cold or scared.",
    "is",
    "feels",
  ],
  [
    "If someone is skillful at something, they are very good at (1w) it.",
    "doing",
    "without 'doing'",
  ],
  [
    "To adhere means to act in the way that a rule or (1w) says is right.",
    "agreement ",
    "idea",
  ],
  [
    "A choir is a group of people who (1w) together.",
    "sing",
    'sings (may be because of "a group")',
  ],
  [
    "A parade is a series of things or people that come or are shown (2w) another.",
    "one after",
    "after one",
  ],
  [
    "To con someone is to trick that person into (1w) something or giving up money.",
    "doing",
    "without 'doing'",
  ],
  [
    "When a poem is considered lyric, it (1w) a lot of emotion.",
    "expresses ",
    "consists",
  ],
  [
    "A rite is a traditional ceremony (2w) by a particular group or society.",
    "carried out ",
    "carried",
  ],
  [
    "(3w) deliberate murder of a whole group or race of people.",
    "Genocide is the ",
    "Genocide a the ",
  ],
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
  "A novelty is something that is new, original, or strange.",
  "Unrest is a state of anger about something among the people in a place.",
  "To manipulate something means to skillfully or unfairly control or affect it.",
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
