import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import dankookLogo from "../assets/d4779426a70a161f36b0a3fe4df0ccddfda7687b.png";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Schedule", href: "#schedule" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "People", href: "#people" },
    { label: "Contact", href: "#recruit" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1C1C1C]/95 backdrop-blur-lg border-b border-gray-800 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-0.5">
                <img src={dankookLogo} alt="단국대학교" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="text-[#0047AB] text-xs font-bold">
                  DANKOOK
                </div>
                <div className="text-[#FF6000] text-xs tracking-[0.2em] font-bold -mt-1">
                  LIKELION
                </div>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-[#FF6000] transition-colors relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6000]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
              <motion.a
                href="#recruit"
                className="px-6 py-2 bg-[#FF6000] text-white rounded-lg hover:bg-[#ff7a26] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                지원하기
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-[#FF6000] transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-[#1C1C1C]/98 backdrop-blur-lg border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:text-[#FF6000] hover:bg-[#FF6000]/10 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isMobileMenuOpen
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -20 }
                }
                transition={{ delay: index * 0.05 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#recruit"
              className="block px-4 py-2 bg-[#FF6000] text-white text-center rounded-lg hover:bg-[#ff7a26] transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={
                isMobileMenuOpen
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ delay: navItems.length * 0.05 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              지원하기
            </motion.a>
          </div>
        </motion.div>
      </motion.nav>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6000] to-[#ff7a26] origin-left z-50"
        style={{
          scaleX: useScroll().scrollYProgress,
        }}
      />
    </>
  );
}