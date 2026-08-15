import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCode2,
  FileSpreadsheet,
  FolderOpen,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import {
  BentoCard,
  BentoGrid,
  EmptyState,
  ProgressRing,
  SectionTitle,
  StatTile,
} from "@/components/docko/bento";
import { QrCodeCard } from "@/components/docko/qr-code-card";
import { Button } from "@/components/ui/button";
import { formatDay, formatTime, sumHours } from "@/lib/docko";
import { meQuery, myEntriesQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio · Docko" },
      {
        name: "description",
        content: "An audit-ready summary of your verified fieldwork hours, credentials, and supervisor pairings.",
      },
      { property: "og:title", content: "Portfolio · Docko" },
      { property: "og:description", content: "Audit-ready summary of your verified fieldwork." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

interface MentorRelationship {
  id: string;
  name: string;
  role: string;
  email: string;
  institution: string;
  status: "active" | "pending";
  avgTurnaroundHours: number;
  approvedCount: number;
  avatarLetter: string;
}

interface TeamAffiliation {
  id: string;
  code: string;
  name: string;
  lead: string;
  membersCount: number;
  geofenceRadius: number;
  workspaceName: string;
}

export default function PortfolioPage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries } = useQuery(myEntriesQuery);

  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const verified = mine.filter((entry) => entry.status === "verified");
  const pending = mine.filter((entry) => entry.status === "pending");

  const studentId = me?.id || "student-preview-id";
  const studentName = me?.full_name || "Fieldwork Student";
  const studentInstitution = me?.institution || "Metropolitan Engineering Institute";







  // 4. Skills & Competencies Breakdown
  const totalVerifiedHours = Number(sumHours(verified)) || 0;
  const targetRequirementHours = 120;
  const targetProgressPercent = Math.min(100, Math.round((totalVerifiedHours / targetRequirementHours) * 100));



  // Export handlers
  function exportCsv() {
    const rows = [
      ["Date", "Title", "Hours", "Status", "Latitude", "Longitude", "Location", "Notes"],
      ...mine.map((entry) => [
        new Date(entry.captured_at).toISOString(),
        entry.title,
        String(Number(entry.hours)),
        entry.status,
        entry.latitude ? String(entry.latitude) : "",
        entry.longitude ? String(entry.longitude) : "",
        entry.address ?? "",
        (entry.note ?? "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `docko-portfolio-${studentName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV audit report exported successfully.");
  }

  function exportGeoJson() {
    const featureCollection = {
      type: "FeatureCollection",
      features: mine
        .filter((e) => e.latitude && e.longitude)
        .map((entry) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(entry.longitude), Number(entry.latitude)],
          },
          properties: {
            id: entry.id,
            title: entry.title,
            hours: Number(entry.hours),
            status: entry.status,
            captured_at: entry.captured_at,
            address: entry.address,
            note: entry.note,
            student_id: entry.student_id,
            verified: entry.status === "verified",
          },
        })),
    };

    const jsonStr = JSON.stringify(featureCollection, null, 2);
    const url = URL.createObjectURL(new Blob([jsonStr], { type: "application/geo+json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `docko-fieldwork-geodata-${studentName.toLowerCase().replace(/\s+/g, "-")}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("GeoJSON fieldwork dataset exported.");
  }



  const publicUrl = `https://docko.app/p/@${studentName.toLowerCase().replace(/\s+/g, "")}`;

  return (
    <AppShell
      title="Portfolio & Credential Hub"
      subtitle={studentInstitution}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCsv} className="press rounded-2xl h-9 px-3 text-xs font-semibold">
            <FileSpreadsheet className="size-4" />
            <span className="hidden sm:inline">CSV Export</span>
          </Button>

          <Button variant="outline" onClick={exportGeoJson} className="press rounded-2xl h-9 px-3 text-xs font-semibold">
            <FileCode2 className="size-4" />
            <span className="hidden sm:inline">GeoJSON</span>
          </Button>

          <Button onClick={() => window.print()} className="press rounded-2xl h-9 px-3.5 text-xs font-semibold">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Audit PDF</span>
          </Button>
        </div>
      }
    >
      {/* 1. Header Metrics Grid */}
      <BentoGrid>
        <StatTile
          className="lg:col-span-2"
          label="Verified hours"
          value={sumHours(verified)}
          unit="h"
          hint={`${targetRequirementHours}h Institutional target`}
          icon={<BadgeCheck className="size-4.5" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Verified logs"
          value={verified.length}
          hint={`${pending.length} pending review`}
          icon={<CheckCircle2 className="size-4.5" />}
        />
        <BentoCard className="flex items-center justify-center lg:col-span-2">
          <ProgressRing
            value={mine.length ? (verified.length / mine.length) * 100 : 0}
            sublabel="verified"
          />
        </BentoCard>
      </BentoGrid>

      {/* 2. Dynamic Student ID & Scannable QR Hub */}
      <div className="mt-8">
        <SectionTitle
          title="Student Digital ID & Scannable QR Hub"
          hint="Allow mentors to pair directly via camera or team leads to enroll you in field squads."
        />
        <QrCodeCard studentId={studentId} studentName={studentName} institution={studentInstitution} />
      </div>







      {/* 6. Public Verifiable Portfolio & Privacy Controls */}
      <div className="mt-8">
        <SectionTitle
          title="Public Verifiable Portfolio Link"
          hint="Share your tamper-proof fieldwork profile with prospective employers and accrediting boards."
        />
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shrink-0 shadow-sm">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">Cryptographically Signed Portfolio</h4>
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    GPS-Verified
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">{publicUrl}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("Public portfolio URL copied to clipboard!");
                }}
                className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none"
              >
                <Copy className="size-3.5" />
                <span>Copy Link</span>
              </Button>
              <Button
                size="sm"
                onClick={() => window.open(publicUrl, "_blank")}
                className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none"
              >
                <ExternalLink className="size-3.5" />
                <span>Preview</span>
              </Button>
            </div>
          </div>


        </div>
      </div>

      {/* 7. Itemized Verified Fieldwork Dossier Log */}
      <div className="mt-8">
        <SectionTitle
          title="Verified Fieldwork Record"
          hint="Formal audit register with mentor approvals and timestamps."
        />
        {verified.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-5" />}
            title="No verified logs yet"
            body="Once your mentor signs off a log, it appears in your portfolio and hour totals."
          />
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-border">
              {verified.map((entry) => (
                <li key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      <BadgeCheck className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{entry.title}</h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
                        <span>{formatDay(entry.captured_at)} · {formatTime(entry.captured_at)}</span>
                        {entry.address ? <span>· {entry.address}</span> : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {Number(entry.hours)} Hours
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      Signed Off
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}
