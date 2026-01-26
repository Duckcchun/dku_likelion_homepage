import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Calendar, Users, Rocket, GraduationCap, Trophy, Sparkles, Award } from "lucide-react";

interface ScheduleItem {
  id: string;
  icon: any;
  title: string;
  date: string;
  description: string;
  color: string;
}

const scheduleData: ScheduleItem[] = [
  {
    id: "1",
    icon: Users,
    title: "아기사자 모집",
    date: "2월 ~ 3월",
    description: "단국대 아기사자 14기 모집",
    color: "#FF6000",
  },
  {
    id: "2",
    icon: Rocket,
    title: "합격자 발표",
    date: "3월 중순",
    description: "최종 합격 발표",
    color: "#0047AB",
  },
  {
    id: "3",
    icon: GraduationCap,
    title: "OT",
    date: "3월 18일",
    description: "전체 오리엔테이션",
    color: "#FF6000",
  },
  {
    id: "4",
    icon: Sparkles,
    title: "세션 시작",
    date: "3월 ~ 6월",
    description: "정기 세션 & 스터디",
    color: "#0047AB",
  },
  {
    id: "5",
    icon: Trophy,
    title: "중간 해커톤",
    date: "7월",
    description: "중간 발표회",
    color: "#FF6000",
  },
  {
    id: "6",
    icon: Award,
    title: "최종 데모데이",
    date: "11월",
    description: "결과물 발표  시연",
    color: "#0047AB",
  },
];

export function ScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      id="schedule"
      ref={ref}
      className="py-24 bg-[#0F0F0F] relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FF6000] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#0047AB] rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">
              활동 일정
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            1년 동안 함께 성장할 여정을 확인하세요
          </p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="hidden md:block relative max-w-7xl mx-auto" style={{ minHeight: "500px" }}>
          {/* Timeline Container */}
          <div className="relative flex items-center justify-between px-4 md:px-8" style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)" }}>
            {/* Horizontal Line */}
            <motion.div
              className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6000] via-[#0047AB] to-[#FF6000]"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
              style={{ transformOrigin: "left" }}
            />

            {/* Timeline Items */}
            {scheduleData.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={item.id}
                  className="relative flex-1 flex flex-col items-center"
                  style={{ zIndex: scheduleData.length - index }}
                >
                  {/* Content Card - Alternating Top/Bottom */}
                  <motion.div
                    className={`absolute ${
                      isEven ? "bottom-20" : "top-20"
                    } w-40 md:w-48`}
                    initial={{ opacity: 0, y: isEven ? 50 : -50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-[#1C1C1C] to-[#0F0F0F] border-2 rounded-2xl p-4 text-center hover:scale-110 transition-transform cursor-pointer"
                      style={{
                        borderColor: item.color,
                        boxShadow: `0 0 20px ${item.color}40`,
                      }}
                      whileHover={{
                        scale: 1.15,
                        boxShadow: `0 0 30px ${item.color}60`,
                      }}
                    >
                      <div className="flex justify-center mb-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${item.color}20`,
                          }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: item.color }}
                          />
                        </div>
                      </div>
                      <h3
                        className="font-bold text-sm mb-1"
                        style={{ color: item.color }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-1">{item.date}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </motion.div>

                    {/* Connecting Line to Circle */}
                    <motion.div
                      className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b ${
                        isEven
                          ? "top-full mt-0"
                          : "bottom-full mb-0"
                      }`}
                      style={{
                        height: "2rem",
                        background: `linear-gradient(${
                          isEven ? "to bottom" : "to top"
                        }, ${item.color}, transparent)`,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.2 + 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Circle Node */}
                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {/* Outer Glow Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{
                        backgroundColor: item.color,
                        opacity: 0.3,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />

                    {/* Main Circle */}
                    <div
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#0F0F0F] flex items-center justify-center"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 30px ${item.color}80`,
                      }}
                    >
                      <span className="text-white font-bold text-lg md:text-xl">
                        {item.id}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline (Vertical for small screens) */}
        <div className="md:hidden mt-20 max-w-md mx-auto">
          {scheduleData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="relative flex gap-6 mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
              >
                {/* Circle */}
                <div className="relative">
                  <motion.div
                    className="w-14 h-14 rounded-full border-4 border-[#0F0F0F] flex items-center justify-center"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 20px ${item.color}60`,
                    }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.15 + 0.2,
                      type: "spring",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  {index !== scheduleData.length - 1 && (
                    <div
                      className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-8"
                      style={{
                        background: `linear-gradient(to bottom, ${item.color}, transparent)`,
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <motion.div
                  className="flex-1 bg-gradient-to-br from-[#1C1C1C] to-[#0F0F0F] border-2 rounded-xl p-4"
                  style={{
                    borderColor: item.color,
                  }}
                >
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{item.date}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
