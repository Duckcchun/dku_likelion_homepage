import { tracks } from "../data/site";
import { Container, Reveal, SectionHeader } from "./layout";

export function TracksSection() {
  return (
    <section id="tracks" className="scroll-mt-16 bg-[#0F0F0F] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="02"
          label="트랙"
          title={
            <>
              네 개의 트랙이
              <br />
              하나의 프로덕트가 됩니다.
            </>
          }
          description="각자 트랙에서 기초를 다지고, 프로젝트에서는 트랙을 섞어 팀을 이룹니다."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="flex flex-col bg-[#0F0F0F] p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[1.625rem] font-bold tracking-[-0.01em] text-white">{t.title}</h3>
                <span className="text-sm text-white/50">{t.ko}</span>
              </div>
              <p className="mt-4 min-h-[3.2em] text-[15px] leading-relaxed text-white/60">{t.description}</p>

              <ol className="mt-7 space-y-2.5 border-t border-white/[0.08] pt-6">
                {t.curriculum.map((c, n) => (
                  <li key={c} className="flex gap-3 text-[14px] leading-snug text-white/75">
                    <span className="w-5 shrink-0 tabular-nums text-white/50">{n + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>

              <p className="mt-auto pt-8 text-[13px] leading-relaxed text-white/50">{t.tools.join(" · ")}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
