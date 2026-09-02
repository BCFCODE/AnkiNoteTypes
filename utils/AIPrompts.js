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
    'your sentence...',
    'correct',
    'your mistake mistake'
  ]
  /* DON'T FORGET TO ADD EnglishMastery TAG!! */
]; 

AIPRs.outputToFile("AIPRs.txt");

/* 
  TongueTwister:
    AIPR: give me a tongue twister and its meaning to help me speed up my English speaking
  Idiom:
    AIPR: give me a practical and common idiom that natives use in their conversations, and tell me when and where I can use it and where it comes from? what is its story?
*/