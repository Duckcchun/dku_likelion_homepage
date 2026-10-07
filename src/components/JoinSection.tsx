import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle, Instagram, Mail, MapPin } from "lucide-react";
import { contact, generation, recruit } from "../data/site";
import { Container, Reveal, SectionHeader } from "./layout";

// EmailJS 설정 (환경변수)
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_TO_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL || contact.email;

const inputClass =
  "w-full rounded-lg bg-[#161616] px-4 py-3 text-[15px] text-white placeholder:text-white/50 ring-1 ring-inset ring-white/10 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#FF6000]";

function InquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setStatusMessage("모든 항목을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setStatus("idle");
    try {
      if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        // 폼을 실제로 보낼 때만 EmailJS를 불러옵니다. (첫 화면 로딩을 가볍게)
        const { default: emailjs } = await import("@emailjs/browser");
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: EMAILJS_TO_EMAIL,
            from_name: form.name,
            from_email: form.email,
            message: form.message,
            reply_to: form.email,
          },
          { publicKey: EMAILJS_PUBLIC_KEY },
        );
      } else {
        // 데모 모드: 환경변수가 없으면 전송을 흉내만 냅니다.
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
      setStatusMessage("문의가 접수되었습니다. 곧 연락드릴게요.");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("이메일 전송 오류:", err);
      setStatus("error");
      setStatusMessage("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">이름</span>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="홍길동"
            autoComplete="name"
            disabled={submitting}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/60">이메일</span>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@email.com"
            autoComplete="email"
            disabled={submitting}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm text-white/60">문의 내용</span>
        <textarea
          className={`${inputClass} min-h-[140px] resize-y`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="모집, 협업, 후원 등 무엇이든 편하게 남겨 주세요."
          disabled={submitting}
        />
      </label>

      {status !== "idle" && (
        <p
          role="status"
          className={`flex items-center gap-2 text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
        >
          {status === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {statusMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-white py-3.5 text-[15px] font-semibold text-[#0B0B0B] transition-colors hover:bg-[#FF6000] hover:text-white disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {submitting ? "보내는 중…" : "문의 보내기"}
      </button>
    </form>
  );
}

export function JoinSection() {
  return (
    <section id="join" className="scroll-mt-16 bg-[#0F0F0F] py-28 md:py-36">
      <Container>
        <SectionHeader
          index="06"
          label="함께하기"
          title={
            <>
              다음 프로젝트의 주인공을
              <br />
              기다립니다.
            </>
          }
          description="전공도, 경험도 상관없습니다. 끝까지 만들어 보고 싶은 마음이면 충분합니다."
        />

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* 모집 상태 */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl bg-[#161616] p-7 ring-1 ring-inset ring-white/[0.06] md:p-8">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className={`h-2 w-2 rounded-full ${recruit.isOpen ? "bg-emerald-400" : "bg-white/30"}`} />
                <span className={recruit.isOpen ? "text-emerald-400" : "text-white/60"}>
                  {recruit.isOpen ? `${generation}기 모집 중` : "지금은 모집 기간이 아닙니다"}
                </span>
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                {recruit.isOpen
                  ? "아래 지원서를 작성해 주세요. 마감 전에 꼭 제출해 주세요!"
                  : "다음 기수 모집 소식은 인스타그램에서 가장 먼저 알려 드려요."}
              </p>

              <a
                href={recruit.isOpen ? recruit.applyUrl : contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#FF6000] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#ff7420]"
              >
                {recruit.isOpen ? "지원서 작성하기" : "인스타그램에서 소식 받기"}
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <div className="mt-8 border-t border-white/[0.08] pt-6">
                <p className="text-sm text-white/50">
                  {recruit.isOpen ? "모집 일정" : `지난 ${generation}기 모집 일정`}
                </p>
                <dl className="mt-4 space-y-3">
                  {recruit.schedule.map((s) => (
                    <div key={s.phase} className="flex justify-between gap-4 text-[14px]">
                      <dt className="text-white/75">{s.phase}</dt>
                      <dd className="tabular-nums text-white/50">{s.period}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>

          {/* 문의 */}
          <Reveal delay={0.08} className="lg:col-span-3">
            <h3 className="text-xl font-bold text-white">문의하기</h3>
            <p className="mt-2 text-[15px] text-white/55">궁금한 점이 있다면 언제든 편하게 연락 주세요.</p>
            <div className="mt-8">
              <InquiryForm />
            </div>

            <ul className="mt-12 grid gap-4 border-t border-white/[0.08] pt-8 text-[14px] sm:grid-cols-3">
              <li>
                <a href={`mailto:${contact.email}`} className="group flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                  <span className="break-all text-white/70 group-hover:text-white">{contact.email}</span>
                </a>
              </li>
              <li>
                <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3">
                  <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                  <span className="text-white/70 group-hover:text-white">{contact.instagram.handle}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bear-light" />
                <span className="text-white/70">{contact.address}</span>
              </li>
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
