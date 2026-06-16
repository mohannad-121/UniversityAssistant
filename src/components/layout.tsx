import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Languages, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/lib/supabase";
import { isCurrentUserAdmin } from "@/lib/university-data";
import { BrandLogo } from "@/components/brand-logo";
import { BRAND_NAME } from "@/lib/brand";

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
  const { language, toggleLanguage, t } = useLanguage();
  const nextLanguageLabel = language === "en" ? t("language.arabic") : t("language.english");
  const getNavLabel = (labelKey: (typeof navItems)[number]["labelKey"]) =>
    labelKey === "nav.login"
      ? language === "ar"
        ? "تسجيل الدخول"
        : "Login"
      : labelKey === "nav.registration"
        ? language === "ar"
          ? "تسجيل المواد"
          : "Registration"
        : t(labelKey);

  const visibleNavItems = navItems.filter((item) => item.to !== "/admin" || isAdmin);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
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

  return (
    <header
      className={cn(
        "premium-navbar sticky top-0 z-50 border-b border-border/60 transition-shadow duration-300",
        scrolled && "shadow-[0_18px_46px_-34px_oklch(0.25_0.08_264_/_0.7)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5"
          aria-label={BRAND_NAME}
          onClick={() => setOpen(false)}
        >
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="premium-nav-link rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              activeProps={{
                className: "premium-nav-link bg-secondary/80 text-foreground",
                "data-status": "active",
              }}
            >
              {getNavLabel(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="premium-nav-action inline-flex h-9 items-center gap-2 rounded-lg border border-border/80 bg-card/85 px-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            aria-label={t("language.switchTo")}
          >
            <Languages className="h-4 w-4" />
            {nextLanguageLabel}
          </button>
          <Button asChild size="sm" className="premium-nav-action">
            <Link to="/chatbot">{t("nav.startChatting")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-foreground hover:bg-secondary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={t("nav.menu")}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {visibleNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={() => setOpen(false)}
                className="premium-nav-link rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: "premium-nav-link bg-secondary text-foreground",
                  "data-status": "active",
                }}
              >
                {getNavLabel(item.labelKey)}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleLanguage}
              className="premium-nav-action mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              aria-label={t("language.switchTo")}
            >
              <Languages className="h-4 w-4" />
              {nextLanguageLabel}
            </button>
            <Button asChild size="sm" className="mt-2">
              <Link to="/chatbot" onClick={() => setOpen(false)}>
                {t("nav.startChatting")}
              </Link>
            </Button>
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


