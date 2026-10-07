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
        className="fixed bottom-6 right-6 z-40 rounded-full bg-white/10 p-3 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md transition-colors hover:bg-white hover:text-[#0B0B0B]"
        title="맨 위로 이동"
        aria-label="맨 위로 이동"
        style={{
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <motion.div
          
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </>
  );
}
