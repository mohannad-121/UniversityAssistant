import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { TEMP_STUDENT_ACCOUNT, signInStudent } from "@/lib/student-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student Login - Murshidi" },
      {
        name: "description",
        content: "Sign in with the temporary student account to access Murshidi.",
      },
    ],
  }),
  component: StudentLoginPage,
});

type LoginErrors = {
  universityId?: string;
  password?: string;
};

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
    if (!universityId.trim()) nextErrors.universityId = "University ID is required.";
    if (password.length < 8) nextErrors.password = "Password must contain at least 8 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signInStudent({ universityId, password });
      await navigate({ to: "/", replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Login failed. Check your temporary university ID and password.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page auth-page-compact selection:bg-sky-400/30">
      <aside className="auth-signup-aside">
        <div className="auth-signup-card liquid-glass">
          <div className={`signup-robot-scene ${password.length > 0 ? "is-shy" : ""}`}>
            <span className="signup-robot-aura" aria-hidden="true" />
            <span className="signup-robot-spark signup-robot-spark-1" aria-hidden="true" />
            <span className="signup-robot-spark signup-robot-spark-2" aria-hidden="true" />
            <span className="signup-robot-spark signup-robot-spark-3" aria-hidden="true" />

            <div className="signup-robot-body">
              <span className="signup-robot-antenna" aria-hidden="true" />

              <div className="signup-robot-head" aria-hidden="true">
                <span className="signup-robot-brow signup-robot-brow-left" />
                <span className="signup-robot-brow signup-robot-brow-right" />
                <span className="signup-robot-eye signup-robot-eye-left">
                  <span className="signup-robot-pupil" />
                </span>
                <span className="signup-robot-eye signup-robot-eye-right">
                  <span className="signup-robot-pupil" />
                </span>
                <span className="signup-robot-mouth">
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <span className="signup-robot-neck" aria-hidden="true" />

              <div className="signup-robot-torso" aria-hidden="true">
                <span className="signup-robot-arm signup-robot-arm-left" />
                <span className="signup-robot-arm signup-robot-arm-right" />
                <div className="signup-robot-core" />
              </div>
            </div>
          </div>

          <span className="auth-login-showcase-pill">Murshidi Robot</span>

          <h2>Murshidi</h2>
          <p>
            Keep exploring with the temporary test account for now. When the
            university system is ready, we will connect real student access.
          </p>
        </div>
      </aside>

      <main className="auth-form-column">
        <div className="auth-form-wrap">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-violet-400/40 hover:text-white"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
            <BrandLogo />
          </div>

          <div className="auth-heading">
            <span className="auth-badge liquid-glass">
              <ShieldCheck className="h-3.5 w-3.5" />
              Student Login
            </span>
            <h1>Sign in to Murshidi</h1>
            <p>
              Use the temporary university ID and password to enter the system.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-field">
              <span>University ID</span>
              <span className={`auth-input-shell ${errors.universityId ? "has-error" : ""}`}>
                <IdCard className="h-4 w-4" />
                <input
                  name="universityId"
                  value={universityId}
                  onChange={(event) => setUniversityId(event.target.value)}
                  placeholder={TEMP_STUDENT_ACCOUNT.universityId}
                  autoComplete="username"
                />
              </span>
              {errors.universityId && <small>{errors.universityId}</small>}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <span className={`auth-input-shell ${errors.password ? "has-error" : ""}`}>
                <Lock className="h-4 w-4" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="12345678"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
              <em>Password must contain at least 8 characters.</em>
              {errors.password && <small>{errors.password}</small>}
            </label>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={submitting}
                className="auth-submit"
                style={{
                  background: "linear-gradient(90deg, #7C3AED 0%, #9333EA 50%, #2563EB 100%)",
                }}
              >
                {submitting ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          {formError && <p className="auth-form-error">{formError}</p>}

          <p className="mt-6 text-sm text-slate-400">
            Test credentials:{" "}
            <span className="font-semibold text-white">
              {TEMP_STUDENT_ACCOUNT.universityId} / {TEMP_STUDENT_ACCOUNT.password}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
