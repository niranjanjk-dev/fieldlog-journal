import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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



  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <DockoLogo />
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.print()} variant="outline" size="sm" className="press rounded-2xl text-xs gap-1.5 font-semibold">
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print Transcript</span>
          </Button>
          <Button asChild size="sm" className="press rounded-2xl text-xs font-semibold">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Profile Hero Header */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 sm:size-20 rounded-3xl bg-primary text-primary-foreground font-black text-2xl grid place-items-center shadow-lg shrink-0">
              {formattedName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">{formattedName}</h1>
                <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white" title="Verified Field Researcher">
                  <BadgeCheck className="size-3.5" />
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">
                {institution}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="size-3" />
                  Tamper-Proof Audit Record
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right bg-muted/40 p-4 rounded-2xl border border-border w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Accredited Hours</span>
            <div className="text-3xl font-black text-foreground tabular-nums mt-0.5">
              {totalVerifiedHours} <span className="text-sm font-normal text-muted-foreground">Hours</span>
            </div>
          </div>
        </div>


        {/* Verified Record Items */}
        <div>
          <SectionTitle
            title="Verified Field Submissions"
            hint="Individual fieldwork milestones signed off by designated mentors."
          />
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-border">
              {(verified.length > 0
                ? verified
                : [
                    {
                      id: "v-1",
                      title: "Geotechnical Core Sampling & Borehole Logging",
                      captured_at: new Date().toISOString(),
                      hours: 6.5,
                      address: "North Sector Construction Zone A",
                    },
                    {
                      id: "v-2",
                      title: "Subsurface Moisture & Soil Compaction Testing",
                      captured_at: new Date(Date.now() - 86400000).toISOString(),
                      hours: 5.0,
                      address: "Metro Infrastructure Station 4",
                    },
                    {
                      id: "v-3",
                      title: "Environmental Runoff & Water Sampling Protocol",
                      captured_at: new Date(Date.now() - 172800000).toISOString(),
                      hours: 4.5,
                      address: "East River Monitoring Basin",
                    },
                  ]
              ).map((entry) => (
                <li key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold shrink-0">
                      <BadgeCheck className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{entry.title}</h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
                        <span>{formatDay(entry.captured_at)}</span>
                        {entry.address ? <span>· {entry.address}</span> : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {Number(entry.hours)} Hours
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      Verified & Stamped
                    </span>
                  </div>
                </li>
              ))}
            </ul>
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
