import { useMemo, useState } from "react";

const DOORS = [0, 1, 2];

function randomDoor() {
  return Math.floor(Math.random() * DOORS.length);
}

function revealGoatDoor(prizeDoor, chosenDoor) {
  const goatDoors = DOORS.filter(
    (door) => door !== prizeDoor && door !== chosenDoor,
  );

  if (goatDoors.length === 0) {
    return null;
  }

  return goatDoors[Math.floor(Math.random() * goatDoors.length)];
}

function switchDoor(chosenDoor, openedDoor) {
  return DOORS.find(
    (door) => door !== chosenDoor && door !== openedDoor,
  );
}

export default function MontyHallExplorer() {
  const [prizeDoor, setPrizeDoor] = useState(() => randomDoor());
  const [chosenDoor, setChosenDoor] = useState(null);
  const [openedDoor, setOpenedDoor] = useState(null);
  const [finalChoice, setFinalChoice] = useState(null);

  const phase = chosenDoor === null
    ? "pick"
    : openedDoor === null
      ? "reveal"
      : finalChoice === null
        ? "decision"
        : "result";

  const finalDoor = useMemo(() => {
    if (finalChoice === null || chosenDoor === null || openedDoor === null) {
      return null;
    }

    return finalChoice === "stay" ? chosenDoor : switchDoor(chosenDoor, openedDoor);
  }, [chosenDoor, finalChoice, openedDoor]);

  const didWin = finalDoor !== null && finalDoor === prizeDoor;

  function startRound(door) {
    setPrizeDoor(randomDoor());
    setChosenDoor(door);
    setOpenedDoor(null);
    setFinalChoice(null);
  }

  function revealDoor() {
    if (chosenDoor === null || openedDoor !== null) {
      return;
    }

    setOpenedDoor(revealGoatDoor(prizeDoor, chosenDoor));
  }

  function chooseStay() {
    if (chosenDoor === null || openedDoor === null) {
      return;
    }

    setFinalChoice("stay");
  }

  function chooseSwitch() {
    if (chosenDoor === null || openedDoor === null) {
      return;
    }

    setFinalChoice("switch");
  }

  function resetRound() {
    setChosenDoor(null);
    setOpenedDoor(null);
    setFinalChoice(null);
    setPrizeDoor(randomDoor());
  }

  return (
    <section className="monty-hall-explorer" aria-label="Monty Hall explorer">
      <div className="monty-hall-header">
        <div>
          <span className="monty-hall-kicker">Interactive puzzle</span>
          <h2>Three doors, one prize</h2>
        </div>
        <button className="monty-hall-button monty-hall-button--ghost" type="button" onClick={resetRound}>
          New round
        </button>
      </div>

      <div className="monty-hall-stage">
        <div className="monty-hall-doors" aria-label="Three doors">
          {DOORS.map((door) => {
            const isSelected = chosenDoor === door;
            const isOpened = openedDoor === door;
            const isPrize = prizeDoor === door;
            const isFinal = finalDoor === door;
            const isRevealed = isOpened || (phase === "result" && isFinal);

            return (
              <button
                key={door}
                type="button"
                className={[
                  "monty-hall-door",
                  isSelected ? "monty-hall-door--selected" : "",
                  isOpened ? "monty-hall-door--opened" : "",
                  isFinal && phase === "result"
                    ? didWin
                      ? "monty-hall-door--win"
                      : "monty-hall-door--loss"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  if (phase === "pick") {
                    startRound(door);
                  }
                }}
                disabled={phase !== "pick"}
                aria-label={`Door ${door + 1}${isRevealed ? `, ${isPrize ? "Prize" : "Goat"}` : ""}`}
              >
                <span className="monty-hall-door-number">Door {door + 1}</span>
                <span className="monty-hall-door-symbol" aria-hidden="true">
                  {isRevealed ? (isPrize ? "💰" : "🐐") : "🚪"}
                </span>
                {isSelected && !isRevealed && (
                  <span className="monty-hall-door-tag">Your pick</span>
                )}
                {isFinal && <span className="monty-hall-door-tag">Final choice</span>}
              </button>
            );
          })}
        </div>

        <div
          className={`monty-hall-status ${
            phase === "result"
              ? didWin
                ? "monty-hall-status--win"
                : "monty-hall-status--loss"
              : ""
          }`}
          aria-live="polite"
        >
          {phase === "pick" && (
            <>
              <strong>Pick a door</strong>
              <p>One door hides the prize. The other two hide goats.</p>
            </>
          )}
          {phase === "reveal" && (
            <>
              <strong>Host reveals a goat</strong>
              <p>The host knows where the prize is and opens one losing door.</p>
            </>
          )}
          {phase === "decision" && (
            <>
              <strong>Stay or switch?</strong>
              <p>
                Door {openedDoor + 1} was opened. You can keep your original door or
                switch to the other unopened door.
              </p>
            </>
          )}
          {phase === "result" && (
            <>
              <strong>{didWin ? "You won" : "You lost"}</strong>
              <p>
                {finalChoice === "stay"
                  ? "You kept your original choice."
                  : "You switched to the remaining unopened door."}
              </p>
            </>
          )}
        </div>

        <div className="monty-hall-actions">
          {phase === "pick" && (
            <p className="monty-hall-hint">Choose any door to begin.</p>
          )}
          {phase === "reveal" && (
            <button
              type="button"
              className="monty-hall-button monty-hall-button--primary"
              onClick={revealDoor}
            >
              Reveal a goat
            </button>
          )}
          {phase === "decision" && (
            <>
              <button type="button" className="monty-hall-button" onClick={chooseStay}>
                Stay with door {chosenDoor + 1}
              </button>
              <button
                type="button"
                className="monty-hall-button monty-hall-button--primary"
                onClick={chooseSwitch}
              >
                Switch doors
              </button>
            </>
          )}
          {phase === "result" && (
            <button
              type="button"
              className="monty-hall-button monty-hall-button--primary"
              onClick={resetRound}
            >
              Play again
            </button>
          )}
        </div>
      </div>

      <div className="monty-hall-summary" aria-live="polite">
        <div className="monty-hall-metric">
          <span>Stay</span>
          <strong>1/3</strong>
        </div>
        <div className="monty-hall-metric">
          <span>Switch</span>
          <strong>2/3</strong>
        </div>
      </div>
    </section>
  );
}
