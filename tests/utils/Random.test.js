import { it, expect, describe } from "vitest";
import Random from "../../utils/Random";

describe("Random", () => {
  const randomLength = Math.floor(Math.random() * 10 + 4);

  const hasDuplicatedDigits = (digits) =>
    [...digits].every(
      (digit) => digits.match(new RegExp(digit, "g")).length > 1,
    );

  it(`\tconst random = new Random();\n\trandom.numberOfDigits = ${randomLength};\n\tconst number = random.number\n>> after set numberOfDigits to ${randomLength}, it number should be a random ${randomLength} digit number with no adjacent same digits (in range of 10 digits)`, () => {
    const random = new Random();
    random.numberOfDigits = randomLength;
    const number = random.number

    const hasNotDuplicatedDigits = !hasDuplicatedDigits(number);

    expect(hasNotDuplicatedDigits).toBe(true);
  });
});
