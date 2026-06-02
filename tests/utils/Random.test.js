import { it, expect, describe } from "vitest";
import Random from "../../utils/Random";

describe("Random", () => {
  const randomLength = Math.floor(Math.random() * 10 + 4);

  const hasDuplicatedDigits = (digits) =>
    [...digits].every(
      (digit) => digits.match(new RegExp(digit, "g")).length > 1,
    );

  it(`after set numberOfDigits to ${randomLength}, it number should be a random ${randomLength} digit number with no adjacent same digits (in range of 10 digits)`, () => {
    const random = new Random();

    random.config = {
      numberOfDigits: 10,
      isBackward: false,
      numberOfOutputs: 10,
    };

    const [
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
    ] = random.output.split`|`;

    const hasNotDuplicatedDigits = !hasDuplicatedDigits(TTSBack);

    expect(hasNotDuplicatedDigits).toBe(true);
  });
});
