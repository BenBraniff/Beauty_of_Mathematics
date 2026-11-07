function stabilize(grid, size) {
  const totalCells = size * size;
  const queued = new Uint8Array(totalCells);
  const queue = [];

  const enqueue = (index) => {
    if (grid[index] >= 4 && !queued[index]) {
      queued[index] = 1;
      queue.push(index);
    }
  };
  for (let index = 0; index < totalCells; index += 1) enqueue(index);

  while (queue.length) {
    const index = queue.pop();
    queued[index] = 0;
    const topples = Math.floor(grid[index] / 4);
    if (!topples) continue;

    const x = index % size;
    const y = Math.floor(index / size);
    grid[index] -= topples * 4;
    if (x > 0) {
      grid[index - 1] += topples;
      enqueue(index - 1);
    }
    if (x < size - 1) {
      grid[index + 1] += topples;
      enqueue(index + 1);
    }
    if (y > 0) {
      grid[index - size] += topples;
      enqueue(index - size);
    }
    if (y < size - 1) {
      grid[index + size] += topples;
      enqueue(index + size);
    }
    enqueue(index);
  }
  return grid;
}

function createIdentity(size) {
  const maxStable = new Int32Array(size * size);
  maxStable.fill(3);
  const doubledMaxStable = maxStable.map((value) => value * 2);
  const stabilized = stabilize(doubledMaxStable, size);
  const identitySeed = stabilized.map((value) => 6 - value);
  return Uint8Array.from(stabilize(identitySeed, size));
}

self.onmessage = (event) => {
  if (event.data.type !== "generate") return;
  const startedAt = performance.now();
  const grid = createIdentity(event.data.size);
  const elapsed = (performance.now() - startedAt) / 1000;
  self.postMessage({ type: "complete", elapsed, grid }, [grid.buffer]);
};
