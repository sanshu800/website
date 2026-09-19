/*
 * Generates the site's abstract artwork — `node scripts/artwork/gen.mjs`.
 *
 * The output is committed, so this is not part of the build. It exists so the
 * images have a readable source rather than being binaries nobody can adjust:
 * change a number here, re-run, and the file in `public/images/` changes with
 * it. Deterministic — the same numbers produce the same bytes.
 *
 * The house language is the hero film: thin luminous threads in smoke on
 * near-black, one focal bloom. These pieces are drawn in that vocabulary. They
 * are deliberately abstract — no faces, no stock office, no invented product
 * UI — and they carry luminance only: the cards render them under
 * `mix-blend-luminosity` on a saturated field, so the backdrop supplies the
 * colour and the drawing supplies the light.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const W = 1408;
const H = 968;
const OUT = new URL("../../public/images/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

/** mulberry32 — small, seeded, reproducible. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => Math.round(v * 100) / 100;

/* ---------- backplate: near-black ground, focal glow, smoke, vignette ----- */

/*
 * Smoke is what makes the hero film feel like light rather than lines, so every
 * piece gets it: soft low-opacity clouds behind the drawing, and a thinner wash
 * in front so the threads sit *inside* the atmosphere instead of on top of it.
 */
function ground(focus, seed) {
  const r = rng(seed);
  const motes = Array.from({ length: 130 }, () => {
    const x = r() * W;
    const y = r() * H;
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(0.5 + r() * 1.7)}" fill="#fff" opacity="${n(
      0.04 + r() * 0.14,
    )}"/>`;
  }).join("");

  const cloud = (opacity) =>
    Array.from({ length: 5 }, () => {
      const cx = r() * W;
      const cy = r() * H;
      const rx = 190 + r() * 380;
      const ry = 90 + r() * 190;
      return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="url(#smoke)" opacity="${n(
        opacity * (0.5 + r()),
      )}"/>`;
    }).join("");

  return {
    back: `
      <rect width="${W}" height="${H}" fill="url(#ground)"/>
      <rect width="${W}" height="${H}" fill="url(#bloom)"/>
      ${cloud(0.05)}`,
    front: `${cloud(0.028)}${motes}`,
    defs: `
      <radialGradient id="ground" cx="${n((focus.x / W) * 100)}%" cy="${n((focus.y / H) * 100)}%" r="78%">
        <stop offset="0%" stop-color="#131313"/>
        <stop offset="54%" stop-color="#090909"/>
        <stop offset="100%" stop-color="#010101"/>
      </radialGradient>
      <radialGradient id="bloom" cx="${n((focus.x / W) * 100)}%" cy="${n((focus.y / H) * 100)}%" r="46%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.11"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0.035"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="smoke">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="55%" stop-color="#ffffff" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>`,
  };
}

/* Grain keeps the flat field from banding after compression. Drawn last. */
const GRAIN = `
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05"/>`;

/* ---------- 1 · enquiries that arrive and fade out ----------------------- */

function unanswered() {
  const r = rng(4211);
  const focus = { x: 1120, y: 484 };
  const g = ground(focus, 4211);

  const threads = Array.from({ length: 9 }, (_, i) => {
    const y0 = 96 + i * 94 + (r() - 0.5) * 46;
    const amp = 34 + r() * 74;
    // Each channel sets off, wanders, and loses its light partway across.
    const reach = 300 + r() * 500;
    const end = 250 + r() * 120;
    const d = `M -20 ${n(y0)}
      C ${n(reach * 0.26)} ${n(y0 + amp)}, ${n(reach * 0.5)} ${n(y0 - amp * 0.85)}, ${n(reach * 0.72)} ${n(y0 + amp * 0.3)}
      S ${n(reach)} ${n(y0 - amp * 0.2)}, ${n(end + reach)} ${n(y0 + amp * 0.1)}`;
    return {
      d,
      w: n(1.1 + r() * 1.3),
      tip: 3 + r() * 2.4,
      x: n(end + reach),
      y: n(y0 + amp * 0.1),
      grad: `<linearGradient id="fade${i}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
          <stop offset="7%" stop-color="#fff" stop-opacity="0.95"/>
          <stop offset="48%" stop-color="#fff" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>`,
      body: `<path d="${d}" fill="none" stroke="url(#fade${i})" stroke-width="${n(
        1.1 + r() * 1.3,
      )}" stroke-linecap="round"/>
        <circle cx="${n(end + reach)}" cy="${n(y0 + amp * 0.1)}" r="${n(
          2.4 + r() * 2.2,
        )}" fill="#fff" opacity="0.5"/>`,
    };
  });

  // The one still waiting, past them all, unanswered.
  const y = 484;
  return `
  ${g.defs}
  <defs>${threads.map((t) => t.grad).join("")}</defs>
  ${g.back}
  ${threads.map((t) => t.body).join("")}
  <g>
    <path d="M1252 236 L1252 732" stroke="#fff" stroke-width="1.2" opacity="0.09"/>
    <path d="M1252 296 L1252 672" stroke="#fff" stroke-width="17" stroke-linecap="round" opacity="0.05"/>
    <path d="M1252 296 L1252 672" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.13"/>
    <path d="M1252 296 L1252 672" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity="0.95"/>
    <circle cx="1252" cy="${y}" r="22" fill="#fff" opacity="0.1"/>
    <circle cx="1252" cy="${y}" r="7.5" fill="#fff"/>
  </g>
  ${g.front}
  ${GRAIN}`;
}

