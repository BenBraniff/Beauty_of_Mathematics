import assert from "node:assert/strict";
import test from "node:test";
import { generateTilingGeometry } from "./index.js";
import { colorAdjacentTiles } from "./tileColoring.js";

function edgeKey(first, second) {
  const pointKey = ({ x, y }) => `${Math.round(x * 100000)},${Math.round(y * 100000)}`;
  return [pointKey(first), pointKey(second)].sort().join("|");
}

test("visible P2 tiles can be randomly colored with RGB without matching shared edges", () => {
  const tiles = generateTilingGeometry("penroseP2", 800, 420, { density: 7 }).filter(({ points }) => {
    const xs = points.map(({ x }) => x);
    const ys = points.map(({ y }) => y);
    return Math.max(...xs) >= 0
      && Math.min(...xs) <= 800
      && Math.max(...ys) >= 0
      && Math.min(...ys) <= 420;
  });
  const colors = colorAdjacentTiles(tiles);
  const edges = new Map();

  tiles.forEach(({ points }, tileIndex) => {
    points.forEach((point, pointIndex) => {
      const key = edgeKey(point, points[(pointIndex + 1) % points.length]);
      const adjacent = edges.get(key) || [];
      adjacent.push(tileIndex);
      edges.set(key, adjacent);
    });
  });

  assert.ok(colors.every((color) => color >= 0 && color <= 2), "visible tiles should use red, green, or blue");
  edges.forEach((tileIndices) => {
    if (tileIndices.length === 2) {
      assert.notEqual(colors[tileIndices[0]], colors[tileIndices[1]], "tiles sharing an edge should differ");
    }
  });
});
