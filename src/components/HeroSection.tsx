import { motion, useScroll, useTransform, useMotionValue } from "motion/react";
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import likelionUnivLogo from "../assets/0e22b8d85e32254db31b5fd548862b4df3d4b0a1.png";

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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-24"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 96, 0, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 71, 171, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
          style={{
            background: "radial-gradient(circle, #FF6000 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-25"
          style={{
            background: "radial-gradient(circle, #0047AB 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[80px] opacity-20"
          style={{
            background: "radial-gradient(circle, #FF6000 0%, #0047AB 50%, transparent 70%)",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Glass Sphere Effect - Enhanced */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y }}
      >
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
          {/* Outer glow rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid rgba(255, 96, 0, ${0.1 - i * 0.03})`,
                scale: 1 + i * 0.15,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1 + i * 0.15, 1.1 + i * 0.15, 1 + i * 0.15],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Main sphere */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, 
                  rgba(255, 255, 255, 0.2) 0%,
                  rgba(255, 96, 0, 0.15) 25%,
                  rgba(0, 71, 171, 0.15) 50%,
                  transparent 70%
                )
              `,
              boxShadow: `
                0 0 60px rgba(255, 96, 0, 0.3),
                0 0 100px rgba(0, 71, 171, 0.2),
                inset 0 0 60px rgba(255, 255, 255, 0.1)
              `,
              backdropFilter: "blur(20px)",
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute top-[20%] left-[25%] w-[40%] h-[40%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 60%)",
              filter: "blur(20px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Rotating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#FF6000] to-[#0047AB]"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-4px",
                marginLeft: "-4px",
              }}
              animate={{
                rotate: [0, 360],
                x: [0, Math.cos((i * Math.PI) / 4) * 200, 0],
                y: [0, Math.sin((i * Math.PI) / 4) * 200, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        {/* Likelion Univ Logo - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed bottom-8 left-8 z-20"
        >
          <img 
            src={likelionUnivLogo} 
            alt="멋사대학" 
            className="w-32 md:w-40 opacity-90"
          />
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="text-[#0047AB]">
                DANKOOK UNIV.
              </span>
            </h1>
            <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-white via-[#FF6000] to-white bg-clip-text text-transparent">
                LIKELION
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Description */}
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

        {/* CTA Buttons with Enhanced Effects */}
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
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#ff8533] to-[#FF6000]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />

            {/* Pulse effect */}
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

        {/* Scroll Indicator */}
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
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 text-[#FF6000]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1C1C1C] to-transparent" />
    </section>
  );
}
