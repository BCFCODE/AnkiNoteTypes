import { it, describe, vi, expect } from "vitest";
import DigitMemory from "../../utils/DigitMemory";

describe("DigitMemory", () => {
  const digitMemory = new DigitMemory();
  digitMemory.number = 4531071;
  digitMemory.digits = 317;

  const correctReturnValue = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

  it(`const digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.digits = 317;\n\tdigitMemory.output >> ${JSON.stringify(correctReturnValue)}`, () => {
    const result = digitMemory.output;
    expect(result).toBe(JSON.stringify(correctReturnValue));
  });

  it("should have output property", () => {
    expect(digitMemory).toHaveProperty("output");
  });
});
