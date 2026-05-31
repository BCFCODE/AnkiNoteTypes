import fs from "fs";

class Utils {
  addColor = (char) => {
    const colors = {
      "*": "rgb(170, 255, 0);",
    };
    /* 
      I want to create an anki card with lets say 10 digits random numbers in front fiels (eg. 123456790), I want to give each digit a specific color, tell me what is best practice colors for each, consider every possible aspect like familiarity with memory, color psychology and... to choose the best colors for this reason, I want to use these colors years of training on this deck and I want to be the best choice
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
