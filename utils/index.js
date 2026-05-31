import fs from "fs";

class Utils {
  addColor = (char) => {
    const colors = {
      "*": "rgb(170, 255, 0);",
      0: "rgb(128, 128, 128);",
      1: "rgb(255, 255, 255);",
      2: "rgb(0, 102, 255);",
      3: "rgb(0, 168, 67);",
      4: "rgb(255, 215, 0);",
      5: "rgb(255, 127, 0);",
      6: "rgb(138, 43, 226);",
      7: "rgb(255, 0, 0);",
      8: "rgb(139, 69, 19);",
      9: "rgb(0, 0, 0);",
    };
    /* Philosophy: If your goal is **long-term digit memorization training** (years of Anki use), the most important principle is:

      > **Consistency beats cleverness.**

      The brain learns associations through repetition. A color system that feels slightly less intuitive but remains unchanged for 5 years will outperform a "more optimal" system that gets redesigned every few months.

      ---

      # My Selection Criteria

      For each digit, I would optimize for:

      1. **Distinctiveness**

        * Colors must be easy to distinguish quickly.
        * Avoid colors that look similar.

      2. **Natural Associations**

        * Use associations many people already have.
        * Existing mental links reduce learning time.

      3. **Cross-Cultural Familiarity**

        * Prefer associations common worldwide.

      4. **Color Psychology**

        * Use colors with strong emotional or visual identities.

      5. **Visual Balance**

        * No color should dominate too much.

      6. **Accessibility**

        * Remain distinguishable for people with mild color-vision deficiencies.

      7. **Long-Term Memory Encoding**

        * Strong "digit → color" mapping creates an additional retrieval cue.

      ---

      # Recommended Digit → Color System

      | Digit | Color  | Reason                                |
      | ----- | ------ | ------------------------------------- |
      | 0     | Gray   | Neutral, empty, nothingness           |
      | 1     | White  | Beginning, singularity, simplicity    |
      | 2     | Blue   | Pairing, balance, calm                |
      | 3     | Green  | Growth, triangle, expansion           |
      | 4     | Yellow | Stability, square, structure          |
      | 5     | Orange | Midpoint, energy, movement            |
      | 6     | Purple | Complexity, richness                  |
      | 7     | Red    | Strong, memorable, attention-grabbing |
      | 8     | Brown  | Solidity, weight, abundance           |
      | 9     | Black  | Completion, finality                  |

      ---

      # Exact Color Palette

      I would use:

      0 → rgb(128, 128, 128)  Gray
      1 → rgb(255, 255, 255)  White
      2 → rgb(0, 102, 255)  Blue
      3 → rgb(0, 168, 67)  Green
      4 → rgb(255, 215, 0)  Gold/Yellow
      5 → rgb(255, 127, 0)  Orange
      6 → rgb(138, 43, 226)  Purple
      7 → rgb(255, 0, 0)  Red
      8 → rgb(139, 69, 19)  Brown
      9 → rgb(0, 0, 0)  Black

      # Why Not Use the Rainbow?

      Many people instinctively do:

      1 = Red
      2 = Orange
      3 = Yellow
      4 = Green
      5 = Blue

      The problem:

      * Several neighboring colors become similar.
      * Yellow is hard to read.
      * Light blue and dark blue get confused.
      * No natural meaning for some digits.

      For a system you'll use for years, distinctiveness matters more than rainbow order.

      ---

      # A Stronger Alternative: Number Shape Method

      Another philosophy is matching colors to the *shape* or *meaning* of digits.

      Example:

      | Digit | Association        | Color  |
      | ----- | ------------------ | ------ |
      | 0     | Empty              | Gray   |
      | 1     | Light beam         | White  |
      | 2     | Water wave         | Blue   |
      | 3     | Plant sprout       | Green  |
      | 4     | Sunlight           | Yellow |
      | 5     | Fire               | Orange |
      | 6     | Magic              | Purple |
      | 7     | Warning sign       | Red    |
      | 8     | Tree trunk / earth | Brown  |
      | 9     | Night              | Black  |

      This creates an extra layer:

      Digit → Color
      Digit → Concept
      Color → Concept

      which strengthens memory encoding.

      ---

      # If You Want the Most Memory-Palace-Friendly System

      Many elite memorizers eventually move toward:

      0 = White
      1 = Black
      2 = Blue
      3 = Green
      4 = Yellow
      5 = Orange
      6 = Red
      7 = Purple
      8 = Brown
      9 = Gray

      because:

      * White ↔ zero/blankness
      * Black ↔ single mark/stroke
      * Blue ↔ pair/two halves
      * Green ↔ growth/three branches
      * Yellow ↔ square stability
      * Orange ↔ midpoint energy
      * Red ↔ intensity
      * Purple ↔ rarity
      * Brown ↔ earth/weight
      * Gray ↔ ending/fading

      However, for Anki digit training specifically, I would still choose the first table because it maximizes immediate visual discrimination when scanning long numbers.

      For a deck you expect to use for many years, the key is not finding the objectively perfect colors—it's choosing a set of **highly distinct colors and never changing them again**. The brain becomes remarkably efficient once a digit-color mapping has been reinforced thousands of times.
   */
    return `<span style="color: ${colors[char]}">${char}</span>`;
  };
  addSpaceBetweenDigits = (n) => [...`${n}`].join` `;

  removeNoneDigits = (n) => `${n}`.replace(/\D/g, "");

  getUniqueDigits = (digits) => [...new Set(this.removeNoneDigits(digits))];

  getReg = (n, flag = "g") => {
    return new RegExp(`[${this.removeNoneDigits(n)}]`, flag);
  };

  outputToFile = (path = "Anki.txt") =>
    fs.writeFileSync(`outputs/${path}`, this.output, "utf8");
}

export default Utils;
