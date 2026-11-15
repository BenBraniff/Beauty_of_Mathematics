import assert from "node:assert/strict";
import test from "node:test";
import { generatePenroseP1 } from "./penroseP1.js";
import { generatePenroseP2 } from "./penroseP2.js";
import { generatePenroseP3 } from "./penroseP3.js";
import { generateTilingGeometry } from "./index.js";

const edgeKey = (first, second) => [
  `${Math.round(first.x * 1e6)},${Math.round(first.y * 1e6)}`,
  `${Math.round(second.x * 1e6)},${Math.round(second.y * 1e6)}`,
].sort().join("|");

test("P1 generator returns valid tiles with unit-length matching edges", () => {
  const tiles = generatePenroseP1(10);
  assert.ok(tiles.length > 10);
  assert.deepEqual(
    [...new Set(tiles.map(({ kind }) => kind))].sort(),
    [0, 1, 2, 3, 4, 5],
  );
  assert.ok(tiles.every(({ kind, points }) => (
    Number.isInteger(kind)
    && kind >= 0
    && kind < 6
    && points.length >= 4
    && points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))
  )));

  const edgeCounts = new Map();
  tiles.forEach(({ points }) => {
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const length = Math.hypot(next.x - point.x, next.y - point.y);
      assert.ok(Math.abs(length - 1) < 1e-8, `unexpected edge length ${length}`);
      const key = edgeKey(point, next);
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    });

  });
  assert.ok([...edgeCounts.values()].every((count) => count === 1 || count === 2));
  assert.ok([...edgeCounts.values()].some((count) => count === 2));
});

test("P2 substitution returns complete kite-and-dart pairs", () => {
  const density = 3;
  const tiles = generatePenroseP2(10, density);
  assert.ok(tiles.length > 10);
  assert.deepEqual([...new Set(tiles.map(({ kind }) => kind))].sort(), ["dart", "kite"]);

  const expectedTileCount = [5, 15, 35, 95][density];
  assert.equal(tiles.length, expectedTileCount);
  const edgeCounts = new Map();
  tiles.forEach(({ kind, points }) => {
    assert.equal(points.length, 4);
    points.forEach((point, index) => {
      const key = edgeKey(point, points[(index + 1) % points.length]);
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    });
    const angles = points.map((point, index) => {
      const previous = points[(index + 3) % 4];
      const next = points[(index + 1) % 4];
      const first = Math.atan2(previous.y - point.y, previous.x - point.x);
      const second = Math.atan2(next.y - point.y, next.x - point.x);
      let angle = (second - first + Math.PI * 2) % (Math.PI * 2);
      if (angle > Math.PI) angle = Math.PI * 2 - angle;
      const cross = (point.x - previous.x) * (next.y - point.y)
        - (point.y - previous.y) * (next.x - point.x);
      if (cross < 0) angle = Math.PI * 2 - angle;
      return angle * 180 / Math.PI;
    }).sort((a, b) => a - b);
    const expected = kind === "kite" ? [72, 72, 72, 144] : [36, 36, 72, 216];
    angles.forEach((angle, index) => {
      assert.ok(Math.abs(angle - expected[index]) < 0.01, `${kind} angle ${angle}`);
    });
  });
  assert.ok([...edgeCounts.values()].every((count) => count === 1 || count === 2));
  assert.ok([...edgeCounts.values()].some((count) => count === 2));
});

test("P3 deflation returns thick and thin rhombi with matching edges", () => {
  const tiles = generatePenroseP3(10, 4);
  assert.ok(tiles.length > 10);
  assert.deepEqual([...new Set(tiles.map(({ kind }) => kind))].sort(), ["thick", "thin"]);
  const edgeCounts = new Map();
  let commonSideLength;

  tiles.forEach(({ kind, points }) => {
    assert.equal(points.length, 4);
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      const length = Math.hypot(next.x - point.x, next.y - point.y);
      commonSideLength ??= length;
      assert.ok(Math.abs(length - commonSideLength) < 1e-8);
      const key = edgeKey(point, next);
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    });
    const angles = points.map((point, index) => {
      const previous = points[(index + 3) % 4];
      const next = points[(index + 1) % 4];
      const first = Math.atan2(previous.y - point.y, previous.x - point.x);
      const second = Math.atan2(next.y - point.y, next.x - point.x);
      let angle = (second - first + Math.PI * 2) % (Math.PI * 2);
      if (angle > Math.PI) angle = Math.PI * 2 - angle;
      return angle * 180 / Math.PI;
    }).sort((a, b) => a - b);
    const expected = kind === "thin" ? [36, 36, 144, 144] : [72, 72, 108, 108];
    angles.forEach((angle, index) => {
      assert.ok(Math.abs(angle - expected[index]) < 0.01, `${kind} angle ${angle}`);
    });
  });

  assert.ok([...edgeCounts.values()].every((count) => count === 1 || count === 2));
  assert.ok([...edgeCounts.values()].some((count) => count === 2));
});

