import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock, QrCode, Users } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid, MiniBars, SectionTitle, StatTile } from "@/components/docko/bento";
import { ScannerModal } from "@/components/docko/scanner-modal";
import { Button } from "@/components/ui/button";
import { sumHours, weeklyActivity } from "@/lib/docko";
import { reviewQueueQuery, teamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/mentor/")({
  head: () => ({
    meta: [
      { title: "Mentor overview · docko." },
      { name: "description", content: "Review queue, team progress, and active student journals." },
      { property: "og:title", content: "Mentor overview · docko." },
      { property: "og:description", content: "Team activity and pending verifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorOverview,
});

function MentorOverview() {
  const navigate = useNavigate({ from: "/_authenticated/mentor/" });
  const [isScanning, setIsScanning] = useState(false);
  const { data: queue } = useQuery(reviewQueueQuery);
  const { data: teams } = useQuery(teamsQuery);

  const all = queue ?? [];
  const pending = all.filter((entry) => entry.status === "pending");
  const students = new Set(all.map((entry) => entry.student_id));

  return (
    <AppShell
      title="Mentor overview"
      subtitle="Where your students are, at a glance"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="press rounded-2xl" onClick={() => setIsScanning(true)}>
            <QrCode className="size-4 mr-2" />
            Scan Student
          </Button>
          <Button asChild className="press rounded-2xl hidden sm:flex">
            <Link to="/mentor/verify">Review queue</Link>
          </Button>
        </div>
      }
    >
      <ScannerModal
        open={isScanning}
        onOpenChange={setIsScanning}
        title="Scan Student Code"
        description="Scan a student's pairing QR code to become their mentor."
        mockData={all[0]?.student_id ?? "00000000-0000-0000-0000-000000000000"}
        onScan={(data) => {
          navigate({ to: "/mentor/pair", search: { studentId: data } });
        }}
      />
      {/* ── Mobile Stats Layout (phone only) ───────────────────────── */}
      <div className="sm:hidden space-y-3">
        {/* Horizontal stat strip */}
        <div className="raised rounded-3xl p-4 flex items-stretch divide-x divide-border/60 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <CheckCircle2 className="size-3 text-primary" /> Queue
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{pending.length}</span>
              <span className="text-[11px] text-muted-foreground">logs</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <Clock className="size-3 text-primary" /> Hours
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{sumHours(all)}</span>
              <span className="text-[11px] text-muted-foreground">h</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <Users className="size-3 text-primary" /> Students
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{students.size}</span>
              <span className="text-[11px] text-muted-foreground">active</span>
            </div>
          </div>
        </div>

        {/* Activity chart compact */}
        <div className="raised rounded-3xl p-4">
          <p className="text-xs font-semibold text-foreground mb-0.5">Team activity</p>
          <p className="text-[11px] text-muted-foreground mb-3">Logs per day across your students</p>
          <MiniBars data={weeklyActivity(all)} />
        </div>
      </div>

      {/* ── Desktop Stats Layout (sm and above) ─────────────────────── */}
      <BentoGrid className="hidden sm:grid">
        <StatTile
          className="col-span-1 lg:col-span-2"
          label="Awaiting you"
          value={pending.length}
          hint="Logs needing verification"
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatTile
          className="col-span-1 lg:col-span-2"
          label="Total team hours"
          value={sumHours(all)}
          unit="h"
          icon={<Clock className="size-4" />}
        />
        <StatTile
          className="col-span-2 md:col-span-1 lg:col-span-2"
          label="Active students"
          value={students.size}
          hint={`${teams?.length ?? 0} teams`}
          icon={<Users className="size-4" />}
        />
        <BentoCard className="col-span-2 lg:col-span-6">
          <SectionTitle title="Team activity" hint="Logs captured per day across your students" />
          <MiniBars data={weeklyActivity(all)} />
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
