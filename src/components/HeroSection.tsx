import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDown } from "lucide-react";
import { allProducts, productGroups, type Product } from "../data/products";
import { EASE } from "./layout";
import { useIsMobile } from "./ui/use-mobile";

const likelionUnivLogo = new URL("../assets/logo-likelion-univ.webp", import.meta.url).href;
const startupLogo = new URL("../assets/logo-dku-startup.webp", import.meta.url).href;

const year = productGroups[0]?.year;

/**
 * 흩어진 상태의 카드 자리. 화면 중앙 기준 x(vw)·y(vh), 기울기(deg), 크기 배율, 밝기.
 * 가운데 글자를 가리지 않도록 가장자리에만 둡니다. 프로덕트가 더 많아지면 앞에서부터 다시 씁니다.
 */
type Spot = { x: number; y: number; rotate: number; scale: number; opacity: number };

const SCATTER_DESKTOP: Spot[] = [
  { x: -38, y: -29, rotate: -8, scale: 1.5, opacity: 0.78 },
  { x: -20, y: -36, rotate: 5, scale: 0.9, opacity: 0.63 },
  { x: 21, y: -36, rotate: -4, scale: 1.1, opacity: 0.68 },
  { x: 39, y: -26, rotate: 9, scale: 1.6, opacity: 0.78 },
  { x: -42, y: 3, rotate: 6, scale: 1.15, opacity: 0.68 },
  { x: 42, y: 7, rotate: -7, scale: 1.3, opacity: 0.68 },
  { x: -33, y: 31, rotate: -5, scale: 1.7, opacity: 0.83 },
  { x: 3, y: 39, rotate: 3, scale: 1.1, opacity: 0.68 },
  { x: 33, y: 33, rotate: 7, scale: 1.5, opacity: 0.78 },
];

const SCATTER_MOBILE: Spot[] = [
  { x: -36, y: -39, rotate: -8, scale: 0.9, opacity: 0.73 },
  { x: 4, y: -44, rotate: 4, scale: 0.65, opacity: 0.58 },
  { x: 40, y: -38, rotate: 7, scale: 0.8, opacity: 0.68 },
  { x: -50, y: 16, rotate: 6, scale: 0.6, opacity: 0.53 },
  { x: 52, y: -25, rotate: -6, scale: 0.55, opacity: 0.53 },
  { x: -31, y: 37, rotate: -5, scale: 0.9, opacity: 0.73 },
  { x: 7, y: 43, rotate: 3, scale: 0.7, opacity: 0.58 },
  { x: 39, y: 35, rotate: 8, scale: 0.95, opacity: 0.68 },
  { x: 52, y: 18, rotate: -4, scale: 0.55, opacity: 0.53 },
];

/** 정렬된 상태: 화면 아래쪽 한 줄. 데스크톱은 전부 보이고, 모바일은 양옆으로 이어집니다. */
const ROW = {
  desktop: { step: 11, y: 36 },
  mobile: { step: 32, y: 37 },
};

