import { it, describe, vi, expect } from "vitest";
import Warmup from "../../utils/DigitMemory";

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
        expectedResult: `<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 3 8|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits *
1 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 8|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits *
<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 8|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||1 3 8|1 3 8||Memo DigitMemory Warmup Forward 3Digits **`,
      },
      {
        number: 4531071,
        digits: "3@ 1d7g 9 d",
        expectedResult: `4 5 3 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 7 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 1 0 7 1|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 3 1 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 1|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`,
      },
    ])(
      `should work with unclean inputs\n\tconst warmup = new DigitMemory();\n\twarmup.singleInput = { number: $number, digits: $digits };`,
      ({ number, digits, expectedResult }) => {
        const warmup = new Warmup();
        warmup.singleInput = { number, digits };

        const result = warmup.output;
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
      `should all fields be empty if input is invalid $scenario\n\tconst warmup = new DigitMemory();\n\twarmup.number = 4531071;\n\twarmup.singleInput = { number: $number, digits: $digits };`,
      ({ number, digits }) => {
        const warmup = new Warmup();
        warmup.singleInput = { number, digits };

        const correctOutput = "";
        const result = warmup.output;
        expect(result).toBe(correctOutput);
      },
    );
  });

  it("should split and generate multiple inputs for two or more digits, one for every digit and one for all digits", () => {
    const warmup = new Warmup();
    warmup.singleInput = { number: "4 8 6 7 4 7 9 7 5", digits: 4712 };

    const result = warmup.output;
    expect(result).toBe(
      `<span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">*</span> 8 6 7 <span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">*</span> 7 9 7 5|<span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">4</span> <span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">4</span>|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits **
4 8 6 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 4 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 9 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 5|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits ***
<span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">*</span> 8 6 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 9 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 5|<span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">4</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">4</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||4 8 6 7 4 7 9 7 5|4 8 6 7 4 7 9 7 5||Memo DigitMemory Warmup Forward 9Digits *****`,
    );
  });

  it("should have stars tag (number of hidden stars like)", () => {
    const warmup = new Warmup();
    warmup.singleInput = { number: 4531071, digits: 317 };

    const result = warmup.output;
    expect(result)
      .toBe(`4 5 3 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 7 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 1 0 7 1|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 3 1 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 1|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`);
  });

  it(`const warmup = new DigitMemory();\n\twarmup.number = 4531071;\n\twarmup.singleInput = { number: 4531071, digits: 317 };`, () => {
    const warmup = new Warmup();
    warmup.singleInput = { number: 4531071, digits: 317 };

    const result = warmup.output;
    expect(result)
      .toBe(`4 5 3 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 7 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits **
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 1 0 7 1|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 3 1 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 1|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits *
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||4 5 3 1 0 7 1|4 5 3 1 0 7 1||Memo DigitMemory Warmup Forward 7Digits ****`);
  });

  it("should have reversed Front field digits and Backward tag if isBackward flag is true", () => {
    const warmup = new Warmup();
    warmup.singleInput = {
      number: 4531071,
      digits: 317,
      isBackward: true,
    };

    const correctOutput = `4 5 3 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 7 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits **
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> 1 0 7 1|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span>|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits *
4 5 3 1 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> 1|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits *
4 5 <span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 0 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5); font-weight: 700; border-radius: 6px;">3</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span> <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span> <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||1 7 0 1 3 5 4|4 5 3 1 0 7 1||Memo DigitMemory Warmup Backward 7Digits ****`;

    const result = warmup.output;
    expect(result).toBe(correctOutput);
    expect(result).not.toMatch(/Forward/);
  });

  describe("should work if input is only number or number string (not an object)", () => {
    it.each([{ number: "2 5 0 1 2 0 4 2 7" }, { number: 250120427 }])(
      `warmup.singleInput = $number`,
      ({ number }) => {
        const warmup = new Warmup();
        warmup.singleInput = number;

        const correctOutput = `2 5 <span style="color: rgb(105, 105, 105); text-shadow: 0 2px 6px rgba(0,0,0,0.8), 0 0 4px rgba(105,105,105,0.4); background: rgba(255,255,255,0.06); font-weight: 700; border-radius: 6px;">*</span> 1 2 <span style="color: rgb(105, 105, 105); text-shadow: 0 2px 6px rgba(0,0,0,0.8), 0 0 4px rgba(105,105,105,0.4); background: rgba(255,255,255,0.06); font-weight: 700; border-radius: 6px;">*</span> 4 2 7|<span style="color: rgb(105, 105, 105); text-shadow: 0 2px 6px rgba(0,0,0,0.8), 0 0 4px rgba(105,105,105,0.4); background: rgba(255,255,255,0.06); font-weight: 700; border-radius: 6px;">0</span> <span style="color: rgb(105, 105, 105); text-shadow: 0 2px 6px rgba(0,0,0,0.8), 0 0 4px rgba(105,105,105,0.4); background: rgba(255,255,255,0.06); font-weight: 700; border-radius: 6px;">0</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits **
2 5 0 <span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">*</span> 2 0 4 2 7|<span style="color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3); font-weight: 700; border-radius: 6px;">1</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *
<span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">*</span> 5 0 1 <span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">*</span> 0 4 <span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">*</span> 7|<span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">2</span> <span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">2</span> <span style="color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4); font-weight: 700; border-radius: 6px;">2</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits ***
2 5 0 1 2 0 <span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">*</span> 2 7|<span style="color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4); font-weight: 700; border-radius: 6px;">4</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *
2 <span style="color: rgb(255, 145, 0); text-shadow: 0 0 10px rgba(255, 145, 0, 0.8), 0 0 18px rgba(255, 100, 0, 0.5); font-weight: 700; border-radius: 6px;">*</span> 0 1 2 0 4 2 7|<span style="color: rgb(255, 145, 0); text-shadow: 0 0 10px rgba(255, 145, 0, 0.8), 0 0 18px rgba(255, 100, 0, 0.5); font-weight: 700; border-radius: 6px;">5</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *
2 5 0 1 2 0 4 2 <span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">*</span>|<span style="color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4); font-weight: 700; border-radius: 6px;">7</span>|||||||||2 5 0 1 2 0 4 2 7|2 5 0 1 2 0 4 2 7||Memo DigitMemory Warmup Forward 9Digits *`;

        const result = warmup.output;
        expect(result).toBe(correctOutput);
      },
    );
  });
});
