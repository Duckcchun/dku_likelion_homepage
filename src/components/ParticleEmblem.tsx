import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import emblemSrc from "../assets/emblem-lion-bear.webp";

/**
 * 히어로의 입체 파티클: 곰이 무너졌다가 사자로 다시 모입니다. (three.js + 셰이더)
 *
 * 속이 빈 삼각형 입자 수천 개가 입체적인 곰 머리(단국대학교, 블루)를 이루고 있다가,
 * 아래로 무너져 내린 뒤 갈기를 두른 사자(멋쟁이사자처럼, 오렌지)로 다시 모입니다.
 * 몇 초마다 둘 사이를 오갑니다.
 *
 * - 곰과 사자는 타원체 여러 덩이를 이어 붙인 겉면 위에 입자를 찍어 만들고, 눈·코·입·귀 테는 그 굴곡 위에 선으로 그립니다.
 *   사자의 갈기는 끝이 뾰족한 가닥 수십 개이고, 끝으로 갈수록 바람에 일렁입니다.
 * - 입자는 표면에 얹혀 까딱거리며, 표면이 받는 빛(왼쪽 위 조명 + 윤곽광)에 따라 밝기가 달라져 덩어리가 입체로 읽힙니다.
 * - 전환은 위에서 아래로 물결처럼 번집니다. 눈은 눈으로, 코는 코로, 겉면은 가까운 자리끼리 짝지어 옮겨 갑니다.
 * - 형상 입자 일부에는 부드러운 빛무리를 깔아, 촘촘한 곳이 은은하게 번집니다. (후처리 없이 입자만으로)
 * - 입자 하나하나가 3D 공간에서 제 축을 따라 도는 진짜 삼각형 틀입니다. 정면을 향하면 밝고, 옆으로 누우면 어둡습니다.
 * - 주변을 떠다니는 큰 도형은 두께가 있는 입체(삼각형 틀, 정사면체 뼈대)이고, 면마다 밝기가 달라 덩어리로 보입니다.
 * - 가까운 입자는 크고 밝게, 먼 입자는 작고 어둡게 그려 깊이를 만듭니다.
 * - 마우스가 움직이면 고개를 돌려 포인터를 쳐다보고, 가만히 있으면 천천히 좌우로 둘러봅니다.
 * - 주변에는 작은 입자들이 떠다니며 반짝이고, 뒤에서는 지금 동물의 색(블루/오렌지)이 은은하게 번집니다.
 * - scatter(0→1)가 커지면 입자가 화면 전체로 흩어지며 사라집니다.
 * - 화면 밖이거나 탭이 가려지면 그리기를 멈춥니다.
 * - 움직임 줄이기 설정에서는 사자 모습 한 장만 그리고, WebGL이 없으면 엠블럼 이미지를 보여 줍니다.
 * - three.js는 필요할 때 따로 내려받아 첫 화면 로딩을 막지 않습니다.
 */

const COUNT = {
  desktop: { shape: 11000, ambient: 1900, solidsNear: 12, solidsCorner: 18, solidsRing: 30, solidsMid: 54 },
  mobile: { shape: 3600, ambient: 560, solidsNear: 4, solidsCorner: 7, solidsRing: 10, solidsMid: 17 },
};

/** 화면 안에서의 자리와 크기. cx·cy는 화면 비율, size는 화면 높이(모바일은 너비) 대비 전체 지름 */
const PLACE = {
  desktop: { cx: 0.735, cy: 0.505, size: 0.97 },
  mobile: { cx: 0.5, cy: 0.21, size: 0.84 },
};

/** 한 번 오가는 시간(초): 곰 유지 → 무너지며 사자로 → 사자 유지 → 다시 곰으로 */
const TIMING = { bear: 4.2, morph: 3.2, lion: 6.4 };

/** 형상 입자 가운데 빛무리를 함께 그리는 비율 */
const HALO_SHARE = 0.2;

/** 형태의 가장 바깥 반지름(갈기 끝). 크기를 맞출 때 씁니다. */
const EXTENT = 1.55;

type Vec3 = [number, number, number];
type Palette = readonly (readonly [string, number])[];

const BEAR: Palette = [
  ["#2F7FD0", 34],
  ["#4A90D6", 30],
  ["#7DB3EA", 16],
  ["#FFFFFF", 12],
  ["#FFB020", 8],
];
const MANE: Palette = [
  ["#FF6000", 54],
  ["#FFB020", 22],
  ["#FF3D00", 10],
  ["#FFFFFF", 8],
  ["#4A90D6", 6],
];
const LION_FACE: Palette = [
  ["#FFB020", 40],
  ["#FF6000", 32],
  ["#FFFFFF", 28],
];
const BEAR_MUZZLE: Palette = [
  ["#7DB3EA", 46],
  ["#FFFFFF", 30],
  ["#4A90D6", 24],
];
const MANE_ROOT: Palette = [
  ["#FFB020", 62],
  ["#FF6000", 26],
  ["#FFFFFF", 12],
];
const MANE_TIP: Palette = [
  ["#FF3D00", 52],
  ["#FF6000", 44],
  ["#4A90D6", 4],
];
const LION_MUZZLE: Palette = [
  ["#FFFFFF", 44],
  ["#FFB020", 40],
  ["#FF6000", 16],
];
const LION_FEATURE: Palette = [
  ["#FFFFFF", 80],
  ["#FFE1A6", 20],
];
const FEATURE: Palette = [
  ["#FFFFFF", 85],
  ["#CFE3F8", 15],
];
const AMBIENT: Palette = [
  ["#FF6000", 40],
  ["#FFB020", 22],
  ["#4A90D6", 22],
  ["#FFFFFF", 16],
];

function pickColor(colors: Palette) {
  const total = colors.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [hex, w] of colors) {
    if ((r -= w) <= 0) return hex;
  }
  return colors[0][0];
}

const hexToRgb = (hex: string): Vec3 => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** 구 표면 위의 고른 방향 하나 */
function randomDirection(): Vec3 {
  const z = Math.random() * 2 - 1;
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [Math.cos(a) * r, Math.sin(a) * r, z];
}

const normalize = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

/** 형상을 이루는 덩어리 하나: 타원체 (c 중심, r 세 축의 반지름) */
interface Part {
  c: Vec3;
  r: Vec3;
}
/** 표면 위의 점 하나와 그 자리의 바깥 방향(법선) */
interface Sample {
  p: Vec3;
  n: Vec3;
}
type P2 = [number, number];

const part = (c: Vec3, r: Vec3 | number): Part => ({ c, r: typeof r === "number" ? [r, r, r] : r });

const insidePart = (p: Vec3, e: Part, shrink = 0.97) =>
  ((p[0] - e.c[0]) / e.r[0]) ** 2 + ((p[1] - e.c[1]) / e.r[1]) ** 2 + ((p[2] - e.c[2]) / e.r[2]) ** 2 < shrink * shrink;

/**
 * 덩어리 표면의 점. 다른 덩어리 속에 묻히는 점은 버려서 겉면만 남깁니다.
 * 뒤통수 쪽은 어차피 잘 보이지 않으므로 성기게 두고, 그만큼 얼굴 쪽을 촘촘하게 씁니다.
 */
