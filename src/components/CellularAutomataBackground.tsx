"use client";

import { useEffect, useRef } from "react";

const CELL_SIZE = 8;
const ONE_DIMENSIONAL_INTERVAL = 90;
const TWO_DIMENSIONAL_INTERVAL = 240;
const LIVE_CELL_RGB = "15, 23, 42";
const LIVE_CELL_ALPHA = 0.078;
const STATE_ALPHA_LEVELS = [0, 0.026, 0.043, 0.06, LIVE_CELL_ALPHA] as const;
const MAX_RANDOM_CHUNK = 65_536;

type OneDimensionalRule = {
  id: string;
  code: number;
  density: number;
};

type LifeLikeRule = {
  kind: "life-like";
  id: string;
  birth: readonly number[];
  survive: readonly number[];
  density: number;
};

type GenerationsRule = {
  kind: "generations";
  id: string;
  birth: readonly number[];
  survive: readonly number[];
  states: number;
  density: number;
};

type CyclicRule = {
  kind: "cyclic";
  id: string;
  states: number;
  threshold: number;
};

type GreenbergHastingsRule = {
  kind: "greenberg-hastings";
  id: string;
  states: number;
  threshold: number;
};

type LangtonsAntRule = {
  kind: "langtons-ant";
  id: string;
  ants: number;
  stepsPerGeneration: number;
};

type TwoDimensionalRule =
  | LifeLikeRule
  | GenerationsRule
  | CyclicRule
  | GreenbergHastingsRule
  | LangtonsAntRule;

type Ant = {
  x: number;
  y: number;
  direction: number;
};

type AutomataSelection =
  | { family: "one-dimensional"; rule: OneDimensionalRule }
  | { family: "two-dimensional"; rule: TwoDimensionalRule };

const ONE_DIMENSIONAL_RULES: readonly OneDimensionalRule[] = [
  { id: "rule-18", code: 18, density: 0.08 },
  { id: "rule-22", code: 22, density: 0.08 },
  { id: "rule-30", code: 30, density: 0.12 },
  { id: "rule-45", code: 45, density: 0.12 },
  { id: "rule-54", code: 54, density: 0.16 },
  { id: "rule-60", code: 60, density: 0.08 },
  { id: "rule-73", code: 73, density: 0.12 },
  { id: "rule-90", code: 90, density: 0.08 },
  { id: "rule-105", code: 105, density: 0.08 },
  { id: "rule-110", code: 110, density: 0.14 },
  { id: "rule-126", code: 126, density: 0.08 },
  { id: "rule-150", code: 150, density: 0.08 },
  { id: "rule-184", code: 184, density: 0.46 },
];

const TWO_DIMENSIONAL_RULES: readonly TwoDimensionalRule[] = [
  {
    kind: "life-like",
    id: "conway",
    birth: [3],
    survive: [2, 3],
    density: 0.27,
  },
  {
    kind: "life-like",
    id: "highlife",
    birth: [3, 6],
    survive: [2, 3],
    density: 0.27,
  },
  {
    kind: "life-like",
    id: "day-and-night",
    birth: [3, 6, 7, 8],
    survive: [3, 4, 6, 7, 8],
    density: 0.48,
  },
  {
    kind: "life-like",
    id: "seeds",
    birth: [2],
    survive: [],
    density: 0.16,
  },
  {
    kind: "life-like",
    id: "maze",
    birth: [3],
    survive: [1, 2, 3, 4, 5],
    density: 0.25,
  },
  {
    kind: "life-like",
    id: "replicator",
    birth: [1, 3, 5, 7],
    survive: [1, 3, 5, 7],
    density: 0.18,
  },
  {
    kind: "life-like",
    id: "two-by-two",
    birth: [3, 6],
    survive: [1, 2, 5],
    density: 0.24,
  },
  {
    kind: "life-like",
    id: "morley",
    birth: [3, 6, 8],
    survive: [2, 4, 5],
    density: 0.28,
  },
  {
    kind: "life-like",
    id: "coral",
    birth: [3],
    survive: [4, 5, 6, 7, 8],
    density: 0.34,
  },
  {
    kind: "life-like",
    id: "diamoeba",
    birth: [3, 5, 6, 7, 8],
    survive: [5, 6, 7, 8],
    density: 0.46,
  },
  {
    kind: "life-like",
    id: "anneal",
    birth: [4, 6, 7, 8],
    survive: [3, 5, 6, 7, 8],
    density: 0.5,
  },
  {
    kind: "generations",
    id: "brians-brain",
    birth: [2],
    survive: [],
    states: 3,
    density: 0.18,
  },
  {
    kind: "generations",
    id: "star-wars",
    birth: [2],
    survive: [3, 4, 5],
    states: 4,
    density: 0.2,
  },
  {
    kind: "cyclic",
    id: "cyclic-spirals",
    states: 12,
    threshold: 1,
  },
  {
    kind: "greenberg-hastings",
    id: "excitable-waves",
    states: 8,
    threshold: 2,
  },
  {
    kind: "langtons-ant",
    id: "langtons-ant",
    ants: 12,
    stepsPerGeneration: 32,
  },
];

