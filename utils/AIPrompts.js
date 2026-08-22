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
    'A workout is an exercise routine that helps (1w) health.',
    'improve ',
    'increase'
  ],
  [
    'The development of plants (1w) ongoing because it takes time for them to mature.',
    'is',
    'are'
  ],
  [
    'Moreover is used to introduce information (1w) adds to or supports what has previously been said.',
    'that', 
    'to'
  ],
  [
    'A rule is an official instruction that (1w) how things must be done or what is allowed.',
    'says', 
    'said'
  ],
  [
    'An applicant is someone who writes a request to be considered for a job or (1w|1.)',
    'prize', 
    'price'
  ],
  [
    'A barn is a large farm building that (1w) crops, equipment, and animals.',
    'houses ',
    'uses'
  ],
  [
    'Oil is a smooth, thick liquid made from plants or some animals, and (1w) especially in cooking.',
    'is',
    'used'
  ],
  [
    'To conf?rm to rules or laws is to obey them.',
    'o',
    'i'
  ],
  [
    'Oil is a smooth, thick liquid made from plants or some animals, and is especially (1w) cooking.', 
    'in',
    'for'
  ],
  [
    'Oil is a smooth, thick liquid made from plants or some animals, and is (1w) in cooking.',
    'especially ',
    'specially'
  ],
  [
    'An enemy is a country that is (2w) country during a war.',
    'fighting another ',
    'fighting in another '
  ],
  [
    'A privilege is a special right given (3w) certain person or group of people.',
    'only to a ',
    'to only'
  ],
  [
    'Shutters are wooden or metal (1w) in front of a window.',
    'covers',
    'covered'
  ],
  [
    'Sociology is the study of human society, its organizations, (2w|1.)',
    'and problems.',
    'and its problems.'
  ]
];

AIPRs.outputToFile("AIPRs.txt");
