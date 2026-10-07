import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useIsMobile } from "./ui/use-mobile";
import { ArrowDown } from "lucide-react";
import { milestones } from "../data/site";
import { productGroups } from "../data/products";
import { Container, EASE, SectionHeader } from "./layout";

const countFor = (anchor?: string) =>
  anchor ? productGroups.find((g) => g.id === anchor)?.products.length ?? 0 : 0;

export function JourneySection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  // 타임라인이 화면 아래쪽에 들어오면 차오르기 시작해, 화면 가운데쯤 왔을 때 끝까지 찹니다.
  // (모바일은 세로로 길어서, 읽어 내려가는 속도에 맞춰 목록 끝이 보일 때 다 찹니다.)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: mobile ? ["start 0.85", "end 0.8"] : ["start 0.95", "start 0.55"],
  });
  const fill = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  return (
    <section id="journey" className="scroll-mt-16 bg-[#0B0B0B] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="03"
          label="1년의 흐름"
          title={
            <>
              배우고, 만들고,
              <br />
              세상에 보여 줍니다.
            </>
          }
          description="정기 세션으로 기본기를 쌓고 나면, 아이디어톤과 해커톤에서 그 실력을 실제 서비스로 증명합니다."
        />

        <ol ref={listRef} className="relative isolate grid gap-0 md:grid-cols-6">
          {/* 가로선 (데스크톱) */}
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/15 md:block" />
          {/* 세로선 (모바일) */}
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-white/15 md:hidden" />
          {/* 차오르는 주황 선 */}
          <motion.span
            aria-hidden
            className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-[#FF6000] md:block"
            style={{ scaleX: fill }}
          />
          <motion.span
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-[#FF6000] md:hidden"
            style={{ scaleY: fill }}
          />

          {milestones.map((m, i) => {
            const count = countFor(m.projectsAnchor);
            const highlight = count > 0;
            return (
              <motion.li
                key={m.title}
                className="relative z-10 pb-10 pl-9 md:pb-0 md:pl-0 md:pr-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 z-10 h-[15px] w-[15px] rounded-full border-2 md:relative md:block ${
                      highlight ? "border-[#FF6000] bg-[#FF6000]" : "border-[#6D6D6D] bg-[#0B0B0B]"
                    }`}
                  />
                  <p className="text-sm tabular-nums text-white/50 md:mt-6">{m.date ?? " "}</p>
                  <h3 className={`mt-1 text-lg font-bold ${highlight ? "text-[#FF6000]" : "text-white"}`}>
                    {m.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-snug text-white/55">{m.description}</p>
                  {highlight && (
                    <a
                      href={`#${m.projectsAnchor}`}
                      className="link-line mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-white"
                    >
                      결과물 {count}개 보기 <ArrowDown className="h-3.5 w-3.5" />
                    </a>
                  )}
              </motion.li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
