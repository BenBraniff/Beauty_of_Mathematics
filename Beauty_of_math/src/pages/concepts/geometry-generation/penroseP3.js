const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const INVERSE_GOLDEN_RATIO = 1 / GOLDEN_RATIO;
const POINT_QUANTUM = 100000;

// Robinson-triangle P3 deflation rules: https://github.com/Ginden/tilings/blob/99b847fb87934db5a7d33f69bf67ed9b5b7b319d/src/tilings/penrose.ts
function interpolate(first, second, amount) {
  return {
    x: first.x + (second.x - first.x) * amount,
    y: first.y + (second.y - first.y) * amount,
  };
}

function createSunSeed(radius) {
  const origin = { x: 0, y: 0 };
  return Array.from({ length: 10 }, (_, index) => {
    const firstAngle = (2 * index - 1) * Math.PI / 10;
    const secondAngle = (2 * index + 1) * Math.PI / 10;
    const first = {
      x: radius * Math.cos(firstAngle),
      y: radius * Math.sin(firstAngle),
    };
    const second = {
      x: radius * Math.cos(secondAngle),
      y: radius * Math.sin(secondAngle),
    };
    return {
      kind: 0,
      a: origin,
      b: index % 2 === 0 ? second : first,
      c: index % 2 === 0 ? first : second,
    };
  });
}

function subdivideRobinsonTriangle(triangle) {
  const { a, b, c } = triangle;
  if (triangle.kind === 0) {
    const p = interpolate(a, b, INVERSE_GOLDEN_RATIO);
    return [
      { kind: 0, a: c, b: p, c: b },
      { kind: 1, a: p, b: c, c: a },
    ];
  }
  const q = interpolate(b, a, INVERSE_GOLDEN_RATIO);
  const r = interpolate(b, c, INVERSE_GOLDEN_RATIO);
  return [
    { kind: 1, a: r, b: c, c: a },
    { kind: 1, a: q, b: r, c: b },
    { kind: 0, a: r, b: q, c: a },
  ];
}

function pointKey(point) {
  return `${Math.round(point.x * POINT_QUANTUM)},${Math.round(point.y * POINT_QUANTUM)}`;
}

function edgeKey(first, second) {
  return [pointKey(first), pointKey(second)].sort().join("|");
}

function isMirror(first, second, point, candidate) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const lengthSquared = dx * dx + dy * dy;
  const relativeX = point.x - first.x;
  const relativeY = point.y - first.y;
  const amount = (relativeX * dx + relativeY * dy) / lengthSquared;
  const reflected = {
    x: first.x + 2 * amount * dx - relativeX,
    y: first.y + 2 * amount * dy - relativeY,
  };
  return Math.hypot(reflected.x - candidate.x, reflected.y - candidate.y)
    < Math.sqrt(lengthSquared) * 1e-6;
}

function orderedQuadrilateral(points) {
  const center = points.reduce(
    (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
    { x: 0, y: 0 },
  );
  center.x /= points.length;
  center.y /= points.length;
  return points.sort((first, second) => (
    Math.atan2(first.y - center.y, first.x - center.x)
    - Math.atan2(second.y - center.y, second.x - center.x)
  ));
}

function combineHalfRhombs(triangles) {
  const edges = new Map();
  triangles.forEach((triangle) => {
    const key = edgeKey(triangle.b, triangle.c);
    const matches = edges.get(key) || [];
    matches.push(triangle);
    edges.set(key, matches);
  });

  const used = new Set();
  const rhombi = [];
  edges.forEach((matches) => {
    if (matches.length < 2) return;
    for (let firstIndex = 0; firstIndex < matches.length; firstIndex += 1) {
      const first = matches[firstIndex];
      if (used.has(first)) continue;
      for (let secondIndex = firstIndex + 1; secondIndex < matches.length; secondIndex += 1) {
        const second = matches[secondIndex];
        if (used.has(second) || first.kind !== second.kind) continue;
        if (!isMirror(first.b, first.c, first.a, second.a)) continue;
        used.add(first);
        used.add(second);
        rhombi.push({
          kind: first.kind === 0 ? "thin" : "thick",
          points: orderedQuadrilateral([first.a, first.b, second.a, first.c]),
        });
        break;
      }
    }
  });
  return rhombi;
}

/**
 * Generate a finite P3 patch from Robinson-triangle deflation.
 * Kind 0 is an acute golden triangle; kind 1 is an obtuse golden gnomon.
 */
export function generatePenroseP3(radius, density) {
  let triangles = createSunSeed(radius);
  for (let generation = 0; generation < density; generation += 1) {
    triangles = triangles.flatMap(subdivideRobinsonTriangle);
  }
  return combineHalfRhombs(triangles);
}
