import { motion, useInView } from "motion/react";
import { useState, useRef } from "react";
import {
  Code2,
  Database,
  Palette,
  ChevronDown,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

const tracks = [
  {
    id: "frontend",
    title: "Front-end",
    icon: Code2,
    color: "#FF6000",
    description: "사용자가 직접 마주하는 웹/앱 화면을 만듭니다",
    techs: [
      { name: "HTML/CSS", logo: "🎨" },
      { name: "JavaScript", logo: "⚡" },
      { name: "React", logo: "⚛️" },
      { name: "Next.js", logo: "▲" },
      { name: "TypeScript", logo: "📘" },
      { name: "Tailwind CSS", logo: "🎭" },
    ],
    curriculum: [
      "웹 기초 (HTML, CSS, JavaScript)",
      "React 핵심 개념 및 Hook",
      "상태 관리 (Zustand, Redux)",
      "Next.js 프레임워크",
      "TypeScript 도입",
      "반응형 디자인 & 최적화",
    ],
  },
  {
    id: "backend",
    title: "Back-end",
    icon: Database,
    color: "#0047AB",
    description: "서버, 데이터베이스, API를 설계하고 구축합니다",
    techs: [
      { name: "Node.js", logo: "🟢" },
      { name: "Express", logo: "🚂" },
      { name: "Django", logo: "🐍" },
      { name: "Spring", logo: "🍃" },
      { name: "PostgreSQL", logo: "🐘" },
      { name: "MongoDB", logo: "🍃" },
    ],
    curriculum: [
      "서버와 API 개념",
      "RESTful API 설계",
      "데이터베이스 설계 및 쿼리",
      "인증/인가 시스템",
      "배포 및 클라우드 (AWS, Docker)",
      "성능 최적화 및 보안",
    ],
  },
  {
    id: "design",
    title: "Design",
    icon: Palette,
    color: "#F38181",
    description: "사용자 경험을 디자인하고 시각적으로 표현합니다",
    techs: [
      { name: "Figma", logo: "🎨" },
      { name: "Adobe XD", logo: "🎭" },
      { name: "Prototyping", logo: "📱" },
      { name: "UI/UX", logo: "✨" },
      { name: "Illustration", logo: "🖌️" },
      { name: "Design System", logo: "🎯" },
    ],
    curriculum: [
      "디자인 씽킹 프로세스",
      "사용자 리서치 방법론",
      "와이어프레임 & 프로토타입",
      "UI/UX 디자인 원칙",
      "디자인 시스템 구축",
      "개발자와의 협업",
    ],
  },
  {
    id: "pm",
    title: "PM/기획",
    icon: Lightbulb,
    color: "#95E1D3",
    description: "프로덕트를 기획하고 팀을 이끌어 목표를 달성합니다",
    techs: [
      { name: "Notion", logo: "📝" },
      { name: "Jira", logo: "📊" },
      { name: "User Research", logo: "🔍" },
      { name: "Data Analysis", logo: "📈" },
      { name: "MVP Strategy", logo: "🎯" },
      { name: "Agile", logo: "⚡" },
    ],
    curriculum: [
      "프로덕트 매니지먼트 기초",
      "사용자 니즈 분석",
      "기획서 작성 및 문서화",
      "애자일 방법론",
      "데이터 기반 의사결정",
      "팀 커뮤니케이션 스킬",
    ],
  },
];

export function CurriculumSection() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="curriculum" ref={ref} className="py-24 bg-[#0F0F0F] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6000]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4ECDC4]/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Curriculum
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            트랙별 체계적인 커리큘럼으로 성장을 경험하세요
          </p>
        </motion.div>

        {/* Track Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {tracks.map((track, index) => {
            const Icon = track.icon;
            const isActive = activeTrack === track.id;

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="relative"
              >
                <button
                  onClick={() =>
                    setActiveTrack(isActive ? null : track.id)
                  }
                  className="w-full text-left"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-[#1C1C1C] border transition-all duration-300 ${
                      isActive
                        ? "border-[#FF6000]"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${track.color}20` }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: track.color }}
                          />
                        </div>
                        <motion.div
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {track.description}
                      </p>
                    </div>

                    {/* Tech Stack Icons - Always Visible */}
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {track.techs.map((tech, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={
                              isInView
                                ? { scale: 1, opacity: 1 }
                                : { scale: 0, opacity: 0 }
                            }
                            transition={{
                              delay: 0.3 + index * 0.1 + i * 0.05,
                              type: "spring",
                              stiffness: 200,
                            }}
                            className="px-3 py-1.5 bg-[#0F0F0F] border border-gray-800 rounded-lg text-sm text-gray-300 flex items-center gap-2"
                          >
                            <span>{tech.logo}</span>
                            <span>{tech.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Curriculum */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 border-t border-gray-800 bg-[#0F0F0F]/50">
                        <h4 className="text-white font-bold mb-4">
                          학습 로드맵
                        </h4>
                        <div className="space-y-3">
                          {track.curriculum.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={
                                isActive
                                  ? { x: 0, opacity: 1 }
                                  : { x: -20, opacity: 0 }
                              }
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2
                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                style={{ color: track.color }}
                              />
                              <span className="text-gray-300 text-sm">
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Bottom Accent */}
                    <motion.div
                      className="h-1"
                      style={{ backgroundColor: track.color, transformOrigin: "left" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-3 bg-[#1C1C1C] border border-gray-800 rounded-full">
            <p className="text-gray-400">
              💡 모든 트랙은{" "}
              <span className="text-[#FF6000] font-bold">
                실전 프로젝트
              </span>
              를 통해 학습합니다
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}