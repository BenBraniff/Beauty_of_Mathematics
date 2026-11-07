import { useEffect, useRef, useState } from "react";
import IdentityWorker from "./sandpile-computation/sandpileIdentity.worker?worker";

const DEFAULT_SIZE = 100;
const MAX_SIZE = 512;
const DEFAULT_COLORS = ["#000000", "#ffff00", "#0000ff", "#ff0000"];
const COLOR_PRESETS = {
  "primary colors": DEFAULT_COLORS,
  "warm desert": ["#20140d", "#9d5c32", "#d9a441", "#f4e3b2"],
  "forest dusk": ["#101b19", "#356859", "#7fa87b", "#d8d69b"],
  "cool lilac": ["#171521", "#536d9e", "#9c8ac4", "#e7d8f2"],
};
const IDENTITY_DATABASE = "beauty-of-math-sandpile";
const IDENTITY_STORE = "identities";

function openIdentityDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(IDENTITY_DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(IDENTITY_STORE, { keyPath: "size" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readCachedIdentity(size) {
  const database = await openIdentityDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(IDENTITY_STORE).objectStore(IDENTITY_STORE).get(size);
    request.onsuccess = () => {
      database.close();
      resolve(request.result ? new Uint8Array(request.result.grid) : null);
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

async function writeCachedIdentity(size, grid) {
  const database = await openIdentityDatabase();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(IDENTITY_STORE, "readwrite")
      .objectStore(IDENTITY_STORE)
      .put({ size, grid: grid.slice().buffer });
    request.onsuccess = () => {
      database.close();
      resolve();
    };
    request.onerror = () => {
      database.close();
      reject(request.error);
    };
  });
}

function createToppleSimulation(nextGrid, size) {
  const grid = nextGrid.map((row) => row.slice());
  const queue = [];
  const queued = new Uint8Array(size * size);
  const enqueue = (x, y) => {
    const index = y * size + x;
    if (grid[y][x] >= 4 && !queued[index]) {
      queued[index] = 1;
      queue.push([x, y]);
    }
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) enqueue(x, y);
  }
  return { grid, queue, queueIndex: 0, queued, enqueue };
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function drawGrid(canvas, grid, colors) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const size = grid.length;
  const image = context.createImageData(size, size);
  grid.forEach((row, y) => row.forEach((value, x) => {
    const color = colors[Math.min(value, 3)] || colors[0];
    const offset = (y * size + x) * 4;
    image.data[offset] = parseInt(color.slice(1, 3), 16);
    image.data[offset + 1] = parseInt(color.slice(3, 5), 16);
    image.data[offset + 2] = parseInt(color.slice(5, 7), 16);
    image.data[offset + 3] = 255;
  }));
  context.putImageData(image, 0, 0);
}

export default function SandpileExplorer() {
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const animationRef = useRef(null);
  const simulationRef = useRef(null);
  const identityWorkerRef = useRef(null);
  const cacheWorkerRef = useRef(null);
  const cacheCancelledRef = useRef(false);
  const cacheRejectRef = useRef(null);
  const generationTimerRef = useRef(null);
  const [gridSize, setGridSize] = useState(DEFAULT_SIZE);
  const [grid, setGrid] = useState(() => createEmptyGrid(DEFAULT_SIZE));
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [grainsPerClick, setGrainsPerClick] = useState(1);
  const [sizeInput, setSizeInput] = useState(String(DEFAULT_SIZE));
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [fps, setFps] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isCaching, setIsCaching] = useState(false);
  const generationStartedRef = useRef(0);
  const animationSpeedRef = useRef(50);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    gridRef.current = grid;
    drawGrid(canvasRef.current, grid, colors);
  }, [grid, colors]);

  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  useEffect(() => () => {
    if (animationRef.current) window.clearTimeout(animationRef.current);
    identityWorkerRef.current?.terminate();
    cacheWorkerRef.current?.terminate();
    cacheCancelledRef.current = true;
    if (generationTimerRef.current) window.clearInterval(generationTimerRef.current);
  }, []);

  const cancelAnimation = () => {
    if (animationRef.current) {
      window.clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    simulationRef.current = null;
    identityWorkerRef.current?.terminate();
    identityWorkerRef.current = null;
    cacheCancelledRef.current = true;
    cacheRejectRef.current?.(new Error("Identity cache population cancelled"));
    cacheRejectRef.current = null;
    cacheWorkerRef.current?.terminate();
    cacheWorkerRef.current = null;
    if (generationTimerRef.current) {
      window.clearInterval(generationTimerRef.current);
      generationTimerRef.current = null;
    }
    setIsAnimating(false);
    setFps(0);
    setGenerationStatus("");
  };

  const animateSimulation = (simulation) => {
    cancelAnimation();
    simulationRef.current = simulation;
    setIsAnimating(true);
    lastFrameTimeRef.current = performance.now();
    const showNextFrame = () => {
      const current = simulationRef.current;
      if (!current || current.queueIndex >= current.queue.length) {
        simulationRef.current = null;
        animationRef.current = null;
        setIsAnimating(false);
        return;
      }
      const stepsPerFrame = Math.max(1, Math.ceil(animationSpeedRef.current / 10));
      for (let step = 0; step < stepsPerFrame && current.queueIndex < current.queue.length; step += 1) {
        const [x, y] = current.queue[current.queueIndex];
        current.queueIndex += 1;
        current.queued[y * gridSize + x] = 0;
        if (current.grid[y][x] >= 4) {
          current.grid[y][x] -= 4;
          if (x > 0) {
            current.grid[y][x - 1] += 1;
            current.enqueue(x - 1, y);
          }
          if (x < gridSize - 1) {
            current.grid[y][x + 1] += 1;
            current.enqueue(x + 1, y);
          }
          if (y > 0) {
            current.grid[y - 1][x] += 1;
            current.enqueue(x, y - 1);
          }
          if (y < gridSize - 1) {
            current.grid[y + 1][x] += 1;
            current.enqueue(x, y + 1);
          }
          current.enqueue(x, y);
        }
      }
      setGrid(current.grid.map((row) => row.slice()));
      const now = performance.now();
      const elapsed = now - lastFrameTimeRef.current;
      if (elapsed > 0) setFps(Math.round(1000 / elapsed));
      lastFrameTimeRef.current = now;
      if (current.queueIndex < current.queue.length) {
        const delay = Math.max(1, Math.round((101 - animationSpeedRef.current) / 2));
        animationRef.current = window.setTimeout(showNextFrame, delay);
      } else {
        showNextFrame();
      }
    };

    showNextFrame();
  };

  const generateIdentity = () => {
    if (isAnimating) return;
    cancelAnimation();
    generationStartedRef.current = performance.now();
    setIsAnimating(true);
    setGenerationStatus("Identity processing 0.0s");
    generationTimerRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - generationStartedRef.current) / 1000;
      setGenerationStatus(`Identity processing ${elapsed.toFixed(1)}s`);
    }, 100);
    const worker = new IdentityWorker();
    identityWorkerRef.current = worker;
    const finish = (identity, elapsed) => {
      setGenerationStatus(`Identity processing ${elapsed.toFixed(1)}s`);
      if (generationTimerRef.current) {
        window.clearInterval(generationTimerRef.current);
        generationTimerRef.current = null;
      }
      const rows = Array.from({ length: gridSize }, (_, y) => (
        Array.from(identity.slice(y * gridSize, (y + 1) * gridSize))
      ));
      setGrid(rows);
      worker.terminate();
      identityWorkerRef.current = null;
      setIsAnimating(false);
    };
    const generate = () => {
      worker.onmessage = (event) => {
        if (identityWorkerRef.current !== worker) return;
        if (event.data.type === "error") {
          if (generationTimerRef.current) {
            window.clearInterval(generationTimerRef.current);
            generationTimerRef.current = null;
          }
          setGenerationStatus("Identity worker failed");
          worker.terminate();
          identityWorkerRef.current = null;
          setIsAnimating(false);
          return;
        }
        writeCachedIdentity(gridSize, event.data.grid).catch(() => {
          setGenerationStatus("Identity generated; cache unavailable");
        });
        finish(event.data.grid, event.data.elapsed);
      };
      worker.postMessage({ type: "generate", size: gridSize });
    };
    readCachedIdentity(gridSize).then((cachedGrid) => {
      if (cachedGrid) finish(cachedGrid, 0);
      else generate();
    }).catch(() => {
      setGenerationStatus("Identity cache unavailable; generating JavaScript identity");
      generate();
    });
  };

  const populateIdentityCache = async () => {
    if (isAnimating) return;
    cancelAnimation();
    cacheCancelledRef.current = false;
    setIsCaching(true);
    setIsAnimating(true);
    try {
      for (let size = 1; size <= MAX_SIZE; size += 1) {
        if (cacheCancelledRef.current) break;
        setGenerationStatus(`Caching identity ${size}/${MAX_SIZE}`);
        let identity = await readCachedIdentity(size).catch(() => null);
        if (!identity) {
          identity = await new Promise((resolve, reject) => {
            const worker = new IdentityWorker();
            cacheWorkerRef.current = worker;
            cacheRejectRef.current = reject;
            worker.onmessage = (event) => {
              cacheWorkerRef.current = null;
              cacheRejectRef.current = null;
              worker.terminate();
              if (event.data.type === "complete") resolve(event.data.grid);
              else reject(new Error("Identity worker failed"));
            };
            worker.onerror = () => {
              cacheWorkerRef.current = null;
              cacheRejectRef.current = null;
              worker.terminate();
              reject(new Error("Identity worker failed"));
            };
            worker.postMessage({ type: "generate", size });
          });
          await writeCachedIdentity(size, identity);
        }
      }
      setGenerationStatus(
        cacheCancelledRef.current ? "Identity cache population cancelled" : "Cached identities 1-512",
      );
    } catch (error) {
      setGenerationStatus(error.message === "Identity cache population cancelled"
        ? "Identity cache population cancelled"
        : "Identity cache population failed");
    } finally {
      cacheWorkerRef.current?.terminate();
      cacheWorkerRef.current = null;
      cacheRejectRef.current = null;
      setIsCaching(false);
      setIsAnimating(false);
    }
  };

  const addGrain = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || isAnimating) return;
    const bounds = canvas.getBoundingClientRect();
    const x = Math.min(gridSize - 1, Math.max(0, Math.floor(((event.clientX - bounds.left) / bounds.width) * gridSize)));
    const y = Math.min(gridSize - 1, Math.max(0, Math.floor(((event.clientY - bounds.top) / bounds.height) * gridSize)));
    const next = gridRef.current.map((row) => row.slice());
    next[y][x] += grainsPerClick;
    const simulation = createToppleSimulation(next, gridSize);
    if (simulation.queue.length) animateSimulation(simulation);
    else setGrid(next);
  };

  const updateColor = (index, color) => {
    setColors((current) => current.map((value, colorIndex) => (
      colorIndex === index ? color : value
    )));
  };

  const resizeGrid = () => {
    const nextSize = Math.min(MAX_SIZE, Math.max(2, Number.parseInt(sizeInput, 10) || DEFAULT_SIZE));
    cancelAnimation();
    setGridSize(nextSize);
    setSizeInput(String(nextSize));
    setGrid(createEmptyGrid(nextSize));
  };

  const generateCenterAvalanche = () => {
    if (isAnimating) return;
    const next = gridRef.current.map((row) => row.slice());
    const center = Math.floor(gridSize / 2);
    next[center][center] += 1000;
    animateSimulation(createToppleSimulation(next, gridSize));
  };

  const downloadPng = () => {
    const link = document.createElement("a");
    link.download = `sandpile-${gridSize}x${gridSize}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="sandpile-explorer" aria-label="Interactive sandpile explorer">
      <div className="sandpile-heading">
        <div>
          <span className="sandpile-kicker">Interactive field</span>
          <h2>Build a sandpile</h2>
        </div>
        <span className="sandpile-status" aria-live="polite">
          {generationStatus || `${fps} FPS`}
        </span>
      </div>
      <div className="sandpile-workspace">
        <div className="sandpile-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="sandpile-canvas"
            width={gridSize}
            height={gridSize}
            onPointerDown={addGrain}
            aria-label={`${gridSize} by ${gridSize} sandpile grid. Click to add a grain.`}
          />
          <span className="sandpile-canvas-note">Click to add grains</span>
        </div>
        <aside className="sandpile-controls">
          <button className="sandpile-button" type="button" onClick={() => {
            generateIdentity();
          }}>
            Generate identity grid
          </button>
          <button
            className="sandpile-button"
            type="button"
            onClick={() => {
              if (isCaching) cancelAnimation();
              else populateIdentityCache();
            }}
            disabled={isAnimating && !isCaching}
          >
            {isCaching ? "Cancel identity caching" : "Cache identities 1-512"}
          </button>
          <label className="sandpile-field sandpile-speed" htmlFor="sandpile-speed">
            Animation speed
            <input
              id="sandpile-speed"
              type="range"
              min="1"
              max="100"
              step="1"
              value={animationSpeed}
              onChange={(event) => setAnimationSpeed(Number(event.target.value))}
            />
            <output>{animationSpeed}%</output>
          </label>
          <div className="sandpile-option-row">
            <label className="sandpile-field" htmlFor="sandpile-grains">
              Grains per click
              <input
                id="sandpile-grains"
                type="number"
                min="1"
                max="1000000"
                step="1"
                value={grainsPerClick}
                onChange={(event) => setGrainsPerClick(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>
            <button className="sandpile-button" type="button" onClick={generateCenterAvalanche}>
              Add 1000 grains at center
            </button>
          </div>
          <div className="sandpile-option-row">
            <label className="sandpile-field" htmlFor="sandpile-size">
              Grid size (max 512)
              <input
                id="sandpile-size"
                type="number"
                min="2"
                max={MAX_SIZE}
                step="1"
                value={sizeInput}
                onChange={(event) => setSizeInput(event.target.value)}
              />
            </label>
            <button className="sandpile-reset" type="button" onClick={resizeGrid}>
              Resize grid
            </button>
          </div>
          <button className="sandpile-reset" type="button" onClick={downloadPng}>
            Download PNG
          </button>
          <button className="sandpile-reset" type="button" onClick={() => {
            cancelAnimation();
            setGrid(createEmptyGrid(gridSize));
          }}>
            Clear grid
          </button>
          <div className="sandpile-colors">
            <h3>Pixel colors</h3>
            <label className="sandpile-field" htmlFor="sandpile-preset">
              Preset
              <select
                id="sandpile-preset"
                defaultValue="primary colors"
                onChange={(event) => {
                  if (event.target.value) setColors(COLOR_PRESETS[event.target.value]);
                }}
              >
                <option value="">Custom</option>
                {Object.keys(COLOR_PRESETS).map((preset) => (
                  <option key={preset} value={preset}>{preset}</option>
                ))}
              </select>
            </label>
            <div className="sandpile-color-options">
              {[3, 2, 1, 0].map((value) => (
                <label key={value} htmlFor={`sandpile-color-${value}`}>
                  <span>{value} grains</span>
                  <input
                    id={`sandpile-color-${value}`}
                    type="color"
                    value={colors[value]}
                    onChange={(event) => updateColor(value, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
