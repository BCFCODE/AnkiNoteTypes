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

  describe("input validation", () => {
    it('should work with digits: 0 or digits: "0"', () => {});

    it.each([
      {
        number: 4531071,
        digits: 9,
        scenario: "(number does not contain digits)",
      },
      { number: "13 u 8 a *", digits: 317, scenario: "(invalid string)" },
      { number: 4531071, digits: "3@ 1d7g d", scenario: "(invalid string)" },
      { number: null, digits: 317, scenario: "(null instead of valid number)" },
      { number: "", digits: 317, scenario: "(number is an empty string)" },
      {
        number: undefined,
        digits: 317,
        scenario: "(undefined instead of valid number)",
      },
    ])(
      `should all fields be empty if input is invalid $scenario\n\tconst digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.input = { number: $number, digits: $digits };`,
      ({ number, digits }) => {
        const digitMemory = new Warmup();
        digitMemory.input = { number, digits };

        const Front = null;

        const Answer = null;

        const TTSFront = null;

        const TTSBack = null;

        const Tags = null;

        const Fields = [
          Front,
          Answer,
          Back,
          Image,
          AudioBothSides,
          AudioFront,
          AudioBack,
          VideoFront,
          VideoBack,
          Links,
          TTSFront,
          TTSBack,
          FrontPersian,
          Tags,
        ];

        const correctOutput = Fields.join`|`;
        const result = digitMemory.output;
        expect(result).toBe(correctOutput);
      },
    );
  });

  it("should have stars tag (number of hidden stars like)", () => {
    const digitMemory = new Warmup();
    digitMemory.input = { number: 4531071, digits: 317 };

    const Front = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

    const Answer = "3 1 7 1";

    const TTSFront = "4 5 3 1 0 7 1";

    const TTSBack = "4 5 3 1 0 7 1";

    const Tags = "Memo DigitMemory Warmup Forward 7Digits ****";

    const Fields = [
      Front,
      Answer,
      Back,
      Image,
      AudioBothSides,
      AudioFront,
      AudioBack,
      VideoFront,
      VideoBack,
      Links,
      TTSFront,
      TTSBack,
      FrontPersian,
      Tags,
    ];

    const correctOutput = Fields.join`|`;
    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
  });

  it(`const digitMemory = new DigitMemory();\n\tdigitMemory.number = 4531071;\n\tdigitMemory.input = { number: 4531071, digits: 317 };`, () => {
    const digitMemory = new Warmup();
    digitMemory.input = { number: 4531071, digits: 317 };

    const Front = `4 5 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span> 0 <span style="color: rgb(170, 255, 0);">*</span> <span style="color: rgb(170, 255, 0);">*</span>`;

    const Answer = "3 1 7 1";

    const TTSFront = "4 5 3 1 0 7 1";

    const TTSBack = "4 5 3 1 0 7 1";

    const Tags = "Memo DigitMemory Warmup Forward 7Digits ****";

    const Fields = [
      Front,
      Answer,
      Back,
      Image,
      AudioBothSides,
      AudioFront,
      AudioBack,
      VideoFront,
      VideoBack,
      Links,
      TTSFront,
      TTSBack,
      FrontPersian,
      Tags,
    ];

    const correctOutput = Fields.join`|`;
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

    const Tags = "Memo DigitMemory Warmup Backward 7Digits ****";

    const Fields = [
      Front,
      Answer,
      Back,
      Image,
      AudioBothSides,
      AudioFront,
      AudioBack,
      VideoFront,
      VideoBack,
      Links,
      TTSFront,
      TTSBack,
      FrontPersian,
      Tags,
    ];

    const correctOutput = Fields.join`|`;

    const result = digitMemory.output;
    expect(result).toBe(correctOutput);
    expect(Tags).not.toMatch(/Forward/);
  });
});
