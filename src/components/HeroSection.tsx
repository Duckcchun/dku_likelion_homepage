import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { productGroups } from "../data/products";

const likelionUnivLogo = new URL(
  "../assets/logo-likelion-univ.png",
  import.meta.url,
).href;

const startupLogo = new URL(
  "../assets/logo-dku-startup.png",
  import.meta.url,
).href;

const latest = productGroups[0];

/** 첫 화면 하단에서 올해 프로덕트 화면이 천천히 흘러가는 띠 (Spline 3D 대체) */
function ProductStrip() {
  const reduce = useReducedMotion();
  // 끊김 없는 루프를 위해 두 번 이어 붙임
  const items = [...latest.products, ...latest.products];

  return (
    <a
      href="#projects"
      aria-label={`${latest.year} ${latest.event} 프로젝트 보러 가기`}
      className="group absolute inset-x-0 bottom-0 z-30 block pb-8"
    >
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4 text-sm sm:px-6 lg:px-8">
        <span className="text-white/50">
          {latest.year} {latest.event} 프로젝트 {latest.products.length}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-white/70 transition-colors group-hover:text-[#FF6000]">
          보러 가기 <ArrowDown className="h-4 w-4" />
        </span>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          className="flex w-max gap-4"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {items.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="h-28 w-48 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 md:h-36 md:w-64"
              aria-hidden={i >= latest.products.length}
            >
              <img
                src={p.image}
                alt=""
                className="h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-90"
                style={{ objectPosition: p.imagePosition ?? "center" }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </a>
  );
}

export function HeroSection() {
  const showRecruitClosedAlert = () => {
    window.alert("모집 기간이 아닙니다.");
  };

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* 배경: 은은한 그리드 + 상단 주황 빛 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 50% 35%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, black 20%, transparent 70%)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6000]/10 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-20 mx-auto max-w-5xl px-4 pb-56 pt-32 text-center md:pb-64"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold tracking-[0.2em] text-[#FF6000]">
            LIKELION · DANKOOK UNIV.
          </p>
          <h1 className="mt-6 text-5xl font-bold leading-[1.1] text-white md:text-7xl lg:text-8xl">
            아이디어를
            <br />
            서비스로 만드는 곳
          </h1>
        </motion.div>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          기획 · 디자인 · 프론트엔드 · 백엔드가 한 팀이 되어
          <br className="hidden md:block" /> 문제를 찾고, 직접 만들어 세상에 내놓습니다.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#projects"
            className="rounded-xl bg-[#FF6000] px-8 py-4 text-lg font-bold text-white transition-[background-color,transform] duration-200 hover:bg-[#ff7420] active:scale-[0.97]"
          >
            프로젝트 보기
          </a>
          <a
            href="https://dku-lion.vercel.app/"
            onClick={(e) => {
              e.preventDefault();
              showRecruitClosedAlert();
            }}
            className="rounded-xl px-8 py-4 text-lg font-bold text-white ring-1 ring-white/20 transition-[background-color,transform] duration-200 hover:bg-white/5 active:scale-[0.97]"
          >
            지원하기
          </a>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center justify-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <img src={likelionUnivLogo} alt="멋쟁이사자처럼 대학" className="h-7 w-auto opacity-80 md:h-8" />
          <span className="h-4 w-px bg-white/20" />
          <img src={startupLogo} alt="단국대학교 창업지원단" className="h-7 w-auto opacity-80 md:h-8" />
        </motion.div>
      </motion.div>

      <ProductStrip />
    </section>
  );
}
