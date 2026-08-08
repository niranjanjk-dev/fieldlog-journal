import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  Compass,
  FolderOpen,
  HelpCircle,
  Home,
  LayoutDashboard,
  MapPin,
  PenLine,
  Search,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page Not Found (404) · Docko" },
      { name: "description", content: "The requested fieldlog page could not be located." },
      { property: "og:title", content: "Page Not Found · Docko" },
      { property: "og:description", content: "Explore other pages in the Docko Field Journal platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotFoundPage,
});

export function NotFoundPage() {
  const [filter, setFilter] = useState("");

  const quickLinks = [
    {
      to: "/app",
      title: "Today",
      desc: "View your active streak, total hours, and review status.",
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      to: "/app/log",
      title: "New log",
      desc: "Capture a field entry with GPS coordinates and photo evidence.",
      icon: <PenLine className="size-4" />,
    },
    {
      to: "/app/timeline",
      title: "Timeline",
      desc: "Browse past journal logs, weekly activity, and filter by date.",
      icon: <CalendarClock className="size-4" />,
    },
    {
      to: "/app/map",
      title: "Map",
      desc: "See all your logs pinned on the interactive map.",
      icon: <MapPin className="size-4" />,
    },
    {
      to: "/app/portfolio",
      title: "Portfolio",
      desc: "View audit-ready verified records and download official CSV logs.",
      icon: <FolderOpen className="size-4" />,
    },
  ];

  const filteredLinks = quickLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(filter.toLowerCase()) ||
      link.desc.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Header spanning full width corners */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="press rounded-2xl text-xs">
            <Link to="/app">
              <Home className="size-3.5 mr-1.5" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-3xl w-full mx-auto space-y-6">
        <BentoCard className="p-6 sm:p-10 space-y-6 text-center">
          {/* Big 404 badge */}
          <div className="relative inline-flex items-center justify-center">
            <span className="text-7xl sm:text-8xl font-black tracking-tighter text-primary/20 select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Compass className="size-6 animate-spin" style={{ animationDuration: "12s" }} />
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Off the Beaten Path
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We couldn't find the page or log you were looking for. Use the directory below to jump straight to any part of your journal.
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search destination pages..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-2xl bg-muted/30 text-sm focus-visible:ring-primary"
            />
          </div>

          {/* Quick Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            {filteredLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-3.5 p-3.5 rounded-2xl raised hover:bg-accent/40 transition-all border border-border/50 hover:border-primary/40"
              >
                <div className="size-10 rounded-xl grid place-items-center bg-muted/60 shrink-0 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      &rarr;
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="press rounded-2xl px-5 text-xs font-semibold"
            >
              <ArrowLeft className="size-3.5 mr-1.5" />
              Back to Previous Page
            </Button>
          </div>
        </BentoCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground py-2">
        &copy; {new Date().getFullYear()} docko. Field Journal Integrity Platform.
      </footer>
    </div>
  );
}
