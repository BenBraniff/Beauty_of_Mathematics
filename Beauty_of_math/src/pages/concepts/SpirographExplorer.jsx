import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;
const TAU = Math.PI * 2;
const INITIAL_ARMS = [
  { length: 50, speed: 1 },
  { length: 100, speed: 2 },
];
const PRESETS = [
  {
    name: "Astroid",
    arms: [
      { length: 75, speed: 1 },
      { length: 25, speed: -3 },
    ],
  },
  {
    name: "Deltoid",
    arms: [
      { length: 66, speed: 1 },
      { length: 33, speed: -2 },
    ],
  },
  {
    name: "Cardioid",
    arms: [
      { length: 50, speed: 1 },
      { length: 50, speed: 2 },
    ],
  },
  {
    name: "Nephroid",
    arms: [
      { length: 75, speed: 1 },
      { length: 25, speed: 3 },
    ],
  },
];

function createCharacterHarmonograph() {
  const outline = [
    [-0.95, -0.72], [-1.12, -0.58], [-1.08, -0.35], [-1.02, -0.08],
    [-1.04, 0.35], [-0.96, 0.88], [-0.72, 1.16], [-0.45, 0.94],
    [-0.18, 1.24], [0.12, 1.05], [0.38, 0.82], [0.68, 0.66],
    [0.94, 0.46], [1.12, 0.18], [0.98, 0.02], [0.76, -0.02],
    [0.64, -0.23], [0.58, -0.48], [0.52, -0.74], [0.42, -0.98],
    [0.22, -1.04], [0.08, -0.82], [-0.12, -0.83], [-0.25, -1.08],
    [-0.48, -1.06], [-0.58, -0.82], [-0.72, -0.88],
  ];
  const sampleCount = 1024;
  const boundary = Array.from({ length: sampleCount }, (_, index) => {
    const position = (index / sampleCount) * outline.length;
    const start = Math.floor(position) % outline.length;
    const end = (start + 1) % outline.length;
    const fraction = position - Math.floor(position);
    return {
      real: outline[start][0] + (outline[end][0] - outline[start][0]) * fraction,
      imaginary: outline[start][1] + (outline[end][1] - outline[start][1]) * fraction,
    };
  });
  return Array.from({ length: 75 }, (_, harmonic) => {
    const frequency = harmonic - 37;
    let real = 0;
    let imaginary = 0;
    boundary.forEach((point, index) => {
      const angle = (TAU * frequency * index) / sampleCount;
      real += (point.real * Math.cos(angle) + point.imaginary * Math.sin(angle)) / sampleCount;
      imaginary += (point.imaginary * Math.cos(angle) - point.real * Math.sin(angle)) / sampleCount;
    });
    return {
      length: Math.hypot(real, imaginary),
      speed: frequency,
      phase: Math.atan2(imaginary, real),
    };
  });
}

const CHARACTER_HARMONOGRAPH = createCharacterHarmonograph();

function getHypotrochoidStatus(arms) {
  if (arms.length !== 2) return "Custom arm system";
  const [radiusArm, distanceArm] = arms.map((arm) => ({
    length: Number(arm.length),
    speed: Number(arm.speed),
  }));
  if (!Number.isFinite(radiusArm.length) || !Number.isFinite(distanceArm.length)
    || !Number.isFinite(radiusArm.speed) || !Number.isFinite(distanceArm.speed)) {
    return "Adjust arm values";
  }
  const isHypotrochoid = radiusArm.speed * distanceArm.speed < 0;
  const curveType = isHypotrochoid ? "Hypotrochoid" : "Epitrochoid";
  if (distanceArm.length < radiusArm.length) return `Contracted ${curveType} (d < r)`;
  if (distanceArm.length === radiusArm.length) {
    return isHypotrochoid
      ? "Classic Hypocycloid / Cuspidal (d = r)"
      : "Classic Epitrochoid (d = r)";
  }
  return `Prolate ${curveType} (d > r)`;
}