function onPart(e: Part, all: Part[]): Sample {
  for (let tries = 0; tries < 40; tries++) {
    const d = randomDirection();
    const n = normalize([d[0] / e.r[0], d[1] / e.r[1], d[2] / e.r[2]]);
    if (n[2] < -0.1 && Math.random() < 0.62) continue;
    const j = 1 + (Math.random() - 0.5) * 0.03;
    const p: Vec3 = [e.c[0] + d[0] * e.r[0] * j, e.c[1] + d[1] * e.r[1] * j, e.c[2] + d[2] * e.r[2] * j];
    if (all.some((o) => o !== e && insidePart(p, o))) continue;
    return { p, n };
  }
  return { p: [e.c[0], e.c[1], e.c[2] + e.r[2]], n: [0, 0, 1] };
}

/** 정면에서 본 (x, y) 자리를 형상의 앞쪽 겉면 위로 올립니다. 눈·코·입을 얼굴 굴곡에 맞춰 그릴 때 씁니다. */
function onFront(parts: Part[], [x, y]: P2, lift = 0.018): Sample {
  let best: Sample | null = null;
  for (const e of parts) {
    const u = (x - e.c[0]) / e.r[0];
    const v = (y - e.c[1]) / e.r[1];
    const k = 1 - u * u - v * v;
    if (k <= 0) continue;
    const w = Math.sqrt(k);
    const z = e.c[2] + e.r[2] * w;
    if (!best || z > best.p[2]) best = { p: [x, y, z], n: normalize([u / e.r[0], v / e.r[1], w / e.r[2]]) };
  }
  if (!best) return { p: [x, y, 0], n: [0, 0, 1] };
  best.p[2] += lift;
  return best;
}

/** 꽉 찬 타원 안의 점 (tilt만큼 기울임) */
function inEllipse(c: P2, rx: number, ry: number, tilt = 0): P2 {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random());
  const x = Math.cos(a) * r * rx;
  const y = Math.sin(a) * r * ry;
  return [c[0] + x * Math.cos(tilt) - y * Math.sin(tilt), c[1] + x * Math.sin(tilt) + y * Math.cos(tilt)];
}

/** 꽉 찬 삼각형 안의 점 */
function inTriangle(a: P2, b: P2, c: P2): P2 {
  let u = Math.random();
  let v = Math.random();
  if (u + v > 1) {
    u = 1 - u;
    v = 1 - v;
  }
  return [a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v, a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v];
}

/** 붓으로 그은 선 위의 점: 2차 곡선(시작·당김점·끝) 여러 개 중 하나를 골라 그 위에 찍습니다. */
type Curve = [P2, P2, P2];
function onStroke(curves: Curve[], width: number): P2 {
  const [a, b, c] = curves[Math.floor(Math.random() * curves.length)];
  const t = Math.random();
  const k = 1 - t;
  return [
    k * k * a[0] + 2 * k * t * b[0] + t * t * c[0] + (Math.random() - 0.5) * width,
    k * k * a[1] + 2 * k * t * b[1] + t * t * c[1] + (Math.random() - 0.5) * width,
  ];
}

/** 눈·코·입 등 얼굴 그림의 갈래. 곰과 사자의 같은 갈래끼리 짝을 지어 눈은 눈으로, 코는 코로 옮겨 갑니다. */
const FEATURES = [
  { kind: "eyeL", share: 0.14 },
  { kind: "eyeR", share: 0.14 },
  { kind: "nose", share: 0.17 },
  { kind: "mouth", share: 0.19 },
  { kind: "extraL", share: 0.18 },
  { kind: "extraR", share: 0.18 },
] as const;
type FeatureKind = (typeof FEATURES)[number]["kind"];

/* ───────── 곰 ───────── */
const bearHead = part([0, -0.05, 0], [1, 0.92, 0.9]);
const bearEars = [part([-0.74, 0.72, -0.05], [0.36, 0.36, 0.28]), part([0.74, 0.72, -0.05], [0.36, 0.36, 0.28])];
const bearMuzzle = part([0, -0.33, 0.74], [0.42, 0.34, 0.36]);
const bearParts = [bearHead, ...bearEars, bearMuzzle];

function bearSurface(): Sample & { color: string } {
  const k = Math.random();
  if (k < 0.58) return { ...onPart(bearHead, bearParts), color: pickColor(BEAR) };
  if (k < 0.78) return { ...onPart(bearEars[Math.random() < 0.5 ? 0 : 1], bearParts), color: pickColor(BEAR) };
  return { ...onPart(bearMuzzle, bearParts), color: pickColor(BEAR_MUZZLE) };
}

function bearFeature(kind: FeatureKind): P2 {
  const side = kind.endsWith("L") ? -1 : 1;
  switch (kind) {
    case "eyeL":
    case "eyeR":
      return inEllipse([0.36 * side, 0.15], 0.07, 0.085);
    case "nose":
      return inEllipse([0, -0.2], 0.135, 0.085);
    case "mouth":
      // 코 밑에서 내려와 양쪽으로 살짝 올라가는 입
      return onStroke(
        [
          [[0, -0.28], [0, -0.36], [0, -0.44]],
          [[0, -0.44], [-0.1, -0.54], [-0.22, -0.46]],
          [[0, -0.44], [0.1, -0.54], [0.22, -0.46]],
        ],
        0.016,
      );
    default: {
      // 귀 안쪽의 둥근 테
      const a = Math.random() * Math.PI * 2;
      const r = 0.19 + (Math.random() - 0.5) * 0.016;
      return [0.74 * side + Math.cos(a) * r, 0.72 + Math.sin(a) * r];
    }
  }
}

/* ───────── 사자 ───────── */
const lionSkull = part([0, 0.04, 0.08], [0.72, 0.66, 0.62]);
const lionBridge = part([0, 0, 0.58], [0.25, 0.34, 0.24]); // 눈 사이에서 코까지 내려오는 긴 콧등
const lionMuzzle = part([0, -0.3, 0.62], [0.43, 0.27, 0.36]);
const lionChin = part([0, -0.52, 0.52], [0.21, 0.15, 0.22]);
const lionCheeks = [part([-0.42, -0.16, 0.3], 0.32), part([0.42, -0.16, 0.3], 0.32)];
const lionEars = [part([-0.56, 0.62, 0.1], [0.23, 0.23, 0.12]), part([0.56, 0.62, 0.1], [0.23, 0.23, 0.12])];
const lionParts = [lionSkull, lionBridge, lionMuzzle, lionChin, ...lionCheeks, ...lionEars];

const WHISKER_DOTS: P2[] = [
  [0.15, -0.3],
  [0.24, -0.29],
  [0.33, -0.29],
  [0.18, -0.37],
  [0.28, -0.36],
  [0.23, -0.43],
];

