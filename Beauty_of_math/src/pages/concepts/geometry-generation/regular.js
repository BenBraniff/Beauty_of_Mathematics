const SQRT3 = Math.sqrt(3);

function centeredPoints(points, x, y) {
  return points.map(([pointX, pointY]) => ({ x: pointX + x, y: pointY + y }));
}

export function generateRegularGeometry(type, width, height, size = 48) {
  const tiles = [];
  if (type === "square") {
    for (let y = -size; y < height + size; y += size) {
      for (let x = -size; x < width + size; x += size) {
        tiles.push({
          kind: "square",
          points: centeredPoints([[0, 0], [size, 0], [size, size], [0, size]], x, y),
        });
      }
    }
    return tiles;
  }

  const triangleHeight = size * SQRT3 / 2;
  if (type === "triangle") {
    for (let row = -2; row < height / triangleHeight + 2; row += 1) {
      for (let column = -12; column < width / size + 13; column += 1) {
        const x = column * size + row * size / 2;
        const y = row * triangleHeight;
        tiles.push(
          { kind: "triangle", points: centeredPoints([[x, y], [x + size, y], [x + size / 2, y + triangleHeight]], 0, 0) },
          { kind: "triangle", points: centeredPoints([[x + size, y], [x + size * 1.5, y + triangleHeight], [x + size / 2, y + triangleHeight]], 0, 0) },
        );
      }
    }
    return tiles;
  }

  const hexWidth = size * 1.5;
  const hexHeight = SQRT3 * size;
  for (let column = -2; column < width / hexWidth + 2; column += 1) {
    for (let row = -2; row < height / hexHeight + 2; row += 1) {
      const centerX = column * hexWidth;
      const centerY = row * hexHeight + (column % 2) * hexHeight / 2;
      tiles.push({
        kind: "hexagon",
        points: Array.from({ length: 6 }, (_, index) => {
          const angle = Math.PI / 3 * index;
          return {
            x: centerX + size * Math.cos(angle),
            y: centerY + size * Math.sin(angle),
          };
        }),
      });
    }
  }
  return tiles;
}

export function generatePentagonalGeometry(width, height, density = 5) {
  const scale = 5 / density;
  const cell = 185.616 * scale;
  const origin = 350;
  const pentagons = [
    [[350.798, 440.491], [418.267, 415.352], [443.406, 482.82], [392.241, 533.498], [325.015, 507.717]],
    [[443.406, 482.82], [418.267, 415.352], [485.734, 390.211], [536.413, 440.89], [510.631, 508.116]],
    [[485.734, 390.211], [418.265, 415.352], [393.126, 347.883], [444.291, 297.204], [511.517, 322.985]],
    [[393.126, 347.883], [418.267, 415.352], [350.798, 440.491], [300.119, 389.326], [325.9, 322.1]],
  ].map((points) => points.map(([x, y]) => [x - origin, y - origin]));
  const tiles = [];
  for (let row = -4; row < height / cell + 4; row += 1) {
    for (let column = -4; column < width / cell + 4; column += 1) {
      pentagons.forEach((points, index) => {
        tiles.push({
          kind: index % 2,
          points: centeredPoints(
            points.map(([x, y]) => [x * scale, y * scale]),
            width / 2 + column * cell,
            height / 2 + row * cell,
          ),
        });
      });
    }
  }
  return tiles;
}