test("P3 viewport generator returns generated geometry at the selected density", () => {
  const sparse = generateTilingGeometry("penroseP3", 800, 420, { density: 2 });
  const dense = generateTilingGeometry("penroseP3", 800, 420, { density: 4 });
  assert.ok(dense.length > sparse.length);
  assert.ok(dense.every(({ kind, points }) => (
    ["thick", "thin"].includes(kind)
    && points.length === 4
    && points.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))
  )));
});

test("the shared density setting produces finer geometry for every tiling", () => {
  const types = [
    "square",
    "triangle",
    "hexagon",
    "einstein",
    "penroseP1",
    "penroseP2",
    "penroseP3",
    "pentagonal",
  ];
  types.forEach((type) => {
    const coarse = generateTilingGeometry(type, 800, 420, { density: 1 });
    const fine = generateTilingGeometry(type, 800, 420, { density: 7 });
    const measurements = (tiles) => {
      const lengths = tiles.flatMap(({ points }) => points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        return Math.hypot(next.x - point.x, next.y - point.y);
      }));
      const bounds = tiles.flatMap(({ points }) => points).reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y),
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
      const meanDiagonal = tiles.reduce((sum, { points }) => {
        const xs = points.map(({ x }) => x);
        const ys = points.map(({ y }) => y);
        return sum + Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
      }, 0) / tiles.length;
      return {
        meanEdge: lengths.reduce((sum, length) => sum + length, 0) / lengths.length,
        meanDiagonal,
        bounds,
      };
    };
    const coarseMetrics = measurements(coarse);
    const fineMetrics = measurements(fine);
    const coarseSize = type === "einstein" ? coarseMetrics.meanDiagonal : coarseMetrics.meanEdge;
    const fineSize = type === "einstein" ? fineMetrics.meanDiagonal : fineMetrics.meanEdge;
    const expectedSizeFactor = type === "einstein" ? Math.SQRT2 : 1;

    assert.ok(fine.length > coarse.length, `${type} should generate more tiles at higher density`);
    assert.ok(fineSize < coarseSize, `${type} should have smaller tiles at higher density`);
    const coarseTarget = 240 * expectedSizeFactor;
    const fineTarget = 240 / 7 * expectedSizeFactor;
    assert.ok(Math.abs(coarseSize - coarseTarget) < coarseTarget * 0.05, `${type} coarse tile sizes should be consistent`);
    assert.ok(Math.abs(fineSize - fineTarget) < fineTarget * 0.05, `${type} fine tile sizes should be consistent`);
    [coarseMetrics, fineMetrics].forEach(({ bounds }) => {
      assert.ok(bounds.minX <= 0 && bounds.maxX >= 800, `${type} patch should cover viewport width`);
      assert.ok(bounds.minY <= 0 && bounds.maxY >= 420, `${type} patch should cover viewport height`);
    });
  });
});

test("Einstein geometry supports density 10 with a consistent visual footprint", () => {
  const tiles = generateTilingGeometry("einstein", 800, 420, { density: 10 });
  const meanDiagonal = tiles.reduce((sum, { points }) => {
    const xs = points.map(({ x }) => x);
    const ys = points.map(({ y }) => y);
    return sum + Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  }, 0) / tiles.length;

  assert.ok(tiles.length > 0);
  assert.ok(tiles.length < 2000, "only viewport tiles should be returned");
  assert.ok(Math.abs(meanDiagonal - 24 * Math.SQRT2) < 24 * Math.SQRT2 * 0.05);
  assert.ok(tiles.every(({ points }) => {
    const xs = points.map(({ x }) => x);
    const ys = points.map(({ y }) => y);
    return Math.max(...xs) >= 0
      && Math.min(...xs) <= 800
      && Math.max(...ys) >= 0
      && Math.min(...ys) <= 420;
  }), "returned tiles should intersect the viewport");
});
