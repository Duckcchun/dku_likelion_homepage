import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDown } from "lucide-react";
import { allProducts, productGroups, type Product } from "../data/products";
import { EASE } from "./layout";
import { ParticleEmblem } from "./ParticleEmblem";
import { useIsMobile } from "./ui/use-mobile";

const likelionUnivLogo = new URL("../assets/logo-likelion-univ.webp", import.meta.url).href;
const startupLogo = new URL("../assets/logo-dku-startup.webp", import.meta.url).href;

const year = productGroups[0]?.year;

/** 프로덕트 줄: 화면 아래쪽 한 줄. 데스크톱은 전부 보이고, 모바일은 양옆으로 이어집니다. (x 간격 vw, 높이 vh) */
const ROW = {
  desktop: { step: 11, y: 36 },
  mobile: { step: 32, y: 37 },
};

/** 줄에 놓인 카드 밝기. 글자보다 앞서지 않도록 살짝 낮춥니다. */
const ROW_OPACITY = 0.7;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 파티클이 흩어진 자리에 떠오르는 프로덕트 화면 한 장 */
function RowCard({
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
  const row = mobile ? ROW.mobile : ROW.desktop;
  const fromCenter = index - (total - 1) / 2;

  // 가운데 카드부터 바깥쪽으로 차례로 나타납니다.
  const start = 0.42 + 0.025 * Math.abs(fromCenter);
  const range = [start, start + 0.26];

  const opacity = useTransform(progress, range, [0, ROW_OPACITY]);
  const lift = useTransform(progress, range, [36, 0], { ease: easeInOut });
  const y = useTransform(lift, (v) => `calc(${row.y}vh + ${v}px)`);

  return (
    <motion.li
      className="absolute left-1/2 top-1/2 -ml-[15vw] -mt-[9.375vw] w-[30vw] md:-ml-[5.1vw] md:-mt-[3.1875vw] md:w-[10.2vw]"
      style={{ x: `${fromCenter * row.step}vw`, y, opacity }}
    >
      <div className="aspect-[16/10] overflow-hidden rounded-md bg-[#161616] ring-1 ring-white/10 md:rounded-lg">
        <img
          src={product.image}
          alt={`${product.name} 화면`}
          className="h-full w-full object-cover"
          style={{ objectPosition: product.imagePosition ?? "center" }}
        />
      </div>
    </motion.li>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const mobile = useIsMobile();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // 움직임을 줄이는 설정에서는 스크롤 연출 없이 엠블럼과 프로덕트 줄을 함께 보여 줍니다.
  const progress = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));
  // 파티클 엠블럼이 흩어지는 정도 (0 = 모여 있음, 1 = 사라짐)
  const scatter = useTransform(scrollYProgress, (v) => (reduce ? 0 : Math.min(1, Math.max(0, (v - 0.02) / 0.5))));

  const captionOpacity = useTransform(progress, [0.75, 0.92], [0, 1]);
  const captionEvents = useTransform(captionOpacity, (v) => (v > 0.5 ? "auto" : "none"));
  const hintOpacity = useTransform(progress, [0, 0.12], [1, 0]);

  return (
    <section id="top" ref={ref} className={`relative bg-black ${reduce ? "" : "h-[200svh]"}`}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* 곰이 무너졌다가 사자로 다시 모이는 입체 파티클. 배경은 순수 검정으로 비워 두고 입자의 빛만 씁니다. */}
        <ParticleEmblem
          scatter={scatter}
          mobile={mobile}
          still={reduce}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* 파티클이 흩어진 자리에 나타나는 프로덕트 화면 */}
        <ul className="pointer-events-none absolute inset-0" aria-label={`${year}년에 만든 서비스 화면`}>
          {allProducts.map((p, i) => (
            <RowCard
              key={`${p.id}-${mobile ? "m" : "d"}`}
              product={p}
              index={i}
              total={allProducts.length}
              progress={progress}
              mobile={mobile}
            />
          ))}
        </ul>

        <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-5 pb-[27svh] pt-[41svh] sm:px-8 md:justify-center md:pb-[17svh] md:pt-24">
          <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
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
              className="mt-5 text-[2.5rem] font-medium leading-[1.06] tracking-[-0.045em] text-white sm:text-5xl md:mt-7 md:text-[clamp(3rem,min(5.7vw,11.5svh),6.25rem)]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            >
              아이디어를
              <br />
              서비스로 만드는 곳
            </motion.h1>

            <motion.p
              className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/75 md:mt-8 md:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              기획 · 디자인 · 프론트엔드 · 백엔드가 한 팀이 되어 문제를 찾고, 직접 만들어 세상에 내놓습니다.
            </motion.p>

            <motion.div
              className="mt-7 flex w-full gap-3 sm:w-auto md:mt-9"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            >
              <a
                href="#about"
                className="press flex-1 rounded-full bg-[#FF6000] px-4 py-3.5 text-center text-[15px] font-semibold text-white hover:bg-[#ff7420] sm:flex-none sm:px-7"
              >
                우리를 소개합니다
              </a>
              <a
                href="#projects"
                className="press flex-1 rounded-full bg-black/60 px-4 py-3.5 text-center text-[15px] font-semibold text-white ring-1 ring-inset ring-white/25 hover:bg-[#1c1c1c] sm:flex-none sm:px-7"
              >
                만든 것들 보기
              </a>
            </motion.div>

            <motion.div
              className="mt-7 flex items-center gap-4 [@media(max-height:700px)]:hidden"
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
        </div>

        {/* 처음엔 스크롤 안내, 프로덕트 줄이 나타나면 프로젝트로 가는 링크 */}
        <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl items-center justify-center px-5 text-sm sm:px-8">
          {!reduce && (
            <motion.span aria-hidden className="hero-hint absolute text-white/50" style={{ opacity: hintOpacity }}>
              <ArrowDown className="h-5 w-5" />
            </motion.span>
          )}
          <motion.a
            href="#projects"
            className="link-line inline-flex items-center gap-1 font-medium text-white/70 hover:text-white"
            style={{ opacity: captionOpacity, pointerEvents: captionEvents }}
          >
            전체 보기 <ArrowDown className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