function randomIndex(length: number) {
  const value = new Uint32Array(1);
  window.crypto.getRandomValues(value);
  return value[0] % length;
}

function pickRule<T extends { id: string }>(
  rules: readonly T[],
  previousRule: string | null
) {
  const candidates = rules.filter((rule) => rule.id !== previousRule);
  return candidates[randomIndex(candidates.length)];
}

function chooseAutomata(): AutomataSelection {
  try {
    const previousFamily = window.sessionStorage.getItem(
      "swag:automata-family"
    );
    const family =
      previousFamily === "one-dimensional"
        ? "two-dimensional"
        : previousFamily === "two-dimensional"
          ? "one-dimensional"
          : randomIndex(2) === 0
            ? "one-dimensional"
            : "two-dimensional";

    window.sessionStorage.setItem("swag:automata-family", family);

    if (family === "one-dimensional") {
      const storageKey = "swag:automata-rule:one-dimensional";
      const rule = pickRule(
        ONE_DIMENSIONAL_RULES,
        window.sessionStorage.getItem(storageKey)
      );
      window.sessionStorage.setItem(storageKey, rule.id);
      return { family, rule };
    }

    const storageKey = "swag:automata-rule:two-dimensional";
    const rule = pickRule(
      TWO_DIMENSIONAL_RULES,
      window.sessionStorage.getItem(storageKey)
    );
    window.sessionStorage.setItem(storageKey, rule.id);
    return { family, rule };
  } catch {
    return randomIndex(2) === 0
      ? {
          family: "one-dimensional",
          rule: ONE_DIMENSIONAL_RULES[
            randomIndex(ONE_DIMENSIONAL_RULES.length)
          ],
        }
      : {
          family: "two-dimensional",
          rule: TWO_DIMENSIONAL_RULES[
            randomIndex(TWO_DIMENSIONAL_RULES.length)
          ],
        };
  }
}

function fillRandom(target: Uint8Array, density: number) {
  const randomValues = new Uint8Array(target.length);

  for (let offset = 0; offset < randomValues.length; offset += MAX_RANDOM_CHUNK) {
    window.crypto.getRandomValues(
      randomValues.subarray(
        offset,
        Math.min(offset + MAX_RANDOM_CHUNK, randomValues.length)
      )
    );
  }

  const liveThreshold = Math.floor(density * 256);

  for (let index = 0; index < target.length; index += 1) {
    target[index] = randomValues[index] < liveThreshold ? 1 : 0;
  }
}

function fillRandomStates(target: Uint8Array, states: number) {
  const randomValues = new Uint8Array(target.length);

  for (let offset = 0; offset < randomValues.length; offset += MAX_RANDOM_CHUNK) {
    window.crypto.getRandomValues(
      randomValues.subarray(
        offset,
        Math.min(offset + MAX_RANDOM_CHUNK, randomValues.length)
      )
    );
  }

  for (let index = 0; index < target.length; index += 1) {
    target[index] = randomValues[index] % states;
  }
}

