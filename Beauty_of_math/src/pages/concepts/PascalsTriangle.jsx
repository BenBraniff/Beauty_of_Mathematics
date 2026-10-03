import { useMemo, useState } from "react";

const DEFAULT_ROWS = 10;

function triangleValue(rowIndex, columnIndex) {
  let value = 1;
  for (let step = 1; step <= columnIndex; step += 1) {
    value = (value * (rowIndex - step + 1)) / step;
  }
  return value;
}

function buildTriangle(rowCount) {
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = [];
    for (let columnIndex = 0; columnIndex <= rowIndex; columnIndex += 1) {
      row.push(triangleValue(rowIndex, columnIndex));
    }
    return row;
  });
}

export default function PascalsTriangle() {
  const [rowCount, setRowCount] = useState(DEFAULT_ROWS);
  const [alignment, setAlignment] = useState("center");
  const [parityColors, setParityColors] = useState(false);
  const triangle = useMemo(() => buildTriangle(rowCount), [rowCount]);

  return (
    <section
      className="pascal-explorer"
      aria-label="Interactive Pascal's Triangle explorer"
    >
      <div className="pascal-heading">
        <div>
          <span className="pascal-kicker">Interactive field</span>
          <h2>Build the triangle</h2>
        </div>
        <span className="pascal-status" aria-live="polite">
          {rowCount} rows / {(rowCount * (rowCount + 1)) / 2} values
        </span>
      </div>
      <div className="pascal-workspace">
        <div
          className={`pascal-stage pascal-align-${alignment} ${
            parityColors ? "pascal-parity" : ""
          }`}
          style={{ "--pascal-row-count": rowCount }}
        >
          <div
            className="pascal-tree"
            aria-label={`Pascal's Triangle with ${rowCount} rows`}
          >
            {triangle.map((row, rowIndex) => (
              <div className="pascal-row" key={rowIndex}>
                {row.map((value, columnIndex) => (
                  <span
                    className="pascal-value"
                    key={`${rowIndex}-${columnIndex}`}
                    data-parity={value % 2 === 0 ? "even" : "odd"}
                  >
                    {value}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <span className="pascal-stage-note">
            Every entry is the sum of the two above
          </span>
        </div>
        <aside className="pascal-controls">
          <label htmlFor="pascal-rows">
            Triangle size <output>{rowCount} rows</output>
          </label>
          <input
            id="pascal-rows"
            type="range"
            min="3"
            max="16"
            step="1"
            value={rowCount}
            onChange={(event) => setRowCount(Number(event.target.value))}
          />
          <fieldset className="pascal-fieldset">
            <legend>Alignment</legend>
            <div className="pascal-segmented">
              {[
                ["left", "Left"],
                ["center", "Center"],
                ["right", "Right"],
              ].map(([value, label]) => (
                <button
                  className={alignment === value ? "active" : ""}
                  key={value}
                  type="button"
                  aria-pressed={alignment === value}
                  onClick={() => setAlignment(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="pascal-toggle">
            <input
              type="checkbox"
              checked={parityColors}
              onChange={(event) => setParityColors(event.target.checked)}
            />
            <span>
              Color even / odd <small>reveal Sierpinski's triangle</small>
            </span>
          </label>
          <button
            className="pascal-reset"
            type="button"
            onClick={() => {
              setRowCount(DEFAULT_ROWS);
              setAlignment("center");
              setParityColors(false);
            }}
          >
            Reset triangle
          </button>
          <p>
            Pascal's triangle counts combinations. Its odd entries trace a
            fractal pattern when the even entries are hidden.
          </p>
        </aside>
      </div>
    </section>
  );
}
