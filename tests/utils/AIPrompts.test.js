import { it, expect, describe, vi } from "vitest";
import AIPrompts from "../../utils/AIPrompts";

describe("AIPrompts", () => {
  const expectedQAMistakeAIPR =
    'QAMistakeAIPR 1>--------------------------------------------------\n  in "“Inn” means a small hotel or lodging place, especially in (1w) countryside." how to find the only right answer is "the" and not "a"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don\'t know in order to make my English better than before. Consider that I want to use it on Back field of my anki card as English tip or lesson.';

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
      console.log(JSON.stringify(result));
      expect(result).toBe(expectedParaphraseAIPR);
    });
  });
});
