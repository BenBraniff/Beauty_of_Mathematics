import { useEffect, useRef, useState } from "react";

const TILINGS = {
  square: {
    name: "Square grid",
    description: "Four right angles meet at every vertex.",
    detail: "Regular, periodic",
    color: "#e5875d",
  },
  triangle: {
    name: "Equilateral triangles",
    description: "Six equal triangles meet around each vertex.",
    detail: "Regular, periodic",
    color: "#5b9bd5",
  },
  hexagon: {
    name: "Hexagonal tiling",
    description: "Three regular hexagons meet at every vertex.",
    detail: "Regular, periodic",
    color: "#63b58c",
  },
  einstein: {
    name: "Einstein tiles",
    description: "A single hat-shaped tile can cover the plane without repeating.",
    detail: "Aperiodic",
    color: "#b77acb",
  },
};

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

  if (type === "triangle") {
    const triangleHeight = size * Math.sqrt(3) / 2;
    for (let row = -2; row < height / triangleHeight + 2; row += 1) {
      for (let column = -2; column < width / size + 2; column += 1) {
        const x = column * size + (row % 2) * size / 2;
        const y = row * triangleHeight;
        const points = column % 2 === row % 2
          ? [[x, y + triangleHeight], [x + size / 2, y], [x + size, y + triangleHeight]]
          : [[x, y], [x + size, y], [x + size / 2, y + triangleHeight]];
        polygon(context, points);
        context.fill();
        context.stroke();
      }
    }
    return;
  }

  const hexWidth = size * 1.5;
  const hexHeight = Math.sqrt(3) * size;
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

function drawEinsteinTiling(context, width, height) {
  const scale = 23;
  const hat = [
    [-2, -1], [-1, -2], [1, -2], [2, -1], [3, 0], [2, 1],
    [1, 1], [0, 3], [-1, 3], [-2, 2], [-3, 2], [-4, 1], [-3, 0],
  ].map(([x, y]) => [x * scale, y * scale]);

  context.lineWidth = 1.1;
  context.strokeStyle = "#fff8ef";
  context.fillStyle = TILINGS.einstein.color;
  for (let row = -2; row < height / (scale * 5) + 2; row += 1) {
    for (let column = -2; column < width / (scale * 7) + 2; column += 1) {
      const offsetX = column * scale * 7 + (row % 2) * scale * 3.5;
      const offsetY = row * scale * 5;
      polygon(context, hat, offsetX, offsetY);
      context.fill();
      context.stroke();
      polygon(context, hat, offsetX + scale * 3.5, offsetY + scale * 3);
      context.fillStyle = "#a76fc0";
      context.fill();
      context.stroke();
      context.fillStyle = TILINGS.einstein.color;
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
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();
    return () => resizeObserver.disconnect();
  }, [selectedTiling]);

  return (
    <section className="tiling-explorer" aria-label="Interactive tiling explorer">
      <div className="tiling-heading">
        <div>
          <span className="tiling-kicker">Interactive field</span>
          <h2>Four ways to tile a plane</h2>
        </div>
        <span className="tiling-status" aria-live="polite">{selected.detail}</span>
      </div>
      <div className="tiling-workspace">
        <div className="tiling-stage">
          <canvas ref={canvasRef} className="tiling-canvas" aria-label={`${selected.name} pattern`} />
          <span className="tiling-stage-note">Every edge meets another edge.</span>
        </div>
        <div className="tiling-controls">
          <label htmlFor="tiling-choice">Choose a tiling</label>
          <select
            id="tiling-choice"
            value={selectedTiling}
            onChange={(event) => setSelectedTiling(event.target.value)}
          >
            {Object.entries(TILINGS).map(([key, tiling]) => (
              <option key={key} value={key}>{tiling.name}</option>
            ))}
          </select>
          <p>{selected.description}</p>
          <div className="tiling-facts">
            <span>{selected.name}</span>
            <small>{selected.detail}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