/* ---------- 2 · the same loop, all day ---------------------------------- */

function loop() {
  const r = rng(9021);
  const cy = 500;
  const focus = { x: 700, y: cy };
  const g = ground(focus, 9021);

  const loops = 9;
  let d = `M ${n(96)} ${cy}`;
  let x = 210;
  let drift = 0;
  for (let i = 0; i < loops; i++) {
    // Amplitudes and spacing vary, so it reads as work rather than a spring.
    const rx = 66 + r() * 26;
    const ry = 130 + r() * 74;
    drift += (r() - 0.5) * 22;
    x += rx * 1.06;
    d += ` C ${n(x - rx)} ${n(cy - ry + drift)}, ${n(x + rx * 0.1)} ${n(
      cy - ry * 0.9 + drift,
    )}, ${n(x)} ${n(cy + ry * 0.2 + drift)}`;
    d += ` C ${n(x + rx * 0.9)} ${n(cy + ry + drift)}, ${n(x - rx * 1.35)} ${n(
      cy + ry * 0.94 + drift,
    )}, ${n(x + rx * 0.2)} ${n(cy + drift)}`;
  }

  const echoes = [24, 48, 76]
    .map(
      (off, i) =>
        `<path d="${d}" transform="translate(0 ${off})" stroke="#fff" stroke-width="1" opacity="${n(
          0.11 - i * 0.032,
        )}"/>
         <path d="${d}" transform="translate(0 -${off})" stroke="#fff" stroke-width="1" opacity="${n(
           0.11 - i * 0.032,
         )}"/>`,
    )
    .join("");

  return `
  ${g.defs}
  <defs>
    <linearGradient id="coil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.05"/>
      <stop offset="30%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  ${g.back}
  <g fill="none" stroke-linecap="round">
    ${echoes}
    <path d="${d}" stroke="#fff" stroke-width="20" opacity="0.04"/>
    <path d="${d}" stroke="#fff" stroke-width="8" opacity="0.085"/>
    <path d="${d}" stroke="url(#coil)" stroke-width="2.3"/>
  </g>
  ${g.front}
  ${GRAIN}`;
}

/* ---------- 3 · the light goes out exactly when you need it ------------- */

/*
 * A visibility gap, not a chart. One thread crosses the frame, and it stays
 * flat and unreadable for the stretch where the decision actually has to be
 * made; only at the far end does it turn into something you can read. The
 * marker in the flat stretch is the month-end question being asked, the arc is
 * the answer arriving weeks later. Same line grammar as the piece either side
 * of it — no scatter, because scatter reads as noise rather than as data.
 */
