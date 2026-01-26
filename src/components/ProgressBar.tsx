import { motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * 페이지 로드 진행 표시 바
 * 상단에 고정되어 페이지 스크롤 진행도를 시각적으로 표시합니다.
 */
export function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#FF6000] to-[#0047AB] z-50"
      style={{
        width: `${scrollProgress}%`,
      }}
      transition={{ type: "tween", duration: 0.1 }}
    />
  );
}
