import { useEffect, useMemo, useRef, useState } from "react";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 620;
const MAX_ITERATION = 20;
const INITIAL_ITERATION = 12;
const BACKGROUND_COLOR = "#f4f1e8";
const INITIAL_CURVE_COLOR = "#147d92";

function nextIteration(directions) {
  const inverse = directions
    .slice()
    .reverse()
    .map((direction) => (direction + 1) % 4);
  return directions.concat(inverse);
}

function directionsFor(iteration) {
  let directions = [0];
  for (let current = 0; current < iteration; current += 1) {
    directions = nextIteration(directions);
  }
  return directions;
}

function curvePoints(directions, iteration) {
  const points = [{ x: 0, y: 0 }];
  let x = 0;
  let y = 0;

  directions.forEach((direction) => {
    if (direction === 0) x += 1;
    if (direction === 1) y += 1;
    if (direction === 2) x -= 1;
    if (direction === 3) y -= 1;
    points.push({ x, y });
  });

  const rotation = (-45 * iteration * Math.PI) / 180;
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);

  return points.map(({ x: pointX, y: pointY }) => ({
    x: pointX * cosine - pointY * sine,
    y: pointX * sine + pointY * cosine,
  }));
}

function renderCurve(canvas, points, curveColor) {
  const context = canvas.getContext("2d");
  if (!context || points.length < 2) return;

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;
  points.forEach(({ x, y }) => {
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  });
  const padding = Math.max(20, Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.08);
  const xRange = Math.max(1, xMax - xMin);
  const yRange = Math.max(1, yMax - yMin);
  const scale = Math.min(
    (CANVAS_WIDTH - padding * 2) / xRange,
    (CANVAS_HEIGHT - padding * 2) / yRange,
  );
  const offsetX = (CANVAS_WIDTH - xRange * scale) / 2 - xMin * scale;
  const offsetY = (CANVAS_HEIGHT - yRange * scale) / 2 + yMax * scale;

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.beginPath();
  points.forEach(({ x, y }, index) => {
    const canvasX = x * scale + offsetX;
    const canvasY = offsetY - y * scale;
    if (index === 0) context.moveTo(canvasX, canvasY);
    else context.lineTo(canvasX, canvasY);
  });
  context.strokeStyle = curveColor;
  context.lineWidth = Math.max(1, Math.round(Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 900));
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke();
}

export default function DragonCurve() {
  const canvasRef = useRef(null);
  const [iteration, setIteration] = useState(INITIAL_ITERATION);
  const [curveColor, setCurveColor] = useState(INITIAL_CURVE_COLOR);
  const directions = useMemo(() => directionsFor(iteration), [iteration]);
  const points = useMemo(
    () => curvePoints(directions, iteration),
    [directions, iteration],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const frame = window.requestAnimationFrame(() => {
      renderCurve(canvas, points, curveColor);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [curveColor, points]);

  const goToNextIteration = () => {
    setIteration((current) => Math.min(MAX_ITERATION, current + 1));
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `dragon-curve-iteration-${iteration}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="dragon-curve-explorer" aria-label="Interactive dragon curve">
      <div className="dragon-curve-heading">
        <div>
          <span className="dragon-curve-kicker">Interactive field</span>
          <h2>Fold the curve</h2>
        </div>
        <span className="dragon-curve-status" aria-live="polite">
          {iteration === MAX_ITERATION ? "Maximum iteration" : "Ready to explore"}
        </span>
      </div>
      <div className="dragon-curve-workspace">
        <div className="dragon-curve-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="dragon-curve-canvas"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-label={`Dragon curve at iteration ${iteration}`}
          />
        </div>
        <aside className="dragon-curve-controls">
          <div className="dragon-curve-readout">
            <span>Current iteration</span>
            <strong>{iteration}</strong>
            <span>Segments</span>
            <strong>{directions.length.toLocaleString()}</strong>
          </div>
          <label htmlFor="dragon-curve-iteration">
            Number of iterations <output>{iteration}</output>
          </label>
          <input
            id="dragon-curve-iteration"
            type="range"
            min="0"
            max={MAX_ITERATION}
            step="1"
            value={iteration}
            onChange={(event) => setIteration(Number(event.target.value))}
          />
          <label htmlFor="dragon-curve-color">
            Line color <output>{curveColor.toUpperCase()}</output>
          </label>
          <input
            id="dragon-curve-color"
            className="dragon-curve-color-input"
            type="color"
            value={curveColor}
            onChange={(event) => setCurveColor(event.target.value)}
          />
          <div className="dragon-curve-actions">
            <button type="button" onClick={goToNextIteration} disabled={iteration === MAX_ITERATION}>
              Next iteration
            </button>
            <button type="button" onClick={downloadImage}>
              Download image
            </button>
          </div>
          <p>
            The curve is rotated by 45 degrees for every iteration, keeping its
            folded shape oriented consistently as it grows.
          </p>
        </aside>
      </div>
    </section>
  );
}