import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Mail, Linkedin, Github } from "lucide-react";
import { OptimizedImage } from "./utils-components/OptimizedImage";
import member1 from "../assets/member-1.png";
import member2 from "../assets/member-2.png";
import member3 from "../assets/member-3.png";
import member4 from "../assets/member-4.png";
import member5 from "../assets/member-5.png";
import member6 from "../assets/member-6.png";

const members = [
  {
    name: "손동민",
    role: "14기 대표",
    track: "Leader",
    message: "함께 성장하는 대표가 되겠습니다 !",
    image: member1,
    emoji: "👑",
    email: "qasw1733@gmail.com",
    github: "https://github.com/Duckcchun",
    linkedin: "https://www.linkedin.com/in/%EB%8F%99%EB%AF%BC-%EC%86%90-0a5674354",
  },
  {
    name: "여채린",
    role: "14기 부대표",
    track: "Vice Leader",
    message: "함께 배우고 성장하는 멋사를 만들어가겠습니다",
    image: member2,
    emoji: "🌟",
    email: "ycl0514@dankook.ac.kr",
    github: "https://github.com/chae-ring",
  },
  {
    name: "양준호",
    role: "백엔드",
    track: "Back-end",
    message: "올해도 버텨보겠습니다 같이 성장해요!",
    image: member3,
    emoji: "💻",
    email: "did1406dud@dankook.ac.kr",
    github: "https://github.com/Novice-Dev-Robin",
  },
  {
    name: "김민수",
    role: "백엔드",
    track: "Back-end",
    message: "함께 성장해나가며 모두에게 얻어갈 수 있는 한 해가 되어봅시다!",
    image: member4,
    emoji: "🚀",
    email: "ms32220624@dankook.ac.kr",
    github: "https://github.com/Minwater-03",
  },
  {
    name: "김선민",
    role: "프론트엔드",
    track: "Front-end",
    message: "꾸준한 노력으로 성장하는 개발자입니다",
    image: member5,
    emoji: "🎨",
    email: "kimsunmin0616@dankook.ac.kr",
  },
  {
    name: "이효빈",
    role: "기획",
    track: "PM",
    message: "오늘도 심어보는 사과 나무 한 그루 잘 부탁드립니다~",
    image: member6,
    emoji: "🍎",
    email: "hbeen22@dankook.ac.kr",
    github: "https://github.com/hyoddi",
  },
];

const trackColors: Record<string, string> = {
  "Leader": "#FF6000",
  "Vice Leader": "#0047AB",
  "Front-end": "#FF6000",
  "Back-end": "#4ECDC4",
  "Design": "#F38181",
  "PM": "#A78BFA",
};

function MemberCard({ member, index }: { member: typeof members[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-[400px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-full h-full group">
            <img
              src={member.image}
              alt={`${member.name} - ${member.role}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

            {/* Content on Front */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                style={{ backgroundColor: trackColors[member.track] }}
              >
                {member.track}
              </div>
              <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              카드 뒤집기 →
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#1C1C1C] border border-gray-800 p-6 backface-hidden flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: `${trackColors[member.track]}20` }}
          >
            <span className="text-3xl">{member.emoji}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
          <p className="text-gray-400 mb-6">"{member.message}"</p>

          <div className="flex gap-3">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 bg-[#0F0F0F] border border-gray-700 rounded-lg hover:border-[#FF6000] transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-400" />
              </a>
            )}
            {member.github ? (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#0F0F0F] border border-gray-700 rounded-lg hover:border-[#FF6000] transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400" />
              </a>
            ) : (
              <button
                className="p-2 bg-[#0F0F0F] border border-gray-800 rounded-lg cursor-not-allowed"
                aria-disabled="true"
              >
                <Github className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#0F0F0F] border border-gray-700 rounded-lg hover:border-[#FF6000] transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400" />
              </a>
            ) : (
              <button
                className="p-2 bg-[#0F0F0F] border border-gray-800 rounded-lg cursor-not-allowed"
                aria-disabled="true"
              >
                <Linkedin className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          <div className="mt-6 text-xs text-gray-500">
            {member.email}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PeopleSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="people" ref={ref} className="py-24 bg-[#1C1C1C] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#FF6000]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#4ECDC4]/20 rounded-full blur-[150px]" />
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
            Our <span className="text-[#FF6000]">People</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-4">
            열정을 가진 운영진들이 여러분과 함께합니다
          </p>
          <p className="text-gray-500 text-sm">
            💡 카드에 마우스를 올려보세요!
          </p>
        </motion.div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-[#FF6000]/10 to-transparent border border-[#FF6000]/30 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              함께 성장할 준비가 되셨나요?
            </h3>
            <p className="text-gray-400 mb-6">
              단국대 멋쟁이사자처럼 14기를 모집합니다
            </p>
            <a
              href="#recruit"
              className="inline-block px-8 py-3 bg-[#FF6000] text-white rounded-lg hover:bg-[#ff7a26] transition-colors"
            >
              지원하기
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}