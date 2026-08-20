import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  FolderOpen,
  Globe,
  HardHat,
  MapPin,
  PieChart,
  Printer,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

import { DockoLogo } from "@/components/docko/app-shell";
import { SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { formatDay, formatTime, sumHours } from "@/lib/docko";
import { publicProfileQuery } from "@/lib/queries";

export const Route = createFileRoute("/p/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `Verified Fieldwork Portfolio (${params.handle}) · Docko` },
      {
        name: "description",
        content: "Cryptographically verified academic fieldwork hours, logs, and supervisor sign-offs.",
      },
      { property: "og:title", content: `Verified Fieldwork Portfolio (${params.handle}) · Docko` },
      { property: "og:description", content: "Cryptographically verified fieldwork hours and logs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicPortfolioPage,
});

function PublicPortfolioPage() {
  const { handle } = Route.useParams();
  const cleanHandle = handle.replace(/^@/, "");
  
  const { data } = useQuery(publicProfileQuery(cleanHandle));
  
  const profile = data?.profile;
  const verified = data?.entries ?? [];

  const formattedName = profile?.full_name ?? (cleanHandle
    ? cleanHandle
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Fieldwork Researcher");
    
  const institution = profile?.institution ?? "Metropolitan Engineering Institute";

  const totalVerifiedHours = Number(sumHours(verified)) || 0;

  // Calculate category breakdowns
  const categoryHours = verified.reduce((acc, entry) => {
    const cat = entry.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(entry.hours);
    return acc;
  }, {} as Record<string, number>);

  const categoryBreakdown = Object.entries(categoryHours)
    .map(([category, hours]) => ({
      category,
      hours,
      percentage: totalVerifiedHours > 0 ? Math.round((hours / totalVerifiedHours) * 100) : 0,
    }))
    .sort((a, b) => b.hours - a.hours);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories ? categoryBreakdown : categoryBreakdown.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="press rounded-2xl text-xs font-semibold">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Content Area - Coming Soon */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="size-10" />
          </div>
          
          <div className="space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Coming Soon
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Public verifiable portfolios are currently under construction. Soon, you will be able to share your tamper-proof fieldwork profile with prospective employers and accrediting boards right here.
            </p>
          </div>

          <div className="pt-4">
            <Button asChild className="press h-11 px-8 rounded-2xl font-bold shadow-[var(--shadow-lift)]">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-muted-foreground py-4 border-t border-border/40">
        &copy; {new Date().getFullYear()} docko. Cryptographic Fieldwork Integrity Protocol.
      </footer>
    </div>
  );
}
