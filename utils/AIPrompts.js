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
    `There's a small tribe of people who (1w) in the mountains of Spain.`,
    "live",
    "lived",
  ],
  [
    `There's a small tribe of people who (1w) in the mountains of Spain.`,
    "live",
    "2",
  ],
  [
    "A nation is a large area of land that is controlled by its (1w) government.",
    "own",
    "''(without 'own')",
  ],
  ["An affair is an event or (1w) thing that happened.", "a", "the"],
  [
    "They found archeological evidence that proved an ancient species of (1w|1.)",
    "man",
    "men",
  ],
  ["To ad?pt means to change in order to deal with a new situation.", "a", "e"],
  [
    "Lava is the hot substance made of melted rock that comes out (1w) volcanoes.",
    "of",
    "from",
  ],
  [
    "Relativity teaches that light travels at the same speed (1w) the universe.",
    "in",
    "at",
  ],
  [
    "The child held the erroneous (1w) that time machines were real.",
    "belief",
    "believe",
  ],
  [
    "Canyons are formed because rivers of (1w) water caused erosion.",
    "fast-moving",
    "fast moving",
  ],
  ["To (1w) means to quit a job.", "resign", "resigned"],
  ["A bitter person feels upset or (1w) about something.", "angry", "anger"],
  [
    "To acknowledge something is to accept that it is true or that it (1w|1.)",
    "exists.",
    "exist.",
  ],
  [
    "Cereal is a breakfast (2w) from grains that is eaten with milk.",
    "food made ",
    "food that is made ",
  ],
];

AIPRs.outputToFile("AIPRs.txt");
