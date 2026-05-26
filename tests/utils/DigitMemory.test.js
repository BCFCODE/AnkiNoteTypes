import { it, describe, vi, expect } from "vitest";
import { Warmup } from "../../utils/DigitMemory";

describe("DigitMemory", () => {
  const Back = null;
  const Image = null;
  const AudioBothSides = null;
  const AudioFront = null;
  const AudioBack = null;
  const VideoFront = null;
  const VideoBack = null;
  const Links = null;
  const FrontPersian = null;

  describe("input cleaners (clean input before use)", () => {
    it.each([
      {
        number: "13 u 8 a *",
        digits: 3417,
        expectedResult: `<span style="color: rgb(170, 255, 0);">*</span> 3 8|1|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits *\n1 <span style="color: rgb(170, 255, 0);">*</span> 8|3|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits *\n<span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 8|1 3|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits **`,
      },
      {
        number: 4531071,
        digits: "3@ 1d7g 9 d",
        expectedResult: `4 5 3 <span style="color: rgb(170, 255, 0);">*</span> 0 7 <span style="color: rgb(170, 255, 0);">*</span>|1 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **\n4 5 <span style="color: rgb(170, 255, 0);">*</span> 1 0 7 1|3|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 3 1 0 <span style="color: rgb(170, 255, 0);">*</span> 1|7|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>|3 1 7 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`,
      },
    ])(
      `should work with unclean inputs\n\tconst digitMemory = new DigitMemory();\n\tdigitMemory.singleInput = { number: $number, digits: $digits };`,
      ({ number, digits, expectedResult }) => {
        const digitMemory = new Warmup();
        digitMemory.singleInput = { number, digits };

        const result = digitMemory.output;
        expect(result).toBe(expectedResult);
      },
    );
  });

  describe("input validation", () => {
    it.each([
      {
        number: 4531071,
        digits: 9,
        scenario: "(number does not contain digits)",
      },
      { number: null, digits: 317, scenario: "(null instead of valid number)" },
      { number: "", digits: 317, scenario: "(number is an empty string)" },
      {
        number: undefined,
        digits: 317,
        scenario: "(undefined instead of valid number)",
      },
    ])(
      `should all fields be empty if input is invalid $scenario\n\tconst digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.singleInput = { number: $number, digits: $digits };`,
      ({ number, digits }) => {
        const digitMemory = new Warmup();
        digitMemory.singleInput = { number, digits };

        const correctOutput = "";
        const result = digitMemory.output;
        expect(result).toBe(correctOutput);
      },
    );
  });

  it("should split and generate multiple inputs for two or more digits, one for every digit and one for all digits", () => {
    const digitMemory = new Warmup();
    digitMemory.singleInput = { number: "4 8 6 7 4 7 9 7 5", digits: 4712 };

    const result = digitMemory.output;
    expect(result).toBe(
      `<span style="color: rgb(170, 255, 0);">*</span> 8 6 7 <span style="color: rgb(170, 255, 0);">*</span> 7 9 7 5|4 4|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits **\n4 8 6 <span style="color: rgb(170, 255, 0);">*</span> 4 <span style="color: rgb(170, 255, 0);">*</span> 9 <span style="color: rgb(170, 255, 0);">*</span> 5|7 7 7|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits ***\n<span style="color: rgb(170, 255, 0);">*</span> 8 6 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 9 <span style="color: rgb(170, 255, 0);">*</span> 5|4 7 4 7 7|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits *****`,
    );
  });
  it("should have stars tag (number of hidden stars like)", () => {
    const digitMemory = new Warmup();
    digitMemory.singleInput = { number: 4531071, digits: 317 };

    const correctOutput = `4 5 3 <span style="color: rgb(170, 255, 0);">*</span> 0 7 <span style="color: rgb(170, 255, 0);">*</span>|1 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **\n4 5 <span style="color: rgb(170, 255, 0);">*</span> 1 0 7 1|3|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 3 1 0 <span style="color: rgb(170, 255, 0);">*</span> 1|7|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>|3 1 7 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`;
    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
  });

  it(`const digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.singleInput = { number: 4531071, digits: 317 };`, () => {
    const digitMemory = new Warmup();
    digitMemory.singleInput = { number: 4531071, digits: 317 };

    const correctOutput = `4 5 3 <span style="color: rgb(170, 255, 0);">*</span> 0 7 <span style="color: rgb(170, 255, 0);">*</span>|1 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **\n4 5 <span style="color: rgb(170, 255, 0);">*</span> 1 0 7 1|3|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 3 1 0 <span style="color: rgb(170, 255, 0);">*</span> 1|7|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *\n4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>|3 1 7 1|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`;

    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
  });

  it("should have reversed Front field digits and Backward tag if isBackward flag is true", () => {
    const digitMemory = new Warmup();
    digitMemory.singleInput = {
      number: 4531071,
      digits: 317,
      isBackward: true,
    };

    const correctOutput = `4 5 3 <span style="color: rgb(170, 255, 0);">*</span> 0 7 <span style="color: rgb(170, 255, 0);">*</span>|1 1|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits **\n4 5 <span style="color: rgb(170, 255, 0);">*</span> 1 0 7 1|3|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits *\n4 5 3 1 0 <span style="color: rgb(170, 255, 0);">*</span> 1|7|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits *\n4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>|3 1 7 1|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits ****`;

    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
    expect(result).not.toMatch(/Forward/);
  });

  describe("should work if input is only number or number string (not an object)", () => {
    it.each([{ number: "2 5 0 1 2 0 4 2 7" }, { number: 250120427 }])(
      `digitMemory.singleInput = $number`,
      ({ number }) => {
        const digitMemory = new Warmup();
        digitMemory.singleInput = number;

        const correctOutput = `2 5 <span style="color: rgb(170, 255, 0);">*</span> 1 2 <span style="color: rgb(170, 255, 0);">*</span> 4 2 7|0 0|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits **\n2 5 0 <span style="color: rgb(170, 255, 0);">*</span> 2 0 4 2 7|1|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *\n<span style="color: rgb(170, 255, 0);">*</span> 5 0 1 <span style="color: rgb(170, 255, 0);">*</span> 0 4 <span style="color: rgb(170, 255, 0);">*</span> 7|2 2 2|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits ***\n2 5 0 1 2 0 <span style="color: rgb(170, 255, 0);">*</span> 2 7|4|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *\n2 <span style="color: rgb(170, 255, 0);">*</span> 0 1 2 0 4 2 7|5|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *\n2 5 0 1 2 0 4 2 <span style="color: rgb(170, 255, 0);">*</span>|7|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *`;

        const result = digitMemory.output;
        console.log(result);
        expect(result).toBe(correctOutput);
      },
    );
  });
});
