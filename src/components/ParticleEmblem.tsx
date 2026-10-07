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
  desktop: { shape: 9000, ambient: 1900, solidsNear: 12, solidsCorner: 18, solidsRing: 30, solidsMid: 54 },
  mobile: { shape: 3000, ambient: 560, solidsNear: 4, solidsCorner: 7, solidsRing: 10, solidsMid: 17 },
};

/** 화면 안에서의 자리와 크기. cx·cy는 화면 비율, size는 화면 높이(모바일은 너비) 대비 전체 지름 */
const PLACE = {
  desktop: { cx: 0.735, cy: 0.505, size: 0.97 },
  mobile: { cx: 0.5, cy: 0.21, size: 0.84 },
};

/** 한 번 오가는 시간(초): 곰 유지 → 무너지며 사자로 → 사자 유지 → 다시 곰으로 */
const TIMING = { bear: 4.2, morph: 2.6, lion: 6.4 };

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

interface Ball {
  c: Vec3;
  r: number;
  /** 앞뒤로 납작한 정도 */
  flat?: number;
}

const inside = (p: Vec3, b: Ball, shrink = 0.96) => {
  const dx = p[0] - b.c[0];
  const dy = p[1] - b.c[1];
  const dz = (p[2] - b.c[2]) / (b.flat ?? 1);
  return dx * dx + dy * dy + dz * dz < (b.r * shrink) ** 2;
};

/** 공 표면의 점. 다른 공 안에 묻히는 점은 버립니다. */
function onBall(ball: Ball, others: Ball[], jitter = 0.02): Vec3 {
  for (let tries = 0; tries < 30; tries++) {
    const d = randomDirection();
    const r = ball.r * (1 + (Math.random() - 0.5) * jitter * 2);
    const p: Vec3 = [ball.c[0] + d[0] * r, ball.c[1] + d[1] * r, ball.c[2] + d[2] * r * (ball.flat ?? 1)];
    if (!others.some((o) => inside(p, o))) return p;
  }
  return [ball.c[0], ball.c[1] + ball.r, ball.c[2]];
}

/** 눈·코처럼 작게 뭉친 점 */
function inBlob(c: Vec3, rx: number, ry: number): Vec3 {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random());
  return [c[0] + Math.cos(a) * r * rx, c[1] + Math.sin(a) * r * ry, c[2] + (Math.random() - 0.5) * 0.03];
}

/* ───────── 곰 ───────── */
const bearHead: Ball = { c: [0, -0.05, 0], r: 1, flat: 0.92 };
const bearEars: Ball[] = [
  { c: [-0.74, 0.74, -0.05], r: 0.37 },
  { c: [0.74, 0.74, -0.05], r: 0.37 },
];
const bearMuzzle: Ball = { c: [0, -0.34, 0.74], r: 0.4 };

function bearPoint(): { p: Vec3; feature: boolean } {
  const k = Math.random();
  if (k < 0.6) return { p: onBall(bearHead, [...bearEars, bearMuzzle]), feature: false };
  if (k < 0.77) {
    const ear = bearEars[Math.random() < 0.5 ? 0 : 1];
    return { p: onBall(ear, [bearHead]), feature: false };
  }
  if (k < 0.945) return { p: onBall(bearMuzzle, [bearHead]), feature: false };
  if (k < 0.978) return { p: inBlob([Math.random() < 0.5 ? -0.37 : 0.37, 0.16, 0.86], 0.075, 0.085), feature: true };
  return { p: inBlob([0, -0.2, 1.14], 0.13, 0.085), feature: true };
}

/* ───────── 사자 ───────── */
const lionHead: Ball = { c: [0, -0.06, 0.18], r: 0.8, flat: 0.95 };
const lionEars: Ball[] = [
  { c: [-0.6, 0.62, 0.2], r: 0.23 },
  { c: [0.6, 0.62, 0.2], r: 0.23 },
];
const lionMuzzle: Ball = { c: [0, -0.36, 0.84], r: 0.35 };

/** 갈기: 얼굴 둘레로 뾰족뾰족하게 뻗은 털 */
function manePoint(): Vec3 {
  for (let tries = 0; tries < 30; tries++) {
    const d = randomDirection();
    if (d[2] > 0.5) continue; // 얼굴 앞은 비워 둡니다.
    const a = Math.atan2(d[1], d[0]);
    const tuft = Math.pow(Math.abs(Math.sin(a * 6.5 + d[2] * 2.2)), 0.7);
    // 아래쪽(턱)은 더 길게
    const beard = Math.max(0, -Math.sin(a)) ** 3 * 0.22;
    const r = 1.0 + tuft * 0.32 + beard + Math.random() * 0.1;
    return [d[0] * r, d[1] * r - 0.05, d[2] * r * 0.7 + 0.12];
  }
  return [0, 1.3, 0];
}

