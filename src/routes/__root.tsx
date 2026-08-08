import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { DevToolbar } from "@/components/docko/dev-toolbar";
import { Toaster } from "@/components/ui/sonner";
import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NotFoundPage } from "./404";
import {
  AlertCircle,
  CalendarClock,
  FolderOpen,
  Home,
  LayoutDashboard,
  MapPin,
  PenLine,
  RefreshCw,
  Wrench,
} from "lucide-react";

function NotFoundComponent() {
  return <NotFoundPage />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("[Application Error Caught]:", error);
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const navLinks = [
    { to: "/app", label: "Today", icon: <LayoutDashboard className="size-4" /> },
    { to: "/app/log", label: "New log", icon: <PenLine className="size-4" /> },
    { to: "/app/timeline", label: "Timeline", icon: <CalendarClock className="size-4" /> },
    { to: "/app/map", label: "Map", icon: <MapPin className="size-4" /> },
    { to: "/app/portfolio", label: "Portfolio", icon: <FolderOpen className="size-4" /> },
  ].filter((item) => item.to !== currentPath && item.to !== currentPath.replace(/\/$/, ""));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Navigation Bar spanning full width corners */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="press rounded-2xl text-xs">
            <Link to="/app">
              <Home className="size-3.5 mr-1.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Error Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-2xl w-full mx-auto space-y-6">
        <BentoCard className="p-6 sm:p-8 space-y-5 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Temporary Issue Loading This Page
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              This specific view ran into a snag, but all other pages and your saved logs are completely safe.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              size="sm"
              className="press rounded-2xl px-5 text-xs font-semibold gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Try Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.reload();
              }}
              className="press rounded-2xl px-4 text-xs font-semibold"
            >
              Hard Reload
            </Button>
          </div>

          {/* Fallback Navigation Grid */}
          <div className="pt-4 border-t border-border/50 text-left space-y-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
              Navigate to Another Page:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 p-2.5 rounded-xl raised hover:bg-accent/50 transition-colors text-xs font-medium text-foreground"
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Collapsible details for dev debugging */}
          {error?.message ? (
            <details className="text-left text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl">
              <summary className="cursor-pointer font-semibold text-muted-foreground hover:text-foreground">
                Technical Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] text-destructive/80 overflow-x-auto">
                {error.message}
              </pre>
            </details>
          ) : null}
        </BentoCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground py-2">
        &copy; {new Date().getFullYear()} docko. Academic Fieldwork & Journaling Integrity.
      </footer>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "docko. — Track your academic journey with daily verified achievements" },
      {
        name: "description",
        content:
          "docko. helps students track any academic journey, project, or lab work. Log daily milestones with real evidence and get your achievements verified every day by mentors.",
      },
      { name: "author", content: "docko." },
      { property: "og:title", content: "docko. — Track your academic journey with daily verified achievements" },
      {
        property: "og:description",
        content:
          "Capture daily milestones, lab photos, and project progress. Faculty and mentors verify your achievements every day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&family=Sora:wght@400;600;700;800&display=swap",
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event === "SIGNED_OUT") {
        queryClient.clear();
        return;
      }
      queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <DevToolbar />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
