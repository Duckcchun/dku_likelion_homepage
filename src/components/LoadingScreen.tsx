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
          setTimeout(onComplete, 220);
          return 100;
        }
        return Math.min(prev + 2, 100);
      });
    }, 18);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0A0A0A] flex items-center justify-center"
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(45,76,140,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(45,76,140,0.14),transparent_40%),#0A0A0A]" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="text-center relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center drop-shadow-2xl bg-white/95 rounded-2xl backdrop-blur-sm">
            <img
              src={dankookLogo}
              alt="단국대학교 로고"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-[#FF6000] text-sm tracking-[0.3em] font-bold mb-2">
            LIKELION
          </div>
          <div className="text-white text-lg font-bold">DANKOOK UNIV.</div>
        </motion.div>

        <div className="w-64 h-2 bg-white/15 rounded-full overflow-hidden mx-auto border border-white/10">
          <motion.div
            className="h-full bg-[#FF6000]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <motion.p
          className="text-gray-300 text-sm mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading... {progress}%
        </motion.p>
      </div>
    </motion.div>
  );
}
