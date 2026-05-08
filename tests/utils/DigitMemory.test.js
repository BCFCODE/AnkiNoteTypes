import { it, describe, vi, expect } from "vitest";
import DigitMemory from "../../utils/DigitMemory";

describe("DigitMemory", () => {
  const digitMemory = new DigitMemory();
  digitMemory.number = 4531071;
  digitMemory.digits = 317;

  const Front = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

  const Answer = "3 1 7 1";

  const TTSFront = "4 5 3 1 0 7 1";

  const TTSBack = "4 5 3 1 0 7 1";

  const Tags = "Memo DigitMemory Warmup Forward 7Digits";

  const correctOutput =
    [Front, Answer, TTSFront, TTSBack, Tags].map((str) => JSON.stringify(str))
      .join`, ` + "\n";

  it(`const digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.digits = 317;\n\tdigitMemory.output >> ${correctOutput}`, () => {
    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
  });

  it("should have reversed Front field digits and Backward tag if isBackward flag is true", () => {
    digitMemory.isBackward = true;
    const reversedTTSFront = "1 7 0 1 3 5 4";
    const Tags = "Memo DigitMemory Warmup Backward 7Digits";
    const correctOutput =
      [Front, Answer, reversedTTSFront, TTSBack, Tags].map((str) =>
        JSON.stringify(str),
      ).join`, ` + "\n";

    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
    expect(Tags).not.toMatch(/Forward/);
  });

  it("should have output property", () => {
    expect(digitMemory).toHaveProperty("output");
  });


});
