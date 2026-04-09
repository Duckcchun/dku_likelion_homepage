import { motion, useScroll, useTransform, useMotionValue } from "motion/react";
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Spline from "@splinetool/react-spline";

const likelionUnivLogo = new URL(
  "../assets/0e22b8d85e32254db31b5fd548862b4df3d4b0a1.png",
  import.meta.url,
).href;

const startupLogo = new URL(
  "../assets/단대_창업지원단_로고-removebg-preview.png",
  import.meta.url,
).href;

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-[#0A0A0A] pt-24"
    >
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute -top-[8%] left-0 w-full h-[116%] scale-105 pointer-events-none select-none">
          <Spline
            scene="https://prod.spline.design/ZIRHX1UuO6MzVmaV/scene.splinecode"
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent z-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-8 z-50 flex items-center gap-3"
      >
        <img
          src={likelionUnivLogo}
          alt="멋사대학"
          className="w-32 md:w-40 opacity-90"
        />
        <img
          src={startupLogo}
          alt="창업지원단"
          className="w-20 md:w-24 opacity-90"
        />
      </motion.div>

      <motion.div
        className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        style={{ opacity }}
      >

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="text-[#0047AB]">DANKOOK UNIV.</span>
            </h1>
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-white via-[#FF6000] to-white bg-clip-text text-transparent">
                LIKELION
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-14 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          여러분의 아이디어를 현실로 만드세요
          <br />
          <span className="text-gray-400 text-base md:text-lg">
            프론트엔드 · 백엔드 · 디자인 · 기획
          </span>
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.a
            href="https://dku-lion.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 bg-gradient-to-r from-[#FF6000] to-[#ff8533] text-white rounded-xl font-bold text-lg overflow-hidden shadow-lg shadow-[#FF6000]/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#ff8533] to-[#FF6000]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute inset-0 bg-white/20 rounded-xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <span className="relative z-10">지원하기</span>
          </motion.a>

          <motion.a
            href="#about"
            className="group px-10 py-5 bg-transparent border-2 border-[#0047AB] text-white rounded-xl font-bold text-lg relative overflow-hidden shadow-lg shadow-[#0047AB]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#0047AB]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">더 알아보기</span>
          </motion.a>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <span className="text-sm text-gray-500 uppercase tracking-wider">
            Scroll Down
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-[#FF6000]" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