/** 정렬된 뒤 카드 밝기. 글자보다 앞서지 않도록 살짝 낮춥니다. */
const ROW_OPACITY = 0.7;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function FloatingCard({
  product,
  index,
  total,
  progress,
  mobile,
}: {
  product: Product;
  index: number;
  total: number;
  progress: MotionValue<number>;
  mobile: boolean;
}) {
  const spots = mobile ? SCATTER_MOBILE : SCATTER_DESKTOP;
  const from = spots[index % spots.length];
  const row = mobile ? ROW.mobile : ROW.desktop;
  const fromCenter = index - (total - 1) / 2;
  const toX = fromCenter * row.step;

  // 바깥쪽 카드가 조금 늦게 출발해 줄이 가운데부터 채워집니다.
  const range = [0.03 * Math.abs(fromCenter), 0.82];

  const x = useTransform(progress, range, [`${from.x}vw`, `${toX}vw`], { ease: easeInOut });
  const y = useTransform(progress, range, [`${from.y}vh`, `${row.y}vh`], { ease: easeInOut });
  const rotate = useTransform(progress, range, [from.rotate, 0], { ease: easeInOut });
  const scale = useTransform(progress, range, [from.scale, 1], { ease: easeInOut });
  const opacity = useTransform(progress, range, [from.opacity, ROW_OPACITY]);
  const float = useTransform(progress, [0, 0.7], [1, 0]);

  return (
    <motion.li
      className="absolute left-1/2 top-1/2 -ml-[15vw] -mt-[9.375vw] w-[30vw] md:-ml-[5.1vw] md:-mt-[3.1875vw] md:w-[10.2vw]"
      style={{ x, y, rotate, scale, opacity, zIndex: Math.round(from.scale * 10) }}
    >
      <motion.div
        className="hero-float aspect-[16/10] overflow-hidden rounded-md bg-[#161616] ring-1 ring-white/10 md:rounded-lg"
        style={{ "--float": float, animationDelay: `${-index * 0.9}s` } as Record<string, unknown>}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3 + index * 0.06, ease: EASE }}
      >
        <img
          src={product.image}
          alt={`${product.name} 화면`}
          className="h-full w-full object-cover"
          style={{ objectPosition: product.imagePosition ?? "center" }}
        />
      </motion.div>
    </motion.li>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 움직임을 줄이는 설정에서는 처음부터 정렬된 모습으로 고정합니다.
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  const captionOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);
  const captionEvents = useTransform(captionOpacity, (v) => (v > 0.5 ? "auto" : "none"));
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  // 배경: 설계도 같은 격자는 정렬되면서 사라지고, 사자(오렌지)와 곰(블루)의 빛은 줄 아래로 모입니다.
  const gridOpacity = useTransform(progress, [0, 0.6], [1, 0]);
  const lionX = useTransform(progress, [0, 0.82], ["-32vw", "-14vw"], { ease: easeInOut });
  const lionY = useTransform(progress, [0, 0.82], ["-34vh", "40vh"], { ease: easeInOut });
  const bearX = useTransform(progress, [0, 0.82], ["34vw", "14vw"], { ease: easeInOut });
  const bearY = useTransform(progress, [0, 0.82], ["24vh", "40vh"], { ease: easeInOut });

  return (
    <section id="top" ref={ref} className={`relative bg-[#0B0B0B] ${reduce ? "" : "h-[190svh]"}`}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: gridOpacity,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, black, transparent)",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -ml-[45vmax] -mt-[45vmax] h-[90vmax] w-[90vmax]"
            style={{
              x: lionX,
              y: lionY,
              background: "radial-gradient(closest-side, rgba(255,96,0,0.2), rgba(255,96,0,0.06) 55%, transparent)",
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -ml-[45vmax] -mt-[45vmax] h-[90vmax] w-[90vmax]"
            style={{
              x: bearX,
              y: bearY,
              background: "radial-gradient(closest-side, rgba(10,85,156,0.5), rgba(10,85,156,0.14) 55%, transparent)",
            }}
          />
        </div>

        {/* 흩어져 있다가 스크롤하면 한 줄로 정렬되는 프로덕트 화면 */}
        <ul className="pointer-events-none absolute inset-0" aria-label={`${year}년에 만든 서비스 화면`}>
          {allProducts.map((p, i) => (
            <FloatingCard
              key={`${p.id}-${mobile ? "m" : "d"}`}
              product={p}
              index={i}
              total={allProducts.length}
              progress={progress}
              mobile={mobile}
            />
          ))}
        </ul>

        <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-[27svh] pt-20 text-center">
          <motion.p
            className="font-display text-xs font-semibold tracking-[0.24em] text-[#FF6000] md:text-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            LIKELION{" "}
            <span aria-hidden className="text-white/30">
              ·
            </span>{" "}
            <span className="text-bear-light">DANKOOK UNIV.</span>
          </motion.p>

          <motion.h1
            className="mt-6 text-[2.35rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-6xl md:text-[clamp(3.25rem,9.5svh,4.5rem)] lg:text-[clamp(3.5rem,10.5svh,5.5rem)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            아이디어를
            <br />
            서비스로 만드는 곳
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:mt-7 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            기획 · 디자인 · 프론트엔드 · 백엔드가 한 팀이 되어
            <br className="hidden sm:block" /> 문제를 찾고, 직접 만들어 세상에 내놓습니다.
          </motion.p>

          <motion.div
            className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row md:mt-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          >
            <a
              href="#about"
              className="w-full rounded-xl bg-[#FF6000] px-7 py-3.5 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#ff7420] active:scale-[0.98] sm:w-auto"
            >
              우리를 소개합니다
            </a>
            <a
              href="#projects"
              className="w-full rounded-xl bg-[#0B0B0B]/70 px-7 py-3.5 text-base font-semibold text-white ring-1 ring-inset ring-white/20 transition-[background-color,transform] duration-200 hover:bg-[#1c1c1c] active:scale-[0.98] sm:w-auto"
            >
              만든 것들 보기
            </a>
          </motion.div>

          <motion.div
            className="mt-7 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <img
              src={likelionUnivLogo}
              alt="멋쟁이사자처럼 대학"
              width={395}
              height={72}
              className="h-[18px] w-auto opacity-75 md:h-5"
            />
            <span className="h-3.5 w-px bg-white/20" />
            <img
              src={startupLogo}
              alt="단국대학교 창업지원단"
              width={368}
              height={72}
              className="h-[18px] w-auto opacity-75 md:h-5"
            />
          </motion.div>
        </div>

        {/* 처음엔 스크롤 안내, 정렬이 끝나면 프로젝트로 가는 링크 */}
        <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl items-center justify-center px-5 text-sm sm:px-8">
          {!reduce && (
            <motion.span aria-hidden className="hero-hint absolute text-white/50" style={{ opacity: hintOpacity }}>
              <ArrowDown className="h-5 w-5" />
            </motion.span>
          )}
          <motion.a
            href="#projects"
            className="inline-flex items-center gap-1 font-medium text-white/70 transition-colors hover:text-[#FF6000]"
            style={{ opacity: captionOpacity, pointerEvents: captionEvents }}
          >
            전체 보기 <ArrowDown className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
