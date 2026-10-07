import { Github, Linkedin, Mail } from "lucide-react";
import { generation, members } from "../data/site";
import { Container, Reveal, SectionHeader } from "./layout";

const linkClass =
  "flex h-8 w-8 items-center justify-center rounded-full text-white/50 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white hover:text-[#0B0B0B]";

export function PeopleSection() {
  return (
    <section id="people" className="scroll-mt-16 bg-[#0B0B0B] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="05"
          label="사람들"
          title={
            <>
              {generation}기를 함께 이끄는
              <br />
              운영진입니다.
            </>
          }
          description="세션을 준비하고, 팀을 연결하고, 프로젝트가 끝까지 완성되도록 곁에서 돕습니다."
        />

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
          {members.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 4) * 0.05} className="flex h-full flex-col">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-[#161616]">
                  <img
                    src={m.image}
                    alt={`${m.name} 프로필`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span className="shrink-0 text-sm text-white/45">{m.role}</span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/55">{m.message}</p>
                {(m.email || m.github || m.linkedin) && (
                  <div className="mt-4 flex gap-2">
                    {m.email && (
                      <a href={`mailto:${m.email}`} className={linkClass} aria-label={`${m.name} 이메일`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.github && (
                      <a href={m.github} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${m.name} GitHub`}>
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${m.name} LinkedIn`}>
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
