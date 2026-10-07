import { allProducts, productGroups } from "../data/products";
import { generation, members, tracks } from "../data/site";
import { Container, Reveal, SectionHeader } from "./layout";

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
  const stats = [
    { value: `${generation}기`, label: "올해 기수" },
    { value: `${tracks.length}`, label: "트랙" },
    { value: `${allProducts.length}`, label: `${productGroups[0]?.year} 완성한 서비스` },
    { value: `${members.length}`, label: "운영진" },
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
              <p className="text-sm tabular-nums text-white/35">0{i + 1}</p>
              <h3 className="mt-8 text-xl font-bold text-white md:text-2xl">{v.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{v.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 grid grid-cols-2 gap-y-10 border-t border-white/[0.08] pt-10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold tracking-tight text-white tabular-nums md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-white/45">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