function drawSpirograph(canvas, arms, time) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const renderArms = arms.map((arm) => ({
    length: Number.isFinite(Number(arm.length)) ? Number(arm.length) : 50,
    speed: Number.isFinite(Number(arm.speed)) ? Number(arm.speed) : 1,
  }));

  const width = canvas.clientWidth || CANVAS_WIDTH;
  const height = canvas.clientHeight || CANVAS_HEIGHT;
  const pixelRatio = window.devicePixelRatio || 1;
  const backingWidth = Math.round(width * pixelRatio);
  const backingHeight = Math.round(height * pixelRatio);
  if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
    canvas.width = backingWidth;
    canvas.height = backingHeight;
  }
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const centerX = width / 2;
  const centerY = height / 2;
  const totalLength = Math.max(1, renderArms.reduce((sum, arm) => sum + arm.length, 0));
  const scale = Math.min((width - 48) / (totalLength * 2), (height - 48) / (totalLength * 2));
  const pointAt = (t) => renderArms.reduce((point, arm) => {
    const angle = t * arm.speed;
    return {
      x: point.x + arm.length * scale * Math.cos(angle),
      y: point.y - arm.length * scale * Math.sin(angle),
    };
  }, { x: centerX, y: centerY });

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f4eee4";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#e0d4c2";
  context.lineWidth = 1;
  context.beginPath();
  for (let x = centerX % 24; x < width; x += 24) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = centerY % 24; y < height; y += 24) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();

  const turns = Math.min(24, Math.max(4, Math.ceil(totalLength / 8)));
  const maxT = TAU * turns;
  context.beginPath();
  for (let step = 0; step <= 2400; step += 1) {
    const point = pointAt((maxT * step) / 2400);
    if (step === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.strokeStyle = "#147d92";
  context.lineWidth = 3;
  context.lineJoin = "round";
  context.stroke();

  const currentPoint = pointAt(time);
  let armStart = { x: centerX, y: centerY };
  renderArms.forEach((arm) => {
    const angle = time * arm.speed;
    const armEnd = {
      x: armStart.x + arm.length * scale * Math.cos(angle),
      y: armStart.y - arm.length * scale * Math.sin(angle),
    };
    context.beginPath();
    context.moveTo(armStart.x, armStart.y);
    context.lineTo(armEnd.x, armEnd.y);
    context.strokeStyle = "#d55d3e";
    context.lineWidth = 3;
    context.stroke();
    armStart = armEnd;
  });
  context.beginPath();
  context.arc(currentPoint.x, currentPoint.y, 6, 0, TAU);
  context.fillStyle = "#d55d3e";
  context.fill();
}

function drawCharacterHarmonograph(canvas, time) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const width = canvas.clientWidth || CANVAS_WIDTH;
  const height = canvas.clientHeight || CANVAS_HEIGHT;
  const pixelRatio = window.devicePixelRatio || 1;
  const backingWidth = Math.round(width * pixelRatio);
  const backingHeight = Math.round(height * pixelRatio);
  if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
    canvas.width = backingWidth;
    canvas.height = backingHeight;
  }
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min((width - 72) / 2.7, (height - 72) / 2.45);
  const pointAt = (t) => CHARACTER_HARMONOGRAPH.reduce((point, arm) => {
    const angle = arm.speed * t + arm.phase;
    return {
      x: point.x + arm.length * scale * Math.cos(angle),
      y: point.y - arm.length * scale * Math.sin(angle),
    };
  }, { x: centerX, y: centerY });

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f4eee4";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#e0d4c2";
  context.lineWidth = 1;
  context.beginPath();
  for (let x = centerX % 24; x < width; x += 24) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = centerY % 24; y < height; y += 24) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();

  context.beginPath();
  const sampleCount = 6000;
  for (let step = 0; step <= sampleCount; step += 1) {
    const point = pointAt((TAU * step) / sampleCount);
    if (step === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.fillStyle = "rgba(20, 125, 146, 0.12)";
  context.fill();
  context.strokeStyle = "#147d92";
  context.lineWidth = 3;
  context.stroke();

  let armStart = { x: centerX, y: centerY };
  CHARACTER_HARMONOGRAPH.forEach((arm) => {
    const angle = arm.speed * time + arm.phase;
    const armEnd = {
      x: armStart.x + arm.length * scale * Math.cos(angle),
      y: armStart.y - arm.length * scale * Math.sin(angle),
    };
    context.beginPath();
    context.moveTo(armStart.x, armStart.y);
    context.lineTo(armEnd.x, armEnd.y);
    context.strokeStyle = "rgba(213, 93, 62, 0.28)";
    context.lineWidth = 1;
    context.stroke();
    armStart = armEnd;
  });
  context.beginPath();
  context.arc(pointAt(time).x, pointAt(time).y, 5, 0, TAU);
  context.fillStyle = "#d55d3e";
  context.fill();
}

function createArm() {
  return { length: 50, speed: 1 };
}

function getArmValue(field, value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  if (field === "length") return Math.min(100, Math.max(1, number));
  if (field === "speed") return Math.min(10, Math.max(-10, number));
  return number;
}

export default function SpirographExplorer() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastFrameRef = useRef(null);
  const [arms, setArms] = useState(INITIAL_ARMS);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMandelbrotMode, setIsMandelbrotMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const frame = window.requestAnimationFrame(() => {
      if (isMandelbrotMode) drawCharacterHarmonograph(canvas, time);
      else drawSpirograph(canvas, arms, time);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [arms, isMandelbrotMode, time]);

  useEffect(() => {
    if (!isPlaying) {
      lastFrameRef.current = null;
      return undefined;
    }
    const animate = (timestamp) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp;
      const elapsed = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;
      setTime((current) => (current + elapsed * 0.001) % (TAU * 24));
      animationRef.current = window.requestAnimationFrame(animate);
    };
    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [isPlaying]);

  const updateArm = (index, field, value) => {
    setArms((current) => current.map((arm, armIndex) => (
      armIndex === index ? { ...arm, [field]: value } : arm
    )));
  };

  const normalizeArm = (index, field) => {
    setArms((current) => current.map((arm, armIndex) => (
      armIndex === index
        ? { ...arm, [field]: getArmValue(field, arm[field], field === "length" ? 50 : 1) }
        : arm
    )));
  };

  const reset = () => {
    setIsPlaying(false);
    setArms(INITIAL_ARMS);
    setTime(0);
  };

  return (
    <section className="spirograph-explorer" aria-label="Interactive spirograph explorer">
      <div className="spirograph-heading">
        <div>
          <span className="spirograph-kicker">Interactive field</span>
          <h2>Draw with rotating arms</h2>
        </div>
      </div>
      <div className="spirograph-workspace">
        <div className="spirograph-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="spirograph-canvas"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-label="Spirograph curve drawn by rotating arms"
          />
        </div>
        <aside className="spirograph-controls">
          <button
            type="button"
            className="spirograph-harmonograph-toggle"
            aria-pressed={isMandelbrotMode}
            onClick={() => {
              setIsMandelbrotMode((enabled) => !enabled);
              setIsPlaying(false);
              setTime(0);
            }}
          >
            {isMandelbrotMode ? "Show arm controls" : "Show character harmonograph"}
          </button>
          <button
            type="button"
            className="spirograph-animate-toggle"
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? "Pause animation" : "Animate"}
          </button>
          <div className="spirograph-readout">
            <span>Spirograph arms</span>
            <strong aria-live="polite">
              {isMandelbrotMode ? "Blue dog-inspired harmonograph" : getHypotrochoidStatus(arms)}
            </strong>
            <strong>Arms: {isMandelbrotMode ? CHARACTER_HARMONOGRAPH.length : arms.length}</strong>
          </div>
          {isMandelbrotMode && (
            <div className="spirograph-harmonograph-arms" aria-label="Character harmonograph arm values">
              <div className="spirograph-harmonograph-header" aria-hidden="true">
                <span>arm</span>
                <span>len</span>
                <span>speed</span>
                <span>angle</span>
              </div>
              {CHARACTER_HARMONOGRAPH.map((arm, index) => (
                <div className="spirograph-harmonograph-arm" key={`harmonograph-arm-${index + 1}`}>
                  <strong>{index + 1}</strong>
                  <span>{arm.length.toFixed(3)}</span>
                  <span>{arm.speed}</span>
                  <span>{(arm.phase * 180 / Math.PI).toFixed(1)}°</span>
                </div>
              ))}
            </div>
          )}
          {!isMandelbrotMode && <div className="spirograph-arms">
            {arms.map((arm, index) => (
              <div className="spirograph-arm" key={`arm-${index + 1}`}>
                <h3>Arm #{index + 1}</h3>
                <label htmlFor={`spirograph-length-${index}`}>Arm length</label>
                <input
                  id={`spirograph-length-${index}`}
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={arm.length}
                  onChange={(event) => updateArm(index, "length", event.target.value)}
                  onBlur={() => normalizeArm(index, "length")}
                />
                <label htmlFor={`spirograph-speed-${index}`}>Rotation speed</label>
                <input
                  id={`spirograph-speed-${index}`}
                  type="text"
                  inputMode="decimal"
                  value={arm.speed}
                  onChange={(event) => updateArm(index, "speed", event.target.value)}
                  onBlur={() => normalizeArm(index, "speed")}
                />
              </div>
            ))}
          </div>}
          {!isMandelbrotMode && (
            <>
          <div className="spirograph-presets" aria-label="Spirograph presets">
            {PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => {
                  setIsPlaying(false);
                  setArms(preset.arms);
                  setTime(0);
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <div className="spirograph-arm-actions">
            <button type="button" className="spirograph-add" onClick={() => setArms((current) => [...current, createArm()])}>
              + Add arm
            </button>
            {arms.length > 2 && (
              <button
                type="button"
                className="spirograph-delete-latest"
                onClick={() => setArms((current) => current.slice(0, -1))}
              >
                Delete last
              </button>
            )}
          </div>
          <div className="spirograph-actions">
            <button type="button" onClick={reset}>Reset spirograph</button>
          </div>
          <p>
            Each arm rotates at its own signed speed. The endpoint of the final arm traces the curve.
          </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