function lionFeature(kind: FeatureKind): P2 {
  const s = kind.endsWith("L") ? -1 : 1;
  switch (kind) {
    case "eyeL":
    case "eyeR":
      // 눈꼬리가 올라간 아몬드 모양 눈 + 눈꼬리 밖으로 뻗는 윗눈꺼풀 선
      return Math.random() < 0.62
        ? inEllipse([0.33 * s, 0.13], 0.075, 0.036, 0.3 * s)
        : onStroke([[[0.21 * s, 0.07], [0.32 * s, 0.185], [0.46 * s, 0.185]]], 0.014);
    case "nose":
      // 위가 넓은 역삼각형 코
      return inTriangle([-0.19, -0.12], [0.19, -0.12], [0, -0.3]);
    case "mouth":
      return onStroke(
        [
          [[0, -0.3], [0, -0.35], [0, -0.39]],
          [[0, -0.39], [-0.13, -0.52], [-0.32, -0.42]],
          [[0, -0.39], [0.13, -0.52], [0.32, -0.42]],
        ],
        0.016,
      );
    default: {
      const k = Math.random();
      // 귀 안쪽의 둥근 테 (곰의 귀 테가 그대로 옮겨 옵니다)
      if (k < 0.4) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.125 + (Math.random() - 0.5) * 0.014;
        return [0.56 * s + Math.cos(a) * r, 0.62 + Math.sin(a) * r];
      }
      // 눈 안쪽에서 코로 내려오는 넓은 콧등의 옆선
      if (k < 0.68) return onStroke([[[0.17 * s, 0.08], [0.2 * s, -0.02], [0.2 * s, -0.12]]], 0.014);
      // 수염 자리의 점
      const dot = WHISKER_DOTS[Math.floor(Math.random() * WHISKER_DOTS.length)];
      return inEllipse([dot[0] * s, dot[1]], 0.014, 0.014);
    }
  }
}

/** 갈기 한 가닥: 얼굴 둘레에서 바깥으로 뻗으며 끝이 뾰족해지는 털 뭉치 */
interface Lock {
  a: number; // 얼굴 둘레의 각도
  layer: number; // 0 앞, 1 가운데, 2 뒤
  root: number; // 뿌리의 반지름
  z: number;
  len: number;
  back: number; // 끝으로 갈수록 뒤로 넘어가는 정도
  width: number;
  curl: number; // 끝이 옆으로 휘는 정도
  droop: number; // 옆 가닥이 아래로 처지는 정도
}

function makeLocks(): Lock[] {
  const layers = [
    { n: 11, root: 0.64, z: 0.3, len: 0.42, back: 0.12 },
    { n: 13, root: 0.64, z: 0.08, len: 0.62, back: 0.26 },
    { n: 15, root: 0.62, z: -0.2, len: 0.82, back: 0.32 },
  ];
  return layers.flatMap((L, layer) =>
    Array.from({ length: L.n }, (_, k) => {
      const a = ((k + Math.random() * 0.6 + layer * 0.37) / L.n) * Math.PI * 2;
      const down = Math.max(0, -Math.sin(a)); // 턱 아래는 더 길게
      return {
        a,
        layer,
        root: L.root,
        z: L.z,
        len: L.len * (0.85 + Math.random() * 0.25) * (1 + down * 0.12),
        back: L.back,
        width: ((Math.PI * L.root) / L.n) * (0.95 + Math.random() * 0.3),
        curl: (Math.random() - 0.5) * 0.5,
        droop: 0.12 * Math.cos(a) ** 2,
      };
    }),
  );
}

function manePoint(locks: Lock[]): Sample & { color: string; flex: number } {
  const lock = locks[Math.floor(Math.random() * locks.length)];
  // s: 뿌리 0 → 끝 1. 가닥이 끝으로 갈수록 가늘어지므로 뿌리 쪽에 더 많이 찍습니다.
  const s = 1 - Math.pow(Math.random(), 0.8);
  const w = lock.width * (1 - s) + 0.006;
  const u = Math.random() * 2 - 1;
  const r = lock.root + lock.len * s;
  const ang = lock.a + lock.curl * s * s;
  const p: Vec3 = [
    Math.cos(ang) * r - Math.sin(ang) * u * w,
    Math.sin(ang) * r + Math.cos(ang) * u * w - lock.droop * s * s + 0.04,
    lock.z - lock.back * s + (Math.random() - 0.5) * w * 0.8,
  ];
  const n = normalize([Math.cos(ang) * 0.55, Math.sin(ang) * 0.55, 0.9 - lock.layer * 0.22]);
  // 뿌리는 금빛, 가운데는 오렌지, 끝은 붉은 오렌지
  const tone = s + (Math.random() - 0.5) * 0.3;
  const color = pickColor(tone < 0.28 ? MANE_ROOT : tone < 0.72 ? MANE : MANE_TIP);
  return { p, n, color, flex: Math.max(s, 0.001) };
}

function lionSurface(locks: Lock[]): Sample & { color: string; flex: number } {
  const k = Math.random();
  if (k < 0.52) return manePoint(locks);
  const face = (e: Part, colors: Palette) => ({ ...onPart(e, lionParts), color: pickColor(colors), flex: 0 });
  if (k < 0.71) return face(lionSkull, LION_FACE);
  if (k < 0.76) return face(lionBridge, LION_FACE);
  if (k < 0.86) return face(lionMuzzle, LION_MUZZLE);
  if (k < 0.89) return face(lionChin, LION_MUZZLE);
  if (k < 0.96) return face(lionCheeks[Math.random() < 0.5 ? 0 : 1], LION_FACE);
  return face(lionEars[Math.random() < 0.5 ? 0 : 1], LION_FACE);
}

/** 입자 하나가 곰일 때와 사자일 때의 자리·법선·색, 그리고 크기 등 */
interface Pair {
  a: Sample & { color: string };
  b: Sample & { color: string; flex: number };
  size: number;
}

/**
 * 인스턴스 속성 묶음. WebGL은 정점 속성을 16개까지만 쓸 수 있어 낱개 값은 vec4 두 개에 모았습니다.
 * - miscA: 회전 속도, 크기, 처음 각도, 위상
 * - miscB: 무작위 값, 곰↔사자를 오가는지(1/0), 갈기 끝에 가까운 정도, 전환이 시작되는 순서
 */
function allocate(total: number) {
  return {
    posA: new Float32Array(total * 3),
    posB: new Float32Array(total * 3),
    colA: new Float32Array(total * 3),
    colB: new Float32Array(total * 3),
    nrmA: new Float32Array(total * 3),
    nrmB: new Float32Array(total * 3),
    scatter: new Float32Array(total * 3),
    axis: new Float32Array(total * 3),
    miscA: new Float32Array(total * 4),
    miscB: new Float32Array(total * 4),
  };
}
type Attributes = ReturnType<typeof allocate>;

