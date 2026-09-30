import { useEffect, useRef, useState } from "react";

const INITIAL_CENTER = { x: -0.5, y: 0 };
const INITIAL_SCALE = 3.2;
const DEFAULT_ZOOM = 2;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 620;

function colorFor(value, colorShift, zoomDepth) {
  const hue =
    ((([0.54, 0.46, 0.64][zoomDepth % 3] + colorShift + value * 0.18) % 1) +
      1) %
    1;
  const saturation = 0.08 + value * 0.82;
  const lightness = 0.98 - value * 0.58;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const secondHue = hue * 6;
  const x = chroma * (1 - Math.abs((secondHue % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (secondHue < 1) [red, green, blue] = [chroma, x, 0];
  else if (secondHue < 2) [red, green, blue] = [x, chroma, 0];
  else if (secondHue < 3) [red, green, blue] = [0, chroma, x];
  else if (secondHue < 4) [red, green, blue] = [0, x, chroma];
  else if (secondHue < 5) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return [red + match, green + match, blue + match].map((channel) =>
    Math.round(channel * 255),
  );
}

function renderFractal(canvas, center, scale, colorShift, maxIterations) {
  const context = canvas.getContext("2d");
  const image = context.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
  const halfWidth = scale / 2;
  const halfHeight = (halfWidth * CANVAS_HEIGHT) / CANVAS_WIDTH;
  const zoomDepth = Math.max(0, Math.floor(Math.log2(INITIAL_SCALE / scale)));

  for (let pixelY = 0; pixelY < CANVAS_HEIGHT; pixelY += 1) {
    const imaginary =
      center.y +
      halfHeight -
      ((pixelY / (CANVAS_HEIGHT - 1)) * scale * CANVAS_HEIGHT) / CANVAS_WIDTH;
    for (let pixelX = 0; pixelX < CANVAS_WIDTH; pixelX += 1) {
      const real = center.x - halfWidth + (pixelX / (CANVAS_WIDTH - 1)) * scale;
      let currentReal = 0;
      let currentImaginary = 0;
      let iteration = 0;
      let magnitudeSquared = 0;

      while (magnitudeSquared <= 4 && iteration < maxIterations) {
        const nextReal =
          currentReal * currentReal -
          currentImaginary * currentImaginary +
          real;
        currentImaginary = 2 * currentReal * currentImaginary + imaginary;
        currentReal = nextReal;
        magnitudeSquared =
          currentReal * currentReal + currentImaginary * currentImaginary;
        iteration += 1;
      }

      const offset = (pixelY * CANVAS_WIDTH + pixelX) * 4;
      if (iteration === maxIterations) {
        image.data[offset] = 0;
        image.data[offset + 1] = 0;
        image.data[offset + 2] = 0;
      } else {
        const smoothIteration =
          iteration + 1 - Math.log2(Math.log2(Math.sqrt(magnitudeSquared)));
        const value = Math.min(1, Math.max(0, smoothIteration / maxIterations));
        const [red, green, blue] = colorFor(value, colorShift, zoomDepth);
        image.data[offset] = red;
        image.data[offset + 1] = green;
        image.data[offset + 2] = blue;
      }
      image.data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
}

export default function MandelbrotExplorer() {
  const canvasRef = useRef(null);
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
  const lastTouchZoomRef = useRef(0);
  const [center, setCenter] = useState(INITIAL_CENTER);
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [zoomFactor, setZoomFactor] = useState(DEFAULT_ZOOM);
  const [colorShift, setColorShift] = useState(0);
  const [maxIterations, setMaxIterations] = useState(260);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    setIsRendering(true);
    const frame = window.requestAnimationFrame(() => {
      renderFractal(canvas, center, scale, colorShift, maxIterations);
      setIsRendering(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [center, scale, colorShift, maxIterations]);

  const zoomAt = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || event.currentTarget !== canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const real =
      center.x -
      scale / 2 +
      ((event.clientX - bounds.left) / bounds.width) * scale;
    const imaginary =
      center.y +
      (scale * CANVAS_HEIGHT) / CANVAS_WIDTH / 2 -
      (((event.clientY - bounds.top) / bounds.height) * scale * CANVAS_HEIGHT) /
        CANVAS_WIDTH;
    setCenter({ x: real, y: imaginary });
    setScale(scale / zoomFactor);
  };

  const handlePointerUp = (event) => {
    if (event.pointerType === "mouse") return;
    event.preventDefault();
    const now = Date.now();
    const lastTap = lastTapRef.current;
    const distance = Math.hypot(
      event.clientX - lastTap.x,
      event.clientY - lastTap.y,
    );

    if (now - lastTap.time < 400 && distance < 30) {
      lastTouchZoomRef.current = now;
      zoomAt(event);
      lastTapRef.current = { time: 0, x: 0, y: 0 };
      return;
    }

    lastTapRef.current = { time: now, x: event.clientX, y: event.clientY };
  };

  const handleDoubleClick = (event) => {
    if (Date.now() - lastTouchZoomRef.current < 500) return;
    zoomAt(event);
  };

  const reset = () => {
    setCenter(INITIAL_CENTER);
    setScale(INITIAL_SCALE);
    setColorShift(0);
    setZoomFactor(DEFAULT_ZOOM);
    setMaxIterations(260);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = "mandelbrot-view.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <section
      className="mandelbrot-explorer"
      aria-label="Interactive Mandelbrot explorer"
    >
      <div className="mandelbrot-heading">
        <div>
          <span className="mandelbrot-kicker">Interactive field</span>
          <h2>Explore the boundary</h2>
        </div>
        <span className="mandelbrot-status" aria-live="polite">
          {isRendering ? "Rendering..." : "Ready"}
        </span>
      </div>
      <div className="mandelbrot-workspace">
        <div className="mandelbrot-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="mandelbrot-canvas"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onDoubleClick={handleDoubleClick}
            onPointerUp={handlePointerUp}
            aria-label="Mandelbrot set. Double-click or double-tap anywhere to zoom into that point."
          />
          <span className="mandelbrot-canvas-note">
            Double-click or tap twice to zoom
          </span>
        </div>
        <aside className="mandelbrot-controls">
          <div className="mandelbrot-readout">
            <span>Center</span>
            <strong>
              {center.x.toFixed(6)} {center.y >= 0 ? "+" : "-"}{" "}
              {Math.abs(center.y).toFixed(6)}i
            </strong>
            <span>View width</span>
            <strong>{scale.toPrecision(6)}</strong>
          </div>
          <label htmlFor="mandelbrot-zoom">
            Zoom factor <output>{zoomFactor.toFixed(1)}x</output>
          </label>
          <input
            id="mandelbrot-zoom"
            type="range"
            min="1.2"
            max="5"
            step="0.1"
            value={zoomFactor}
            onChange={(event) => setZoomFactor(Number(event.target.value))}
          />
          <label htmlFor="mandelbrot-color">
            Color shift <output>{Math.round(colorShift * 360)} deg</output>
          </label>
          <input
            id="mandelbrot-color"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={colorShift}
            onChange={(event) => setColorShift(Number(event.target.value))}
          />
          <label htmlFor="mandelbrot-detail">
            Iteration detail <output>{maxIterations}</output>
          </label>
          <input
            id="mandelbrot-detail"
            type="range"
            min="80"
            max="500"
            step="10"
            value={maxIterations}
            onChange={(event) => setMaxIterations(Number(event.target.value))}
          />
          <div className="mandelbrot-actions">
            <button type="button" onClick={reset}>
              Reset view
            </button>
            <button type="button" onClick={downloadImage}>
              Download PNG
            </button>
          </div>
          <p>
            Black points remain bounded. Color reveals how quickly nearby points
            escape.
          </p>
        </aside>
      </div>
    </section>
  );
}
