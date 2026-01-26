import { motion } from "motion/react";
import { useEffect, useState } from "react";
import dankookLogo from "../assets/dankook-logo.png";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-[#1C1C1C] flex items-center justify-center"
    >
      <div className="text-center">
        {/* Dankook University Logo with White Box */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          {/* 흰색 박스 */}
          <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <img
              src={dankookLogo}
              alt="단국대학교 로고"
              className="w-24 h-24 object-contain"
            />
          </div>

          <div className="text-[#FF6000] text-sm tracking-[0.3em] font-bold mb-2">
            LIKELION
          </div>
          <div className="text-white text-lg font-bold">DANKOOK UNIV.</div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6000] to-[#ff7a26]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-400 text-sm mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading... {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
}
