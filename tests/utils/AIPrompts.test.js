import { it, expect, describe, vi } from "vitest";
import AIPrompts from "../../utils/AIPrompts";

describe("AIPrompts", () => {
  describe("should print multiple inputs to correct output format", () => {
    it(`Q > 'There's a small tribe of people who (1w) in the mountains of Spain.' \n\t A > live \n\t error > lived \n\t output should be >> "AIPR 0: in "There's a small tribe of people who (1w) in the mountains of Spain." how to find the only right answer is "live" and not "lived"? is it??"`, () => {
      const AIPRs = new AIPrompts();

      AIPRs.multipleInputs = [
        [
          `There's a small tribe of people who (1w) in the mountains of Spain.`,
          "live",
          "lived",
        ],
      ];

      const result = AIPRs.output;
      expect(result).toBe(
        `QAErrorAIPR 1: in "There's a small tribe of people who (1w) in the mountains of Spain." how to find the only right answer is "live" and not "lived"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don't know in order to make my English than before. Consider that I want to use it on Back field of my anki card.`,
      );
    });
  });
});
