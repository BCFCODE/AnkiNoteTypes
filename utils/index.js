import fs from "fs";

class Utils {
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
