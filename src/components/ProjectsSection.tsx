import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { productGroups, type Product } from "../data/products";

// 6열 그리드 기준: 첫 두 카드는 크게(3칸), 나머지는 2칸
const spanFor = (index: number) =>
  index < 2 ? "md:col-span-3" : "md:col-span-2";

function ProductCard({
  product,
  index,
  isInView,
  onOpen,
}: {
  product: Product;
  index: number;
  isInView: boolean;
  onOpen: (p: Product) => void;
}) {
  const large = index < 2;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.08 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group flex flex-col ${spanFor(index)}`}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`${product.name} 화면 크게 보기`}
        className={`relative w-full overflow-hidden rounded-xl bg-[#161616] ring-1 ring-white/[0.06] transition-[box-shadow] duration-300 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6000] ${
          large ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <img
          src={product.image}
          alt={`${product.name} 서비스 화면`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: product.imagePosition ?? "center" }}
        />
        <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/40">
          {product.category}
        </p>
        <h3
          className={`mt-2 font-bold text-white ${large ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}
        >
          {product.name}
        </h3>
        <p className="mt-2 text-[15px] font-medium leading-snug text-white/80">
          {product.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {product.description}
        </p>

        {product.link && (
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#FF6000] underline-offset-4 hover:underline"
          >
            서비스 보러 가기
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

function Lightbox({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A]/95 p-4 backdrop-blur-sm md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} 화면`}
        >
          <motion.figure
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={product.image}
              alt={`${product.name} 서비스 화면`}
              className="max-h-[78vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 text-white">
              <span>
                <strong className="font-bold">{product.name}</strong>
                <span className="ml-3 text-sm text-white/60">{product.tagline}</span>
              </span>
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF6000] hover:underline"
                >
                  서비스 보러 가기 <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </figcaption>
          </motion.figure>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [opened, setOpened] = useState<Product | null>(null);

  return (
    <section id="projects" ref={ref} className="scroll-mt-16 bg-[#0F0F0F] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {productGroups.map((group) => (
          <div key={`${group.year}-${group.event}`} className="mb-24 last:mb-0">
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-8 md:mb-16 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#FF6000]">
                  Projects · {group.year}
                </p>
                <h2 className="mt-3 text-4xl font-bold leading-tight text-white md:text-6xl">
                  올해 우리가
                  <br />
                  만든 것들
                </h2>
              </div>
              <p className="max-w-sm text-white/50 md:text-right">
                {group.event}에서 아기사자들이 문제를 정의하고
                직접 기획·디자인·개발한 서비스 {group.products.length}개입니다.
              </p>
            </motion.header>

            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-6">
              {group.products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  isInView={isInView}
                  onOpen={setOpened}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Lightbox product={opened} onClose={() => setOpened(null)} />
    </section>
  );
}
