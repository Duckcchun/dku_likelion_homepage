import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "./ui/use-mobile";

const Spline = lazy(() => import("@splinetool/react-spline"));

const likelionUnivLogo = new URL(
  "../assets/0e22b8d85e32254db31b5fd548862b4df3d4b0a1.png",
  import.meta.url,
).href;

const startupLogo = new URL(
  "../assets/단대_창업지원단_로고-removebg-preview.png",
  import.meta.url,
).href;

export function HeroSection() {
  const showRecruitClosedAlert = () => {
    window.alert("모집 기간이 아닙니다.");
  };

  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);

  const gridX = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const showSpline =
    shouldLoadSpline &&
    !isMobile &&
    !prefersReducedMotion &&
    !isLowEndDevice &&
    !isSlowNetwork;

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    setIsLowEndDevice(lowCpu || lowMemory);
  }, []);

  useEffect(() => {
    type NetworkInfo = {
      effectiveType?: string;
      saveData?: boolean;
      addEventListener?: (type: string, listener: () => void) => void;
      removeEventListener?: (type: string, listener: () => void) => void;
    };

    const nav = navigator as Navigator & { connection?: NetworkInfo };
    const connection = nav.connection;
    if (!connection) return;

    const updateNetworkState = () => {
      const saveData = connection.saveData === true;
      const effectiveType = connection.effectiveType ?? "";
      const slowType = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
      setIsSlowNetwork(saveData || slowType);
    };

    updateNetworkState();
    connection.addEventListener?.("change", updateNetworkState);
    return () => connection.removeEventListener?.("change", updateNetworkState);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReducedMotion(mql.matches);

    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion || isLowEndDevice || isSlowNetwork) {
      setShouldLoadSpline(false);
      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(() => setShouldLoadSpline(true), {
        timeout: 2800,
      });
    } else {
      timeoutId = window.setTimeout(() => setShouldLoadSpline(true), 1200);
    }

    return () => {
      if (idleId !== undefined && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isMobile, prefersReducedMotion, isLowEndDevice, isSlowNetwork]);

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden flex items-center justify-center bg-[#0A0A0A]"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[8%] left-0 w-full h-[116%] scale-105 pointer-events-none select-none">
          {showSpline ? (
            <Suspense
              fallback={
                <div className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,#2E1A57,transparent_45%),radial-gradient(circle_at_80%_20%,#1B2D5B,transparent_40%),#0A0A0A]" />
              }
            >
              <Spline
                  scene="https://prod.spline.design/1uJAXVhO2g0jQgtx/scene.splinecode"
                style={{ width: "100%", height: "100%", pointerEvents: "none" }}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,#2E1A57,transparent_45%),radial-gradient(circle_at_80%_20%,#1B2D5B,transparent_40%),#0A0A0A]" />
          )}
        </div>
      </div>

      <motion.div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div className="absolute inset-0" style={{ x: gridX, y: gridY }}>
          <motion.div
            className="absolute inset-0 opacity-18"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              backgroundPosition: "0px 0px",
            }}
            animate={{ backgroundPositionX: ["0px", "64px"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(45,76,140,0.22),transparent_45%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05),transparent_25%),radial-gradient(circle_at_80%_60%,rgba(45,76,140,0.10),transparent_35%)]" />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-black/28 z-20 pointer-events-none" />

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

      <motion.div className="relative z-30 text-center px-4 max-w-5xl mx-auto" style={{ opacity }}>
        <div className="pt-24">
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
        </div>

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
            onClick={(e) => {
              e.preventDefault();
              showRecruitClosedAlert();
            }}
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