function lionPoint(): { p: Vec3; kind: "mane" | "face" | "feature" } {
  const k = Math.random();
  if (k < 0.6) return { p: manePoint(), kind: "mane" };
  if (k < 0.79) return { p: onBall(lionHead, [...lionEars, lionMuzzle]), kind: "face" };
  if (k < 0.84) {
    const ear = lionEars[Math.random() < 0.5 ? 0 : 1];
    return { p: onBall(ear, [lionHead]), kind: "face" };
  }
  if (k < 0.945) return { p: onBall(lionMuzzle, [lionHead]), kind: "face" };
  if (k < 0.978) return { p: inBlob([Math.random() < 0.5 ? -0.31 : 0.31, 0.14, 0.94], 0.065, 0.07), kind: "feature" };
  return { p: inBlob([0, -0.22, 1.19], 0.14, 0.08), kind: "feature" };
}

/** 입자 자리(곰·사자)·색·크기 등을 한 번에 만듭니다. */
function buildAttributes(counts: { shape: number; ambient: number }) {
  const total = counts.shape + counts.ambient;
  const posA = new Float32Array(total * 3);
  const posB = new Float32Array(total * 3);
  const colA = new Float32Array(total * 3);
  const colB = new Float32Array(total * 3);
  const scatter = new Float32Array(total * 3);
  const size = new Float32Array(total);
  const rot = new Float32Array(total);
  const phase = new Float32Array(total);
  const rand = new Float32Array(total);
  const morph = new Float32Array(total); // 1이면 곰↔사자 사이를 오가는 입자
  const axis = new Float32Array(total * 3);
  const spin = new Float32Array(total);

  let i = 0;
  const common = () => {
    rot[i] = Math.random() * Math.PI * 2;
    phase[i] = Math.random() * Math.PI * 2;
    rand[i] = Math.random();
    axis.set(randomDirection(), i * 3);
    // 느리게 도는 것과 조금 빠른 것이 섞이고, 방향도 제각각
    spin[i] = (0.25 + Math.random() * 0.9) * (Math.random() < 0.5 ? -1 : 1);
  };

  for (; i < counts.shape; i++) {
    const bear = bearPoint();
    const lion = lionPoint();
    posA.set(bear.p, i * 3);
    posB.set(lion.p, i * 3);
    colA.set(hexToRgb(pickColor(bear.feature ? FEATURE : BEAR)), i * 3);
    colB.set(hexToRgb(pickColor(lion.kind === "mane" ? MANE : lion.kind === "face" ? LION_FACE : FEATURE)), i * 3);
    size[i] = 0.011 + Math.random() * 0.011;
    morph[i] = 1;
    common();
    // 바깥쪽·앞쪽으로 흩어지는 방향
    const dir = Math.atan2(lion.p[1], lion.p[0]) + (Math.random() - 0.5) * 1.5;
    const far = 0.7 + Math.random() * 1.8;
    scatter.set([Math.cos(dir) * far, Math.sin(dir) * far, (Math.random() - 0.25) * 1.8], i * 3);
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
    posA.set(p, i * 3);
    posB.set(p, i * 3);
    const c = hexToRgb(pickColor(AMBIENT));
    colA.set(c, i * 3);
    colB.set(c, i * 3);
    // 대부분 잘고, 가끔 조금 큰 것이 섞여 깊이가 느껴지게
    size[i] = 0.006 + Math.random() ** 3 * 0.016;
    common();
    scatter.set([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, Math.random()], i * 3);
  }

  return { posA, posB, colA, colB, scatter, size, rot, phase, rand, morph, axis, spin };
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

function buildSolidAttributes(kinds: SolidKind[]) {
  const total = kinds.length;
  const pos = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  const scatter = new Float32Array(total * 3);
  const axis = new Float32Array(total * 3);
  const spin = new Float32Array(total);
  const size = new Float32Array(total);
  const rot = new Float32Array(total);
  const phase = new Float32Array(total);
  const rand = new Float32Array(total);
  const morph = new Float32Array(total); // 0: 곰↔사자에 끼지 않음

  kinds.forEach((kind, i) => {
    col.set(hexToRgb(pickColor(AMBIENT)), i * 3);
    size[i] =
      kind === "near"
        ? 0.03 + Math.random() * 0.03
        : kind === "corner"
          ? 0.018 + Math.random() ** 2 * 0.04
          : kind === "ring"
            ? 0.015 + Math.random() ** 2 * 0.026
            : 0.016 + Math.random() * 0.022;
    axis.set(randomDirection(), i * 3);
    // 아주 천천히 구릅니다.
    spin[i] = (0.12 + Math.random() * 0.3) * (Math.random() < 0.5 ? -1 : 1);
    rot[i] = Math.random() * Math.PI * 2;
    phase[i] = Math.random() * Math.PI * 2;
    rand[i] = Math.random();
    scatter.set([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, Math.random()], i * 3);
  });
  return { posA: pos, posB: pos, colA: col, colB: col, scatter, size, rot, phase, rand, morph, axis, spin };
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

const VERTEX = /* glsl */ `
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aColor;
  attribute vec3 aColorB;
  attribute vec3 aScatter;
  attribute vec3 aAxis;     // 입자마다 다른 회전축
  attribute float aSpin;    // 회전 속도
  attribute float aSize;
  attribute float aRot;
  attribute float aPhase;
  attribute float aRand;
  attribute float aMorph;

  uniform float uTime;
  uniform float uMorph;     // 0 = 곰, 1 = 사자
  uniform float uScatter;
  uniform float uSizeBoost;
  uniform float uSolid;     // 1이면 두께가 있는 입체 도형
  uniform float uNear;
  uniform float uFar;

  varying vec3 vColor;
  varying float vAlpha;

  // 축 k를 중심으로 a만큼 돌립니다.
  vec3 turn(vec3 v, vec3 k, float a) {
    float c = cos(a);
    float s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }

  void main() {
    // 입자마다 조금씩 다른 때에 움직이기 시작합니다.
    float t = clamp((uMorph - aRand * 0.32) / 0.68, 0.0, 1.0);
    float e = t * t * (3.0 - 2.0 * t);
    float mid = sin(3.14159265 * t) * aMorph;

    vec3 p = mix(aPosA, aPosB, e * aMorph);

    // 무너짐: 아래로 쏟아지며 옆으로 퍼졌다가 다시 올라옵니다.
    p.y -= mid * (0.35 + aRand * 0.95);
    p.x += sin(aPhase) * mid * (0.12 + aRand * 0.5);
    p.z += cos(aPhase) * mid * (0.12 + aRand * 0.4);

    // 주변 입자는 넓게, 천천히 떠다닙니다.
    float drift = 1.0 - aMorph;
    p.x += drift * 0.22 * sin(uTime * 0.11 + aPhase * 1.7);
    p.y += drift * 0.18 * cos(uTime * 0.09 + aPhase * 2.3);
    p.z += drift * 0.2 * sin(uTime * 0.07 + aPhase * 3.1);

    // 표면을 따라 미세하게 흐르는 움직임
    p.x += 0.014 * sin(uTime * 0.55 + aPhase);
    p.y += 0.014 * cos(uTime * 0.47 + aPhase * 1.31);
    p.z += 0.02 * sin(uTime * 0.38 + aPhase * 2.17);

    // 스크롤하면 바깥으로 흩어집니다.
    float s = uScatter * uScatter;
    p += aScatter * s * 2.8;

    // 삼각형 틀 자체가 3D 공간에서 제 축을 따라 돕니다. 무너지는 동안에는 더 빨리 구릅니다.
    float angle = aRot + uTime * aSpin + mid * 5.0;
    vec3 corner = turn(position, aAxis, angle) * aSize * uSizeBoost;
    #ifdef SOLID
      vec3 facingNormal = turn(normal, aAxis, angle);
    #else
      vec3 facingNormal = turn(vec3(0.0, 0.0, 1.0), aAxis, angle);
    #endif

    vec4 mv = modelViewMatrix * vec4(p + corner, 1.0);
    gl_Position = projectionMatrix * mv;

    // 정면을 향한 면은 밝게, 옆으로 누운 면은 어둡게 (최소 0.25)
    vec3 n = normalize(normalMatrix * facingNormal);
    vec3 toEye = normalize(-mv.xyz);
    float facing = max(0.25, abs(dot(n, toEye)));

    // 멀수록 어둡고 투명하게
    float fog = smoothstep(uFar, uNear, -mv.z);
    // 주변 입자는 조금 어둡게, 저마다 다른 박자로 반짝입니다.
    float ambient = mix(0.42 + 0.3 * sin(uTime * 1.3 + aPhase * 5.0), 1.0, aMorph);
    // 입체 도형은 반짝이지 않고, 면의 밝기 차이로 입체감을 냅니다.
    ambient = mix(ambient, 0.42, uSolid);
    vAlpha = mix(0.1, 0.95, fog) * ambient * facing * (1.0 - smoothstep(0.08, 0.9, uScatter));
    vColor = mix(aColor, aColorB, e);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, vAlpha);
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
        };
        const disposables: { dispose: () => void }[] = [];

        /** 도형 하나를 입자 수만큼 한 번에 그리는 메시 (드로우콜 1번, 입자별 값은 인스턴스 속성으로) */
        const instancedMesh = (
          base: { position: Float32Array; normal?: Float32Array; index?: number[] },
          attrs: ReturnType<typeof buildAttributes>,
          range: [number, number],
          solid: boolean,
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
          instanced("aSpin", attrs.spin, 1);
          instanced("aSize", attrs.size, 1);
          instanced("aRot", attrs.rot, 1);
          instanced("aPhase", attrs.phase, 1);
          instanced("aRand", attrs.rand, 1);
          instanced("aMorph", attrs.morph, 1);

          const material = new THREE.ShaderMaterial({
            uniforms: { ...shared, uSizeBoost: sizeUniform, uSolid: { value: solid ? 1 : 0 } },
            defines: solid ? { SOLID: 1 } : {},
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
        pivot.add(instancedMesh(frameGeometry(), flat, [0, flat.size.length], false));
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
          const mesh = instancedMesh(base, attrs, [0, kinds.length], true, solidSize);
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
