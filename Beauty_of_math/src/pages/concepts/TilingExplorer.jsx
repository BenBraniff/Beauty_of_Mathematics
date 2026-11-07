import { useEffect, useRef, useState } from "react";
import einsteinPattern from "../../assets/einstein_tiles_3.png";

const TILINGS = {
  square: { name: "Square grid", description: "Four right angles meet at every vertex.", detail: "Regular, periodic", color: "#e5875d" },
  triangle: { name: "Equilateral triangles", description: "Six equal triangles meet around every vertex.", detail: "Regular, periodic", color: "#5b9bd5" },
  hexagon: { name: "Hexagonal tiling", description: "Three regular hexagons meet at every vertex.", detail: "Regular, periodic", color: "#63b58c" },
  einstein: { name: "Einstein tiles", description: "A single hat-shaped tile can cover the plane without repeating.", detail: "Aperiodic", color: "#b77acb" },
};

const SQRT3 = Math.sqrt(3);
const Y_AXIS = [0.5, SQRT3 / 2];
const identity = [1, 0, 0, 0, 1, 0];
const EINSTEIN_REFERENCE = new Image();
EINSTEIN_REFERENCE.src = einsteinPattern;

function vector(x, y) {
  return { x, y };
}

function hexToCart(x, y) {
  return vector(x + Y_AXIS[0] * y, Y_AXIS[1] * y);
}

function multiply(a, b) {
  return [
    a[0] * b[0] + a[1] * b[3],
    a[0] * b[1] + a[1] * b[4],
    a[0] * b[2] + a[1] * b[5] + a[2],
    a[3] * b[0] + a[4] * b[3],
    a[3] * b[1] + a[4] * b[4],
    a[3] * b[2] + a[4] * b[5] + a[5],
  ];
}

function transform(matrix, point) {
  return vector(
    matrix[0] * point.x + matrix[1] * point.y + matrix[2],
    matrix[3] * point.x + matrix[4] * point.y + matrix[5],
  );
}

