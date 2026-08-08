// Generates the placeholder image sequence for the home page's scroll-driven
// canvas animation (components/home/DoorSequence.tsx): a stylised street that
// dollies toward a door, the door swings open, warm light floods out, and the
// last frames wash to pearl so the hand-off into the video section is seamless.
//
// These are stand-ins so the animation is real and tunable before the yeshiva's
// own footage exists. To swap in real frames, extract them from the video and
// drop them in public/frames/door with the same zero-padded naming:
//
//   ffmpeg -i door.mp4 -vf "fps=24,scale=1080:-2" -q:v 6 \
//     public/frames/door/frame-%03d.webp
//
// then point FRAME_COUNT/FRAME_EXT in DoorSequence.tsx at the new set. Keep the
// count near 48-72 and the width near 1080 — a phone has to hold every decoded
// frame in memory at once, and full-resolution sequences are what make these
// animations crash mobile Safari.
//
// Run: node scripts/gen-door-frames.mjs

import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FRAME_COUNT = 48;
const WIDTH = 1200;
const HEIGHT = 1800; // portrait source: mobile-first, desktop crops top/bottom
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "frames", "door");

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const r = (n) => Math.round(n * 10) / 10;

// Doorway + wall geometry, in source coordinates before the camera push-in.
const DOOR = { x: 490, y: 690, w: 220, h: 470 };
// Wall and floor are deliberately drawn well outside the viewBox so they stay
// full-bleed at every step of the camera push-in.
const WALL = { x: -400, y: -400, w: 2000, bottom: 1160 };

function buildFrame(index) {
  const t = index / (FRAME_COUNT - 1);
  const dolly = lerp(1, 1.5, easeInOut(t)); // camera walks toward the door
  const open = easeInOut(clamp01((t - 0.5) / 0.42)); // door swings inward
  const glow = clamp01((t - 0.42) / 0.4); // light builds behind it
  const whiteout = clamp01((t - 0.9) / 0.1); // wash out into the next section

  // The door panel is hinged on its start edge; as it opens the free edge
  // travels back toward the hinge and tapers vertically, faking perspective.
  const freeX = DOOR.x + DOOR.w * (1 - open);
  const freeTopY = DOOR.y + 46 * open;
  const freeBottomY = DOOR.y + DOOR.h - 46 * open;
  const panel = [
    `${DOOR.x},${DOOR.y}`,
    `${r(freeX)},${r(freeTopY)}`,
    `${r(freeX)},${r(freeBottomY)}`,
    `${DOOR.x},${DOOR.y + DOOR.h}`,
  ].join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f2ece1"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e6ded0"/>
      <stop offset="1" stop-color="#f7f3ec"/>
    </linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f6f2ea"/>
      <stop offset="0.5" stop-color="#fbf8f2"/>
      <stop offset="1" stop-color="#efe9de"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#1a4a88"/>
      <stop offset="1" stop-color="#12325c"/>
    </linearGradient>
    <radialGradient id="warm" cx="0.5" cy="0.55" r="0.65">
      <stop offset="0" stop-color="#fff3cf"/>
      <stop offset="0.55" stop-color="#e5b842"/>
      <stop offset="1" stop-color="#9a7318"/>
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)"/>

  <g transform="translate(600,1010) scale(${r(dolly)}) translate(-600,-1010)">
    <rect x="${WALL.x}" y="${WALL.bottom}" width="${WALL.w}" height="1200" fill="url(#floor)"/>
    <rect x="${WALL.x}" y="${WALL.y}" width="${WALL.w}" height="${WALL.bottom - WALL.y}" fill="url(#wall)"/>
    <line x1="${WALL.x}" y1="${WALL.bottom}" x2="${WALL.x + WALL.w}" y2="${WALL.bottom}" stroke="#12325c" stroke-opacity="0.1" stroke-width="3"/>

    <!-- doorway interior: dark until the light behind it comes up -->
    <rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="#0d2547"/>
    <rect x="${DOOR.x}" y="${DOOR.y}" width="${DOOR.w}" height="${DOOR.h}" fill="url(#warm)" opacity="${r(glow)}"/>

    <!-- light spilling across the floor once the door is ajar -->
    <polygon points="${DOOR.x},${WALL.bottom} ${DOOR.x + DOOR.w},${WALL.bottom} ${DOOR.x + DOOR.w + 210},${HEIGHT} ${DOOR.x - 210},${HEIGHT}" fill="#e5b842" opacity="${r(glow * 0.35)}"/>

    <polygon points="${panel}" fill="url(#panel)"/>
    <polygon points="${panel}" fill="none" stroke="#e5b842" stroke-opacity="${r(0.35 + glow * 0.4)}" stroke-width="4"/>

    <rect x="${DOOR.x - 16}" y="${DOOR.y - 16}" width="${DOOR.w + 32}" height="${DOOR.h + 16}" fill="none" stroke="#12325c" stroke-opacity="0.16" stroke-width="6"/>
  </g>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fdfcfa" opacity="${r(whiteout)}"/>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const file of readdirSync(OUT_DIR)) {
  if (file.endsWith(".svg")) unlinkSync(join(OUT_DIR, file));
}
for (let i = 0; i < FRAME_COUNT; i++) {
  writeFileSync(join(OUT_DIR, `frame-${String(i).padStart(3, "0")}.svg`), buildFrame(i));
}
console.log(`Wrote ${FRAME_COUNT} frames to ${OUT_DIR}`);
