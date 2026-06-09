import fs from "fs";

class Utils {
  currentFormattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  currentYear = new Date().getFullYear()
  authorName = "Morteza Bakhshandeh (@BCFCODE)";
  twitterUrl = "https://x.com/bcfcode";
  websiteUrl = "https://www.bcfcode.ir";
  githubUrl = "https://github.com/BCFCODE/AnkiNoteTypes";

  addColor = (digit, replaceChar = digit) => {
    const style = {
      0: "color: rgb(115, 115, 115); text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 6px rgba(115,115,115,0.5), 0 0 14px rgba(0,0,0,0.6);",
      1: "color: rgb(0, 135, 255); text-shadow: 0 0 10px rgba(0, 135, 255, 0.85), 0 0 20px rgba(0, 135, 255, 0.45), 0 2px 8px rgba(0,0,0,0.7);",
      2: "color: rgb(0, 245, 130); text-shadow: 0 0 12px rgba(0, 245, 130, 0.9), 0 0 24px rgba(0, 245, 130, 0.5), 0 3px 10px rgba(0,0,0,0.65);",
      3: "color: rgb(40, 205, 95); text-shadow: 0 0 10px rgba(40, 205, 95, 0.8), 0 0 22px rgba(40, 205, 95, 0.4), 0 2px 8px rgba(0,0,0,0.6);",
      4: "color: rgb(255, 235, 40); text-shadow: 0 0 14px rgba(255, 235, 40, 0.95), 0 0 28px rgba(255, 200, 0, 0.6), 0 3px 10px rgba(0,0,0,0.7);",
      5: "color: rgb(255, 160, 25); text-shadow: 0 0 12px rgba(255, 160, 25, 0.9), 0 0 25px rgba(255, 110, 0, 0.55), 0 2px 9px rgba(0,0,0,0.7);",
      6: "color: rgb(170, 65, 255); text-shadow: 0 0 13px rgba(170, 65, 255, 0.85), 0 0 26px rgba(140, 30, 255, 0.5), 0 2px 8px rgba(0,0,0,0.65);",
      7: "color: rgb(255, 45, 70); text-shadow: 0 0 11px rgba(255, 45, 70, 0.9), 0 0 23px rgba(255, 60, 85, 0.5), 0 2px 8px rgba(0,0,0,0.75);",
      8: "color: rgb(200, 105, 45); text-shadow: 0 3px 10px rgba(0,0,0,0.9), 0 0 8px rgba(200, 105, 45, 0.6), 0 0 18px rgba(0,0,0,0.5);",
      9: "color: rgb(255, 50, 175); text-shadow: 0 0 12px rgba(255, 50, 175, 0.9), 0 0 26px rgba(255, 30, 160, 0.5), 0 2px 9px rgba(0,0,0,0.7);",
    };

    return `<span style="${style[digit]} font-weight: 700; border-radius: 6px; padding: 2px 4px; display: inline-block;">${replaceChar}</span>`;
    /*=== DIGIT COLOR PHILOSOPHY ===

      
      0: Neutral foundation. Dark gray represents emptiness, stability, and origin. Heavy shadow + subtle glass background creates a solid, grounded, premium stone-like presence. Serves as visual breathing room between brighter digits.
      
      1: Trust, clarity, and new beginnings. Classic blue evokes calmness and reliability. Clean electric glow makes it feel sharp and focused — the natural "leader" digit.
      
      2: Your favorite yellow-green — fresh, natural, and vibrant life energy. Brightened for maximum sexiness while staying true to your personal preference. Strong glow symbolizes growth, joy, and high memorability.
      
      3: Growth, balance, and harmony (triangle stability). Rich green creates calm strength and natural grounding with layered depth.
      
      4: Value, energy, and golden reward (square structure). Bright gold with the strongest radiant glow creates a luxurious, satisfying sparkle.
      
      5: Dynamic warmth, movement, and midpoint power. Energetic orange grabs attention with a fiery, alive pulse in the middle of numbers.
      
      6: Mystery, creativity, richness, and magic. Vibrant purple adds elegant, hypnotic cosmic depth.
      
      7: Intensity, alertness, passion, and strong memory anchoring. Crimson red delivers powerful, dramatic visual impact.
      
      8: Earthy solidity, abundance, weight, and reliability (infinity shape). Brown feels heavy and premium with metallic-bronze texture.
      
      9: Playful high energy, completion, joy, and flair. Deep pink/magenta provides a fun, seductive, and vibrant ending to number sequences.
      
      Overall System Goal: Transform boring number memorization into a visually addictive, premium, and sexy daily experience. Combines color psychology, personal preference (yellow-green on 2), and modern glowing aesthetics while ensuring excellent long-term readability for years of Anki training.
    */
  };

  addColorToEachDigit = (number) =>
    `${number}`.replace(/\d/g, (digit) => this.addColor(digit));

  removeNoneDigits = (n) => `${n}`.replace(/\D/g, "");

  addSpaceBetweenDigits = (n) => [...this.removeNoneDigits(n)].join` `;

  reverseDigits = (n) => [...this.removeNoneDigits(n)].reverse().join``;

  getUniqueDigits = (digits) => [...new Set(this.removeNoneDigits(digits))];

  getReg = (n, flag = "g") => new RegExp(`[${this.removeNoneDigits(n)}]`, flag);

  getNumberOfDigits = (n) => this.removeNoneDigits(n).toString().length;

  createNumberOfDigitsTag = (numberOfDigits) => `${numberOfDigits}Digits`;

  createDirectionTag = (isBackward) => (isBackward ? "Backward" : "Forward");

  createTagsField = (numberOfDigits, isBackward) => {
    const directionTag = this.createDirectionTag(isBackward);
    const numberOfDigitsTag = this.createNumberOfDigitsTag(numberOfDigits);
    return `Memo DigitMemory ${directionTag} ${numberOfDigitsTag}`;
  };

  outputToFile = (path = "Anki.txt") =>
    fs.writeFileSync(`outputs/${path}`, this.output, "utf8");
}

export default Utils;
