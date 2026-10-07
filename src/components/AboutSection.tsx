import { allProducts, productGroups } from "../data/products";
import { generation, members, tracks } from "../data/site";
import emblem from "../assets/emblem-lion-bear.webp";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Container, Reveal, SectionHeader } from "./layout";

/** 화면에 들어올 때 0에서 목표 숫자까지 한 번 올라갑니다. */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      // 숫자가 작아서 천천히 올라가야 세는 느낌이 납니다.
      duration: 2,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <>
      <span ref={ref}>{to}</span>
      {suffix}
    </>
  );
}

const values = [
  {
    title: "실전 중심",
    description: "강의를 듣는 데서 끝나지 않습니다. 배운 것은 바로 프로젝트에 씁니다.",
  },
  {
    title: "다른 전공, 한 팀",
    description: "기획·디자인·개발이 처음부터 함께 일하며 서로의 언어를 배웁니다.",
  },
  {
    title: "끝까지 만들기",
    description: "머릿속 아이디어를 실제로 동작하는 서비스로 완성해 발표합니다.",
  },
];

export function AboutSection() {
  const stats: { value: number; suffix?: string; label: string }[] = [
    { value: generation, suffix: "기", label: "올해 기수" },
    { value: tracks.length, label: "트랙" },
    { value: allProducts.length, label: `${productGroups[0]?.year} 완성한 서비스` },
    { value: members.length, label: "운영진" },
  ];

  return (
    <section id="about" className="scroll-mt-16 bg-[#0B0B0B] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="01"
          label="소개"
          title={
            <>
              전공이 달라도,
              <br />한 팀으로 만듭니다.
            </>
          }
          description="멋쟁이사자처럼 단국대학교는 기술로 문제를 풀고 싶은 대학생들이 모여 함께 배우고, 직접 서비스를 만드는 커뮤니티입니다."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/[0.08] md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06} className="bg-[#0B0B0B] p-7 md:p-9">
              <p className="text-sm tabular-nums text-white/50">0{i + 1}</p>
              <h3 className="mt-8 text-xl font-bold text-white md:text-2xl">{v.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{v.description}</p>
            </Reveal>
          ))}
        </div>

        {/* 사자와 곰: 대학 엠블럼과 두 브랜드 색의 유래 */}
        <Reveal className="mt-4 overflow-hidden rounded-2xl bg-bear">
          <div className="flex flex-col gap-8 p-7 md:flex-row md:items-center md:justify-between md:gap-12 md:p-12">
            <div className="max-w-xl">
              <h3 className="text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-white md:text-4xl">
                사자의 갈기를 쓴 곰
              </h3>
              <p className="mt-4 text-pretty text-[15px] leading-relaxed text-white/85 md:text-base">
                멋쟁이사자처럼의 사자와 단국대학교의 곰이 만나 우리 대학의 얼굴이 되었습니다.
                <br className="hidden md:block" /> 이 사이트의 오렌지는 사자에게서, 블루는 곰에게서 왔습니다.
              </p>
              <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <dt className="h-3 w-3 rounded-full bg-lion" aria-hidden />
                  <dd className="text-white">
                    <span className="font-semibold">사자</span> <span className="text-white/75">멋쟁이사자처럼</span>
                  </dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <dt className="h-3 w-3 rounded-full bg-white" aria-hidden />
                  <dd className="text-white">
                    <span className="font-semibold">곰</span> <span className="text-white/75">단국대학교</span>
                  </dd>
                </div>
              </dl>
            </div>
            <img
              src={emblem}
              alt="멋쟁이사자처럼 단국대학교 엠블럼. 사자 갈기를 쓴 곰의 얼굴"
              width={512}
              height={512}
              loading="lazy"
              className="order-first h-36 w-36 shrink-0 md:order-none md:h-64 md:w-64"
            />
          </div>
        </Reveal>

        <Reveal className="mt-16 grid grid-cols-2 gap-y-10 border-t border-white/[0.08] pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-bold tracking-tight text-white tabular-nums md:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
