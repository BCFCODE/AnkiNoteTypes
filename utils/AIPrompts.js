import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs;

  set multipleInputs(inputs) {
    this.#multipleInputs = inputs;
  }

  #createOutput() {
    const outputs = this.#multipleInputs.map(
      ([Q, A, error], i) =>
        `AIPR ${i + 1}: in "${Q}" how to find the only right answer is "${A}" and not "${error}"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don't know in order to make my English than before. Consider that I want to use it on Back field of my anki card.`,
    );
    return outputs.join`\n\n`;
  }

  get output() {
    return this.#createOutput();
  }
}

export const AIPRs = new AIPrompts();

AIPRs.multipleInputs = [
  [
    'Etiquette is (1w) group of rules about how to be polite.',
    'the', 
    'a'
  ],
  [
    'The computers of (1w) 1980s are primitive compared to those of todays.',
    'the',
    "without 'the'"
  ],
  [
    'When something is erroneous, it is incorrect or (1w) partly correct.',
    'only',
    "without 'only'"
  ],
  [
    'An acquisition is something that a person buys or gets in (2w|1.)',
    'some way.',
    'someway.'
  ]
  /* DON'T FORGET TO ADD EnglishMastery TAG!! */
]; 

AIPRs.outputToFile("AIPRs.txt");
