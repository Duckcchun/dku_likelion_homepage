import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle, Instagram, Mail, MapPin, Plus } from "lucide-react";
import { contact, faq, generation, recruit } from "../data/site";
import { Container, Reveal, SectionHeader } from "./layout";

// EmailJS 설정 (환경변수)
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_TO_EMAIL = import.meta.env.VITE_EMAILJS_TO_EMAIL || contact.email;

/** 동아리 메일로 보내기. 환경변수가 없으면(로컬·미리보기) 보내는 척만 합니다. */
async function sendToClub(params: { from_name: string; from_email: string; message: string }) {
  if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
    // 실제로 보낼 때만 EmailJS를 불러옵니다. (첫 화면 로딩을 가볍게)
    const { default: emailjs } = await import("@emailjs/browser");
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { to_email: EMAILJS_TO_EMAIL, reply_to: params.from_email, ...params },
      { publicKey: EMAILJS_PUBLIC_KEY },
    );
  } else {
    await new Promise((r) => setTimeout(r, 1200));
  }
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

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
      await sendToClub({ from_name: form.name, from_email: form.email, message: form.message });
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
        className="w-full rounded-lg bg-white py-3.5 text-[15px] font-semibold text-[#0B0B0B] press hover:bg-[#FF6000] hover:text-white disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {submitting ? "보내는 중…" : "문의 보내기"}
      </button>
    </form>
  );
}

/** 모집 기간이 아닐 때: 이메일을 남기면 다음 기수 모집이 열릴 때 알려 줍니다. (동아리 메일로 신청이 옵니다) */
function RecruitAlertForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const next = generation + 1;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setStatus("error");
      setStatusMessage("이메일 주소를 확인해 주세요.");
      return;
    }
    setSubmitting(true);
    setStatus("idle");
    try {
      await sendToClub({
        from_name: `${next}기 모집 알림 신청`,
        from_email: email.trim(),
        message: `[${next}기 모집 알림 신청] ${email.trim()}\n모집이 열리면 이 주소로 알려 주세요.`,
      });
      setStatus("success");
      setStatusMessage("신청되었습니다. 모집이 열리면 가장 먼저 알려 드릴게요.");
      setEmail("");
    } catch (err) {
      console.error("알림 신청 오류:", err);
      setStatus("error");
      setStatusMessage("신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6" noValidate>
      <label htmlFor="recruit-alert-email" className="block text-sm font-semibold text-white">
        {next}기 모집 알림 받기
      </label>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="recruit-alert-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={`${inputClass} sm:flex-1`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="press shrink-0 rounded-lg bg-[#FF6000] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#ff7420] disabled:opacity-50"
        >
          {submitting ? "신청 중…" : "알림 신청"}
        </button>
      </div>
      {status !== "idle" ? (
        <p
          role="status"
          className={`mt-3 flex items-center gap-2 text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
        >
          {status === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {statusMessage}
        </p>
      ) : (
        <p className="mt-3 text-[13px] leading-relaxed text-white/50">
          남겨 주신 이메일은 모집 안내에만 쓰고, 모집이 끝나면 지웁니다.
        </p>
      )}
    </form>
  );
}

/** 자주 묻는 질문. 내용은 src/data/site.ts의 faq에서 고칩니다. */
function Faq() {
  return (
    <Reveal className="mt-20 border-t border-white/[0.08] pt-12 md:mt-28">
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-16">
        <h3 className="text-2xl font-bold tracking-[-0.01em] text-white md:text-3xl lg:col-span-2">자주 묻는 질문</h3>
        <ul className="lg:col-span-3">
          {faq.map((item) => (
            <li key={item.q} className="border-b border-white/[0.08] first:border-t">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-semibold text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus className="h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-45" aria-hidden />
                </summary>
                <p className="-mt-1 pb-6 pr-10 text-[15px] leading-relaxed text-white/60">{item.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
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
                  {recruit.isOpen ? `${generation}기 모집 중` : "현재 지원 기간이 아닙니다"}
                </span>
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/60">
                {recruit.isOpen
                  ? "아래 지원서를 작성해 주세요. 마감 전에 꼭 제출해 주세요!"
                  : "이메일을 남겨 주시면 다음 기수 모집이 열릴 때 가장 먼저 알려 드려요."}
              </p>

              {recruit.isOpen ? (
                <a
                  href={recruit.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#FF6000] px-5 py-3 text-[15px] font-semibold text-white press hover:bg-[#ff7420]"
                >
                  지원서 작성하기
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <>
                  <RecruitAlertForm />
                  <a
                    href={contact.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-line mt-5 inline-flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white"
                  >
                    인스타그램 {contact.instagram.handle} <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </>
              )}

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

        <Faq />
      </Container>
    </section>
  );
}
