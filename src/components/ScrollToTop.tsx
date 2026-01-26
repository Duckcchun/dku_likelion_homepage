import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 500);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 상단으로 스크롤 버튼 */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-br from-[#FF6000] to-[#ff7a26] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="맨 위로 이동"
        aria-label="맨 위로 이동"
        style={{
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <motion.div
          animate={isVisible ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* 모바일 하단 고정 네비게이션 팁 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-20 right-8 md:hidden z-40 bg-[#1C1C1C] border border-gray-800 rounded-lg p-3 text-xs text-gray-300 pointer-events-none"
      >
        위로 스크롤 ↑
      </motion.div>
    </>
  );
}