/** 입자 자리(곰·사자)·색·크기 등을 한 번에 만듭니다. */
function buildAttributes(counts: { shape: number; ambient: number }): Attributes {
  const total = counts.shape + counts.ambient;
  const out = allocate(total);
  const locks = makeLocks();

  // 1) 얼굴 그림(눈·코·입…): 같은 갈래끼리 짝을 짓습니다.
  const pairs: Pair[] = [];
  const featureTotal = Math.round(counts.shape * 0.15);
  for (const { kind, share } of FEATURES) {
    for (let n = Math.round(featureTotal * share); n > 0; n--) {
      pairs.push({
        a: { ...onFront(bearParts, bearFeature(kind)), color: pickColor(FEATURE) },
        b: { ...onFront(lionParts, lionFeature(kind)), color: pickColor(LION_FEATURE), flex: 0 },
        size: 0.0065 + Math.random() * 0.005,
      });
    }
  }

  // 2) 겉면: 둘레의 각도 순서대로 짝을 지어, 가까운 자리끼리 옮겨 가게 합니다.
  //    (아무렇게나 짝지으면 전환할 때 입자들이 서로 가로질러 뿌옇게 뭉개집니다)
  const surfaceTotal = counts.shape - pairs.length;
  const byAngle = <T extends Sample>(list: T[]) => list.sort((p, q) => Math.atan2(p.p[1], p.p[0]) - Math.atan2(q.p[1], q.p[0]));
  const bears = byAngle(Array.from({ length: surfaceTotal }, bearSurface));
  const lions = byAngle(Array.from({ length: surfaceTotal }, () => lionSurface(locks)));
  for (let k = 0; k < surfaceTotal; k++) {
    // 갈기는 굵게, 얼굴은 잘게 찍어 얼굴 굴곡이 뭉개지지 않게 합니다.
    const size = lions[k].flex > 0 ? 0.011 + Math.random() * 0.011 : 0.008 + Math.random() * 0.008;
    pairs.push({ a: bears[k], b: lions[k], size });
  }

  // 순서를 섞어 둡니다. (앞에서부터 일부만 골라도 형상 전체에 고르게 퍼지도록)
  for (let k = pairs.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [pairs[k], pairs[j]] = [pairs[j], pairs[k]];
  }

  let i = 0;
  const common = (size: number, morph: number, flex: number, delay: number) => {
    out.axis.set(randomDirection(), i * 3);
    // 느리게 도는 것과 조금 빠른 것이 섞이고, 방향도 제각각
    const spin = (0.25 + Math.random() * 0.9) * (Math.random() < 0.5 ? -1 : 1);
    out.miscA.set([spin, size, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2], i * 4);
    out.miscB.set([Math.random(), morph, flex, delay], i * 4);
  };

  for (; i < counts.shape; i++) {
    const { a, b, size } = pairs[i];
    out.posA.set(a.p, i * 3);
    out.posB.set(b.p, i * 3);
    out.nrmA.set(a.n, i * 3);
    out.nrmB.set(b.n, i * 3);
    out.colA.set(hexToRgb(a.color), i * 3);
    out.colB.set(hexToRgb(b.color), i * 3);
    // 전환은 위에서 아래로 물결처럼 번집니다. (조금씩 어긋나게)
    const sweep = Math.min(1, Math.max(0, 0.52 - a.p[1] * 0.42));
    common(size, 1, b.flex, sweep * 0.82 + Math.random() * 0.18);
    // 바깥쪽·앞쪽으로 흩어지는 방향
    const dir = Math.atan2(b.p[1], b.p[0]) + (Math.random() - 0.5) * 1.5;
    const far = 0.7 + Math.random() * 1.8;
    out.scatter.set([Math.cos(dir) * far, Math.sin(dir) * far, (Math.random() - 0.25) * 1.8], i * 3);
  }

  // 주변에 떠 있는 작은 입자들
  for (; i < total; i++) {
    // 곰·사자 얼굴 위로는 지나가지 않게 하되, 형상 둘레는 비어 보이지 않게 채웁니다.
    let p: Vec3 = [0, 0, 0];
    if (Math.random() < 0.42) {
      // 형상 둘레를 감싸는 띠: 가까울수록 촘촘하고 멀어질수록 성깁니다.
      const a = Math.random() * Math.PI * 2;
      const r = 1.35 + Math.random() ** 1.7 * 1.7;
      p = [Math.cos(a) * r, Math.sin(a) * r, -1.2 + Math.random() * 1.6];
    } else {
      for (let tries = 0; tries < 20; tries++) {
        p = [(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4.4 - 0.4];
        const seen = 3.4 / (3.4 - p[2]); // 가까울수록 화면에서는 더 바깥에 보입니다.
        // 얼굴 위만 비워 둡니다.
        if (Math.hypot(p[0], p[1]) * seen > 1.1) break;
      }
    }
    out.posA.set(p, i * 3);
    out.posB.set(p, i * 3);
    out.nrmA.set([0, 0, 1], i * 3);
    out.nrmB.set([0, 0, 1], i * 3);
    const c = hexToRgb(pickColor(AMBIENT));
    out.colA.set(c, i * 3);
    out.colB.set(c, i * 3);
    // 대부분 잘고, 가끔 조금 큰 것이 섞여 깊이가 느껴지게
    common(0.006 + Math.random() ** 3 * 0.016, 0, 0, 0);
    out.scatter.set([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, Math.random()], i * 3);
  }

  return out;
}

/**
 * 주변을 떠다니는 큰 입체 도형들.
 * - near: 카메라 바로 앞을 지나가는 아주 큰 것
 * - corner: 첫 화면 왼쪽 아래에 모여 있는 것
 * - ring: 곰·사자 둘레에 가까이 떠 있는 것
 * - mid: 나머지 빈 공간에 흩어진 중간 크기
 * 자리는 화면 비율에 맞춰 나중에 놓습니다. (곰·사자의 얼굴 위는 비워 두기 위해서)
 */
type SolidKind = "near" | "corner" | "ring" | "mid";

function buildSolidAttributes(kinds: SolidKind[]): Attributes {
  const out = allocate(kinds.length);
  // 자리는 화면 비율에 맞춰 나중에 놓으므로, 곰일 때와 사자일 때가 같은 배열을 봅니다.
  out.posB = out.posA;
  out.colB = out.colA;

  kinds.forEach((kind, i) => {
    out.colA.set(hexToRgb(pickColor(AMBIENT)), i * 3);
    const size =
      kind === "near"
        ? 0.03 + Math.random() * 0.03
        : kind === "corner"
          ? 0.018 + Math.random() ** 2 * 0.04
          : kind === "ring"
            ? 0.015 + Math.random() ** 2 * 0.026
            : 0.016 + Math.random() * 0.022;
    out.axis.set(randomDirection(), i * 3);
    out.nrmA.set([0, 0, 1], i * 3);
    out.nrmB.set([0, 0, 1], i * 3);
    // 아주 천천히 구릅니다.
    const spin = (0.12 + Math.random() * 0.3) * (Math.random() < 0.5 ? -1 : 1);
    out.miscA.set([spin, size, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2], i * 4);
    out.miscB.set([Math.random(), 0, 0, 0], i * 4); // 곰↔사자에 끼지 않음
    out.scatter.set([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, Math.random()], i * 3);
  });
  return out;
}

/**
 * 입체 도형이 놓일 화면 위 자리 (u·v는 0~1, z는 카메라 쪽으로 다가온 거리).
 * 곰·사자가 있는 둥근 영역은 피하고, 가까운 큰 도형은 글과 버튼 위도 피합니다.
 */
function pickSpot(
  kind: SolidKind,
  head: { u: number; v: number; ru: number; rv: number; edgeU: number; edgeV: number },
  narrow: boolean,
) {
  for (let tries = 0; tries < 60; tries++) {
    let u: number;
    let v: number;
    let z: number;
    if (kind === "corner") {
      // 첫 화면 왼쪽 아래
      u = 0.01 + Math.random() * (narrow ? 0.7 : 0.5);
      v = narrow ? 0.85 + Math.random() * 0.13 : 0.72 + Math.random() * 0.25;
      z = -0.5 + Math.random() * 1.3;
    } else if (kind === "ring") {
      // 형상의 가장자리 바로 안팎 (갈기 끝의 0.85~1.45배 거리)
      const a = Math.random() * Math.PI * 2;
      const r = 0.85 + Math.random() * 0.6;
      u = head.u + Math.cos(a) * head.edgeU * r;
      v = head.v + Math.sin(a) * head.edgeV * r;
      z = -0.9 + Math.random() * 1.3;
    } else {
      u = -0.04 + Math.random() * 1.08;
      v = -0.04 + Math.random() * 1.08;
      z = kind === "near" ? 1.0 + Math.random() * 0.9 : -1.6 + Math.random() * 2.2;
    }
    // 얼굴 위는 비워 둡니다.
    if (((u - head.u) / head.ru) ** 2 + ((v - head.v) / head.rv) ** 2 < 1) continue;
    // 가까운 큰 도형은 왼쪽의 제목·설명·버튼을 가리지 않게 합니다.
    if (kind === "near" && !narrow && u > 0.05 && u < 0.5 && v > 0.16 && v < 0.76) continue;
    if (kind === "near" && narrow && v > 0.38 && v < 0.8) continue;
    return { u, v, z };
  }
  return { u: 0.03, v: 0.95, z: 0 };
}

/** a에서 b까지 이어지는 네모난 막대 (면마다 법선이 따로 있는 삼각형 12개) */
function bar(a: Vec3, b: Vec3, thickness: number, position: number[], normal: number[]) {
  const d: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(...d);
  const w: Vec3 = [d[0] / len, d[1] / len, d[2] / len];
  // 막대 방향과 수직인 두 축
  const ref: Vec3 = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const cross = (p: Vec3, q: Vec3): Vec3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const unit = (p: Vec3): Vec3 => {
    const l = Math.hypot(...p);
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  const u = unit(cross(w, ref));
  const v = cross(w, u);
  const h = thickness / 2;
  // 모서리가 맞물리도록 양 끝을 막대 두께의 절반만큼 늘립니다.
  const corner = (end: Vec3, su: number, sv: number, sw: number): Vec3 => [
    end[0] + u[0] * h * su + v[0] * h * sv + w[0] * h * sw,
    end[1] + u[1] * h * su + v[1] * h * sv + w[1] * h * sw,
    end[2] + u[2] * h * su + v[2] * h * sv + w[2] * h * sw,
  ];
  const A = (su: number, sv: number) => corner(a, su, sv, -1);
  const B = (su: number, sv: number) => corner(b, su, sv, 1);
  const quad = (p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, n: Vec3) => {
    position.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
    for (let k = 0; k < 6; k++) normal.push(...n);
  };
  const neg = (p: Vec3): Vec3 => [-p[0], -p[1], -p[2]];
  quad(A(1, -1), B(1, -1), B(1, 1), A(1, 1), u);
  quad(A(-1, 1), B(-1, 1), B(-1, -1), A(-1, -1), neg(u));
  quad(A(1, 1), B(1, 1), B(-1, 1), A(-1, 1), v);
  quad(A(-1, -1), B(-1, -1), B(1, -1), A(1, -1), neg(v));
  quad(B(1, -1), B(-1, -1), B(-1, 1), B(1, 1), w);
  quad(A(1, 1), A(-1, 1), A(-1, -1), A(1, -1), neg(w));
}

/** 두께가 있는 삼각형 틀: 네모 막대 3개 */
function solidFrameGeometry() {
  const position: number[] = [];
  const normal: number[] = [];
  const pts: Vec3[] = [0, 1, 2].map((k) => {
    const a = Math.PI / 2 + (k * Math.PI * 2) / 3;
    return [Math.cos(a), Math.sin(a), 0];
  });
  for (let k = 0; k < 3; k++) bar(pts[k], pts[(k + 1) % 3], Math.sqrt(3) * FRAME_THICKNESS, position, normal);
  return { position: new Float32Array(position), normal: new Float32Array(normal) };
}

/** 정사면체 뼈대: 모서리 6개를 네모 막대로 */
function tetraGeometry() {
  const position: number[] = [];
  const normal: number[] = [];
  const k = 1 / Math.sqrt(3);
  const pts: Vec3[] = [
    [k, k, k],
    [k, -k, -k],
    [-k, k, -k],
    [-k, -k, k],
  ];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) bar(pts[i], pts[j], 0.11, position, normal);
  return { position: new Float32Array(position), normal: new Float32Array(normal) };
}

/**
 * 입자 하나의 모양: 속이 빈 정삼각형 틀.
 * 변마다 얇은 막대를 두른 평면 메시이고, 막대 두께는 변 길이의 9%입니다.
 */
const FRAME_THICKNESS = 0.09;

function frameGeometry() {
  const outer: number[][] = [];
  const inner: number[][] = [];
  // 안쪽 삼각형은 내접원 반지름이 막대 두께만큼 줄어든 크기
  const innerScale = 1 - 2 * Math.sqrt(3) * FRAME_THICKNESS;
  for (let k = 0; k < 3; k++) {
    const a = Math.PI / 2 + (k * Math.PI * 2) / 3;
    outer.push([Math.cos(a), Math.sin(a), 0]);
    inner.push([Math.cos(a) * innerScale, Math.sin(a) * innerScale, 0]);
  }
  const index: number[] = [];
  for (let k = 0; k < 3; k++) {
    const n = (k + 1) % 3;
    index.push(k, n, 3 + n, k, 3 + n, 3 + k);
  }
  return { position: new Float32Array([...outer, ...inner].flat()), index };
}

/** 빛무리용 네모 한 장 */
function quadGeometry() {
  return { position: new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), index: [0, 1, 2, 0, 2, 3] };
}

