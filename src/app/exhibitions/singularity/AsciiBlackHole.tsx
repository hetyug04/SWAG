"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Singularity.module.css";

const DISK_CHARS = ".,:;!i1tfLCG08@#";
const SPACE_CHARS = ".,'`:;i+*";
const CORE_CHARS = "@#80";
const TAU = Math.PI * 2;
const PHOTON_SPHERE = 3;
const DISK_INNER = 6;

type View = { yaw: number; pitch: number };
type DragOrigin = View & { x: number; y: number };
type TraceResult = {
  id: number;
  columns: number;
  rows: number;
  yaw: number;
  pitch: number;
  rayKind: Uint8Array<ArrayBuffer>;
  sourceA: Float32Array<ArrayBuffer>;
  sourceB: Float32Array<ArrayBuffer>;
  sourceC: Float32Array<ArrayBuffer>;
  closestRadius: Float32Array<ArrayBuffer>;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

export function AsciiBlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewTargetRef = useRef<View>({ yaw: -0.12, pitch: 0.28 });
  const viewCurrentRef = useRef<View>({ yaw: -0.12, pitch: 0.28 });
  const dragOriginRef = useRef<DragOrigin | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const worker = new Worker(new URL("./rayTracer.worker.ts", import.meta.url), { type: "module" });
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let columns = 1;
    let rows = 1;
    let cellW = 11;
    let cellH = 18;
    let fontSize = 16;
    let lastDraw = 0;
    let lastTraceRequest = -Infinity;
    let tracedYaw = Infinity;
    let tracedPitch = Infinity;
    let traceInvalid = true;
    let workerBusy = false;
    let queuedView: View | null = null;
    let traceId = 0;
    let visible = !document.hidden;

    let rayKind = new Uint8Array(1);
    let sourceA = new Float32Array(1);
    let sourceB = new Float32Array(1);
    let sourceC = new Float32Array(1);
    let closestRadius = new Float32Array(1);
    let glyphs: string[] = [];
    let reds = new Uint8Array(1);
    let greens = new Uint8Array(1);
    let blues = new Uint8Array(1);
    let alphas = new Uint8Array(1);
    let emission = new Float32Array(1);
    let blurHorizontal = new Float32Array(1);
    let blurredEmission = new Float32Array(1);
    let glowTiers = new Uint8Array(1);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const updateMotion = () => {
      reducedMotion = motionQuery.matches;
    };
    const updateVisibility = () => {
      visible = !document.hidden;
      if (visible) lastDraw = 0;
    };
    const forwardEscapeToGallery = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || window.parent === window) return;
      event.preventDefault();
      window.parent.postMessage({ type: "singularity:escape" }, window.location.origin);
    };

    const allocate = (size: number) => {
      rayKind = new Uint8Array(size);
      sourceA = new Float32Array(size);
      sourceB = new Float32Array(size);
      sourceC = new Float32Array(size);
      closestRadius = new Float32Array(size);
      glyphs = new Array<string>(size);
      reds = new Uint8Array(size);
      greens = new Uint8Array(size);
      blues = new Uint8Array(size);
      alphas = new Uint8Array(size);
      emission = new Float32Array(size);
      blurHorizontal = new Float32Array(size);
      blurredEmission = new Float32Array(size);
      glowTiers = new Uint8Array(size);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      const compact = width < 640;
      fontSize = compact ? 14 : 16;
      cellW = compact ? 9.5 : 11;
      cellH = compact ? 16 : 18;
      columns = Math.ceil(width / cellW);
      rows = Math.ceil(height / cellH);
      allocate(columns * rows);
      traceInvalid = true;
      queuedView = { ...viewCurrentRef.current };
    };

    const requestTrace = (view: View) => {
      if (workerBusy) {
        queuedView = { ...view };
        return;
      }
      workerBusy = true;
      traceId += 1;
      worker.postMessage({ id: traceId, width, height, columns, rows, cellW, cellH, yaw: view.yaw, pitch: view.pitch });
      lastTraceRequest = performance.now();
    };

    worker.onmessage = (event: MessageEvent<TraceResult>) => {
      const result = event.data;
      if (result.columns === columns && result.rows === rows) {
        rayKind = result.rayKind;
        sourceA = result.sourceA;
        sourceB = result.sourceB;
        sourceC = result.sourceC;
        closestRadius = result.closestRadius;
        tracedYaw = result.yaw;
        tracedPitch = result.pitch;
        traceInvalid = false;
      }
      workerBusy = false;
      if (queuedView) {
        const next = queuedView;
        queuedView = null;
        requestTrace(next);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("keydown", forwardEscapeToGallery);
    resize();
    requestTrace(viewCurrentRef.current);

    const render = (now: number) => {
      frame = window.requestAnimationFrame(render);
      if (!visible || (!reducedMotion && now - lastDraw < 32)) return;
      lastDraw = now;

      const target = viewTargetRef.current;
      const view = viewCurrentRef.current;
      const easing = reducedMotion ? 1 : dragOriginRef.current ? 0.25 : 0.12;
      view.yaw += (target.yaw - view.yaw) * easing;
      view.pitch += (target.pitch - view.pitch) * easing;

      const viewChanged = Math.abs(view.yaw - tracedYaw) > 0.006 || Math.abs(view.pitch - tracedPitch) > 0.006;
      if (traceInvalid || (viewChanged && now - lastTraceRequest > 44)) requestTrace(view);

      const time = reducedMotion ? 5000 : now;
      emission.fill(0);
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          const kind = rayKind[index];

          if (kind === 1) {
            const seed = hash(column + 1301, row + 1709);
            glyphs[index] = CORE_CHARS[Math.floor(seed * CORE_CHARS.length)];
            const edge = smoothstep(2.65, 3.08, closestRadius[index]);
            reds[index] = 5 + Math.round(edge * 5);
            greens[index] = 6 + Math.round(edge * 5);
            blues[index] = 6 + Math.round(edge * 4);
            alphas[index] = 218;
            continue;
          }

          if (kind === 2) {
            const radius = sourceA[index];
            const azimuth = sourceB[index];
            const beta = clamp(Math.sqrt(1 / Math.max(radius - 2, 1)), 0, 0.78);
            const gamma = 1 / Math.sqrt(1 - beta * beta);
            const doppler = 1 / Math.max(0.22, gamma * (1 - beta * sourceC[index]));
            const gravitationalShift = Math.sqrt(Math.max(0.01, 1 - 2 / radius));
            const frequencyShift = gravitationalShift * doppler;
            const emissivity = Math.pow(DISK_INNER / radius, 2.18);
            const orbitalPhase = azimuth - time * (0.00145 / Math.pow(radius / DISK_INNER, 1.5));
            const flowWave = 0.5 + 0.5 * Math.sin(orbitalPhase * 16 - time * (0.0028 / Math.pow(radius / DISK_INNER, 1.5)) + radius * 3.7);
            const turbulence = 0.7 + 0.17 * Math.sin(orbitalPhase * 11 + radius * 4.2) + 0.1 * Math.sin(orbitalPhase * 23 - radius * 8.7);
            const photonBoost = Math.exp(-Math.pow((closestRadius[index] - PHOTON_SPHERE) / 0.45, 2)) * 0.82;
            const intensity = clamp(emissivity * Math.pow(frequencyShift, 3) * turbulence * 1.82 + photonBoost, 0.2, 1);
            const glyphEnergy = clamp(intensity * 0.7 + flowWave * 0.3, 0, 1);
            glyphs[index] = DISK_CHARS[Math.floor(glyphEnergy * (DISK_CHARS.length - 1))];

            const heat = smoothstep(0.18, 1.35, Math.pow(DISK_INNER / radius, 0.75) * frequencyShift);
            const whiteHeat = heat * heat;
            const flowLuma = 0.9 + flowWave * 0.1;
            reds[index] = Math.min(255, Math.round((222 + heat * 33) * flowLuma));
            greens[index] = Math.min(255, Math.round((68 + heat * 132 + whiteHeat * 55) * flowLuma));
            blues[index] = Math.min(255, Math.round((18 + heat * 76 + whiteHeat * 158) * flowLuma));
            alphas[index] = Math.round((0.74 + intensity * 0.26) * 255);
            emission[index] = clamp(intensity * 0.92 + photonBoost * 0.8, 0, 1);
            continue;
          }

          const skyU = (sourceA[index] + Math.PI) / TAU;
          const skyV = (sourceB[index] + Math.PI * 0.5) / Math.PI;
          const skyX = Math.floor(skyU * 360);
          const skyY = Math.floor(skyV * 180);
          const seed = hash(skyX + 37, skyY + 71);
          const fine = hash(skyX * 3 + 509, skyY * 3 + 911);
          const band = Math.exp(-Math.pow((skyV - 0.53 - Math.sin(skyU * TAU) * 0.07) / 0.085, 2));
          const isStar = seed > 0.97 - band * 0.07;
          const skyFlow = 0.5 + 0.5 * Math.sin(sourceA[index] * 9 + sourceB[index] * 14 - time * 0.0007 + sourceC[index] * 4);
          glyphs[index] = isStar
            ? seed > 0.996 ? "+" : seed > 0.988 ? "*" : ":"
            : SPACE_CHARS[(Math.floor(fine * 4 + skyFlow * 2)) % 5];
          if (isStar) {
            reds[index] = fine > 0.78 ? 226 : 211;
            greens[index] = fine > 0.78 ? 244 : 224;
            blues[index] = fine > 0.78 ? 248 : 209;
            alphas[index] = Math.round((0.76 + seed * 0.23) * 255);
            emission[index] = 0.11 + seed * 0.12;
          } else {
            reds[index] = Math.round(151 + band * 38);
            greens[index] = Math.round(160 + band * 31);
            blues[index] = Math.round(157 + band * 22);
            alphas[index] = Math.round((0.21 + fine * 0.12 + band * 0.14 + clamp(sourceC[index] / Math.PI, 0, 1) * 0.045) * 255);
            emission[index] = band * 0.04;
          }
        }
      }

      const weights = [0.3, 0.21, 0.15, 0.105, 0.075, 0.05, 0.032, 0.018];
      const norm = weights[0] + 2 * weights.slice(1).reduce((sum, value) => sum + value, 0);
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          let total = emission[row * columns + column] * weights[0];
          for (let offset = 1; offset < weights.length; offset += 1) {
            total += (
              emission[row * columns + Math.max(0, column - offset)] +
              emission[row * columns + Math.min(columns - 1, column + offset)]
            ) * weights[offset];
          }
          blurHorizontal[row * columns + column] = total / norm;
        }
      }
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const index = row * columns + column;
          let total = blurHorizontal[index] * weights[0];
          for (let offset = 1; offset < weights.length; offset += 1) {
            total += (
              blurHorizontal[Math.max(0, row - offset) * columns + column] +
              blurHorizontal[Math.min(rows - 1, row + offset) * columns + column]
            ) * weights[offset];
          }
          const glow = clamp((total / norm) * 3.2, 0, 1);
          blurredEmission[index] = glow;
          if (rayKind[index] === 1) {
            glowTiers[index] = 0;
            continue;
          }
          const radiance = Math.sqrt(glow);
          reds[index] = Math.min(255, Math.round(reds[index] + radiance * 106));
          greens[index] = Math.min(255, Math.round(greens[index] + radiance * 66));
          blues[index] = Math.min(255, Math.round(blues[index] + radiance * 32));
          alphas[index] = Math.max(alphas[index], Math.round((0.28 + radiance * 0.64) * 255));
          const direct = emission[index];
          glowTiers[index] = direct > 0.78 ? 3 : direct > 0.42 || glow > 0.48 ? 2 : glow > 0.12 ? 1 : 0;
        }
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.fillStyle = "#010202";
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px ui-monospace, "Cascadia Mono", "SFMono-Regular", Consolas, monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      const blurByTier = [0, 8, 17, 30];
      for (let tier = 0; tier < blurByTier.length; tier += 1) {
        context.shadowBlur = blurByTier[tier];
        for (let row = 0; row < rows; row += 1) {
          for (let column = 0; column < columns; column += 1) {
            const index = row * columns + column;
            if (glowTiers[index] !== tier) continue;
            const alpha = alphas[index] / 255;
            context.fillStyle = `rgba(${reds[index]}, ${greens[index]}, ${blues[index]}, ${alpha})`;
            context.shadowColor = tier === 0
              ? "transparent"
              : `rgba(${reds[index]}, ${greens[index]}, ${blues[index]}, ${Math.min(0.92, 0.28 + blurredEmission[index] * 0.74)})`;
            context.fillText(glyphs[index], column * cellW + cellW * 0.5, row * cellH + cellH * 0.5);
          }
        }
      }
      context.shadowBlur = 0;
      context.shadowColor = "transparent";
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      worker.terminate();
      observer.disconnect();
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("keydown", forwardEscapeToGallery);
    };
  }, []);

  const normalizeYaw = () => {
    const target = viewTargetRef.current;
    const normalized = Math.atan2(Math.sin(target.yaw), Math.cos(target.yaw));
    const shift = target.yaw - normalized;
    target.yaw = normalized;
    viewCurrentRef.current.yaw -= shift;
  };

  return (
    <main className={`${styles.exhibit} ${dragging ? styles.dragging : ""}`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="A glowing ASCII black hole on a fixed grid. Drag freely in any direction to orbit the centered viewpoint."
        role="application"
        tabIndex={0}
        onPointerDown={(event) => {
          const target = viewTargetRef.current;
          dragOriginRef.current = { x: event.clientX, y: event.clientY, yaw: target.yaw, pitch: target.pitch };
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const origin = dragOriginRef.current;
          if (!origin) return;
          viewTargetRef.current = {
            yaw: origin.yaw + (event.clientX - origin.x) * 0.0052,
            pitch: clamp(origin.pitch - (event.clientY - origin.y) * 0.0044, -1.48, 1.48),
          };
        }}
        onPointerUp={(event) => {
          dragOriginRef.current = null;
          setDragging(false);
          normalizeYaw();
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragOriginRef.current = null;
          setDragging(false);
          normalizeYaw();
        }}
        onKeyDown={(event) => {
          const amount = event.shiftKey ? 0.2 : 0.09;
          const next = { ...viewTargetRef.current };
          if (event.key === "ArrowLeft") next.yaw -= amount;
          else if (event.key === "ArrowRight") next.yaw += amount;
          else if (event.key === "ArrowUp") next.pitch = clamp(next.pitch + amount, -1.48, 1.48);
          else if (event.key === "ArrowDown") next.pitch = clamp(next.pitch - amount, -1.48, 1.48);
          else if (event.key.toLowerCase() === "r") {
            viewTargetRef.current = { yaw: -0.12, pitch: 0.28 };
            event.preventDefault();
            return;
          } else return;
          event.preventDefault();
          viewTargetRef.current = next;
        }}
      />
      <p className={styles.srOnly}>
        Each non-overlapping ASCII cell traces a light ray. The camera remains centered and can orbit through the full upper and lower viewing sphere.
      </p>
    </main>
  );
}
