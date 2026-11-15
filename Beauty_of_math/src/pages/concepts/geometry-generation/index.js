import { generateEinsteinGeometry } from "./einstein.js";
import { generatePenroseP1 } from "./penroseP1.js";
import { generatePenroseP2 } from "./penroseP2.js";
import { generatePenroseP3 } from "./penroseP3.js";
import { generatePentagonalGeometry, generateRegularGeometry } from "./regular.js";

function normalizeTileSizeAndCenter(tiles, targetSize, width, height, matchSquareFootprint = false) {
  const points = tiles.flatMap((tile) => tile.points);
  if (points.length === 0) return tiles;
  const edgeLengths = tiles.flatMap((tile) => tile.points.map((point, index) => {
    const next = tile.points[(index + 1) % tile.points.length];
    return Math.hypot(next.x - point.x, next.y - point.y);
  }));
  const meanEdgeLength = edgeLengths.reduce((sum, length) => sum + length, 0) / edgeLengths.length;
  const meanTileDiagonal = matchSquareFootprint
    ? tiles.reduce((sum, tile) => {
      const xs = tile.points.map(({ x }) => x);
      const ys = tile.points.map(({ y }) => y);
      return sum + Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    }, 0) / tiles.length
    : meanEdgeLength;
  const scale = (matchSquareFootprint ? targetSize * Math.SQRT2 : targetSize) / meanTileDiagonal;
  const bounds = points.reduce((result, point) => ({
    minX: Math.min(result.minX, point.x),
    maxX: Math.max(result.maxX, point.x),
    minY: Math.min(result.minY, point.y),
    maxY: Math.max(result.maxY, point.y),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  const offsetX = width / 2 - ((bounds.minX + bounds.maxX) * scale) / 2;
  const offsetY = height / 2 - ((bounds.minY + bounds.maxY) * scale) / 2;
  return tiles.map((tile) => ({
    ...tile,
    points: tile.points.map(({ x, y }) => ({
      x: x * scale + offsetX,
      y: y * scale + offsetY,
    })),
  }));
}

export function generateTilingGeometry(type, width, height, options = {}) {
  const density = options.density ?? 5;
  const targetTileSize = 240 / density;
  let tiles;
  if (type === "einstein") {
    return generateEinsteinGeometry(density, { width, height, targetTileSize });
  } else if (type === "penroseP1") {
    const radius = Math.max(width, height) * 1.4 / targetTileSize;
    tiles = generatePenroseP1(radius, density);
  } else if (type === "penroseP2") {
    const radius = Math.max(width, height) * 0.7;
    tiles = generatePenroseP2(radius, density + 2);
  } else if (type === "penroseP3") {
    const radius = Math.max(width, height) * 0.7;
    tiles = generatePenroseP3(radius, density + 2);
  } else if (type === "pentagonal") {
    tiles = generatePentagonalGeometry(width, height, density);
  } else if (["square", "triangle", "hexagon"].includes(type)) {
    tiles = generateRegularGeometry(type, width, height, targetTileSize);
  } else {
    throw new Error(`No geometry generator registered for tiling: ${type}`);
  }
  return normalizeTileSizeAndCenter(tiles, targetTileSize, width, height, type === "einstein");
}
