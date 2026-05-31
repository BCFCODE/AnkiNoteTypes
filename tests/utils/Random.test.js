import { it, expect, describe } from "vitest";
import Random from "../../utils/Random";

describe("Random", () => {
  const randomLength = Math.floor(Math.random() * 10 + 4);

  const hasDuplicatedDigits = (digits) =>
    [...digits].every(
      (digit) => digits.match(new RegExp(digit, "g")).length > 1,
    );

  it(`after set numberOfDigits to ${randomLength}, it should output a random ${randomLength} digit number with no adjacent same digits (in range of 10 digits)\n\tconst random = new Random();\n\trandom.numberOfDigits = ${randomLength};`, () => {
    const random = new Random();
    random.numberOfDigits = randomLength;

    const output = random.output;
    const hasNotDuplicatedDigits = !hasDuplicatedDigits(output);

    expect(hasNotDuplicatedDigits).toBe(true);
  });
});
