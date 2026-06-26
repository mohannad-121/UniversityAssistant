import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Languages, LogOut, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { useLanguage } from "@/lib/language";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { isCurrentUserAdmin } from "@/lib/university-data";
import { supabase } from "@/lib/supabase";
import {
  getStoredStudentSession,
  signOutTempStudent,
  type StudentSession,
} from "@/lib/student-auth";

const navItems = [
  { to: "/", labelKey: "nav.home" },
  { to: "/chatbot", labelKey: "nav.chatbot" },
  { to: "/courses", labelKey: "nav.courses" },
  { to: "/registration", labelKey: "nav.registration" },
  { to: "/instructors", labelKey: "nav.instructors" },
  { to: "/departments", labelKey: "nav.departments" },
  { to: "/faq", labelKey: "nav.faq" },
  { to: "/login", labelKey: "nav.login" },
  { to: "/admin", labelKey: "nav.admin" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<StudentSession | null>(null);
  const { language, toggleLanguage, t } = useLanguage();
  const nextLanguageLabel = language === "en" ? t("language.arabic") : t("language.english");

  const visibleNavItems = navItems.filter((item) => item.to !== "/admin" || isAdmin);
  const desktopNavItems = visibleNavItems.filter((item) =>
    ["/", "/chatbot", "/courses", "/departments", "/faq"].includes(item.to),
  );

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const updateSession = () => setSession(getStoredStudentSession());
    updateSession();
    window.addEventListener("storage", updateSession);
    return () => window.removeEventListener("storage", updateSession);
  }, []);

  useEffect(() => {
    let mounted = true;

    const updateAdminStatus = async () => {
      const nextIsAdmin = await isCurrentUserAdmin();
      if (mounted) setIsAdmin(nextIsAdmin);
    };

    void updateAdminStatus();

    const subscription = supabase?.auth.onAuthStateChange(() => {
      void updateAdminStatus();
    });

    return () => {
      mounted = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  function handleSignOut() {
    signOutTempStudent();
    setSession(null);
    setOpen(false);
  }

  const sessionLabel = session?.fullName ?? "Guest";
  const sessionAccent = session?.major ?? "Not signed in";
  const sessionInitials =
    session?.fullName
      ?.split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "G";

  return (
    <header
      className={cn(
        "premium-navbar sticky top-0 z-50 border-b border-white/10 transition-shadow duration-300",
        scrolled && "shadow-[0_18px_46px_-34px_oklch(0.25_0.08_264_/_0.7)]",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={BRAND_NAME}
          onClick={() => setOpen(false)}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]">
            <BrandLogo compact imageClassName="h-8 w-8 rounded-full" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-lg font-black uppercase tracking-[0.28em] text-white">
              MURSHIDI
            </span>
            <span className="truncate text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/60">
              Your smart university assistant
            </span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="premium-nav-link rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              activeProps={{
                className: "premium-nav-link bg-white/8 text-white",
                "data-status": "active",
              }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="premium-nav-action inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/12"
            aria-label={t("language.switchTo")}
          >
            <Languages className="h-4 w-4" />
            {nextLanguageLabel}
          </button>
          {session ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_100%)] text-sm font-black text-white">
                {sessionInitials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{sessionLabel}</p>
                <p className="truncate text-[0.7rem] uppercase tracking-[0.18em] text-white/55">
                  {sessionAccent}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/12 hover:text-white"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-white/10 bg-white/6 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
          <Link
            to="/chatbot"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_45px_-24px_rgba(59,130,246,0.8)] transition-transform hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#070b16]/95 backdrop-blur lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {visibleNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="premium-nav-link rounded-2xl px-3 py-2.5 text-sm font-medium text-white/72 transition-colors hover:bg-white/8 hover:text-white"
                activeProps={{
                  className: "premium-nav-link bg-white/8 text-white",
                  "data-status": "active",
                }}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleLanguage}
              className="premium-nav-action mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/12"
              aria-label={t("language.switchTo")}
            >
              <Languages className="h-4 w-4" />
              {nextLanguageLabel}
            </button>
            {session ? (
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_100%)] text-sm font-black text-white">
                  {sessionInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{sessionLabel}</p>
                  <p className="truncate text-[0.7rem] uppercase tracking-[0.18em] text-white/55">
                    {sessionAccent}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/12 hover:text-white"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Login
              </Link>
            )}
            <Link
              to="/chatbot"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#8b5cf6_0%,#2563eb_100%)] px-4 py-3 text-sm font-semibold text-white"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <BrandLogo compact imageClassName="h-8 w-8 rounded-lg" />
          <p className="text-sm font-medium text-foreground">{t("footer.tagline")}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}

export function PageLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className={cn("flex-1 bg-background", className)}>{children}</main>
      <Footer />
    </div>
  );
}
