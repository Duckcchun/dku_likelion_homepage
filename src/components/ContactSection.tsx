import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Mail, Instagram, MapPin, Calendar, Send, AlertCircle, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

// 환경변수에서 EmailJS 설정 가져오기
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_TO_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL || "dku_uni@likelion.org";

export function ContactSection() {
  const showRecruitClosedAlert = () => {
    window.alert("모집 기간이 아닙니다.");
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    // EmailJS 초기화 (환경변수가 설정되어 있을 때만)
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "") {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch (err) {
        console.warn("EmailJS 초기화에 실패했습니다. 환경변수를 확인해주세요.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 기본 검증
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus("error");
      setSubmitMessage("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // EmailJS 설정이 완료되었다면 실제 전송
      if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: EMAILJS_TO_EMAIL,
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email,
          }
        );
      } else {
        // 데모 모드: 1.5초 후 성공 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      setSubmitStatus("success");
      setSubmitMessage("문의가 성공적으로 접수되었습니다! 곧 연락드리겠습니다.");
      setFormData({ name: "", email: "", message: "" });

      // 3초 후 상태 초기화
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("이메일 전송 오류:", error);
      setSubmitStatus("error");
      setSubmitMessage("문의 접수에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "이메일",
      value: "dku_uni@likelion.org",
      link: "mailto:dku_uni@likelion.org",
    },
    {
      icon: Instagram,
      label: "인스타그램",
      value: "@likelion.dku",
      link: "https://www.instagram.com/likelion.dku/",
    },
    {
      icon: MapPin,
      label: "위치",
      value: "경기도 용인시 수지구 죽전로 152",
      link: null,
    },
  ];

  const recruitSchedule = [
    { phase: "서류 접수", period: "2026.02.01 - 03.10" },
    { phase: "면접 진행", period: "2026.03.12 - 03.13" },
    { phase: "최종 합격 발표", period: "2026.03.15" },
    { phase: "OT 및 활동 시작", period: "2026.03.18" },
  ];

  return (
    <section
      id="recruit"
      ref={ref}
      className="py-24 bg-[#0F0F0F] relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255, 96, 0, 0.3) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
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
            Join <span className="text-[#FF6000]">Us</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            함께 성장할 14기 멤버를 찾습니다
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-[#1C1C1C] border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                문의하기
              </h3>
              <p className="text-gray-400 mb-6">
                궁금한 점이 있다면 언제든지 연락주세요!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">이름</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6000] transition-colors"
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">이메일</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6000] transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">메시지</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FF6000] transition-colors resize-none"
                    placeholder="문의 내용을 입력해주세요"
                    required
                  />
                </div>

                {/* 상태 메시지 */}
                {submitStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-4 rounded-lg ${
                      submitStatus === "success"
                        ? "bg-green-500/20 border border-green-500/50 text-white"
                        : "bg-red-500/20 border border-red-500/50 text-white"
                    }`}
                  >
                    {submitStatus === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium">{submitMessage}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    isSubmitting
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-[#FF6000] text-white hover:bg-[#ff7a26]"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "전송 중..." : "전송하기"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Info */}
            <div className="bg-[#1C1C1C] border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">연락처</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-[#0F0F0F] rounded-lg hover:bg-[#0F0F0F]/50 transition-colors"
                    >
                      <div className="p-2 bg-[#FF6000]/10 rounded-lg">
                        <Icon className="w-5 h-5 text-[#FF6000]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm">{item.label}</p>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-white hover:text-[#FF6000] transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recruitment Schedule */}
            <div className="bg-[#1C1C1C] border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-[#FF6000]" />
                <h3 className="text-2xl font-bold text-white">
                  14기 모집 일정
                </h3>
              </div>
              <div className="space-y-4">
                {recruitSchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-[#FF6000] rounded-full" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.phase}</p>
                      <p className="text-gray-400 text-sm">{item.period}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.6 }}
                className="mt-6 pt-6 border-t border-gray-800"
              >
                <a
                  href="https://dku-lion.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    showRecruitClosedAlert();
                  }}
                  className="block w-full px-6 py-3 bg-[#FF6000] text-white text-center rounded-lg hover:bg-[#ff7a26] transition-colors"
                >
                  지원서 작성하기 →
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block px-8 py-4 bg-[#1C1C1C] border border-gray-800 rounded-2xl">
            <p className="text-gray-400">
              💡 <span className="text-white font-bold">비전공자도 환영</span>합니다!
              열정만 있다면 누구나 지원 가능합니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}