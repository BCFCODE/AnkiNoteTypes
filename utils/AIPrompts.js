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
  ],
  [
    'The sails harness the (1w) in order to move.',
    'wind', 
    'winds'
  ],
  [
    'A deck is a wooden floor built outside of a house or (1w) floor of a ship.',
    'the',
    "without 'the'"
  ],
  [
    'When a bad thing is (1w|1,) it is very severe and intense.',
    'acute, ',
    'accute, '
  ],
  [
    'A routine is (1w) way of doing things that is the same every time.',
    'a',
    'the'
  ],
  [
    'When something is inevitable, it is certain to happen (4w|1.)',
    'or cannot be avoided.',
    'and cannot be avoidable.'
  ],
  [
    'Ma? has many clothes inside of her closet.',
    'rie',
    'rry'
  ],
  [
    'Marie has many clothes inside (1w) her closet.',
    'of',
    "without 'of'"
  ],
  [
    'I did some practice questions (1w) the math exam on the board.',
    'for',
    'on'
  ],
  [
    'A courier is (1w) who takes and delivers mail or packages.',
    'someone',
    'something'
  ],
  [
    'Dust is (1w) small, dry particles of earth or sand.',
    'very',
    'a'
  ]
  /* DON'T FORGET TO ADD EnglishMastery TAG!! */
]; 

AIPRs.outputToFile("AIPRs.txt");

/* 
  AIPR: give me a tongue twister to help me speed of my speaking
  AIPR: give me a practical and common idiom that natives use in their conversations
*/