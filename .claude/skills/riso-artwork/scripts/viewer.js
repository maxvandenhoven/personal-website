/**
 * Browser side of the artwork preview (see preview.mjs).
 *
 * It paints the artwork with the site's own painter and mirrors the figure
 * engine in src/lib/riso/engine.ts: 20 fps, a device pixel ratio capped at 1.5
 * and one motif instance per canvas. If the engine's loop changes, update this
 * file too.
 */
import artwork from "artwork-under-preview";
import { createPainter } from "../../../../src/lib/riso/painter.ts";
import { readPalette } from "../../../../src/lib/riso/palette.ts";

const MAX_DPR = 1.5;
const FRAME_INTERVAL_MS = 1000 / 20 - 2;
const MAX_STEP_SECONDS = 0.05;
const TIMELINE_FRAMES = 6;
const SCRUB_RANGE_SECONDS = 60;

const $ = (id) => document.getElementById(id);
const errorBox = $("errors");
const reported = new Set();

function report(message) {
  if (reported.has(message)) return;
  reported.add(message);
  errorBox.append(`${message}\n`);
}

if (!artwork || typeof artwork.create !== "function") {
  report(
    "The artwork must default-export defineArtwork({ create }) from @/lib/riso/artwork.",
  );
  throw new Error("Invalid artwork export");
}

const painter = createPainter(readPalette());
const startTime = artwork.startTime ?? 0;
let clock = startTime;
let playing = true;
let speed = 1;
let lastFrame = performance.now();
let lastDrawn = 0;

/** Paints one frame of `motif` at `time` onto `canvas`, sized to its CSS box. */
function draw(canvas, motif, time) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);
  if (!width || !height) return;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  painter.setDpr(dpr);
  painter.begin(ctx, width, height);
  try {
    motif(painter, width, height, time);
  } catch (error) {
    report(`${error instanceof Error ? error.stack : error}`);
  }
  painter.end();
}

function createMotif() {
  try {
    return artwork.create();
  } catch (error) {
    report(`create() threw: ${error instanceof Error ? error.stack : error}`);
    return () => {};
  }
}

const live = ["card", "article", "glyph-small", "glyph-large"].map((id) => ({
  canvas: $(id),
  motif: createMotif(),
}));

function renderTimeline() {
  const step = Number($("step").value);
  const shape = document.body.dataset.kind;
  const timeline = $("timeline");
  timeline.replaceChildren();
  for (let i = 0; i < TIMELINE_FRAMES; i++) {
    const time = startTime + i * step;
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    frame.className = shape === "glyph" ? "frame glyph-small" : "frame card";
    if (shape === "glyph") {
      frame.style.width = frame.style.height = "80px";
    }
    const canvas = document.createElement("canvas");
    frame.append(canvas);
    const caption = document.createElement("figcaption");
    caption.textContent = `t = ${time.toFixed(1)} s`;
    figure.append(frame, caption);
    timeline.append(figure);
    // A fresh motif per frame, so closures that keep state see each time once.
    draw(canvas, createMotif(), time);
  }
}

function syncControls() {
  $("play").textContent = playing ? "Pause" : "Play";
  $("clock").textContent = `${clock.toFixed(1)} s`;
  $("scrub").value = String(clock % SCRUB_RANGE_SECONDS);
}

function frame(now) {
  const dt = Math.min(MAX_STEP_SECONDS, (now - lastFrame) / 1000);
  lastFrame = now;
  if (playing) clock += dt * speed;
  if (now - lastDrawn >= FRAME_INTERVAL_MS || !playing) {
    for (const { canvas, motif } of live) {
      if (canvas.clientWidth > 0) draw(canvas, motif, clock);
    }
    lastDrawn = now;
    syncControls();
  }
  requestAnimationFrame(frame);
}

$("play").addEventListener("click", () => {
  playing = !playing;
  syncControls();
});
$("restart").addEventListener("click", () => {
  clock = startTime;
  syncControls();
});
$("speed").addEventListener("change", (event) => {
  speed = Number(event.target.value);
});
$("scrub").addEventListener("input", (event) => {
  playing = false;
  clock = Number(event.target.value);
  syncControls();
});
$("step").addEventListener("change", renderTimeline);
$("kind").value = document.body.dataset.kind;
$("kind").addEventListener("change", (event) => {
  document.body.dataset.kind = event.target.value;
  renderTimeline();
});
window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLSelectElement) return;
  if (event.code === "Space") {
    event.preventDefault();
    playing = !playing;
  } else if (event.code === "ArrowRight") {
    playing = false;
    clock += 0.25;
  } else if (event.code === "ArrowLeft") {
    playing = false;
    clock = Math.max(0, clock - 0.25);
  } else {
    return;
  }
  syncControls();
});

renderTimeline();
requestAnimationFrame(frame);
