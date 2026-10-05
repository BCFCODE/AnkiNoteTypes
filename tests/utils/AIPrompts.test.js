import { it, expect, describe, vi } from "vitest";
import AIPrompts from "../../utils/AIPrompts";

describe("AIPrompts", () => {
  const expectedQAMistakeAIPR =
    'QAMistakeAIPR 1>--------------------------------------------------\n\nIn "“Inn” means a small hotel or lodging place, especially in (1w) countryside.", determine whether "the" is truly the best/correct answer, and analyze why you might choose "a".\nYour goal is not only to correct the answer, but to discover the hidden English knowledge gap behind this mistake and teach you the concept needed to avoid similar mistakes in the future.\n\nRules:\n- Do NOT assume "the" is the only correct answer. Check this first.\n- If "a" is also grammatical, natural, or acceptable in another context, clearly say so and explain the difference.\n- If "the" is preferred because of context, collocation, naturalness, or the exercise\'s intended meaning, explain why.\n- Distinguish carefully between:\n  - grammar correctness\n  - meaning differences\n  - collocation and common word combinations\n  - natural/native usage\n  - context and register (formal, informal, spoken, written)\n  - the exercise\'s intended answer\n- Explain the key clue(s) in the sentence that help you choose the best answer.\n- Analyze why you might have chosen "a":\n  - What misunderstanding most likely caused this mistake?\n  - What English concept, pattern, or rule is missing?\n  - Is the problem related to grammar, vocabulary, collocation, pronunciation, word origin, Latin roots, or another language-learning aspect?\n  - Focus on the root cause, not only this single question.\n- Teach you how to recognize similar situations in future questions.\n- Prefer explaining reusable patterns instead of memorizing isolated answers.\n- Help you develop natural English intuition, not only exam-solving ability.\n\nCommunication style:\n- Speak directly to me using second person ("you", "your").\n- Always address me directly using "you" and "your".\n- Never refer to me as "the learner", "the student", or "they".\n- Avoid third-person explanations about my mistake.\n- Instead of saying:\n  "The learner needs to learn that many English verbs have fixed preposition partnerships."\n  Say:\n  "You need to learn that many English verbs have fixed preposition partnerships."\n\nOutput format:\n\nWrite the explanation naturally as a continuous response.\n\nDo NOT use headings such as:\n- "Verdict:"\n- "Why:"\n- "Hidden Learning Gap:"\n- "Learning Insight:"\n\nDo NOT use numbered sections, labels, or section titles. Write it as a natural explanation.\n\nInstead, integrate these ideas naturally into the explanation:\n- First, clearly state whether "the" is the best answer and whether "a" is wrong or simply less appropriate.\n- Then explain the difference between "the" and "a".\n- Then explain what misunderstanding caused this mistake and what concept you need to learn.\n- End with one short, highly relevant, reusable learning insight only if it genuinely helps you make better decisions in future English questions.\n- Do not label the final insight as "Learning Insight"; integrate it naturally into the final sentence or paragraph.\n- The insight may be about grammar, vocabulary, collocation, usage, pronunciation, etymology, or Latin roots.\n- Include a tiny example only if it improves understanding.\n- Do not add unrelated facts.\n- Omit the insight if there is no genuinely useful extra knowledge.\n\nLength and style:\n- Keep the explanation concise, clear, and practical.\n- Aim for under 60 seconds when read aloud.\n- Exceed 60 seconds only when genuinely necessary to explain an important distinction, hidden learning gap, or reusable English concept.\n- Never add length just for extra details.\n- Avoid unnecessary technical terminology.\n- If a technical term is used, briefly explain it.\n- Make every explanation useful for future English learning.\n\n--------------------------------------------------<QAMistakeAIPR 1\n\n';

  const expectedSentenceAIPR =
    'SentenceAIPR 1>--------------------------------------------------\n  Use "trance" in a short memorable sentence that I can use it in my English speaking in the way natives use, and also that sentence helps me to find what "trance" means in "The woman’s powerful eyes often put men in a trance." too.';

  const expectedParaphraseAIPR =
    "ParaphraseAIPR 1>--------------------------------------------------\nParaphrase the sentence below to help me learn English better.\n\nRules:\n\n* Preserve the original meaning exactly.\n* Use natural, idiomatic English that a native speaker would actually use.\n* Change the wording and, when useful, the sentence structure.\n* Do not make the sentence unnecessarily complicated.\n* Prefer useful vocabulary and grammar patterns that I can reuse in other situations.\n* Keep approximately the same level of difficulty unless a slightly more advanced version sounds significantly more natural.\n* Do not explain the changes unless I ask.\n* Return only the paraphrased sentence.\n\nSentence:\nShe is a benevolent leader who always helps people in need.\n\n\nParaphraseAIPR 2>--------------------------------------------------\nParaphrase the sentence below to help me learn English better.\n\nRules:\n\n* Preserve the original meaning exactly.\n* Use natural, idiomatic English that a native speaker would actually use.\n* Change the wording and, when useful, the sentence structure.\n* Do not make the sentence unnecessarily complicated.\n* Prefer useful vocabulary and grammar patterns that I can reuse in other situations.\n* Keep approximately the same level of difficulty unless a slightly more advanced version sounds significantly more natural.\n* Do not explain the changes unless I ask.\n* Return only the paraphrased sentence.\n\nSentence:\nThat picture of a crying child deprived of a feeling of sadness.\n\n\nParaphraseAIPR 3>--------------------------------------------------\nParaphrase the sentence below to help me learn English better.\n\nRules:\n\n* Preserve the original meaning exactly.\n* Use natural, idiomatic English that a native speaker would actually use.\n* Change the wording and, when useful, the sentence structure.\n* Do not make the sentence unnecessarily complicated.\n* Prefer useful vocabulary and grammar patterns that I can reuse in other situations.\n* Keep approximately the same level of difficulty unless a slightly more advanced version sounds significantly more natural.\n* Do not explain the changes unless I ask.\n* Return only the paraphrased sentence.\n\nSentence:\nWe had a huge banquet to celebrate the wedding.\n";

  describe("should print multiple inputs to correct output format", () => {
    it(`multipleQAMistake \n\t Q > 'There's a small tribe of people who (1w) in the mountains of Spain.' \n\t A > live \n\t Mistake > lived \n\t output should be >> "${expectedQAMistakeAIPR}"`, () => {
      const AIPRs = new AIPrompts();

      AIPRs.multipleQAMistake = [
        [
          "“Inn” means a small hotel or lodging place, especially in (1w) countryside.",
          "the",
          "a",
        ],
      ];

      const result = AIPRs.output;
      console.log(JSON.stringify(result));
      expect(result).toBe(expectedQAMistakeAIPR);
    });

    it(`multipleSentence \n\t part > "trance" \n\t context > "The woman’s powerful eyes often put men in a trance." \n\t output should be >> "${expectedSentenceAIPR}"`, () => {
      const AIPRs = new AIPrompts();

      AIPRs.multipleSentence = [
        ["trance", "The woman’s powerful eyes often put men in a trance."],
      ];

      const result = AIPRs.output;
      expect(result).toBe(expectedSentenceAIPR);
    });

    it(`multipleParaphrase \n\t part > "trance" \n\t context > "The woman’s powerful eyes often put men in a trance." \n\t output should be >> "${expectedParaphraseAIPR}"`, () => {
      const AIPRs = new AIPrompts();

      AIPRs.multipleParaphrase = [
        "She is a benevolent leader who always helps people in need.",
        "That picture of a crying child deprived of a feeling of sadness.",
        "We had a huge banquet to celebrate the wedding.",
      ];

      const result = AIPRs.output;
      // console.log(JSON.stringify(result));
      expect(result).toBe(expectedParaphraseAIPR);
    });
  });
});
