const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const INVERSE_GOLDEN_RATIO = 1 / GOLDEN_RATIO;

function interpolate(first, second, amount) {
  return {
    x: first.x + (second.x - first.x) * amount,
    y: first.y + (second.y - first.y) * amount,
  };
}

function pointAt(radius, degrees) {
  const angle = degrees * Math.PI / 180;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

function createKiteSeed(radius) {
  const origin = { x: 0, y: 0 };
  const halves = [];
  for (let index = 0; index < 5; index += 1) {
    const axis = 72 * index;
    halves.push(
      { kind: "kite", a: origin, b: pointAt(radius, axis - 36), c: pointAt(radius, axis) },
      { kind: "kite", a: origin, b: pointAt(radius, axis + 36), c: pointAt(radius, axis) },
    );
  }
  return halves;
}

function subdivideHalfTile(tile) {
  if (tile.kind === "kite") {
    const p = interpolate(tile.a, tile.b, INVERSE_GOLDEN_RATIO ** 2);
    const q = interpolate(tile.a, tile.c, INVERSE_GOLDEN_RATIO);
    return [
      { kind: "dart", a: p, b: q, c: tile.a },
      { kind: "kite", a: tile.b, b: p, c: q },
      { kind: "kite", a: tile.b, b: tile.c, c: q },
    ];
  }
  const g = interpolate(tile.c, tile.b, INVERSE_GOLDEN_RATIO);
  return [
    { kind: "kite", a: tile.c, b: g, c: tile.a },
    { kind: "dart", a: g, b: tile.a, c: tile.b },
  ];
}

function samePoint(first, second) {
  return Math.abs(first.x - second.x) < 0.00001
    && Math.abs(first.y - second.y) < 0.00001;
}

function axisKey(first, second) {
  return [
    `${Math.round(first.x * 100000)},${Math.round(first.y * 100000)}`,
    `${Math.round(second.x * 100000)},${Math.round(second.y * 100000)}`,
  ].sort().join("|");
}

function outlineForHalves(first, second) {
  const boundary = [first, second].flatMap((tile) => (
    [[tile.a, tile.b], [tile.b, tile.c], [tile.c, tile.a]].filter(([start, end]) => (
      !(samePoint(start, first.a) && samePoint(end, first.c))
      && !(samePoint(start, first.c) && samePoint(end, first.a))
    ))
  ));
  if (boundary.length !== 4) return [];

  const points = [boundary[0][0]];
  let endpoint = boundary[0][1];
  boundary.splice(0, 1);
  while (boundary.length) {
    points.push(endpoint);
    const edgeIndex = boundary.findIndex(([start, end]) => (
      samePoint(start, endpoint) || samePoint(end, endpoint)
    ));
    if (edgeIndex < 0) return [];
    const [start, end] = boundary.splice(edgeIndex, 1)[0];
    endpoint = samePoint(start, endpoint) ? end : start;
  }
  if (!samePoint(endpoint, points[0])) return [];
  let area = 0;
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    area += point.x * next.y - next.x * point.y;
  });
  return area < 0 ? points.reverse() : points;
}

function combineHalfTiles(halves) {
  // The shared a-c mirror axis pairs two Robinson half-tiles into one P2 tile.
  const axes = new Map();
  halves.forEach((tile) => {
    const key = axisKey(tile.a, tile.c);
    const pair = axes.get(key) || [];
    pair.push(tile);
    axes.set(key, pair);
  });

  const tiles = [];
  axes.forEach((pair) => {
    if (pair.length !== 2 || pair[0].kind !== pair[1].kind) return;
    const points = outlineForHalves(pair[0], pair[1]);
    if (points.length === 4) tiles.push({ kind: pair[0].kind, points });
  });
  return tiles;
}

export function generatePenroseP2(radius, density) {
  let halves = createKiteSeed(radius);
  for (let generation = 0; generation < density; generation += 1) {
    halves = halves.flatMap(subdivideHalfTile);
  }
  return combineHalfTiles(halves);
}
