import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { allProducts, productGroups, type Product, type ProductGroup } from "../data/products";
import { Container, EASE, Reveal, SectionHeader } from "./layout";

/** 상세 화면 주소: #project-tomo 처럼 공유할 수 있습니다. */
const HASH_PREFIX = "#project-";
const hashFor = (p: Product) => `${HASH_PREFIX}${p.id}`;
const productFromHash = () => allProducts.find((p) => hashFor(p) === window.location.hash) ?? null;

const accentStyle = (p: Product) => ({ "--accent": p.accentColor ?? "#FF6000" }) as CSSProperties;

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
      className={`flex flex-col ${span}`}
      style={accentStyle(product)}
    >
      {/* 카드 전체가 상세 화면으로 가는 링크. 마우스를 올리면 서비스 대표 색이 번집니다. */}
      <a
        href={hashFor(product)}
        onClick={(e) => {
          e.preventDefault();
          onOpen(product);
        }}
        className="group flex flex-1 flex-col rounded-xl focus-visible:outline-none"
      >
        <span
          className={`relative block w-full overflow-hidden rounded-xl bg-[#161616] ring-1 ring-inset ring-white/[0.06] transition-[box-shadow] duration-300 group-hover:shadow-[0_28px_70px_-30px_var(--accent)] group-hover:ring-[color:var(--accent)] group-focus-visible:ring-2 group-focus-visible:ring-[#FF6000] ${
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
        </span>

        <span className="mt-5 flex flex-1 flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">{product.category}</span>
          <h4 className={`mt-2 font-bold text-white ${large ? "text-2xl md:text-[1.75rem]" : "text-xl md:text-2xl"}`}>
            {product.name}
          </h4>
          <span className="mt-2 text-[15px] font-medium leading-snug text-white/80">{product.tagline}</span>
          <span className="mt-3 text-sm leading-relaxed text-white/50">{product.description}</span>
          <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white/70 underline-offset-4 transition-colors group-hover:text-white group-hover:underline">
            자세히 보기
          </span>
        </span>
      </a>
    </motion.article>
  );
}

/** 프로젝트 상세: 소개 → 핵심 기능 → 화면 갤러리 */
function ProjectDetail({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    if (!product) return;
    setShot(0);
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [product, onClose]);

  const shots = product ? [product.image, ...(product.images ?? [])] : [];

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#0A0A0A]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-detail-title"
          style={accentStyle(product)}
        >
          <motion.div
            className="mx-auto grid min-h-full w-full max-w-7xl items-center gap-8 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-14 lg:py-16"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* 화면 갤러리 */}
            <div className="lg:col-span-7" onClick={(e) => e.stopPropagation()}>
              <div className="overflow-hidden rounded-xl bg-[#161616] ring-1 ring-inset ring-white/[0.08]">
                <img
                  src={shots[shot]}
                  alt={`${product.name} 서비스 화면 ${shots.length > 1 ? shot + 1 : ""}`.trim()}
                  className="max-h-[70vh] w-full object-contain"
                />
              </div>
              {shots.length > 1 && (
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {shots.map((src, i) => (
                    <li key={src} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setShot(i)}
                        aria-label={`${i + 1}번째 화면 보기`}
                        aria-current={i === shot}
                        className={`block h-14 w-[5.6rem] overflow-hidden rounded-lg bg-[#161616] ring-1 ring-inset transition-[box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6000] ${
                          i === shot ? "ring-white/60" : "opacity-60 ring-white/10 hover:opacity-100"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 설명 */}
            <div className="lg:col-span-5" onClick={(e) => e.stopPropagation()}>
              <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {product.category}
              </p>
              <h3
                id="project-detail-title"
                className="mt-4 text-4xl font-bold leading-[1.15] tracking-[-0.02em] text-white md:text-5xl"
              >
                {product.name}
              </h3>
              <p className="mt-4 text-pretty text-lg font-medium leading-snug text-white/85">{product.tagline}</p>

              <div className="mt-8 border-t border-white/[0.1] pt-6">
                {product.problem && <h4 className="text-sm font-semibold text-white/60">어떤 문제를 푸나요</h4>}
                <p
                  className={`text-pretty text-[15px] leading-relaxed text-white/70 ${product.problem ? "mt-2" : ""}`}
                >
                  {product.problem ?? product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-white/60">핵심 기능</h4>
                  <ol className="mt-3">
                    {product.features.map((f, i) => (
                      <li
                        key={f}
                        className="flex gap-4 border-t border-white/[0.08] py-3.5 text-[15px] leading-snug text-white/85"
                      >
                        <span className="w-4 shrink-0 font-semibold tabular-nums text-[var(--accent)]">{i + 1}</span>
                        {f}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 rounded-xl bg-[#FF6000] px-6 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#ff7420] active:scale-[0.98]"
                >
                  서비스 보러 가기
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="fixed right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6000]"
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

  // 주소의 #project-… 와 열린 상세 화면을 맞춥니다. (공유 링크, 뒤로 가기)
  useEffect(() => {
    const sync = () => setOpened(productFromHash());
    sync();
    if (productFromHash()) document.getElementById("projects")?.scrollIntoView();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const open = useCallback((p: Product) => {
    window.history.pushState(null, "", hashFor(p));
    setOpened(p);
  }, []);

  const close = useCallback(() => {
    if (productFromHash()) window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    setOpened(null);
  }, []);

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
            <GroupBlock key={g.id} group={g} onOpen={open} />
          ))}
        </div>
      </Container>

      <ProjectDetail product={opened} onClose={close} />
    </section>
  );
}
