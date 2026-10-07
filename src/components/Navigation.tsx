import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import dankookLogo from "../assets/emblem-lion-bear.png";
import { recruit } from "../data/site";

const navItems = [
  { label: "소개", href: "#about" },
  { label: "트랙", href: "#tracks" },
  { label: "1년의 흐름", href: "#journey" },
  { label: "프로젝트", href: "#projects" },
  { label: "사람들", href: "#people" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const cta = recruit.isOpen ? "지원하기" : "모집 안내";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-white/[0.06] bg-[#0B0B0B]/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={dankookLogo} alt="" className="h-8 w-8 rounded-full bg-white object-contain" />
          <span className="text-[15px] font-bold tracking-tight text-white">
            LIKELION <span className="font-medium text-bear-light">DKU</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] text-white/60 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#join"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0B0B0B] transition-colors hover:bg-[#FF6000] hover:text-white"
          >
            {cta}
          </a>
        </div>

        <button
          type="button"
          className="-mr-2 p-2 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="h-[calc(100svh-4rem)] border-t border-white/[0.06] bg-[#0B0B0B] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col px-5 py-6">
              {[...navItems, { label: cta, href: "#join" }].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/[0.06] py-4 text-2xl font-semibold text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