function monthEnd() {
  const y = 528;
  const g = ground({ x: 1240, y: 470 }, 5510);
  const need = 902;

  // Days passing under an unreadable line.
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const x = 110 + i * 41;
    const o = n(0.055 + (i % 3) * 0.02);
    return `<path d="M${x} ${y + 18} L${x} ${y + 30}" stroke="#fff" stroke-width="1" opacity="${o}"/>`;
  }).join("");

  // The readings exist all month — they are just too faint to act on.
  const faint = Array.from({ length: 12 }, (_, i) => {
    const x = 190 + i * 64;
    return `<circle cx="${x}" cy="${n(y - 1)}" r="2.6" fill="#fff" opacity="0.22"/>`;
  }).join("");

  return `
  ${g.defs}
  <defs>
    <linearGradient id="late" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="30%" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="72%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  ${g.back}
  ${ticks}
  <path d="M60 ${y} L1064 ${y}" stroke="#fff" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
  ${faint}
  <g>
    <path d="M${need} ${y - 58} L${need} ${y + 52}" stroke="#fff" stroke-width="1.2" opacity="0.14"/>
    <circle cx="${need}" cy="${y}" r="6.5" fill="#fff" opacity="0.55"/>
    <circle cx="${need}" cy="${y}" r="19" fill="#fff" opacity="0.06"/>
  </g>
  <path d="M880 ${y} C 1080 ${y}, 1150 ${n(y - 52)}, 1348 ${n(y - 232)}"
        fill="none" stroke="url(#late)" stroke-width="20" opacity="0.05" stroke-linecap="round"/>
  <path d="M880 ${y} C 1080 ${y}, 1150 ${n(y - 52)}, 1348 ${n(y - 232)}"
        fill="none" stroke="url(#late)" stroke-width="8" opacity="0.1" stroke-linecap="round"/>
  <path d="M880 ${y} C 1080 ${y}, 1150 ${n(y - 52)}, 1348 ${n(y - 232)}"
        fill="none" stroke="url(#late)" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="1350" cy="${y - 233}" r="7.5" fill="#fff"/>
  <circle cx="1350" cy="${y - 233}" r="24" fill="#fff" opacity="0.12"/>
  ${g.front}
  ${GRAIN}`;
}

/* ---------- 4 · many problems, one system ------------------------------- */

function converge() {
  const r = rng(3312);
  const cx = 742;
  const cy = 484;
  const g = ground({ x: cx, y: cy }, 3312);

  const lines = Array.from({ length: 15 }, (_, i) => {
    const y0 = -10 + i * 66 + (r() - 0.5) * 26;
    const amp = 30 + r() * 68;
    const d = `M -20 ${n(y0)}
      C 200 ${n(y0 + amp)}, 330 ${n(y0 - amp * 0.9)}, 470 ${n(cy + (y0 - cy) * 0.42)}
      C 600 ${n(cy + (y0 - cy) * 0.12)}, 660 ${n(cy + (y0 - cy) * 0.03)}, ${cx} ${cy}`;
    return `<path d="${d}" fill="none" stroke="#fff" stroke-width="${n(
      0.9 + r() * 0.9,
    )}" opacity="${n(0.22 + r() * 0.4)}" stroke-linecap="round"/>`;
  }).join("");

  return `
  ${g.defs}
  ${g.back}
  ${lines}
  <circle cx="${cx}" cy="${cy}" r="64" fill="#fff" opacity="0.05"/>
  <circle cx="${cx}" cy="${cy}" r="52" fill="none" stroke="#fff" stroke-width="1" opacity="0.15"/>
  <circle cx="${cx}" cy="${cy}" r="30" fill="#fff" opacity="0.13"/>
  <circle cx="${cx}" cy="${cy}" r="9" fill="#fff"/>
  <path d="M${cx} ${cy} L1330 ${cy}" stroke="#fff" stroke-width="2.4" opacity="0.88" stroke-linecap="round"/>
  <path d="M${cx} ${cy} L1330 ${cy}" stroke="#fff" stroke-width="10" opacity="0.09" stroke-linecap="round"/>
  ${Array.from({ length: 7 }, (_, i) => {
    const x = cx + 74 + i * 72;
    return `<path d="M${x} ${cy + 13} L${x} ${cy + 26}" stroke="#fff" stroke-width="1.1" opacity="0.2"/>`;
  }).join("")}
  ${g.front}
  ${GRAIN}`;
}

/* ---------- render ------------------------------------------------------ */

const pieces = {
  "problem-enquiries": unanswered(),
  "problem-manual": loop(),
  "problem-lag": monthEnd(),
  "about-converge": converge(),
};

for (const [name, svg] of Object.entries(pieces)) {
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${svg}</svg>`;
  const buf = await sharp(Buffer.from(doc), { density: 144 })
    .resize(W, H)
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toBuffer();
  writeFileSync(`${OUT}/${name}.jpg`, buf);
  console.log(`${name.padEnd(20)} ${(buf.length / 1024).toFixed(0)} KB`);
}
