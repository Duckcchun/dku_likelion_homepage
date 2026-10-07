import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { allProducts, productGroups } from "../data/products";
import { EASE } from "./layout";

const likelionUnivLogo = new URL("../assets/logo-likelion-univ.webp", import.meta.url).href;
const startupLogo = new URL("../assets/logo-dku-startup.webp", import.meta.url).href;

const year = productGroups[0]?.year;

/** 첫 화면 하단: 올해 만든 프로덕트 화면이 천천히 흐르는 띠 (미리보기) */
function ProductStrip() {
  const reduce = useReducedMotion();
  const items = [...allProducts, ...allProducts]; // 끊김 없는 루프

  return (
    <div className="relative z-10 pb-10">
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-5 text-sm sm:px-8">
        <span className="text-white/50">
          {year} 우리가 만든 서비스 {allProducts.length}개
        </span>
        <a
          href="#projects"
          className="inline-flex items-center gap-1 font-medium text-white/70 transition-colors hover:text-[#FF6000]"
        >
          전체 보기 <ArrowDown className="h-4 w-4" />
        </a>
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <motion.ul
          className="flex w-max gap-3 md:gap-4"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {items.map((p, i) => (
            <li
              key={`${p.id}-${i}`}
              aria-hidden={i >= allProducts.length}
              className="h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-[#161616] ring-1 ring-white/[0.08] md:h-32 md:w-56"
            >
              <img
                src={p.image}
                alt={i < allProducts.length ? `${p.name} 화면` : ""}
                className="h-full w-full object-cover opacity-70"
                style={{ objectPosition: p.imagePosition ?? "center" }}
              />
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0B0B0B]">
      {/* 배경 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6000]/[0.12] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pb-12 pt-32 text-center">
        <motion.p
          className="text-xs font-semibold tracking-[0.24em] text-[#FF6000] md:text-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          LIKELION <span aria-hidden className="text-white/30">·</span>{" "}
          <span className="text-bear-light">DANKOOK UNIV.</span>
        </motion.p>
        <motion.h1
          className="mt-6 text-[2.35rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        >
          아이디어를
          <br />
          서비스로 만드는 곳
        </motion.h1>
        <motion.p
          className="mt-7 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          기획 · 디자인 · 프론트엔드 · 백엔드가 한 팀이 되어
          <br className="hidden sm:block" /> 문제를 찾고, 직접 만들어 세상에 내놓습니다.
        </motion.p>
        <motion.div
          className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
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
            className="w-full rounded-xl px-7 py-3.5 text-base font-semibold text-white ring-1 ring-inset ring-white/20 transition-[background-color,transform] duration-200 hover:bg-white/5 active:scale-[0.98] sm:w-auto"
          >
            만든 것들 보기
          </a>
        </motion.div>
        <motion.div
          className="mt-10 flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <img src={likelionUnivLogo} alt="멋쟁이사자처럼 대학" width={395} height={72} className="h-6 w-auto opacity-75 md:h-7" />
          <span className="h-4 w-px bg-white/20" />
          <img src={startupLogo} alt="단국대학교 창업지원단" width={368} height={72} className="h-6 w-auto opacity-75 md:h-7" />
        </motion.div>
      </div>

      <ProductStrip />
    </section>
  );
}
