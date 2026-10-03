import { useEffect, useMemo, useRef, useState } from "react";

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const DEFAULT_SEEDS = 420;
const MAX_SEEDS = 500;
const VIEWBOX_SIZE = 560;
const CENTER = VIEWBOX_SIZE / 2;
const MAX_RADIUS = 250;
const PRESET_RATIOS = [
  ["0", 0],
  ["1/5", 1 / 5],
  ["1/2", 1 / 2],
  ["golden ratio", GOLDEN_RATIO],
  ["1/π", 1 / Math.PI],
  ["1/√2", 1 / Math.sqrt(2)],
];
const ANIMATION_RANGE = 2.5;
const ANIMATION_SPEED = 0.002;

function buildSeeds(seedCount, ratio) {
  const fractionalRatio = ratio % 1;

  return Array.from({ length: seedCount }, (_, index) => {
    const distance = Math.sqrt(index / seedCount) * MAX_RADIUS;
    const angle = index * fractionalRatio * Math.PI * 2;

    return {
      x: CENTER + Math.cos(angle) * distance,
      y: CENTER + Math.sin(angle) * distance,
      radius: 2.5 + (index / seedCount) * 2.5,
    };
  });
}

export default function SunflowerSpiral() {
  const svgRef = useRef(null);
  const [seedCount, setSeedCount] = useState(DEFAULT_SEEDS);
  const [ratio, setRatio] = useState(GOLDEN_RATIO);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMotionWarning, setShowMotionWarning] = useState(false);
  const seeds = useMemo(
    () => buildSeeds(seedCount, ratio),
    [seedCount, ratio],
  );

  useEffect(() => {
    if (!isPlaying) return undefined;

    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;
      const elapsedSeconds = (timestamp - startTime) / 1000;
      setRatio((elapsedSeconds * ANIMATION_SPEED) % ANIMATION_RANGE);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const stopAnimation = () => setIsPlaying(false);

  const downloadImage = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgClone = svg.cloneNode(true);
    svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgClone.querySelector(".sunflower-center")?.setAttribute("fill", "#5c3d26");
    svgClone
      .querySelector(".sunflower-center")
      ?.setAttribute("opacity", "0.18");
    svgClone.querySelectorAll(".sunflower-seed").forEach((seed) => {
      seed.setAttribute("fill", "#493020");
    });

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const image = new Image();
    const imageUrl = URL.createObjectURL(
      new Blob([svgData], { type: "image/svg+xml" }),
    );

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = VIEWBOX_SIZE * 2;
      canvas.height = VIEWBOX_SIZE * 2;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(imageUrl);
        return;
      }
      context.fillStyle = "#f7e7a8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(imageUrl);

      const link = document.createElement("a");
      link.download = `sunflower-spiral-${seedCount}-seeds.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      console.error("Unable to create a PNG from the sunflower spiral.");
    };
    image.src = imageUrl;
  };

  return (
    <section
      className="sunflower-explorer"
      aria-label="Interactive sunflower spiral explorer"
    >
      <div className="sunflower-heading">
        <div>
          <span className="sunflower-kicker">Interactive field</span>
          <h2>Grow a sunflower</h2>
        </div>
        <span className="sunflower-status" aria-live="polite">
          {isPlaying ? "Playing r values" : `${seedCount} seeds`}
        </span>
      </div>
      <div className="sunflower-workspace">
        <div className="sunflower-stage">
          <svg
            ref={svgRef}
            className="sunflower-canvas"
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            role="img"
            aria-label={`Sunflower spiral with ${seedCount} seeds using r = ${ratio.toFixed(
              6,
            )}`}
          >
            <circle
              className="sunflower-center"
              cx={CENTER}
              cy={CENTER}
              r={MAX_RADIUS + 7}
            />
            {seeds.map((seed, index) => (
              <circle
                className="sunflower-seed"
                key={index}
                cx={seed.x}
                cy={seed.y}
                r={seed.radius}
              />
            ))}
          </svg>
          <span className="sunflower-stage-note">
            Each seed turns by 2πr around the center
          </span>
        </div>
        <aside className="sunflower-controls">
          <div className="sunflower-readout">
            <span>Current values</span>
            <strong>r = {ratio.toFixed(6)}</strong>
            <strong>{seedCount} seeds</strong>
          </div>
          <label htmlFor="sunflower-seeds">
            Number of seeds <output>{seedCount}</output>
          </label>
          <input
            id="sunflower-seeds"
            type="range"
            min="20"
            max={MAX_SEEDS}
            step="10"
            value={seedCount}
            onChange={(event) => setSeedCount(Number(event.target.value))}
          />
          <label htmlFor="sunflower-ratio">
            r value <output>{ratio.toFixed(6)}</output>
          </label>
          <input
            id="sunflower-ratio"
            type="range"
            min="0"
            max="2.5"
            step="0.001"
            value={ratio}
            onChange={(event) => {
              stopAnimation();
              setRatio(Number(event.target.value));
            }}
          />
          <fieldset className="sunflower-presets">
            <legend>Set r value</legend>
            <div className="sunflower-preset-grid">
              {PRESET_RATIOS.map(([label, value]) => (
                <button
                  className={ratio === value ? "active" : ""}
                  key={label}
                  type="button"
                  aria-pressed={ratio === value}
                  onClick={() => {
                    stopAnimation();
                    setRatio(value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            className="sunflower-download"
            type="button"
            onClick={downloadImage}
          >
            Download PNG
          </button>
          <button
            className="sunflower-play"
            type="button"
            aria-pressed={isPlaying}
            onClick={() => {
              if (isPlaying) {
                stopAnimation();
              } else {
                setShowMotionWarning(true);
              }
            }}
          >
            {isPlaying ? "Pause r animation" : "Play r animation"}
          </button>
          <button
            className="sunflower-reset"
            type="button"
            onClick={() => {
              stopAnimation();
              setSeedCount(DEFAULT_SEEDS);
              setRatio(GOLDEN_RATIO);
            }}
          >
            Reset spiral
          </button>
          <p>
            At the golden ratio, neighboring seeds avoid lining up in the same
            radial paths, creating the characteristic sunflower pattern.
          </p>
        </aside>
      </div>
      {showMotionWarning && (
        <div
          className="sunflower-warning-backdrop"
          role="presentation"
          onClick={() => setShowMotionWarning(false)}
        >
          <div
            className="sunflower-warning"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sunflower-warning-title"
            aria-describedby="sunflower-warning-description"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="sunflower-warning-title">Motion warning</h3>
            <p id="sunflower-warning-description">
              This animation has continuous motion that may cause discomfort,
              dizziness, or other issues for some people. Continue only if you
              feel comfortable viewing it.
            </p>
            <div className="sunflower-warning-actions">
              <button
                className="sunflower-warning-cancel"
                type="button"
                onClick={() => setShowMotionWarning(false)}
              >
                Cancel
              </button>
              <button
                className="sunflower-warning-continue"
                type="button"
                onClick={() => {
                  setShowMotionWarning(false);
                  setRatio(0);
                  setIsPlaying(true);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}