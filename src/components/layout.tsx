import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** 스크롤해서 보일 때 한 번만 살짝 떠오르는 래퍼 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/**
 * 모든 섹션이 공유하는 머리말: 번호 · 라벨 → 제목 → 설명.
 * 번호가 이어지면서 페이지가 하나의 이야기로 읽히게 합니다.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
  aside,
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Reveal className="relative mb-14 md:mb-20">
      {/* 잡지의 쪽 번호처럼 섹션 번호를 배경에 크게 깝니다. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-14 right-0 select-none font-display text-[9.5rem] font-extrabold leading-none tracking-[-0.04em] text-white/[0.045] md:-top-24 md:text-[19rem]"
      >
        {index}
      </span>
      <div className="relative flex items-center gap-3 text-sm font-medium">
        <span className="h-px w-8 bg-[#FF6000]" />
        <span className="tracking-wide text-white/60">
          <span className="sr-only">{index}. </span>
          {label}
        </span>
      </div>
      <div className="relative mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-3xl font-display text-[2.25rem] font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-[3.5rem]">
          {title}
        </h2>
        {(description || aside) && (
          <div className="max-w-md text-[15px] leading-relaxed text-white/55 md:pb-2 md:text-right">
            {description}
            {aside}
          </div>
        )}
      </div>
    </Reveal>
  );
}
