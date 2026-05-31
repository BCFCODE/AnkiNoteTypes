import Utils from ".";

class Random extends Utils {
  #numberOfDigits = 4;
  #numberOfOutputs = 1;

  set numberOfDigits(value) {
    this.#numberOfDigits = value;
  }
}

const random = new Random();
random.numberOfDigits = 10;
