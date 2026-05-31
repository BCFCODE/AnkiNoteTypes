import { it, expect, describe } from "vitest";
import Random from "../../utils/Random";

describe("Random", () => {
  it("after set numberOfDigits to 10, it should output a random 10 digit number with minimum of repeated digits\n\tconst random = new Random();\nTrandom.numberOfDigits = 10;", () => {
    const random = new Random();
    random.numberOfDigits = 10;
   
  });
});
