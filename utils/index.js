import fs from 'fs'

class Utils {
  addSpaceBetweenDigits = (n) => [...`${n}`].join` `;

  removeNoneDigits = (n) => `${n}`.replace(/\D/g, "");
  
  outputToFile = (path = "Anki.txt") =>
    fs.writeFileSync(`outputs/${path}`, this.output, "utf8");
}

export default Utils;
