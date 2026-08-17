import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs;

  set multipleInputs(inputs) {
    this.#multipleInputs = inputs;
  }

  #createOutput() {
    const outputs = this.#multipleInputs.map(
      ([Q, A, error], i) => `AIPR ${i}: in "${Q}" how to find the only right answer is "${A}" and not "${error}"? is it??`,
    );
    return outputs.join`\n`; 
  } 
 
  get output() {
    return this.#createOutput(); 
  }
}

export const AIPRs = new AIPrompts();
 
AIPRs.multipleInputs = [ 
  [
    `There's a small tribe of people who (1w) in the mountains of Spain.`,
    "live",
    "lived",
  ],
  [
    `There's a small tribe of people who (1w) in the mountains of Spain.`,
    "live",
    "2",
  ],
];
 
AIPRs.outputToFile("AIPRs.txt");
 