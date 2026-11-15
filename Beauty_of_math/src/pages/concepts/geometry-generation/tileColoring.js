function pointKey(point) {
  return `${Math.round(point.x * 100000)},${Math.round(point.y * 100000)}`;
}

function sharedEdgeKey(first, second) {
  return [pointKey(first), pointKey(second)].sort().join("|");
}

function saturation(mask) {
  let count = 0;
  for (let remaining = mask; remaining; remaining &= remaining - 1) count += 1;
  return count;
}

function adjacencyForTiles(tiles) {
  const neighbors = Array.from({ length: tiles.length }, () => []);
  const edges = new Map();
  tiles.forEach(({ points }, tileIndex) => {
    points.forEach((point, pointIndex) => {
      const next = points[(pointIndex + 1) % points.length];
      const key = sharedEdgeKey(point, next);
      const adjacent = edges.get(key) || [];
      adjacent.push(tileIndex);
      edges.set(key, adjacent);
    });
  });
  edges.forEach((tileIndices) => {
    for (let first = 0; first < tileIndices.length; first += 1) {
      for (let second = first + 1; second < tileIndices.length; second += 1) {
        neighbors[tileIndices[first]].push(tileIndices[second]);
        neighbors[tileIndices[second]].push(tileIndices[first]);
      }
    }
  });
  return neighbors;
}

function colorWithRgb(neighbors) {
  const colors = new Int8Array(neighbors.length).fill(-1);
  let visitedNodes = 0;

  const search = (coloredCount) => {
    if (coloredCount === neighbors.length) return true;
    visitedNodes += 1;
    if (visitedNodes > 10000) return false;

    let selected = -1;
    let selectedMask = 0;
    let selectedSaturation = -1;
    let selectedDegree = -1;
    for (let tile = 0; tile < neighbors.length; tile += 1) {
      if (colors[tile] >= 0) continue;
      let mask = 0;
      neighbors[tile].forEach((neighbor) => {
        if (colors[neighbor] >= 0) mask |= 1 << colors[neighbor];
      });
      const currentSaturation = saturation(mask);
      if (currentSaturation > selectedSaturation
        || (currentSaturation === selectedSaturation && neighbors[tile].length > selectedDegree)
        || (currentSaturation === selectedSaturation
          && neighbors[tile].length === selectedDegree
          && (selected < 0 || tile < selected))) {
        selected = tile;
        selectedMask = mask;
        selectedSaturation = currentSaturation;
        selectedDegree = neighbors[tile].length;
      }
    }

    let choices = [0, 1, 2].filter((color) => !(selectedMask & (1 << color)));
    if (choices.length === 0) return false;
    for (const color of choices) {
      colors[selected] = color;
      if (search(coloredCount + 1)) return true;
      colors[selected] = -1;
    }
    return false;
  };

  if (!search(0)) return null;
  const permutation = [0, 1, 2];
  for (let index = permutation.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [permutation[index], permutation[swapIndex]] = [permutation[swapIndex], permutation[index]];
  }
  return colors.map((color) => permutation[color]);
}

function colorWithFallback(neighbors) {
  const colors = new Int8Array(neighbors.length).fill(-1);

  const neighborColors = new Uint8Array(neighbors.length);
  const tieBreakers = Uint32Array.from({ length: neighbors.length }, () => Math.random() * 0x100000000);
  const heap = Array.from({ length: neighbors.length }, (_, index) => index);
  const positions = Int32Array.from({ length: neighbors.length }, (_, index) => index);

  const higherPriority = (first, second) => {
    const firstSaturation = saturation(neighborColors[first]);
    const secondSaturation = saturation(neighborColors[second]);
    return firstSaturation > secondSaturation
      || (firstSaturation === secondSaturation && neighbors[first].length > neighbors[second].length)
      || (firstSaturation === secondSaturation
        && neighbors[first].length === neighbors[second].length
        && tieBreakers[first] > tieBreakers[second]);
  };
  const swap = (first, second) => {
    [heap[first], heap[second]] = [heap[second], heap[first]];
    positions[heap[first]] = first;
    positions[heap[second]] = second;
  };
  const siftUp = (start) => {
    let index = start;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (!higherPriority(heap[index], heap[parent])) break;
      swap(index, parent);
      index = parent;
    }
  };
  const siftDown = (start) => {
    let index = start;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let highest = index;
      if (left < heap.length && higherPriority(heap[left], heap[highest])) highest = left;
      if (right < heap.length && higherPriority(heap[right], heap[highest])) highest = right;
      if (highest === index) break;
      swap(index, highest);
      index = highest;
    }
  };

  for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index -= 1) siftDown(index);
  let remaining = heap.length;
  while (remaining > 0) {
    const tileIndex = heap[0];
    remaining -= 1;
    if (remaining > 0) {
      heap[0] = heap.pop();
      positions[heap[0]] = 0;
      siftDown(0);
    } else {
      heap.pop();
    }
    positions[tileIndex] = -1;

    let availableMask = 0b11111;
    for (const neighbor of neighbors[tileIndex]) {
      if (colors[neighbor] >= 0) availableMask &= ~(1 << colors[neighbor]);
    }
    const rgbMask = availableMask & 0b111;
    const choicesMask = rgbMask || availableMask;
    if (choicesMask === 0) throw new Error("Unable to color adjacent Penrose tiles.");
    const availableColors = [];
    for (let color = 0; color < 5; color += 1) {
      if (choicesMask & (1 << color)) availableColors.push(color);
    }
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    colors[tileIndex] = color;

    for (const neighbor of neighbors[tileIndex]) {
      if (positions[neighbor] < 0) continue;
      const updatedMask = neighborColors[neighbor] | (1 << color);
      if (updatedMask === neighborColors[neighbor]) continue;
      neighborColors[neighbor] = updatedMask;
      siftUp(positions[neighbor]);
    }
  }
  return colors;
}

export function colorAdjacentTiles(tiles) {
  const neighbors = adjacencyForTiles(tiles);
  return colorWithRgb(neighbors) || colorWithFallback(neighbors);
}