const VERTEX = /* glsl */ `
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aNrmA;     // 곰일 때 표면의 바깥 방향
  attribute vec3 aNrmB;     // 사자일 때 표면의 바깥 방향
  attribute vec3 aColor;
  attribute vec3 aColorB;
  attribute vec3 aScatter;
  attribute vec3 aAxis;     // 입자마다 다른 회전축
  attribute vec4 aMiscA;    // 회전 속도, 크기, 처음 각도, 위상
  attribute vec4 aMiscB;    // 무작위 값, 곰↔사자를 오가는지, 갈기 끝에 가까운 정도, 전환 순서

  uniform float uTime;
  uniform float uMorph;     // 0 = 곰, 1 = 사자
  uniform float uScatter;
  uniform float uSizeBoost;
  uniform float uScale;     // 형상 전체의 배율 (빛무리 크기를 맞출 때)
  uniform float uSolid;     // 1이면 두께가 있는 입체 도형
  uniform float uNear;
  uniform float uFar;

  varying vec3 vColor;
  varying float vAlpha;
  #ifdef HALO
    varying vec2 vUv;
  #endif

  // 축 k를 중심으로 a만큼 돌립니다.
  vec3 turn(vec3 v, vec3 k, float a) {
    float c = cos(a);
    float s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }

  void main() {
    float aSpin = aMiscA.x;
    float aSize = aMiscA.y;
    float aRot = aMiscA.z;
    float aPhase = aMiscA.w;
    float aRand = aMiscB.x;
    float aMorph = aMiscB.y;
    float aFlex = aMiscB.z;
    float aDelay = aMiscB.w;

    // 전환은 위에서 아래로 번집니다: 순서가 빠른 입자부터 움직이고, 각자 전체 시간의 3분의 1만 씁니다.
    // 그래서 중간에는 위쪽은 이미 사자, 아래쪽은 아직 곰인 채로 물결이 지나갑니다.
    const float STAGGER = 2.0;
    float t = clamp(uMorph * (1.0 + STAGGER) - aDelay * STAGGER, 0.0, 1.0);
    float e = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    float mid = sin(3.14159265 * t) * aMorph;

    vec3 p = mix(aPosA, aPosB, e * aMorph);

    // 사자의 갈기는 끝으로 갈수록 크게, 이웃한 털끼리 함께 바람에 일렁입니다.
    float wind = e * aMorph * aFlex * aFlex;
    float gust = dot(aPosB, vec3(1.9, 1.3, 1.1));
    p += wind * vec3(
      0.055 * sin(uTime * 0.9 + gust),
      0.045 * sin(uTime * 0.7 + gust * 1.3 + 1.0),
      0.06 * sin(uTime * 0.8 + gust * 0.8 + 2.0)
    );
    // 숨쉬듯 아주 조금 부풀었다 줄어듭니다.
    p *= 1.0 + aMorph * 0.012 * sin(uTime * 0.85);

    // 무너짐: 소용돌이치며 아래로 쏟아졌다가 다시 올라옵니다.
    // 가까운 입자끼리는 같은 흐름을 타서, 뿌옇게 흩어지지 않고 줄기를 이루며 움직입니다.
    float swirl = mid * (0.2 + aRand * 0.45);
    float cs = cos(swirl);
    float sn = sin(swirl);
    p.xz = vec2(p.x * cs - p.z * sn, p.x * sn + p.z * cs);
    vec3 q = aPosA * 1.9 + uTime * 0.35;
    p += vec3(sin(q.y + q.z * 1.3), sin(q.z + q.x * 1.3), sin(q.x + q.y * 1.3)) * mid * 0.17;
    p.y -= mid * (0.1 + aRand * 0.34);
    p.x += sin(aPhase) * mid * aRand * 0.14;
    p.z += cos(aPhase) * mid * aRand * 0.14;

    // 주변 입자는 넓게, 천천히 떠다닙니다.
    float drift = 1.0 - aMorph;
    p.x += drift * 0.22 * sin(uTime * 0.11 + aPhase * 1.7);
    p.y += drift * 0.18 * cos(uTime * 0.09 + aPhase * 2.3);
    p.z += drift * 0.2 * sin(uTime * 0.07 + aPhase * 3.1);

    // 표면을 따라 미세하게 흐르는 움직임 (형상은 또렷하게 남도록 더 작게)
    float wobble = mix(1.0, 0.5, aMorph);
    p.x += wobble * 0.014 * sin(uTime * 0.55 + aPhase);
    p.y += wobble * 0.014 * cos(uTime * 0.47 + aPhase * 1.31);
    p.z += wobble * 0.02 * sin(uTime * 0.38 + aPhase * 2.17);

    // 스크롤하면 바깥으로 흩어집니다.
    float s = uScatter * uScatter;
    p += aScatter * s * 2.8;

    // 형상의 입자: 표면에 얹힌 채 까딱거리고, 표면이 받는 빛에 따라 밝기가 달라집니다.
    float shade = 1.0;
    vec3 surface = vec3(0.0, 0.0, 1.0);
    if (aMorph > 0.5) {
      surface = normalize(mix(aNrmA, aNrmB, e));
      vec3 nv = normalize(normalMatrix * surface);
      // 왼쪽 위 앞에서 비추는 빛 + 윤곽을 따라 도는 빛. 뒤통수 쪽은 어둡게 가라앉힙니다.
      float lit = 0.5 + 0.5 * dot(nv, normalize(vec3(-0.35, 0.55, 0.75)));
      float front = smoothstep(-0.55, 0.2, nv.z);
      float rim = pow(1.0 - abs(nv.z), 3.0);
      shade = mix(1.0, (0.3 + 0.8 * lit * lit) * mix(0.3, 1.0, front) + 0.35 * rim, 1.0 - mid);
      // 사자는 갈기까지 넓게 퍼져 입자가 성기므로 그만큼 밝게 그립니다.
      shade *= 1.0 + 0.45 * e;
    }

    #ifdef HALO
      // 빛무리: 늘 카메라를 보는 부드러운 원
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      mv.xy += position.xy * aSize * uSizeBoost * uScale * 7.0;
      vUv = position.xy;
      float facing = 0.045;
    #else
      // 삼각형 틀 자체가 3D 공간에서 제 축을 따라 돕니다. 무너지는 동안에는 더 빨리 구릅니다.
      vec3 corner;
      vec3 facingNormal;
      if (aMorph > 0.5) {
        vec3 ref = abs(surface.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
        vec3 t1 = normalize(cross(ref, surface));
        vec3 t2 = cross(surface, t1);
        float c = cos(aRot);
        float d = sin(aRot);
        vec3 flatOn = t1 * (position.x * c - position.y * d) + t2 * (position.x * d + position.y * c);
        float rock = (aRand - 0.5) * 1.5 + 0.5 * sin(uTime * aSpin * 1.4 + aPhase) + mid * 5.0;
        corner = turn(flatOn, aAxis, rock);
        facingNormal = turn(surface, aAxis, rock);
      } else {
        float angle = aRot + uTime * aSpin;
        corner = turn(position, aAxis, angle);
        #ifdef SOLID
          facingNormal = turn(normal, aAxis, angle);
        #else
          facingNormal = turn(vec3(0.0, 0.0, 1.0), aAxis, angle);
        #endif
      }
      vec4 mv = modelViewMatrix * vec4(p + corner * aSize * uSizeBoost, 1.0);

      // 정면을 향한 면은 밝게, 옆으로 누운 면은 어둡게 (최소 0.25)
      vec3 n = normalize(normalMatrix * facingNormal);
      vec3 toEye = normalize(-mv.xyz);
      float facing = max(0.25, abs(dot(n, toEye)));
    #endif
    gl_Position = projectionMatrix * mv;

    // 멀수록 어둡고 투명하게
    float fog = smoothstep(uFar, uNear, -mv.z);
    // 주변 입자는 조금 어둡게, 저마다 다른 박자로 반짝입니다.
    float ambient = mix(0.42 + 0.3 * sin(uTime * 1.3 + aPhase * 5.0), 1.0, aMorph);
    // 입체 도형은 반짝이지 않고, 면의 밝기 차이로 입체감을 냅니다.
    ambient = mix(ambient, 0.42, uSolid);
    vAlpha = mix(0.1, 0.95, fog) * ambient * facing * shade * (1.0 + 0.3 * mid) * (1.0 - smoothstep(0.08, 0.9, uScatter));
    // 옮겨 가는 동안에는 달궈진 듯 밝은 금빛을 띱니다.
    vColor = mix(mix(aColor, aColorB, e), vec3(1.0, 0.84, 0.55), mid * 0.3);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vAlpha;
  #ifdef HALO
    varying vec2 vUv;
  #endif

  void main() {
    float alpha = vAlpha;
    #ifdef HALO
      float glow = max(0.0, 1.0 - length(vUv));
      alpha *= glow * glow;
    #endif
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function ParticleEmblem({
  scatter,
  mobile,
  still,
  className,
}: {
  /** 0이면 모여 있음, 1이면 완전히 흩어져 사라짐 */
  scatter: MotionValue<number>;
  mobile: boolean;
  /** true면 움직임 없이 사자 모습만 그립니다. */
  still: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowBear = useRef<HTMLDivElement>(null);
  const glowLion = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    import("./three-lite")
      .then((THREE) => {
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);

        const FOV = 50;
        const CAMERA_Z = 3.4;
        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 30);
        camera.position.z = CAMERA_Z;

        const counts = mobile ? COUNT.mobile : COUNT.desktop;
        const shared = {
          uTime: { value: 0 },
          uMorph: { value: still ? 1 : 0 },
          uScatter: { value: 0 },
          uSizeBoost: { value: 1 },
          uNear: { value: CAMERA_Z - 1 },
          uFar: { value: CAMERA_Z + 1 },
          uScale: { value: 1 },
        };
        const disposables: { dispose: () => void }[] = [];

        /** 도형 하나를 입자 수만큼 한 번에 그리는 메시 (드로우콜 1번, 입자별 값은 인스턴스 속성으로) */
        const instancedMesh = (
          base: { position: Float32Array; normal?: Float32Array; index?: number[] },
          attrs: Attributes,
          range: [number, number],
          mode: "flat" | "solid" | "halo",
          sizeUniform = shared.uSizeBoost,
        ) => {
          const [from, to] = range;
          const geometry = new THREE.InstancedBufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(base.position, 3));
          if (base.normal) geometry.setAttribute("normal", new THREE.BufferAttribute(base.normal, 3));
          if (base.index) geometry.setIndex(base.index);
          geometry.instanceCount = to - from;
          const instanced = (name: string, array: Float32Array, itemSize: number) =>
            geometry.setAttribute(
              name,
              new THREE.InstancedBufferAttribute(array.subarray(from * itemSize, to * itemSize), itemSize),
            );
          instanced("aPosA", attrs.posA, 3);
          instanced("aPosB", attrs.posB, 3);
          instanced("aColor", attrs.colA, 3);
          instanced("aColorB", attrs.colB, 3);
          instanced("aScatter", attrs.scatter, 3);
          instanced("aAxis", attrs.axis, 3);
          instanced("aNrmA", attrs.nrmA, 3);
          instanced("aNrmB", attrs.nrmB, 3);
          instanced("aMiscA", attrs.miscA, 4);
          instanced("aMiscB", attrs.miscB, 4);

          const material = new THREE.ShaderMaterial({
            uniforms: { ...shared, uSizeBoost: sizeUniform, uSolid: { value: mode === "solid" ? 1 : 0 } },
            defines: mode === "solid" ? { SOLID: 1 } : mode === "halo" ? { HALO: 1 } : {},
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.frustumCulled = false;
          disposables.push(geometry, material);
          return mesh;
        };

        const uniforms = shared;
        const pivot = new THREE.Group();
        // 1) 형상과 주변의 작은 입자: 납작한 삼각형 틀
        const flat = buildAttributes(counts);
        // 형상 입자 일부의 뒤에 깔리는 부드러운 빛무리: 입자가 촘촘한 곳일수록 은은하게 번집니다.
        pivot.add(instancedMesh(quadGeometry(), flat, [0, Math.round(counts.shape * HALO_SHARE)], "halo"));
        pivot.add(instancedMesh(frameGeometry(), flat, [0, counts.shape + counts.ambient], "flat"));
        // 2) 떠다니는 큰 도형: 두께가 있는 삼각형 틀 2/3, 정사면체 뼈대 1/3.
        //    고개를 따라 돌지 않도록 pivot 밖에 두고, 곰·사자가 있는 곳은 비워 둡니다.
        const solidSize = { value: 1 };
        const solidsGroup = new THREE.Group();
        const kindsFor = (share: number): SolidKind[] => [
          ...Array<SolidKind>(Math.round(counts.solidsNear * share)).fill("near"),
          ...Array<SolidKind>(Math.round(counts.solidsCorner * share)).fill("corner"),
          ...Array<SolidKind>(Math.round(counts.solidsRing * share)).fill("ring"),
          ...Array<SolidKind>(Math.round(counts.solidsMid * share)).fill("mid"),
        ];
        const solidSets = [
          { base: solidFrameGeometry(), kinds: kindsFor(2 / 3) },
          { base: tetraGeometry(), kinds: kindsFor(1 / 3) },
        ].map(({ base, kinds }) => {
          const attrs = buildSolidAttributes(kinds);
          const mesh = instancedMesh(base, attrs, [0, kinds.length], "solid", solidSize);
          solidsGroup.add(mesh);
          return { kinds, attrs, mesh, spots: null as null | { u: number; v: number; z: number }[] };
        });

        const scene = new THREE.Scene();
        scene.add(pivot);
        scene.add(solidsGroup);

        let width = 0;
        let height = 0;
        let raf = 0;
        let visible = true;
        const startedAt = performance.now();
        // 마우스가 형태의 중심에서 얼마나 떨어져 있는지 (-1~1), 그리고 마지막으로 움직인 때
        const pointer = { x: 0, y: 0, movedAt: -Infinity };
        const look = { x: 0, y: 0, weight: 0 };
        let center = { x: 0.5, y: 0.5 };

        const layout = () => {
          const rect = canvas.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
          if (!width || !height) return;
          const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
          renderer.setPixelRatio(dpr);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();

          const narrow = width < 768;
          const place = narrow ? PLACE.mobile : PLACE.desktop;
          center = { x: place.cx, y: place.cy };
          const viewH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
          const viewW = viewH * camera.aspect;
          // 전체 지름(갈기 끝까지)을 화면 높이(모바일은 너비)의 size배로 맞춥니다.
          const scale = (place.size * (narrow ? viewW : viewH)) / (2 * EXTENT);
          pivot.scale.setScalar(scale);
          // 형태는 카메라 정면에 두고, 보이는 창만 옮깁니다. (월드에서 옆으로 옮기면 원근 때문에 찌그러집니다)
          camera.setViewOffset(width, height, -(place.cx - 0.5) * width, -(place.cy - 0.5) * height, width, height);
          // 좁은 화면에서는 형태가 작아지는 만큼 입자를 조금 키워 틀이 보이게 합니다.
          uniforms.uSizeBoost.value = narrow ? 1.7 : 1;
          uniforms.uScale.value = scale;
          // 입체 도형: 화면 위 자리를 그 깊이의 월드 좌표로 옮깁니다.
          solidSize.value = scale * (narrow ? 1.5 : 1);
          const headRadius = (place.size * (narrow ? width : height)) / 2;
          const head = {
            u: place.cx,
            v: place.cy,
            // 비워 둘 영역은 얼굴 크기만큼만 (갈기 끝의 0.7배)
            ru: (headRadius * 0.7) / width,
            rv: (headRadius * 0.7) / height,
            edgeU: headRadius / width,
            edgeV: headRadius / height,
          };
          const tan = Math.tan((FOV * Math.PI) / 360);
          solidSets.forEach((set) => {
            if (!set.spots) set.spots = set.kinds.map((kind) => pickSpot(kind, head, narrow));
            set.spots.forEach(({ u, v, z }, k) => {
              const half = (CAMERA_Z - z) * tan;
              set.attrs.posA.set([(u - place.cx) * 2 * half * camera.aspect, -(v - place.cy) * 2 * half, z], k * 3);
            });
            set.mesh.geometry.getAttribute("aPosA").needsUpdate = true;
            set.mesh.geometry.getAttribute("aPosB").needsUpdate = true;
          });
          uniforms.uNear.value = CAMERA_Z - 1.15 * scale;
          uniforms.uFar.value = CAMERA_Z + 1.5 * scale;
        };

        /** 지금 곰(0)과 사자(1) 사이 어디쯤인지 */
        const morphAt = (t: number) => {
          const cycle = TIMING.bear + TIMING.morph + TIMING.lion + TIMING.morph;
          const k = t % cycle;
          if (k < TIMING.bear) return 0;
          if (k < TIMING.bear + TIMING.morph) return (k - TIMING.bear) / TIMING.morph;
          if (k < TIMING.bear + TIMING.morph + TIMING.lion) return 1;
          return 1 - (k - TIMING.bear - TIMING.morph - TIMING.lion) / TIMING.morph;
        };

        const render = (now: number) => {
          const t = (now - startedAt) / 1000;
          uniforms.uTime.value = still ? 0 : t;
          uniforms.uMorph.value = still ? 1 : morphAt(t);
          // 처음에는 흩어진 데서 모여들고, 스크롤하면 다시 흩어집니다.
          const intro = still ? 0 : Math.max(0, 1 - t / 1.8) ** 2 * 0.75;
          uniforms.uScatter.value = Math.min(1, Math.max(intro, scatter.get()));
          // 마우스가 움직이는 동안에는 고개를 돌려 포인터를 쳐다보고,
          // 4초쯤 가만히 있으면 다시 천천히 좌우로 둘러봅니다.
          const watching = now - pointer.movedAt < 4000 ? 1 : 0;
          look.weight += (watching - look.weight) * 0.04;
          look.x += (pointer.x - look.x) * 0.08;
          look.y += (pointer.y - look.y) * 0.08;
          const idleY = still ? -0.3 : Math.sin(t * 0.23) * 0.48 - 0.12;
          const idleX = still ? 0.05 : Math.sin(t * 0.17) * 0.07 + 0.04;
          pivot.rotation.y = idleY * (1 - look.weight) + look.x * 0.58 * look.weight;
          pivot.rotation.x = idleX * (1 - look.weight) + look.y * 0.4 * look.weight;

          // 뒤에서 번지는 빛: 곰일 때는 블루, 사자일 때는 오렌지
          const shown = 1 - Math.min(1, uniforms.uScatter.value * 1.4);
          if (glowBear.current) glowBear.current.style.opacity = String((1 - uniforms.uMorph.value) * shown);
          if (glowLion.current) glowLion.current.style.opacity = String(uniforms.uMorph.value * shown);
          renderer.render(scene, camera);
        };

        const tick = (now: number) => {
          raf = 0;
          if (disposed || !visible) return;
          render(now);
          raf = requestAnimationFrame(tick);
        };
        const start = () => {
          if (still) return render(performance.now());
          if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
        };
        const stop = () => {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        };

        const onResize = () => {
          layout();
          start();
        };
        const onPointerMove = (e: PointerEvent) => {
          if (e.pointerType === "touch") return;
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - center.x;
          const y = (e.clientY - rect.top) / rect.height - center.y;
          // 가까이 있을 때도 고개가 충분히 돌아가도록 조금 과장합니다.
          pointer.x = Math.max(-1, Math.min(1, x * 1.6));
          pointer.y = Math.max(-1, Math.min(1, y * 1.6));
          pointer.movedAt = performance.now();
        };
        const onVisibility = () => (document.hidden ? stop() : start());
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        });

        observer.observe(canvas);
        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", onVisibility);
        if (!still) window.addEventListener("pointermove", onPointerMove, { passive: true });

        layout();
        start();

        cleanup = () => {
          stop();
          observer.disconnect();
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          window.removeEventListener("pointermove", onPointerMove);
          disposables.forEach((d) => d.dispose());
          renderer.dispose();
        };
      })
      .catch(() => {
        // WebGL을 쓸 수 없거나 불러오기에 실패하면 엠블럼 이미지로 대신합니다.
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mobile, still, scatter]);

  if (failed) {
    return (
      <div aria-hidden className={`${className ?? ""} flex items-start justify-center md:items-center md:justify-end`}>
        <img
          src={emblemSrc}
          alt=""
          className="mt-[9svh] h-[26svh] w-auto opacity-90 md:mr-[9vw] md:mt-0 md:h-[52svh]"
        />
      </div>
    );
  }

  // 형태 뒤에서 은은하게 번지는 빛. 색은 지금 보이는 동물을 따라 바뀝니다.
  const glow =
    "absolute left-1/2 top-[21%] h-[115vw] w-[115vw] -translate-x-1/2 -translate-y-1/2 md:left-[73.5%] md:top-[50.5%] md:h-[125svh] md:w-[125svh]";

  return (
    <div aria-hidden className={className}>
      <div
        ref={glowBear}
        className={glow}
        style={{
          opacity: still ? 0 : 1,
          background: "radial-gradient(closest-side, rgba(10,85,156,0.5), rgba(10,85,156,0.16) 50%, transparent)",
        }}
      />
      <div
        ref={glowLion}
        className={glow}
        style={{
          opacity: still ? 1 : 0,
          background: "radial-gradient(closest-side, rgba(255,96,0,0.26), rgba(255,96,0,0.08) 50%, transparent)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
