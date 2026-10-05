import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 420;
const CIRCLE_RADIUS = 150;
const INITIAL_DISTANCE = 110;
const MAX_T = Math.PI * 5;
const BACKGROUND_COLOR = "#f4f1e8";
const CURVE_COLOR = "#147d92";
const CIRCLE_COLOR = "#6b3e26";
const POINT_COLOR = "#d55d3e";

function curveName(radius, distance) {
  if (distance < radius) return "Curtate trochoid";
  if (distance > radius) return "Prolate trochoid";
  return "Cycloid";
}

function drawTrochoid(canvas, distance, angle) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const scale = Math.min(
    1,
    CANVAS_WIDTH / (CIRCLE_RADIUS * MAX_T + distance),
  );
  const scaledRadius = CIRCLE_RADIUS * scale;
  const scaledDistance = distance * scale;
  const pathBounds = { minX: Infinity, maxX: -Infinity };
  for (let step = 0; step <= 640; step += 1) {
    const t = (MAX_T * step) / 640;
    const x = scaledRadius * t - scaledDistance * Math.sin(t);
    pathBounds.minX = Math.min(pathBounds.minX, x);
    pathBounds.maxX = Math.max(pathBounds.maxX, x);
  }
  const pathOffsetX =
    (CANVAS_WIDTH - pathBounds.maxX + pathBounds.minX) / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const pathOffsetY = centerY;
  const groundY = centerY + scaledRadius;
  const traceStart = 0;
  const traceEnd = MAX_T;

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  context.strokeStyle = "#cbbda2";
  context.lineWidth = 5 * scale;
  context.beginPath();
  context.moveTo(28 * scale, groundY);
  context.lineTo(CANVAS_WIDTH - 28 * scale, groundY);
  context.stroke();

  context.beginPath();
  for (let step = 0; step <= 640; step += 1) {
    const t = traceStart + ((traceEnd - traceStart) * step) / 640;
    const x = pathOffsetX + scaledRadius * t - scaledDistance * Math.sin(t);
    const y = pathOffsetY + scaledDistance * Math.cos(t);
    if (step === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.strokeStyle = CURVE_COLOR;
  context.lineWidth = 10 * scale;
  context.lineJoin = "round";
  context.stroke();

  const circleX = pathOffsetX + scaledRadius * angle;
  const pointX = circleX - scaledDistance * Math.sin(angle);
  const pointY = centerY + scaledDistance * Math.cos(angle);

  context.beginPath();
  context.arc(circleX, centerY, scaledRadius, 0, 2 * Math.PI);
  context.strokeStyle = CIRCLE_COLOR;
  context.lineWidth = 10 * scale;
  context.stroke();

  context.beginPath();
  context.moveTo(circleX, centerY);
  context.lineTo(pointX, pointY);
  context.strokeStyle = POINT_COLOR;
  context.lineWidth = 10 * scale;
  context.stroke();

  context.beginPath();
  context.arc(pointX, pointY, 7 * scale, 0, 2 * Math.PI);
  context.fillStyle = POINT_COLOR;
  context.fill();

  context.beginPath();
  context.arc(circleX, centerY, 4 * scale, 0, 2 * Math.PI);
  context.fillStyle = CIRCLE_COLOR;
  context.fill();
  
}

export default function CycloidExplorer() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastFrameRef = useRef(null);
  const [distance, setDistance] = useState(INITIAL_DISTANCE);
  const [angle, setAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const frame = window.requestAnimationFrame(() => {
      drawTrochoid(canvas, distance, angle);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [angle, distance]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return undefined;
    }

    const animate = (timestamp) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp;
      const elapsed = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;
      setAngle((current) => (current + elapsed * 0.002) % MAX_T);
      animationRef.current = window.requestAnimationFrame(animate);
    };
    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [isPlaying]);

  const type = curveName(CIRCLE_RADIUS, distance);
  const toggleAnimation = () => setIsPlaying((playing) => !playing);
  const useExactCycloid = () => {
    setDistance(CIRCLE_RADIUS);
    setAngle(0);
  };

  return (
    <section className="cycloid-explorer" aria-label="Interactive cycloid explorer">
      <div className="cycloid-heading">
        <div>
          <span className="cycloid-kicker">Interactive field</span>
          <h2>Roll the circle</h2>
        </div>
        <span className="cycloid-status" aria-live="polite">
          {isPlaying ? "Animation playing" : type}
        </span>
      </div>
      <div className="cycloid-workspace">
        <div className="cycloid-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="cycloid-canvas"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-label={`${type} with radius ${CIRCLE_RADIUS} and point distance ${distance}`}
          />
        </div>
        <aside className="cycloid-controls">
          <div className="cycloid-readout">
            <span>Curve type</span>
            <strong>{type}</strong>
            <span>Position t</span>
            <strong>{angle.toFixed(2)}</strong>
          </div>
          <label htmlFor="cycloid-distance">
            Point distance d <output>{distance}</output>
          </label>
          <input
            id="cycloid-distance"
            type="range"
            min="0"
            max={CIRCLE_RADIUS * 2}
            step="1"
            value={distance}
            onChange={(event) => setDistance(Number(event.target.value))}
          />
          <label htmlFor="cycloid-position">
            Position t <output>{angle.toFixed(2)}</output>
          </label>
          <input
            id="cycloid-position"
            type="range"
            min="0"
            max={MAX_T}
            step="0.01"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
          />
          <div className="cycloid-actions">
            <button type="button" onClick={useExactCycloid}>
              Exact cycloid
            </button>
            <button type="button" onClick={toggleAnimation}>
              {isPlaying ? "Pause animation" : "Play animation"}
            </button>
          </div>
          <p>
            GeoGebra&apos;s trochoid construction rolls a circle of radius r
            while a point d from its center traces the curve. When d = r, the
            curve is a cycloid.
          </p>
        </aside>
      </div>
    </section>
  );
}
