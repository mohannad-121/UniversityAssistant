import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "@/lib/language";
import { BRAND_FAVICON_SRC, BRAND_NAME } from "@/lib/brand";
import { getStoredStudentSession } from "@/lib/student-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND_NAME} - Smart University Chatbot` },
      {
        name: "description",
        content:
          `${BRAND_NAME} is a smart university assistant. Ask about courses, prerequisites, instructors, departments, offices, and student services.`,
      },
      { name: "author", content: BRAND_NAME },
      { property: "og:title", content: `${BRAND_NAME} - Smart University Chatbot` },
      {
        property: "og:description",
        content:
          "Your smart university assistant for courses, prerequisites, instructors, departments and services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: BRAND_FAVICON_SRC },
      { rel: "apple-touch-icon", href: BRAND_FAVICON_SRC },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthGate>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AuthGate>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    setHasSession(Boolean(getStoredStudentSession()));
    setChecking(false);

    const update = () => {
      setHasSession(Boolean(getStoredStudentSession()));
    };

    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  useEffect(() => {
    if (checking) return;

    const publicRoute = pathname === "/" || pathname === "/login" || pathname === "/signup";

    if (!hasSession && !publicRoute) {
      void router.navigate({ to: "/login", replace: true });
    }
  }, [checking, hasSession, pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030714] text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full border border-white/10 bg-white/5" />
          <p className="mt-4 text-sm text-white/70">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasSession && pathname !== "/" && pathname !== "/login" && pathname !== "/signup") {
    return null;
  }

  return children;
}
