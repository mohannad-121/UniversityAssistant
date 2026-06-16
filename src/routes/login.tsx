import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  Building2,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInStudent } from "@/lib/student-auth";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول - مرشدي" },
      {
        name: "description",
        content: "سجل الدخول إلى مرشدي باستخدام رقمك الجامعي للوصول إلى المساعد الأكاديمي الذكي.",
      },
    ],
  }),
  component: StudentLoginPage,
});

type LoginErrors = {
  universityId?: string;
  password?: string;
};

const heroCards = [
  { title: "إرشاد المواد", subtitle: "خطط لمسارك الدراسي", icon: BookOpen },
  { title: "فحص المتطلبات", subtitle: "تحقق من الجاهزية قبل التسجيل", icon: ShieldCheck },
  { title: "البحث عن المدرسين", subtitle: "اعثر على معلومات التواصل", icon: Search },
  { title: "معلومات القسم", subtitle: "استكشف التفاصيل الأكاديمية", icon: Building2 },
];

const steps = [
  "أدخل رقمك الجامعي",
  "تحقق من كلمة المرور",
  "ابدأ استخدام المساعد الذكي",
];

function StudentLoginPage() {
  const navigate = useNavigate();
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const nextErrors: LoginErrors = {};
    if (!universityId.trim()) nextErrors.universityId = "الرقم الجامعي مطلوب.";
    if (password.length < 8) nextErrors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signInStudent({ universityId, password });
      await navigate({ to: "/chatbot" });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "فشل تسجيل الدخول. تحقق من الرقم الجامعي وكلمة المرور.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#03030A] text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 18%, rgba(168,85,247,0.22), transparent 24rem), radial-gradient(circle at 88% 82%, rgba(37,99,235,0.18), transparent 26rem), linear-gradient(135deg, #03030A 0%, #050816 45%, #070B1F 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute -right-20 top-12 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-60 w-60 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[0.46fr_0.54fr]">
        <main className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-xl"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <BrandLogo />
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-violet-400/40 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للرئيسية
              </Link>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_40px_rgba(124,58,237,0.25)] backdrop-blur-xl sm:p-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-violet-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                دخول الطلاب
              </span>

              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                تسجيل الدخول إلى مرشدي
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                استخدم رقمك الجامعي للوصول إلى المساعد الأكاديمي الذكي.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                <FieldShell label="الرقم الجامعي" error={errors.universityId}>
                  <IdCard className="h-4 w-4 text-violet-300" />
                  <input
                    name="universityId"
                    value={universityId}
                    onChange={(event) => setUniversityId(event.target.value)}
                    placeholder="مثال: 202012345"
                    autoComplete="username"
                    className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </FieldShell>

                <div>
                  <FieldShell label="كلمة المرور" error={errors.password}>
                    <Lock className="h-4 w-4 text-violet-300" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="أدخل كلمة المرور"
                      autoComplete="current-password"
                      className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-slate-400 transition-colors hover:text-white"
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </FieldShell>
                  <p className="mt-2 text-xs text-slate-400">
                    يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-12 w-full rounded-xl border-0 text-base font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.28)] transition-all hover:shadow-[0_0_60px_rgba(56,189,248,0.18)]"
                    style={{
                      background:
                        "linear-gradient(90deg, #7C3AED 0%, #9333EA 50%, #2563EB 100%)",
                    }}
                  >
                    {submitting ? "..." : "تسجيل الدخول"}
                  </Button>
                </motion.div>
              </form>

              {formError && (
                <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {formError}
                </p>
              )}

              <p className="mt-6 text-sm text-slate-400">
                <Link
                  to="/signup"
                  className="font-medium text-cyan-300 transition-colors hover:text-violet-300"
                >
                  تحتاج إلى مساعدة؟ تواصل معنا
                </Link>
              </p>
            </div>
          </motion.div>
        </main>

        <aside className="relative hidden overflow-hidden lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative m-6 flex flex-1 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.03] p-10 shadow-[0_0_40px_rgba(124,58,237,0.18)] backdrop-blur-xl"
          >
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(56,189,248,0.22)_1px,transparent_1px)] [background-size:22px_22px]" />
            <svg
              className="absolute inset-0 h-full w-full opacity-40"
              viewBox="0 0 900 900"
              preserveAspectRatio="none"
            >
              <path
                d="M120 620 C250 500 340 530 430 430 S650 270 790 360"
                fill="none"
                stroke="rgba(168,85,247,0.35)"
                strokeDasharray="7 12"
                strokeWidth="2"
              />
              <path
                d="M90 230 C240 170 350 280 480 210 S690 140 820 240"
                fill="none"
                stroke="rgba(56,189,248,0.28)"
                strokeDasharray="6 14"
                strokeWidth="2"
              />
            </svg>

            <FloatingCard
              className="right-10 top-14"
              delay={0}
              icon={<BookOpen className="h-4 w-4" />}
              title="إرشاد المواد"
              subtitle="خطط لمسارك الدراسي"
            />
            <FloatingCard
              className="left-12 top-28"
              delay={0.4}
              icon={<ShieldCheck className="h-4 w-4" />}
              title="فحص المتطلبات"
              subtitle="تحقق من الجاهزية قبل التسجيل"
            />
            <FloatingCard
              className="right-16 bottom-44"
              delay={0.8}
              icon={<Search className="h-4 w-4" />}
              title="البحث عن المدرسين"
              subtitle="اعثر على معلومات التواصل"
            />
            <FloatingCard
              className="left-14 bottom-28"
              delay={1.2}
              icon={<Building2 className="h-4 w-4" />}
              title="معلومات القسم"
              subtitle="استكشف التفاصيل الأكاديمية"
            />

            <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_60px_rgba(56,189,248,0.12)]"
              >
                <img
                  src="/generated/murshidi-hero-assistant.png"
                  alt="مرشدي"
                  className="h-[360px] w-[280px] object-cover"
                />
              </motion.div>

              <div className="rounded-[28px] border border-white/10 bg-black/30 px-8 py-7 backdrop-blur-xl">
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-blue-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.35)]">
                  <Bot className="h-7 w-7" />
                </span>
                <h2 className="text-3xl font-black text-white">مرحباً بعودتك إلى مرشدي</h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  تابع استكشاف معلومات المواد، المتطلبات السابقة، المدرسين، والإرشاد
                  الأكاديمي من مساعد آمن وذكي.
                </p>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
                }}
                className="mt-8 grid w-full max-w-lg gap-3"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={step}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-3 text-right ${
                      index === 0
                        ? "border-white/15 bg-white text-[#070B1F]"
                        : "border-white/10 bg-white/[0.04] text-white"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold ${
                        index === 0
                          ? "bg-[#070B1F] text-white"
                          : "bg-gradient-to-br from-violet-500 to-blue-500 text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium">{step}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

function FieldShell({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <motion.span
        whileFocus={{}}
        className={`flex items-center gap-3 rounded-xl border bg-white/[0.03] px-4 backdrop-blur-md transition-colors ${
          error
            ? "border-rose-400/40 shadow-[0_0_24px_rgba(244,63,94,0.12)]"
            : "border-white/10 hover:border-violet-400/40 focus-within:border-violet-400/50 focus-within:shadow-[0_0_30px_rgba(124,58,237,0.18)]"
        }`}
      >
        {children}
      </motion.span>
      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
    </label>
  );
}

function FloatingCard({
  icon,
  title,
  subtitle,
  className,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4.2,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-right shadow-[0_0_30px_rgba(124,58,237,0.15)] backdrop-blur-xl ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-blue-500/30 text-violet-200">
        {icon}
      </span>
      <div className="min-w-0">
        <strong className="block text-sm font-semibold text-white">{title}</strong>
        <small className="block text-xs text-slate-300">{subtitle}</small>
      </div>
    </motion.div>
  );
}
