import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { Code2, Users, Rocket, Award } from "lucide-react";

function Counter({ end, duration = 2, suffix = "+" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-5xl md:text-7xl font-bold text-[#FF6000]">
      {count}{suffix}
    </div>
  );
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { icon: Award, label: "시작된지", value: 13, suffix: "년" },
    { icon: Users, label: "배출 인원", value: 14000 },
    { icon: Rocket, label: "론칭 서비스", value: 1800 },
  ];

  const values = [
    {
      title: "실전 중심 학습",
      description: "이론보다 실제 프로젝트를 통해 배우고 성장합니다",
    },
    {
      title: "협업과 성장",
      description: "다양한 전공의 학생들이 모여 함께 만들고 배웁니다",
    },
    {
      title: "아이디어 실현",
      description: "머릿속 아이디어를 실제 서비스로 구현합니다",
    },
  ];

  return (
    <section id="about" ref={ref} className="py-24 bg-[#0F0F0F] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6000] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0047AB] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-[#FF6000]">Us</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            멋쟁이사자처럼은 기술로 세상을 바꾸고자 하는
            <br />
            대학생 개발자들의 성장 커뮤니티입니다
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-[#FF6000]/10 rounded-2xl group-hover:bg-[#FF6000]/20 transition-colors">
                    <Icon className="w-8 h-8 text-[#FF6000]" />
                  </div>
                </div>
                <Counter end={stat.value} suffix={stat.suffix || "+"} />
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6000]/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative p-8 bg-[#1C1C1C]/80 border border-gray-800 rounded-2xl hover:border-[#FF6000]/50 transition-all">
                <div className="w-12 h-1 bg-[#FF6000] mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}