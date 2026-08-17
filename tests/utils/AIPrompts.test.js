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
        `AIPR 0: in "There's a small tribe of people who (1w) in the mountains of Spain." how to find the only right answer is "live" and not "lived"? is it??`,
      );
    });
  });
});
