import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { allProducts, productGroups, type Product, type ProductGroup } from "../data/products";
import { Container, EASE, Reveal, SectionHeader } from "./layout";

/**
 * 6열 그리드에서 카드 폭 정하기
 * - 짝수 개: 모두 절반(3칸)
 * - 홀수 개: 앞의 두 개는 절반, 나머지는 3등분(2칸)
 */
function spanFor(index: number, total: number) {
  if (total % 2 === 0) return { span: "md:col-span-3", large: true };
  return index < 2 ? { span: "md:col-span-3", large: true } : { span: "md:col-span-2", large: false };
}

function ProductCard({
  product,
  index,
  total,
  onOpen,
}: {
  product: Product;
  index: number;
  total: number;
  onOpen: (p: Product) => void;
}) {
  const { span, large } = spanFor(index, total);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: 0.05 * (index % 3), duration: 0.55, ease: EASE }}
      className={`group flex flex-col ${span}`}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`${product.name} 화면 크게 보기`}
        className={`relative w-full overflow-hidden rounded-xl bg-[#161616] ring-1 ring-inset ring-white/[0.06] transition-shadow duration-300 hover:ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6000] ${
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
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">{product.category}</p>
        <h4 className={`mt-2 font-bold text-white ${large ? "text-2xl md:text-[1.75rem]" : "text-xl md:text-2xl"}`}>
          {product.name}
        </h4>
        <p className="mt-2 text-[15px] font-medium leading-snug text-white/80">{product.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/50">{product.description}</p>

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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
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
            transition={{ duration: 0.22, ease: EASE }}
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

function GroupBlock({ group, onOpen }: { group: ProductGroup; onOpen: (p: Product) => void }) {
  return (
    <div id={group.id} className="scroll-mt-24">
      <Reveal className="mb-10 flex flex-col gap-3 border-t border-white/[0.1] pt-8 md:flex-row md:items-baseline md:justify-between">
        <div className="flex items-baseline gap-4">
          <h3 className="text-2xl font-bold text-white md:text-3xl">{group.label}</h3>
          <span className="text-sm tabular-nums text-white/50">
            {group.year} · {group.products.length}개
          </span>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-white/50 md:text-right">{group.summary}</p>
      </Reveal>

      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-6">
        {group.products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} total={group.products.length} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [opened, setOpened] = useState<Product | null>(null);
  const year = productGroups[0]?.year;

  return (
    <section id="projects" className="scroll-mt-16 bg-[#0F0F0F] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="04"
          label="프로젝트"
          title={
            <>
              {year}년,
              <br />
              우리가 만든 것들
            </>
          }
          description={`아이디어톤에서 문제를 정의하고, 해커톤에서 실제로 만들었습니다. 올해 완성한 서비스 ${allProducts.length}개를 소개합니다.`}
          aside={
            <div className="mt-5 flex flex-wrap gap-2 md:justify-end">
              {productGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white hover:text-[#0B0B0B]"
                >
                  {g.label} <span className="tabular-nums text-white/50">{g.products.length}</span>
                </a>
              ))}
            </div>
          }
        />

        <div className="space-y-28 md:space-y-36">
          {productGroups.map((g) => (
            <GroupBlock key={g.id} group={g} onOpen={setOpened} />
          ))}
        </div>
      </Container>

      <Lightbox product={opened} onClose={() => setOpened(null)} />
    </section>
  );
}
