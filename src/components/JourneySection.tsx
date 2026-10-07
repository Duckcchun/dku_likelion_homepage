import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { milestones } from "../data/site";
import { productGroups } from "../data/products";
import { Container, EASE, SectionHeader } from "./layout";

const countFor = (anchor?: string) =>
  anchor ? productGroups.find((g) => g.id === anchor)?.products.length ?? 0 : 0;

export function JourneySection() {
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

        <ol className="relative grid gap-0 md:grid-cols-6">
          {/* 가로선 (데스크톱) */}
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-white/15 md:block" />
          {/* 세로선 (모바일) */}
          <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-white/15 md:hidden" />

          {milestones.map((m, i) => {
            const count = countFor(m.projectsAnchor);
            const highlight = count > 0;
            return (
              <motion.li
                key={m.title}
                className="relative pb-10 pl-9 md:pb-0 md:pl-0 md:pr-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 h-[15px] w-[15px] rounded-full border-2 md:static md:block ${
                      highlight ? "border-[#FF6000] bg-[#FF6000]" : "border-white/40 bg-[#0B0B0B]"
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
                      className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-[#FF6000]"
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
