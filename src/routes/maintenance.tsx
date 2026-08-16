import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HardDrive,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";

type MaintenanceSearch = {
  from?: string;
};

export const Route = createFileRoute("/maintenance")({
  validateSearch: (search: Record<string, unknown>): MaintenanceSearch => {
    const params: MaintenanceSearch = {};
    if (typeof search["from"] === "string") params.from = search["from"];
    return params;
  },
  head: () => ({
    meta: [
      { title: "System Maintenance · Docko" },
      { name: "description", content: "Docko is undergoing scheduled maintenance and upgrades." },
      { property: "og:title", content: "System Maintenance · Docko" },
      { property: "og:description", content: "Docko is undergoing scheduled upgrades." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const { from } = Route.useSearch();
  const [checking, setChecking] = useState(false);

  const navLinks = [
    { to: "/app", label: "Today" },
    { to: "/app/log", label: "New log" },
    { to: "/app/timeline", label: "Timeline" },
    { to: "/app/map", label: "Map" },
    { to: "/app/portfolio", label: "Portfolio" },
  ].filter((item) => {
    if (from && (item.to === from || item.to === from.replace(/\/$/, ""))) return false;
    if (typeof window !== "undefined" && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.pathname === item.to || refUrl.pathname === item.to + "/") return false;
      } catch {
        // ignore
      }
    }
    return true;
  });

  const returnTarget = from && from !== "/app" ? "/app" : (navLinks[0]?.to ?? "/");

  function handleCheckStatus() {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      window.location.href = returnTarget;
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top bar spanning full width corners */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Maintenance in progress
          </span>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-3xl w-full mx-auto space-y-6">
        <BentoCard className="p-6 sm:p-10 space-y-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary shadow-inner">
            <Wrench className="size-8 animate-bounce" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Scheduled System Upgrade
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are enhancing our field journal verification engines, GPS tracking sync, and mentor sign-off pipelines. All your logs, photos, and time records remain completely safe.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="raised rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Clock className="size-3.5" />
                <span>Estimated Uptime</span>
              </div>
              <p className="text-base font-bold text-foreground">~15 minutes</p>
              <p className="text-[10px] text-muted-foreground">Syncing database caches</p>
            </div>

            <div className="raised rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <ShieldCheck className="size-3.5 text-success" />
                <span>Data Integrity</span>
              </div>
              <p className="text-base font-bold text-success">100% Secure</p>
              <p className="text-[10px] text-muted-foreground">Immutable journal storage</p>
            </div>

            <div className="raised rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Activity className="size-3.5 text-primary" />
                <span>System Status</span>
              </div>
              <p className="text-base font-bold text-primary">Upgrading v2.4</p>
              <p className="text-[10px] text-muted-foreground">Rolling deployment</p>
            </div>
          </div>

          {/* Service status list */}
          <div className="space-y-2 text-left pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Subsystem Live Status
            </h2>
            <div className="raised rounded-2xl divide-y divide-border/50 overflow-hidden text-xs">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Encrypted Cloud Storage</span>
                </div>
                <span className="flex items-center gap-1.5 text-success font-semibold text-[11px]">
                  <CheckCircle2 className="size-3.5" /> Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">GPS Location Services</span>
                </div>
                <span className="flex items-center gap-1.5 text-success font-semibold text-[11px]">
                  <CheckCircle2 className="size-3.5" /> Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-500/5">
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="size-4 text-amber-500 animate-spin" />
                  <span className="font-medium text-foreground">Real-time Mentor Verification Sync</span>
                </div>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                  Updating
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/50">
            <Button
              onClick={handleCheckStatus}
              disabled={checking}
              className="press rounded-2xl px-6 gap-2"
            >
              <RefreshCw className={`size-4 ${checking ? "animate-spin" : ""}`} />
              <span>{checking ? "Checking..." : "Check System Status"}</span>
            </Button>
            <Button asChild variant="outline" className="press rounded-2xl px-5">
              <Link to="/app">
                <ArrowLeft className="size-4 mr-1.5" />
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </BentoCard>

        {/* Quick Navigation Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">Need urgent assistance?</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-primary">
            <Link to="/" className="hover:underline">Home</Link>
            {navLinks.map((item) => (
              <span key={item.to} className="flex items-center gap-4">
                <span>·</span>
                <Link to={item.to} className="hover:underline">{item.label}</Link>
              </span>
            ))}
            <span>·</span>
            <a href="mailto:support@docko.app" className="hover:underline">Contact Support</a>
          </div>
        </div>
        </div>
      </main>

      {/* Bottom copyright */}
      <footer className="text-center text-[11px] text-muted-foreground py-2">
        &copy; {new Date().getFullYear()} docko. Academic Fieldwork & Journaling Integrity Platform.
      </footer>
    </div>
  );
}
