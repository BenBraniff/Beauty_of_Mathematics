import { useEffect, useRef, useState } from "react";
import { generateTilingGeometry } from "./geometry-generation/index.js";

const TILINGS = {
  square: { name: "Square grid", description: "Four right angles meet at every vertex.", detail: "Regular, periodic", color: "#e5875d" },
  triangle: { name: "Equilateral triangles", description: "Six equal triangles meet around every vertex.", detail: "Regular, periodic", color: "#5b9bd5" },
  hexagon: { name: "Hexagonal tiling", description: "Three regular hexagons meet at every vertex.", detail: "Regular, periodic", color: "#63b58c" },
  einstein: { name: "Einstein tiles", description: "A single hat-shaped tile can cover the plane without repeating.", detail: "Aperiodic", color: "#b77acb" },
  penroseP1: { name: "Penrose P1 (pentagonal)", description: "The original Penrose family: three matched pentagons, a star, a boat, and a diamond.", detail: "Aperiodic", color: "#d27b62" },
  penroseP2: { name: "Penrose P2 (kite and dart)", description: "Kites and darts grow from two Robinson triangles under golden-ratio substitution.", detail: "Aperiodic", color: "#d27b62" },
  penroseP3: { name: "Penrose P3 (rhombi)", description: "The popular thick-and-thin rhombus Penrose tiling.", detail: "Aperiodic", color: "#d27b62" },
  pentagonal: { name: "Pentagonal tiling", description: "Five-sided tiles interlock in the Cairo pattern.", detail: "Periodic", color: "#c69b58" },
};

function polygon(context, points) {
  context.beginPath();
  points.forEach(({ x, y }, index) => {
    const draw = index === 0 ? context.moveTo : context.lineTo;
    draw.call(context, x, y);
  });
  context.closePath();
}

function tileColor(type, kind, hue, grayscale) {
  if (type === "einstein") {
    if (grayscale) {
      return { H: "#b8b8b8", H1: "#737373", T: "#8f8f8f", P: "#d0d0d0", F: "#f4f4f4" }[kind];
    }
    return {
      H: `hsl(${hue} 52% 72%)`,
      H1: `hsl(${(hue + 36) % 360} 28% 48%)`,
      T: `hsl(${(hue + 72) % 360} 72% 54%)`,
      P: `hsl(${(hue + 108) % 360} 28% 82%)`,
      F: `hsl(${(hue + 144) % 360} 38% 96%)`,
    }[kind];
  }
  if (type === "penroseP1") {
    return ["#d27b62", "#e4bd72", "#b8795b", "#d9a85d", "#c68369", "#f0d18a"][kind];
  }
  if (type === "penroseP2") return kind === "kite" ? "#d27b62" : "#e4bd72";
  if (type === "penroseP3") return kind === "thick" ? "#ff8ba6" : "#ffc5c5";
  if (type === "pentagonal") return kind === 0 ? "#c69b58" : "#d9b979";
  return TILINGS[type].color;
}

function drawTiles(context, type, tiles, hue, grayscale) {
  context.lineWidth = type === "einstein" ? 0.9 : 0.8;
  context.strokeStyle = type === "einstein" ? "#20242b" : "#4b4247";
  tiles.forEach(({ kind, points }) => {
    polygon(context, points);
    context.fillStyle = tileColor(type, kind, hue, grayscale);
    context.fill();
    context.stroke();
  });
}

function drawTiling(canvas, type, hue, grayscale, tileDensity) {
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
  const tiles = generateTilingGeometry(type, width, height, { density: tileDensity });
  drawTiles(context, type, tiles, hue, grayscale);
}

export default function TilingExplorer() {
  const canvasRef = useRef(null);
  const [selectedTiling, setSelectedTiling] = useState("square");
  const [einsteinHue, setEinsteinHue] = useState(265);
  const [einsteinGrayscale, setEinsteinGrayscale] = useState(false);
  const [tileDensity, setTileDensity] = useState(5);
  const selected = TILINGS[selectedTiling];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const draw = () => drawTiling(canvas, selectedTiling, einsteinHue, einsteinGrayscale, tileDensity);
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    draw();
    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedTiling, einsteinHue, einsteinGrayscale, tileDensity]);
  return (
    <section className="tiling-explorer" aria-label="Interactive tiling explorer">
      <div className="tiling-heading">
        <div><span className="tiling-kicker">Interactive field</span><h2>Eight ways to tile a plane</h2></div>
        <span className="tiling-status" aria-live="polite">{selected.detail}</span>
      </div>
      <div className="tiling-workspace">
        <div className="tiling-stage"><canvas ref={canvasRef} className="tiling-canvas" aria-label={`${selected.name} pattern`} /><span className="tiling-stage-note">Every edge meets another edge.</span></div>
        <div className="tiling-controls">
          <label htmlFor="tiling-choice">Choose a tiling</label>
          <select id="tiling-choice" value={selectedTiling} onChange={(event) => setSelectedTiling(event.target.value)}>
            {Object.entries(TILINGS).map(([key, tiling]) => <option key={key} value={key}>{tiling.name}</option>)}
          </select>
          {selectedTiling === "einstein" && (
            <>
              <label htmlFor="einstein-hue">Tile hue <output>{einsteinHue}°</output></label>
              <input id="einstein-hue" type="range" min="0" max="360" value={einsteinHue} onChange={(event) => setEinsteinHue(Number(event.target.value))} />
              <label className="tiling-toggle">
                <input type="checkbox" checked={einsteinGrayscale} onChange={(event) => setEinsteinGrayscale(event.target.checked)} />
                <span>Grayscale</span>
              </label>
            </>
          )}
          <label htmlFor="tile-density">Tile density <output>{tileDensity}</output></label>
          <input
            id="tile-density"
            type="range"
            min="1"
            max="7"
            value={tileDensity}
            onChange={(event) => setTileDensity(Number(event.target.value))}
          />
          <p>{selected.description}</p>
          <div className="tiling-facts"><span>{selected.name}</span><small>{selected.detail}</small></div>
        </div>
      </div>
    </section>
  );
}
