import { it, describe, vi, expect } from "vitest";
import { Warmup } from "../../utils/DigitMemory";

describe("DigitMemory", () => {
  it(`const digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\t digitMemory.input = { number: 4531071, digits: 317 };`, () => {
    const digitMemory = new Warmup();
    digitMemory.input = { number: 4531071, digits: 317 };

    const Front = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

    const Answer = "3 1 7 1";

    const TTSFront = "4 5 3 1 0 7 1";

    const TTSBack = "4 5 3 1 0 7 1";

    const Tags = "Memo DigitMemory Warmup Forward 7Digits";

    const correctOutput = [Front, Answer, TTSFront, TTSBack, Tags].join`|`;
    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
  });

  it("should have reversed Front field digits and Backward tag if isBackward flag is true", () => {
    const digitMemory = new Warmup();
    digitMemory.input = { number: 4531071, digits: 317, isBackward: true };

    const Front = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

    const Answer = "3 1 7 1";

    const TTSFront = "1 7 0 1 3 5 4";

    const TTSBack = "4 5 3 1 0 7 1";

    const Tags = "Memo DigitMemory Warmup Backward 7Digits";

    const correctOutput = [Front, Answer, TTSFront, TTSBack, Tags].join`|`;

    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
    expect(Tags).not.toMatch(/Forward/);
  });
});
