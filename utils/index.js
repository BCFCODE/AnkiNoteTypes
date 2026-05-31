import fs from "fs"; 

class Utils {
  addColor = (digit, replaceChar = digit) => {
    const style = {
      0: "color: rgb(105, 105, 105); text-shadow: 0 2px 6px rgba(0,0,0,0.8), 0 0 4px rgba(105,105,105,0.4); background: rgba(255,255,255,0.06);",
      1: "color: rgb(0, 122, 255); text-shadow: 0 0 8px rgba(0, 122, 255, 0.7), 0 0 16px rgba(0, 122, 255, 0.3);",
      2: "color: rgb(0, 230, 120); text-shadow: 0 0 10px rgba(0, 230, 120, 0.8), 0 0 20px rgba(0, 230, 120, 0.4);",
      3: "color: rgb(34, 190, 80); text-shadow: 0 0 8px rgba(34, 190, 80, 0.6), 0 2px 6px rgba(0,0,0,0.5);",
      4: "color: rgb(255, 223, 0); text-shadow: 0 0 12px rgba(255, 223, 0, 0.85), 0 0 22px rgba(255, 180, 0, 0.4);",
      5: "color: rgb(255, 145, 0); text-shadow: 0 0 10px rgba(255, 145, 0, 0.8), 0 0 18px rgba(255, 100, 0, 0.5);",
      6: "color: rgb(150, 50, 240); text-shadow: 0 0 10px rgba(150, 50, 240, 0.75), 0 0 20px rgba(120, 0, 255, 0.35);",
      7: "color: rgb(235, 30, 55); text-shadow: 0 0 9px rgba(235, 30, 55, 0.8), 0 0 18px rgba(255, 40, 70, 0.4);",
      8: "color: rgb(180, 90, 40); text-shadow: 0 3px 8px rgba(0,0,0,0.85), 0 0 6px rgba(180, 90, 40, 0.5); background: rgba(0,0,0,0.25);",
      9: "color: rgb(255, 35, 160); text-shadow: 0 0 11px rgba(255, 35, 160, 0.8), 0 0 22px rgba(255, 20, 147, 0.45);",
    };
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
    return `<span style="${style[digit]} font-weight: 700; border-radius: 6px;">${replaceChar}</span>`;
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
