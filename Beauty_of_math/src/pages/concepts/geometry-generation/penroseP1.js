const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const INFLATION = GOLDEN_RATIO ** 2;
const DEG = Math.PI / 180;
const COS18 = Math.cos(18 * DEG);
const COS36 = Math.cos(36 * DEG);
const COS72 = Math.cos(72 * DEG);
const COS108 = Math.cos(108 * DEG);
const SIN18 = Math.sin(18 * DEG);
const SIN36 = Math.sin(36 * DEG);
const SIN72 = Math.sin(72 * DEG);
const SIN108 = Math.sin(108 * DEG);
const TAN54 = Math.tan(54 * DEG);
const TAN72 = Math.tan(72 * DEG);

const PENTAGON = [
  { x: 0, y: 0 },
  { x: COS108, y: SIN108 },
  { x: 1 + COS72 + Math.cos(144 * DEG), y: SIN72 + Math.sin(144 * DEG) },
  { x: 1 + COS72, y: SIN72 },
  { x: 1, y: 0 },
];

const OUTLINES = {
  P: PENTAGON,
  Q: PENTAGON,
  R: PENTAGON,
  G: [
    { x: 1, y: 0 },
    { x: 1 - COS36, y: -SIN36 },
    { x: 1 - COS36 - COS108, y: -SIN36 - SIN108 },
    { x: COS108, y: -SIN108 },
    { x: -1 + 3 * COS108 + COS36, y: -SIN36 - SIN108 },
    { x: -1 + 2 * COS108 + COS36, y: -SIN36 },
    { x: -1 + 2 * COS108, y: 0 },
    { x: 2 * COS108, y: 0 },
    { x: COS108, y: SIN108 },
    { x: 0, y: 0 },
  ],
  B: [
    { x: -1 + 2 * COS108, y: 0 },
    { x: 2 * COS108, y: 0 },
    { x: COS108, y: SIN108 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1 - COS36, y: -SIN36 },
    { x: -1 + 2 * COS108 + COS36, y: -SIN36 },
  ],
  D: [
    { x: 0, y: 0 },
    { x: COS18, y: SIN18 },
    { x: 2 * COS18, y: 0 },
    { x: COS18, y: -SIN18 },
  ],
};

const TILE_KIND = { P: 0, Q: 1, R: 2, G: 3, B: 4, D: 5 };

// These productions are the P1 inflation rules described by Andrew Stacey's
// Penrose package: https://ctan.org/pkg/penrose
const PRODUCTIONS = {
  P: "[s>P][1sF+Q][1+sF+Q][1*sF+Q][1-sF+Q][1_sF+Q]",
  Q: "[s>P][1+sFR][1*sF*R][1-sF+Q][1_sF+Q][1sF+Q][->fsD]",
  R: "[s>P][1-sF+Q][1+sF*R][1*sFR][1_sF*R][1sFR][_>fsD][>fsD]",
  G: "[s>G][se[>d+R][e1B]][+se[>d+R][e1B]][-se[>d+R][e1B]][*se[>d+R][e1B]][_se[>d+R][e1B]]",
  B: "[s>G][se[>d+R][e1B]][+se[>d+R][e1B]][-se[>d+R][e1B]]",
  D: "[s>d+R][s>eG][se1B]",
};

const IDENTITY = [1, 0, 0, 0, 1, 0];

function multiply(first, second) {
  return [
    first[0] * second[0] + first[1] * second[3],
    first[0] * second[1] + first[1] * second[4],
    first[0] * second[2] + first[1] * second[5] + first[2],
    first[3] * second[0] + first[4] * second[3],
    first[3] * second[1] + first[4] * second[4],
    first[3] * second[2] + first[4] * second[5] + first[5],
  ];
}

function translation(x, y) {
  return [1, 0, x, 0, 1, y];
}

function rotation(angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [cos, -sin, 0, sin, cos, 0];
}

function scaling(amount) {
  return [amount, 0, 0, 0, amount, 0];
}

function apply(matrix, point) {
  return {
    x: matrix[0] * point.x + matrix[1] * point.y + matrix[2],
    y: matrix[3] * point.x + matrix[4] * point.y + matrix[5],
  };
}

function move(state, transform) {
  state.transform = multiply(state.transform, transform);
}

function tileTransform(symbol, state) {
  const { step, transform } = state;
  if ("PQR".includes(symbol)) {
    return multiply(
      transform,
      multiply(translation(-step / 2, (-step * TAN54) / 2), scaling(step)),
    );
  }
  if (symbol === "G" || symbol === "B") {
    return multiply(
      transform,
      multiply(translation(step * COS72, step * TAN54 * COS72), scaling(step)),
    );
  }
  return multiply(
    transform,
    multiply(rotation(90 * DEG), multiply(translation(-step * COS18, 0), scaling(step))),
  );
}

function tileIntersectsClip(symbol, state, clipRadius) {
  const points = OUTLINES[symbol].map((point) => apply(tileTransform(symbol, state), point));
  const minX = Math.min(...points.map(({ x }) => x));
  const maxX = Math.max(...points.map(({ x }) => x));
  const minY = Math.min(...points.map(({ y }) => y));
  const maxY = Math.max(...points.map(({ y }) => y));
  return minX <= clipRadius && maxX >= -clipRadius && minY <= clipRadius && maxY >= -clipRadius;
}

function interpret(sequence, depth, state, tiles, clipRadius) {
  const stack = [];
  for (const command of sequence) {
    if (command === "[") {
      stack.push({ ...state });
    } else if (command === "]") {
      state = stack.pop();
    } else if (command === "+") {
      move(state, rotation(72 * DEG));
    } else if (command === "*") {
      move(state, rotation(144 * DEG));
    } else if (command === "-") {
      move(state, rotation(288 * DEG));
    } else if (command === "_") {
      move(state, rotation(216 * DEG));
    } else if (command === ">") {
      move(state, rotation(Math.PI));
    } else if (command === "s") {
      state.step /= INFLATION;
    } else if (command === "f") {
      move(state, translation(0, (TAN54 * state.step) / 2));
    } else if (command === "F") {
      move(state, translation(0, TAN54 * state.step));
    } else if (command === "d") {
      move(state, translation(0, (TAN54 / 2 - TAN72 / 2 + SIN36) * state.step));
    } else if (command === "e") {
      move(state, translation(0, TAN54 * COS36 * state.step));
    } else if (Object.hasOwn(PRODUCTIONS, command)) {
      if (depth > 0) {
        if (tileIntersectsClip(command, state, clipRadius)) {
          state = interpret(PRODUCTIONS[command], depth - 1, state, tiles, clipRadius);
        }
      } else if (tileIntersectsClip(command, state, clipRadius)) {
        tiles.push({
          kind: TILE_KIND[command],
          points: OUTLINES[command].map((point) => apply(tileTransform(command, state), point)),
        });
      }
    }
  }
  return state;
}

export function generatePenroseP1(radius, density = 5) {
  const sideNeeded = (radius + 2) * 2 * Math.tan(36 * DEG);
  const levels = Math.max(
    3,
    Math.ceil(Math.log(sideNeeded) / Math.log(INFLATION)) + 1 + density - 5,
  );
  const tiles = [];
  interpret(
    "P",
    levels,
    { transform: IDENTITY, step: INFLATION ** levels },
    tiles,
    radius + 2,
  );
  return tiles;
}