function inverse(matrix) {
  const determinant = matrix[0] * matrix[4] - matrix[1] * matrix[3];
  return [
    matrix[4] / determinant,
    -matrix[1] / determinant,
    (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / determinant,
    -matrix[3] / determinant,
    matrix[0] / determinant,
    (matrix[2] * matrix[3] - matrix[0] * matrix[5]) / determinant,
  ];
}

function matchSegment(first, second, targetFirst, targetSecond) {
  const source = [
    second.x - first.x, first.y - second.y, first.x,
    second.y - first.y, second.x - first.x, first.y,
  ];
  const target = [
    targetSecond.x - targetFirst.x, targetFirst.y - targetSecond.y, targetFirst.x,
    targetSecond.y - targetFirst.y, targetSecond.x - targetFirst.x, targetFirst.y,
  ];
  return multiply(target, inverse(source));
}

function rotateAround(point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return multiply(
    [1, 0, point.x, 0, 1, point.y],
    multiply([cos, -sin, 0, sin, cos, 0], [1, 0, -point.x, 0, 1, -point.y]),
  );
}

function add(first, second) {
  return vector(first.x + second.x, first.y + second.y);
}

function subtract(first, second) {
  return vector(first.x - second.x, first.y - second.y);
}

const HAT_OUTLINE = [
  hexToCart(0, 0), hexToCart(-1, -1), hexToCart(0, -2), hexToCart(2, -2),
  hexToCart(2, -1), hexToCart(4, -2), hexToCart(5, -1), hexToCart(4, 0),
  hexToCart(3, 0), hexToCart(2, 2), hexToCart(0, 3), hexToCart(0, 2),
  hexToCart(-1, 2),
];

function hat(label) {
  return { label, shape: HAT_OUTLINE };
}

function metaTile(shape, width) {
  return { shape, width, children: [] };
}

function addChild(parent, matrix, geometry) {
  parent.children.push({ matrix, geometry });
}

function evaluateChild(parent, childIndex, pointIndex) {
  const child = parent.children[childIndex];
  return transform(child.matrix, child.geometry.shape[pointIndex]);
}

function HInit() {
  const outline = [vector(0, 0), vector(4, 0), vector(4.5, Y_AXIS[1]), vector(2.5, 5 * Y_AXIS[1]), vector(1.5, 5 * Y_AXIS[1]), vector(-Y_AXIS[0], Y_AXIS[1])];
  const meta = metaTile(outline, 2);
  addChild(meta, matchSegment(HAT_OUTLINE[5], HAT_OUTLINE[7], outline[5], outline[0]), hat("H"));
  addChild(meta, matchSegment(HAT_OUTLINE[9], HAT_OUTLINE[11], outline[1], outline[2]), hat("H"));
  addChild(meta, matchSegment(HAT_OUTLINE[5], HAT_OUTLINE[7], outline[3], outline[4]), hat("H"));
  addChild(meta, multiply([1, 0, 2.5, 0, 1, Y_AXIS[1]], multiply([-Y_AXIS[0], -Y_AXIS[1], 0, Y_AXIS[1], -Y_AXIS[0], 0], [Y_AXIS[0], 0, 0, 0, -Y_AXIS[0], 0])), hat("H1"));
  return meta;
}

function TInit() {
  const outline = [vector(0, 0), vector(3, 0), vector(1.5, 3 * Y_AXIS[1])];
  const meta = metaTile(outline, 2);
  addChild(meta, [Y_AXIS[0], 0, Y_AXIS[0], 0, Y_AXIS[0], Y_AXIS[1]], hat("T"));
  return meta;
}

function PInit() {
  const outline = [vector(0, 0), vector(4, 0), vector(3, 2 * Y_AXIS[1]), vector(-1, 2 * Y_AXIS[1])];
  const meta = metaTile(outline, 2);
  addChild(meta, [Y_AXIS[0], 0, 1.5, 0, Y_AXIS[0], Y_AXIS[1]], hat("P"));
  addChild(meta, multiply([1, 0, 0, 0, 1, 2 * Y_AXIS[1]], multiply([Y_AXIS[0], Y_AXIS[1], 0, -Y_AXIS[1], Y_AXIS[0], 0], [Y_AXIS[0], 0, 0, 0, Y_AXIS[0], 0])), hat("P"));
  return meta;
}

function FInit() {
  const outline = [vector(0, 0), vector(3, 0), vector(3.5, Y_AXIS[1]), vector(3, 2 * Y_AXIS[1]), vector(-1, 2 * Y_AXIS[1])];
  const meta = metaTile(outline, 2);
  addChild(meta, [Y_AXIS[0], 0, 1.5, 0, Y_AXIS[0], Y_AXIS[1]], hat("F"));
  addChild(meta, multiply([1, 0, 0, 0, 1, 2 * Y_AXIS[1]], multiply([Y_AXIS[0], Y_AXIS[1], 0, -Y_AXIS[1], Y_AXIS[0], 0], [Y_AXIS[0], 0, 0, 0, Y_AXIS[0], 0])), hat("F"));
  return meta;
}

function constructPatch(H, T, P, F) {
  const shapes = { H, T, P, F };
  const rules = [
    ["H"], [0, 0, "P", 2], [1, 0, "H", 2], [2, 0, "P", 2], [3, 0, "H", 2],
    [4, 4, "P", 2], [0, 4, "F", 3], [2, 4, "F", 3], [4, 1, 3, 2, "F", 0],
    [8, 3, "H", 0], [9, 2, "P", 0], [10, 2, "H", 0], [11, 4, "P", 2],
    [12, 0, "H", 2], [13, 0, "F", 3], [14, 2, "F", 1], [15, 3, "H", 4],
    [8, 2, "F", 1], [17, 3, "H", 0], [18, 2, "P", 0], [19, 2, "H", 2],
    [20, 4, "F", 3], [20, 0, "P", 2], [22, 0, "H", 2], [23, 4, "F", 3],
    [23, 0, "F", 3], [16, 0, "P", 2], [9, 4, 0, 2, "T", 2], [4, 0, "F", 3],
  ];
  const result = metaTile([], H.width);
  rules.forEach((rule) => {
    if (rule.length === 1) {
      addChild(result, identity, shapes[rule[0]]);
    } else if (rule.length === 4) {
      const parent = result.children[rule[0]];
      const first = transform(parent.matrix, parent.geometry.shape[(rule[1] + 1) % parent.geometry.shape.length]);
      const second = transform(parent.matrix, parent.geometry.shape[rule[1]]);
      const shape = shapes[rule[2]];
      addChild(result, matchSegment(shape.shape[rule[3]], shape.shape[(rule[3] + 1) % shape.shape.length], first, second), shape);
    } else {
      const firstChild = result.children[rule[0]];
      const secondChild = result.children[rule[2]];
      const first = transform(secondChild.matrix, secondChild.geometry.shape[rule[3]]);
      const second = transform(firstChild.matrix, firstChild.geometry.shape[rule[1]]);
      const shape = shapes[rule[4]];
      addChild(result, matchSegment(shape.shape[rule[5]], shape.shape[(rule[5] + 1) % shape.shape.length], first, second), shape);
    }
  });
  return result;
}

function intersect(first, second, third, fourth) {
  const denominator = (fourth.y - third.y) * (second.x - first.x) - (fourth.x - third.x) * (second.y - first.y);
  const amount = ((fourth.x - third.x) * (first.y - third.y) - (fourth.y - third.y) * (first.x - third.x)) / denominator;
  return vector(first.x + amount * (second.x - first.x), first.y + amount * (second.y - first.y));
}

function recenter(tile) {
  const center = tile.shape.reduce((sum, point) => add(sum, point), vector(0, 0));
  center.x /= tile.shape.length;
  center.y /= tile.shape.length;
  tile.shape = tile.shape.map((point) => subtract(point, center));
  const translation = [1, 0, -center.x, 0, 1, -center.y];
  tile.children.forEach((child) => { child.matrix = multiply(translation, child.matrix); });
}

function constructMetatiles(patch) {
  const bps1 = evaluateChild(patch, 8, 2);
  const bps2 = evaluateChild(patch, 21, 2);
  const rotated = transform(rotateAround(bps1, -2 * Math.PI / 3), bps2);
  const p72 = evaluateChild(patch, 7, 2);
  const p252 = evaluateChild(patch, 25, 2);
  const lowerLeft = intersect(bps1, rotated, evaluateChild(patch, 6, 2), p72);
  let width = subtract(evaluateChild(patch, 6, 2), lowerLeft);
  const hShape = [lowerLeft, bps1];
  width = transform([Math.cos(-Math.PI / 3), -Math.sin(-Math.PI / 3), 0, Math.sin(-Math.PI / 3), Math.cos(-Math.PI / 3), 0], width);
  hShape.push(add(hShape[1], width), evaluateChild(patch, 14, 2));
  width = transform([Math.cos(-Math.PI / 3), -Math.sin(-Math.PI / 3), 0, Math.sin(-Math.PI / 3), Math.cos(-Math.PI / 3), 0], width);
  hShape.push(subtract(hShape[3], width), evaluateChild(patch, 6, 2));
  const newH = metaTile(hShape, patch.width * 2);
  [0, 9, 16, 27, 26, 6, 1, 8, 10, 15].forEach((index) => addChild(newH, patch.children[index].matrix, patch.children[index].geometry));
  const newP = metaTile([p72, add(p72, subtract(bps1, lowerLeft)), bps1, lowerLeft], patch.width * 2);
  [7, 2, 3, 4, 28].forEach((index) => addChild(newP, patch.children[index].matrix, patch.children[index].geometry));
  const newF = metaTile([bps2, evaluateChild(patch, 24, 2), evaluateChild(patch, 25, 0), p252, add(p252, subtract(lowerLeft, bps1))], patch.width * 2);
  [21, 20, 22, 23, 24, 25].forEach((index) => addChild(newF, patch.children[index].matrix, patch.children[index].geometry));
  const a = hShape[2];
  const b = add(hShape[1], subtract(hShape[4], hShape[5]));
  const c = transform(rotateAround(b, -Math.PI / 3), a);
  const newT = metaTile([b, c, a], patch.width * 2);
  addChild(newT, patch.children[11].matrix, patch.children[11].geometry);
  [newH, newP, newF, newT].forEach(recenter);
  return [newH, newT, newP, newF];
}

function drawMetaTile(context, tile, matrix, level, scale, colors) {
  if (level > 0) {
    tile.children.forEach((child) => drawMetaTile(context, child.geometry, multiply(matrix, child.matrix), level - 1, scale, colors));
    return;
  }
  const points = tile.shape.map((point) => transform(matrix, point));
  context.beginPath();
  points.forEach((point, index) => {
    const draw = index === 0 ? context.moveTo : context.lineTo;
    draw.call(context, point.x * scale, point.y * scale);
  });
  context.closePath();
  context.fillStyle = colors[tile.label] || "#f4f4f4";
  context.fill();
  context.stroke();
}

function drawEinsteinTiling(context, width, height) {
  let tiles = [HInit(), TInit(), PInit(), FInit()];
  let level = 1;
  for (let generation = 1; generation < 4; generation += 1) {
    tiles = constructMetatiles(constructPatch(...tiles));
    level += 1;
  }
  const bounds = tiles[0].shape.reduce((current, point) => ({
    minX: Math.min(current.minX, point.x),
    maxX: Math.max(current.maxX, point.x),
    minY: Math.min(current.minY, point.y),
    maxY: Math.max(current.maxY, point.y),
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  const scale = Math.min(
    (width + 8) / (bounds.maxX - bounds.minX),
    (height + 8) / (bounds.maxY - bounds.minY),
  );
  context.save();
  context.translate(
    width / 2 - ((bounds.minX + bounds.maxX) * scale) / 2,
    height / 2 - ((bounds.minY + bounds.maxY) * scale) / 2,
  );
  context.lineWidth = 0.9;
  context.strokeStyle = "#20242b";
  drawMetaTile(context, tiles[0], [1, 0, 0, 0, 1, 0], level, scale, { H: "#9fcfe0", H1: "#777777", T: "#3131f2", P: "#cfcfcf", F: "#fafafa" });
  context.restore();
  if (EINSTEIN_REFERENCE.complete) {
    const imageScale = Math.max(width / EINSTEIN_REFERENCE.naturalWidth, height / EINSTEIN_REFERENCE.naturalHeight);
    const imageWidth = EINSTEIN_REFERENCE.naturalWidth * imageScale;
    const imageHeight = EINSTEIN_REFERENCE.naturalHeight * imageScale;
    context.drawImage(
      EINSTEIN_REFERENCE,
      (width - imageWidth) / 2,
      (height - imageHeight) / 2,
      imageWidth,
      imageHeight,
    );
  }
}

function polygon(context, points, offsetX = 0, offsetY = 0) {
  context.beginPath();
  points.forEach(([x, y], index) => {
    const draw = index === 0 ? context.moveTo : context.lineTo;
    draw.call(context, x + offsetX, y + offsetY);
  });
  context.closePath();
}

function drawRegularTiling(context, width, height, type) {
  const size = 48;
  context.lineWidth = 1.25;
  context.strokeStyle = "#fff8ef";
  context.fillStyle = TILINGS[type].color;
  if (type === "square") {
    for (let y = -size; y < height + size; y += size) {
      for (let x = -size; x < width + size; x += size) {
        context.fillRect(x, y, size, size);
        context.strokeRect(x, y, size, size);
      }
    }
    return;
  }
  const triangleHeight = size * SQRT3 / 2;
  if (type === "triangle") {
    for (let row = -2; row < height / triangleHeight + 2; row += 1) {
      for (let column = -12; column < width / size + 13; column += 1) {
        const x = column * size + row * size / 2;
        const y = row * triangleHeight;
        polygon(context, [[x, y], [x + size, y], [x + size / 2, y + triangleHeight]]);
        context.fill();
        context.stroke();
        polygon(context, [[x + size, y], [x + size * 1.5, y + triangleHeight], [x + size / 2, y + triangleHeight]]);
        context.fill();
        context.stroke();
      }
    }
    return;
  }
  const hexWidth = size * 1.5;
  const hexHeight = SQRT3 * size;
  for (let column = -2; column < width / hexWidth + 2; column += 1) {
    for (let row = -2; row < height / hexHeight + 2; row += 1) {
      const centerX = column * hexWidth;
      const centerY = row * hexHeight + (column % 2) * hexHeight / 2;
      const points = Array.from({ length: 6 }, (_, index) => {
        const angle = Math.PI / 3 * index;
        return [centerX + size * Math.cos(angle), centerY + size * Math.sin(angle)];
      });
      polygon(context, points);
      context.fill();
      context.stroke();
    }
  }
}

function drawTiling(canvas, type) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 420;
  const pixelRatio = window.devicePixelRatio || 1;
  const backingWidth = Math.round(width * pixelRatio);
  const backingHeight = Math.round(height * pixelRatio);
  if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
    canvas.width = backingWidth;
    canvas.height = backingHeight;
  }
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.fillStyle = "#f7efe3";
  context.fillRect(0, 0, width, height);
  if (type === "einstein") drawEinsteinTiling(context, width, height);
  else drawRegularTiling(context, width, height, type);
}

export default function TilingExplorer() {
  const canvasRef = useRef(null);
  const [selectedTiling, setSelectedTiling] = useState("square");
  const selected = TILINGS[selectedTiling];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const draw = () => drawTiling(canvas, selectedTiling);
    EINSTEIN_REFERENCE.onload = draw;
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();
    return () => {
      resizeObserver.disconnect();
      EINSTEIN_REFERENCE.onload = null;
    };
  }, [selectedTiling]);
  return (
    <section className="tiling-explorer" aria-label="Interactive tiling explorer">
      <div className="tiling-heading">
        <div><span className="tiling-kicker">Interactive field</span><h2>Four ways to tile a plane</h2></div>
        <span className="tiling-status" aria-live="polite">{selected.detail}</span>
      </div>
      <div className="tiling-workspace">
        <div className="tiling-stage"><canvas ref={canvasRef} className="tiling-canvas" aria-label={`${selected.name} pattern`} /><span className="tiling-stage-note">Every edge meets another edge.</span></div>
        <div className="tiling-controls">
          <label htmlFor="tiling-choice">Choose a tiling</label>
          <select id="tiling-choice" value={selectedTiling} onChange={(event) => setSelectedTiling(event.target.value)}>
            {Object.entries(TILINGS).map(([key, tiling]) => <option key={key} value={key}>{tiling.name}</option>)}
          </select>
          <p>{selected.description}</p>
          <div className="tiling-facts"><span>{selected.name}</span><small>{selected.detail}</small></div>
        </div>
      </div>
    </section>
  );
}