export function CellularAutomataBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectionRef = useRef<AutomataSelection | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !context) {
      return;
    }

    selectionRef.current ??= chooseAutomata();
    const selection = selectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const birthLookup = new Uint8Array(9);
    const surviveLookup = new Uint8Array(9);
    let columns = 0;
    let rows = 0;
    let cells = new Uint8Array();
    let nextCells = new Uint8Array();
    let line = new Uint8Array();
    let nextLine = new Uint8Array();
    let history = new Uint8Array();
    let ants: Ant[] = [];
    let populatedRows = 0;
    let animationFrame = 0;
    let resizeFrame = 0;
    let previousGenerationTime = 0;
    let running = false;
    let unchangedGenerations = 0;
    let oneDimensionalScrolling = false;

    canvas.dataset.automataFamily = selection.family;
    canvas.dataset.automataRule = selection.rule.id;
    canvas.dataset.automataKind =
      selection.family === "one-dimensional"
        ? "elementary"
        : selection.rule.kind;

    if (
      selection.family === "two-dimensional" &&
      (selection.rule.kind === "life-like" ||
        selection.rule.kind === "generations")
    ) {
      selection.rule.birth.forEach((neighbors) => {
        birthLookup[neighbors] = 1;
      });
      selection.rule.survive.forEach((neighbors) => {
        surviveLookup[neighbors] = 1;
      });
    }

    const evolveLine = (rule: OneDimensionalRule) => {
      for (let x = 0; x < columns; x += 1) {
        const left = line[x === 0 ? columns - 1 : x - 1];
        const center = line[x];
        const right = line[x === columns - 1 ? 0 : x + 1];
        const neighborhood = (left << 2) | (center << 1) | right;

        nextLine[x] = (rule.code >> neighborhood) & 1;
      }

      [line, nextLine] = [nextLine, line];
    };

    const seedOneDimensional = (rule: OneDimensionalRule) => {
      line = new Uint8Array(columns);
      nextLine = new Uint8Array(columns);
      history = new Uint8Array(columns * rows);
      fillRandom(line, rule.density);
      history.set(line, 0);
      populatedRows = 1;
      oneDimensionalScrolling = false;
      evolveLine(rule);
    };

    const moveAnts = (steps: number) => {
      for (let stepIndex = 0; stepIndex < steps; stepIndex += 1) {
        for (const ant of ants) {
          const index = ant.y * columns + ant.x;
          ant.direction =
            cells[index] === 0
              ? (ant.direction + 1) % 4
              : (ant.direction + 3) % 4;
          cells[index] = cells[index] === 0 ? 1 : 0;

          if (ant.direction === 0) {
            ant.y = ant.y === 0 ? rows - 1 : ant.y - 1;
          } else if (ant.direction === 1) {
            ant.x = ant.x === columns - 1 ? 0 : ant.x + 1;
          } else if (ant.direction === 2) {
            ant.y = ant.y === rows - 1 ? 0 : ant.y + 1;
          } else {
            ant.x = ant.x === 0 ? columns - 1 : ant.x - 1;
          }
        }
      }
    };

    const seedTwoDimensional = (rule: TwoDimensionalRule) => {
      cells = new Uint8Array(columns * rows);
      nextCells = new Uint8Array(columns * rows);
      ants = [];

      if (rule.kind === "life-like" || rule.kind === "generations") {
        fillRandom(cells, rule.density);
      } else if (
        rule.kind === "cyclic" ||
        rule.kind === "greenberg-hastings"
      ) {
        fillRandomStates(cells, rule.states);
      } else {
        ants = Array.from({ length: rule.ants }, () => ({
          x: randomIndex(columns),
          y: randomIndex(rows),
          direction: randomIndex(4),
        }));
        moveAnts(256);
      }

      unchangedGenerations = 0;
    };

    const render = () => {
      const source =
        selection.family === "one-dimensional" ? history : cells;
      const multiStateRule =
        selection.family === "two-dimensional" &&
        (selection.rule.kind === "generations" ||
          selection.rule.kind === "cyclic" ||
          selection.rule.kind === "greenberg-hastings")
          ? selection.rule
          : null;

      if (selection.family === "one-dimensional") {
        canvas.dataset.populatedRows = String(populatedRows);
        canvas.dataset.totalRows = String(rows);
        canvas.dataset.scrolling = String(oneDimensionalScrolling);
      }

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!multiStateRule) {
        context.beginPath();

        for (let index = 0; index < source.length; index += 1) {
          if (!source[index]) {
            continue;
          }

          const x = (index % columns) * CELL_SIZE;
          const y = Math.floor(index / columns) * CELL_SIZE;
          context.rect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }

        context.fillStyle = `rgba(${LIVE_CELL_RGB}, ${LIVE_CELL_ALPHA})`;
        context.fill();
        return;
      }

      for (let level = 1; level < STATE_ALPHA_LEVELS.length; level += 1) {
        context.beginPath();

        for (let index = 0; index < source.length; index += 1) {
          const state = source[index];

          if (state === 0) {
            continue;
          }

          let stateLevel: number;

          if (
            multiStateRule.kind === "generations" ||
            multiStateRule.kind === "greenberg-hastings"
          ) {
            stateLevel =
              state === 1
                ? 4
                : Math.max(
                    1,
                    3 -
                      Math.floor(
                        ((state - 2) /
                          Math.max(1, multiStateRule.states - 2)) *
                          2
                      )
                  );
          } else {
            stateLevel = Math.max(
              1,
              Math.ceil(
                (state / Math.max(1, multiStateRule.states - 1)) * 4
              )
            );
          }

          if (stateLevel !== level) {
            continue;
          }

          const x = (index % columns) * CELL_SIZE;
          const y = Math.floor(index / columns) * CELL_SIZE;
          context.rect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }

        context.fillStyle = `rgba(${LIVE_CELL_RGB}, ${STATE_ALPHA_LEVELS[level]})`;
        context.fill();
      }
    };

    const stepOneDimensional = (rule: OneDimensionalRule) => {
      if (populatedRows < rows) {
        history.set(line, populatedRows * columns);
        populatedRows += 1;
      } else {
        history.copyWithin(0, columns);
        history.set(line, (rows - 1) * columns);
        oneDimensionalScrolling = true;
      }

      evolveLine(rule);
    };

    const stepTwoDimensional = (rule: TwoDimensionalRule) => {
      if (rule.kind === "langtons-ant") {
        moveAnts(rule.stepsPerGeneration);
        return;
      }

      let changedCells = 0;
      let activeCells = 0;

      for (let y = 0; y < rows; y += 1) {
        const row = y * columns;
        const rowAbove = (y === 0 ? rows - 1 : y - 1) * columns;
        const rowBelow = (y === rows - 1 ? 0 : y + 1) * columns;

        for (let x = 0; x < columns; x += 1) {
          const left = x === 0 ? columns - 1 : x - 1;
          const right = x === columns - 1 ? 0 : x + 1;
          const index = row + x;
          const currentState = cells[index];
          const targetState =
            rule.kind === "cyclic"
              ? (currentState + 1) % rule.states
              : 1;
          const neighbors =
            (cells[rowAbove + left] === targetState ? 1 : 0) +
            (cells[rowAbove + x] === targetState ? 1 : 0) +
            (cells[rowAbove + right] === targetState ? 1 : 0) +
            (cells[row + left] === targetState ? 1 : 0) +
            (cells[row + right] === targetState ? 1 : 0) +
            (cells[rowBelow + left] === targetState ? 1 : 0) +
            (cells[rowBelow + x] === targetState ? 1 : 0) +
            (cells[rowBelow + right] === targetState ? 1 : 0);
          let nextValue: number;

          if (rule.kind === "life-like") {
            nextValue = currentState
              ? surviveLookup[neighbors]
              : birthLookup[neighbors];
          } else if (rule.kind === "generations") {
            if (currentState === 0) {
              nextValue = birthLookup[neighbors];
            } else if (currentState === 1) {
              nextValue = surviveLookup[neighbors]
                ? 1
                : Math.min(2, rule.states - 1);
            } else {
              nextValue =
                currentState === rule.states - 1 ? 0 : currentState + 1;
            }
          } else if (rule.kind === "cyclic") {
            nextValue =
              neighbors >= rule.threshold ? targetState : currentState;
          } else {
            nextValue =
              currentState === 0
                ? neighbors >= rule.threshold
                  ? 1
                  : 0
                : (currentState + 1) % rule.states;
          }

          nextCells[index] = nextValue;
          changedCells += nextValue === currentState ? 0 : 1;
          activeCells += nextValue === 0 ? 0 : 1;
        }
      }

      [cells, nextCells] = [nextCells, cells];
      unchangedGenerations = changedCells === 0 ? unchangedGenerations + 1 : 0;

      if (
        unchangedGenerations > 3 ||
        ((rule.kind === "life-like" || rule.kind === "generations") &&
          activeCells < Math.max(8, cells.length * 0.01))
      ) {
        seedTwoDimensional(rule);
      }
    };

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;

      columns = Math.max(24, Math.ceil(window.innerWidth / CELL_SIZE));
      rows = Math.max(18, Math.ceil(window.innerHeight / CELL_SIZE));
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;

      if (selection.family === "one-dimensional") {
        seedOneDimensional(selection.rule);
      } else {
        seedTwoDimensional(selection.rule);
      }

      render();
    };

    const step = () => {
      if (selection.family === "one-dimensional") {
        stepOneDimensional(selection.rule);
      } else {
        stepTwoDimensional(selection.rule);
      }

      render();
    };

    const animate = (time: number) => {
      if (!running) {
        return;
      }

      const interval =
        selection.family === "one-dimensional"
          ? ONE_DIMENSIONAL_INTERVAL
          : TWO_DIMENSIONAL_INTERVAL;

      if (time - previousGenerationTime >= interval) {
        step();
        previousGenerationTime = time;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const updateAnimationState = () => {
      if (
        reducedMotion.matches &&
        selection.family === "one-dimensional" &&
        populatedRows < rows
      ) {
        while (populatedRows < rows) {
          stepOneDimensional(selection.rule);
        }
        render();
      }

      const shouldRun = !document.hidden && !reducedMotion.matches;

      if (shouldRun && !running) {
        running = true;
        previousGenerationTime = performance.now();
        animationFrame = window.requestAnimationFrame(animate);
      } else if (!shouldRun && running) {
        running = false;
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(resize);
    };

    resize();
    updateAnimationState();
    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", updateAnimationState);
    reducedMotion.addEventListener("change", updateAnimationState);

    return () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", updateAnimationState);
      reducedMotion.removeEventListener("change", updateAnimationState);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="cellular-automata-background"
    />
  );
}
