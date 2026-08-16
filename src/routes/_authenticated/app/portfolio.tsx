import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCode2,
  FileSpreadsheet,
  FolderOpen,
  Printer,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDay, formatTime, sumHours } from "@/lib/docko";
import { meQuery, myEntriesQuery, myTeamsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

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

function PortfolioPage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: entries } = useQuery(myEntriesQuery);
  const { data: teams } = useQuery(myTeamsQuery);

  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (me?.fullName) {
      setName(me.fullName);
    }
  }, [me?.fullName]);

  const updateName = useMutation({
    mutationFn: async () => {
      if (!me) throw new Error("Not loaded");
      if (me.hasChangedName) throw new Error("Name already changed once.");
      
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim(), has_changed_name: true })
        .eq("id", me.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Name updated successfully!");
      setIsEditingName(false);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const verified = mine.filter((entry) => entry.status === "verified");
  const pending = mine.filter((entry) => entry.status === "pending");

  const studentId = me?.id || "student-preview-id";
  const studentName = me?.fullName || "Fieldwork Student";
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
      {/* 0. Personal Details Inline */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {!isEditingName ? (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">{me?.fullName}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              onClick={() => setIsEditingName(true)}
            >
              <Edit2 className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 w-full max-w-sm">
            <div className="flex gap-2">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={me?.hasChangedName || updateName.isPending}
                className="rounded-2xl h-9 text-sm flex-1 font-bold"
                placeholder="Enter your full name"
              />
              {!me?.hasChangedName && (
                <Button 
                  onClick={() => name.trim() !== me?.fullName && updateName.mutate()}
                  disabled={name.trim() === me?.fullName || !name.trim() || updateName.isPending}
                  className="press rounded-2xl h-9 px-3 text-xs"
                >
                  Save
                </Button>
              )}
              <Button 
                variant="ghost"
                onClick={() => {
                  setName(me?.fullName ?? "");
                  setIsEditingName(false);
                }}
                className="press rounded-2xl h-9 px-3 text-xs text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
            {me?.hasChangedName ? (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
                <AlertCircle className="size-3 text-warning shrink-0" />
                Already changed once. Contact support.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
                <CheckCircle2 className="size-3 text-success shrink-0" />
                Can be changed exactly once.
              </p>
            )}
          </div>
        )}
      </div>

      {/* 1. Header Metrics Grid */}
      <BentoGrid className="mb-8">
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







      {/* 5. My Teams & Mentors */}
      <div className="mt-8">
        <SectionTitle
          title="My Teams & Mentors"
          hint="Teams you are currently enrolled in and the mentors leading them."
        />
        {(!teams || teams.length === 0) ? (
          <EmptyState
            icon={<ShieldCheck className="size-5" />}
            title="No active teams"
            body="You are not part of any field teams yet."
          />
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-border">
              {teams.map((team: any) => (
                <li key={team.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold shrink-0 uppercase">
                      {team.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{team.name}</h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/70">Mentor:</span>
                        {team.mentor?.full_name ?? "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 self-end sm:self-center">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="press rounded-2xl text-xs h-8 px-3 font-semibold text-destructive hover:bg-destructive/10"
                      onClick={async () => {
                        const loadingToast = toast.loading("Leaving team...");
                        try {
                          const { error } = await supabase.rpc('leave_team', { _team_id: team.id });
                          if (error) throw error;
                          toast.success("Successfully left team", { id: loadingToast });
                          queryClient.invalidateQueries({ queryKey: ["teams", "mine"] });
                        } catch (err: any) {
                          toast.error(err.message || "Failed to leave team", { id: loadingToast });
                        }
                      }}
                    >
                      Leave Team
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
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
