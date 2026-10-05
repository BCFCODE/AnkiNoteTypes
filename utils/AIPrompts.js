import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs = [];

  #counter = (i) => (Number.isInteger(i) ? " " + (i + 1) : "");

  #createQAMistakeAIPR = (Q, A, mistake, i) =>
    `QAMistakeAIPR${this.#counter(i)}>${"-".repeat(50)}

In "${Q}", determine whether "${A}" is truly the best/correct answer, and analyze why you might choose "${mistake}".
Your goal is not only to correct the answer, but to discover the hidden English knowledge gap behind this mistake and teach you the concept needed to avoid similar mistakes in the future.

Rules:
- Do NOT assume "${A}" is the only correct answer. Check this first.
- If "${mistake}" is also grammatical, natural, or acceptable in another context, clearly say so and explain the difference.
- If "${A}" is preferred because of context, collocation, naturalness, or the exercise's intended meaning, explain why.
- Distinguish carefully between:
  - grammar correctness
  - meaning differences
  - collocation and common word combinations
  - natural/native usage
  - context and register (formal, informal, spoken, written)
  - the exercise's intended answer
- Explain the key clue(s) in the sentence that help you choose the best answer.
- Analyze why you might have chosen "${mistake}":
  - What misunderstanding most likely caused this mistake?
  - What English concept, pattern, or rule is missing?
  - Is the problem related to grammar, vocabulary, collocation, pronunciation, word origin, Latin roots, or another language-learning aspect?
  - Focus on the root cause, not only this single question.
- Teach you how to recognize similar situations in future questions.
- Prefer explaining reusable patterns instead of memorizing isolated answers.
- Help you develop natural English intuition, not only exam-solving ability.

Communication style:
- Speak directly to me using second person ("you", "your").
- Always address me directly using "you" and "your".
- Never refer to me as "the learner", "the student", or "they".
- Avoid third-person explanations about my mistake.
- Instead of saying:
  "The learner needs to learn that many English verbs have fixed preposition partnerships."
  Say:
  "You need to learn that many English verbs have fixed preposition partnerships."

Output format:

Write the explanation naturally as a continuous response.

Do NOT use headings such as:
- "Verdict:"
- "Why:"
- "Hidden Learning Gap:"
- "Learning Insight:"

Do NOT use numbered sections, labels, or section titles. Write it as a natural explanation.

Instead, integrate these ideas naturally into the explanation:
- First, clearly state whether "${A}" is the best answer and whether "${mistake}" is wrong or simply less appropriate.
- Then explain the difference between "${A}" and "${mistake}".
- Then explain what misunderstanding caused this mistake and what concept you need to learn.
- End with one short, highly relevant, reusable learning insight only if it genuinely helps you make better decisions in future English questions.
- Do not label the final insight as "Learning Insight"; integrate it naturally into the final sentence or paragraph.
- The insight may be about grammar, vocabulary, collocation, usage, pronunciation, etymology, or Latin roots.
- Include a tiny example only if it improves understanding.
- Do not add unrelated facts.
- Omit the insight if there is no genuinely useful extra knowledge.

Length and style:
- Keep the explanation concise, clear, and practical.
- Aim for under 60 seconds when read aloud.
- Exceed 60 seconds only when genuinely necessary to explain an important distinction, hidden learning gap, or reusable English concept.
- Never add length just for extra details.
- Avoid unnecessary technical terminology.
- If a technical term is used, briefly explain it.
- Make every explanation useful for future English learning.

${"-".repeat(50)}<QAMistakeAIPR${this.#counter(i)}

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
    "My role at work is to check the quality of (2w|1.)",
    "the products.",
    "product.",
  ],
  [
    "I quietly passed on a hint (6w|1.)",
    "to my sister about the test.",
    "about the test to my sister.",
  ],
  ["To collaborate means to work together (1w) something.", "on", "in"],
  ["We left the fruit out too long, and (1w) spoiled.", "it", "it's"],
  ["There were a few daisies (1w) in the field.", "growing ", "grown"],
  [
    "Having plenty of clean water is necessary for the ?fare of people.",
    "wel",
    "well",
  ],
  [
    "If something is (4w|1,) has a rough texture.",
    "coarse, that means it ",
    "coarse, then it means",
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
  "She was going to bring treats to the party: cookies, muffins, cake, etc.",
  // `Vanity is excessive pride or love of one's own appearance or things one has done.`,
  // "A novelty is something that is new, original, or strange.",
  // "Unrest is a state of anger about something among the people in a place.",
  // "To manipulate something means to skillfully or unfairly control or affect it.",
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
