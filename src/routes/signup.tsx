import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Lock,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signUpStudent, type StudentMajor } from "@/lib/student-auth";
import { useLanguage, type Language } from "@/lib/language";
import { BrandLogo } from "@/components/brand-logo";
import { repairTextFields } from "@/lib/text-encoding";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Student Sign Up - مرشدي" },
      {
        name: "description",
        content: "Create a مرشدي student account with Supabase verification.",
      },
    ],
  }),
  component: StudentSignupPage,
});

const majors: StudentMajor[] = [
  "Computer Science",
  "Artificial Intelligence",
  "Software Engineering",
  "Cybersecurity",
];

const majorLabels: Record<Language, Record<StudentMajor, string>> = repairTextFields({
  en: {
    "Computer Science": "Computer Science",
    "Artificial Intelligence": "Artificial Intelligence",
    "Software Engineering": "Software Engineering",
    Cybersecurity: "Cybersecurity",
  },
  ar: {
    "Computer Science": "Ø¹Ù„Ù… Ø§Ù„Ø­Ø§Ø³Ùˆب",
    "Artificial Intelligence": "Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    "Software Engineering": "Ù‡Ù†Ø¯Ø³Ø© Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠات",
    Cybersecurity: "Ø§Ù„Ø£Ù…Ù† Ø§Ù„Ø³ÙŠØ¨Ø±Ø§Ù†ÙŠ",
  },
});

const signupCopy = repairTextFields({
  en: {
    badge: "Student Registration",
    title: "Create مرشدي Account",
    subtitle: "Enter your university details to start using the smart assistant.",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    universityId: "University ID",
    universityIdPlaceholder: "Example: 202012345",
    password: "Password",
    passwordPlaceholder: "Create a password",
    passwordHelp: "Password must contain at least 8 characters.",
    major: "Major",
    submit: "Create Account",
    haveAccount: "Already have an account? Log in",
    success: "Account created. You can now log in with your university ID.",
    required: "This field is required.",
    passwordError: "Password must contain at least 8 characters.",
  },
  ar: {
    badge: "ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø·Ù„اب",
    title: "Ø¥Ù†شاء حساب مرشدي",
    subtitle: "Ø£Ø¯Ø®Ù„ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠØ© Ù„Ù„Ø¨Ø¯Ø¡ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯ Ø§Ù„Ø°ÙƒÙŠ.",
    fullName: "Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„",
    fullNamePlaceholder: "Ø§ÙƒØªØ¨ Ø§Ø³Ù…Ùƒ Ø§Ù„ÙƒØ§Ù…Ù„",
    universityId: "Ø§Ù„Ø±Ù‚Ù… Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠ",
    universityIdPlaceholder: "Ù…Ø«Ø§Ù„: 202012345",
    password: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±Ùˆر",
    passwordPlaceholder: "Ø£Ù†Ø´Ø¦ ÙƒÙ„Ù…Ø© Ù…Ø±Ùˆر",
    passwordHelp: "ÙŠØ¬Ø¨ Ø£Ù† ØªØ­ØªÙˆÙŠ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø¹Ù„Ù‰ 8 Ø£Ø­Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„.",
    major: "Ø§Ù„تخصص",
    submit: "Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„حساب",
    haveAccount: "Ù„Ø¯ÙŠÙƒ Ø­Ø³Ø§Ø¨ Ø¨Ø§Ù„ÙØ¹Ù„ØŸ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„",
    success: "ØªÙ… Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø­Ø³Ø§Ø¨. ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„Ø¢Ù† ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¨Ø±Ù‚Ù…Ùƒ Ø§Ù„Ø¬Ø§Ù…Ø¹ÙŠ.",
    required: "Ù‡Ø°Ø§ Ø§Ù„Ø­Ù‚Ù„ Ù…Ø·Ù„Ùˆب.",
    passwordError: "ÙŠØ¬Ø¨ Ø£Ù† ØªØ­ØªÙˆÙŠ ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± Ø¹Ù„Ù‰ 8 Ø£Ø­Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ø£Ù‚Ù„.",
  },
});

type SignupErrors = {
  fullName?: string;
  universityId?: string;
  password?: string;
};

function StudentSignupPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = signupCopy[language];
  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState<StudentMajor>("Computer Science");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    const nextErrors: SignupErrors = {};
    if (!fullName.trim()) nextErrors.fullName = t.required;
    if (!universityId.trim()) nextErrors.universityId = t.required;
    else if (!/^\d+$/.test(universityId.trim())) {
      nextErrors.universityId = "University ID must contain numbers only.";
    }
    if (password.length < 8) nextErrors.password = t.passwordError;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUpStudent({ fullName, universityId, password, major });
      setSuccess(t.success);
      window.setTimeout(() => void navigate({ to: "/login" }), 900);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page auth-page-compact selection:bg-sky-400/30">
      <main className="auth-form-column">
        <div className="auth-form-wrap">
          <Link to="/login" className="auth-back-link">
            {t.haveAccount}
          </Link>

          <div className="auth-heading">
            <span className="auth-badge liquid-glass">
              <GraduationCap className="h-3.5 w-3.5" />
              {t.badge}
            </span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <SignupInput
              label={t.fullName}
              name="fullName"
              placeholder={t.fullNamePlaceholder}
              value={fullName}
              onChange={setFullName}
              icon={<User className="h-4 w-4" />}
              error={errors.fullName}
            />
            <SignupInput
              label={t.universityId}
              name="universityId"
              placeholder={t.universityIdPlaceholder}
              value={universityId}
              onChange={setUniversityId}
              icon={<IdCard className="h-4 w-4" />}
              error={errors.universityId}
            />
            <label className="auth-field">
              <span>{t.password}</span>
              <span className={`auth-input-shell ${errors.password ? "has-error" : ""}`}>
                <Lock className="h-4 w-4" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder={t.passwordPlaceholder}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              <em>{t.passwordHelp}</em>
              {errors.password && <small>{errors.password}</small>}
            </label>

            <label className="auth-field">
              <span>{t.major}</span>
              <span className="auth-input-shell">
                <BookOpen className="h-4 w-4" />
                <select
                  name="major"
                  value={major}
                  onChange={(event) => setMajor(event.target.value as StudentMajor)}
                >
                  {majors.map((item) => (
                    <option key={item} value={item}>
                      {majorLabels[language][item]}
                    </option>
                  ))}
                </select>
              </span>
            </label>

            <Button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? "..." : t.submit}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {formError && <p className="auth-form-error">{formError}</p>}
          {success && <p className="auth-form-success">{success}</p>}
        </div>
      </main>

      <aside className="auth-signup-aside">
        <div className="auth-signup-card liquid-glass">
          <SignupRobot passwordFocused={passwordFocused} />
          <div className="auth-signup-copy">
            <span className="auth-signup-kicker">
              <Bot className="h-4 w-4" />
              Murshidi Robot
            </span>
            <h2>مرشدي</h2>
            <p>
              حرّك الماوس ليبقى الروبوت منتبهاً معك. وعند الوصول إلى خانة كلمة المرور، يغلق
              عينيه حتى تبقى بياناتك خاصة.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SignupRobot({ passwordFocused }: { passwordFocused: boolean }) {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;

    setEyeOffset({
      x: Math.max(-8, Math.min(8, x)),
      y: Math.max(-6, Math.min(6, y)),
    });
  }

  function handlePointerLeave() {
    setEyeOffset({ x: 0, y: 0 });
  }

  return (
    <div
      className={`signup-robot-scene ${passwordFocused ? "is-shy" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="signup-robot-aura" />
      <div className="signup-robot-spark signup-robot-spark-1" />
      <div className="signup-robot-spark signup-robot-spark-2" />
      <div className="signup-robot-spark signup-robot-spark-3" />

      <div className="signup-robot-body">
        <div className="signup-robot-antenna" />
        <div className="signup-robot-head">
          <div className="signup-robot-brow signup-robot-brow-left" />
          <div className="signup-robot-brow signup-robot-brow-right" />
          <div className="signup-robot-eye signup-robot-eye-left">
            <span
              className="signup-robot-pupil"
              style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
            />
          </div>
          <div className="signup-robot-eye signup-robot-eye-right">
            <span
              className="signup-robot-pupil"
              style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
            />
          </div>
          <div className="signup-robot-mouth">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="signup-robot-neck" />
        <div className="signup-robot-torso">
          <div className="signup-robot-core">
            <BrandLogo compact imageClassName="h-9 w-9 rounded-xl" />
          </div>
          <div className="signup-robot-arm signup-robot-arm-left" />
          <div className="signup-robot-arm signup-robot-arm-right" />
        </div>
      </div>
    </div>
  );
}

function SignupInput({
  label,
  name,
  placeholder,
  value,
  onChange,
  icon,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className={`auth-input-shell ${error ? "has-error" : ""}`}>
        {icon}
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      </span>
      {error && <small>{error}</small>}
    </label>
  );
}
