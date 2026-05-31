import Utils from ".";

class Random extends Utils {
  #output = [];
  #numberOfDigits = 4;
  #numberOfOutputs = 1;

  set numberOfDigits(value) {
    this.#numberOfDigits = value;
  }

  #createOutput = () => {
    let digits = "";
    for (let i = 0; i < this.#numberOfDigits; i++) {
      if (digits === "") digits = "1234567890";
      const randomIndex = Math.floor(Math.random() * digits.length);
      const chosenDigit = digits[randomIndex];
      digits = digits.replace(this.getReg(chosenDigit), "");
      this.#output.push(chosenDigit);
    }
    return this.#output.join` `;
  };

  get output() {
    return this.#createOutput();
  }
}

const random = new Random();
random.numberOfDigits = 10;
console.log(random.output) 
random.outputToFile();
 
export default Random;
