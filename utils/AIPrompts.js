import Utils from ".";

export default class AIPrompts extends Utils {
  #multipleInputs;

  set multipleInputs(inputs) {
    this.#multipleInputs = inputs;
  }

  #createOutput() {
    const outputs = this.#multipleInputs.map(
      ([Q, A, error], i) =>
        `AIPR ${i + 1}: in "${Q}" how to find the only right answer is "${A}" and not "${error}"? is it?? Only and only if it helps (not when it is unnecessary!), give me a grammar or Latin tip you think that I don't know in order to make my English than before.`,
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
    'A mill is a building in which wheat (1w) ground into flour.',
    'is',
    "without 'is'"
  ],
  [
    'Charcoal is a black material that is used as fuel (1w) fire.', 
    'for',
    'in'
  ],
  [
    'Climbing (1w) the giant rock was the biggest obstacle for the hikers.',
    'over', 
    'of'
  ],
  [
    `The rebel had enough of the government's unfair (1w|1.)`,
    'polices.',
    'policies'
  ],
  [
    'An action done aside is done toward the side of something or (1w|1.)',
    'someplace.',
    'some place.'
  ],
  [
    'To (1w) something or someone is to make them better.',
    'complement ',
    'compliment '
  ],
  [
    'Thus is used in place of “as a result of something (2w) just mentioned.”',
    'that was ',
    'without "that was "'
  ],
  [
    'If something is theoretical, it is based on theory rather than (1w|1.)',
    'experience.',
    'experiment.'
  ],
  [
    'An awareness (2w) or perception of a situation or fact.',
    'is knowledge ',
    'is a knowledge '
  ],
  [
    'To flee is (3w) very quickly in order to escape from danger.',
    'to leave somewhere ',
    'to leave to somewhere '
  ],
  [
    'An equivalent is an amount or value that is the same (1w) another amount or value.',
    'as',
    'with'
  ],
  [
    'I have a hatred (1w) the taste of medicine.', 
    'for ', 
    'from'
  ],
  [
    'A routine is a way of doing things that is the same (2w|1.)',
    'every time.', 
    'everytime.'
  ],
  [
    'Flour is a powder made from plants (2w) used to make foods like bread.',
    'that is ',
    "without 'that is'"
  ],
  [
    'A deed is a certificate that proves that someone (1w) something.',
    'owns ',
    'owned'
  ],
  [
    'He found himself lost because he had (1w) from the tour group.',
    'strayed ', 
    'straight'
  ],
  [
    'When a bad thing is a?ute, it is very severe and intense.',
    'c',
    'cc'
  ],
  [
    'Proficient (2w) to do something well.', 
    'means able ',
    'means be able '
  ]
];

AIPRs.outputToFile("AIPRs.txt");
