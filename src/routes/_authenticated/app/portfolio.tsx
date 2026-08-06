import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FolderOpen, Printer } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import {
  BentoCard,
  BentoGrid,
  EmptyState,
  ProgressRing,
  SectionTitle,
  StatTile,
} from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { formatDay, sumHours } from "@/lib/docko";
import { meQuery, myEntriesQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio · Docko" },
      {
        name: "description",
        content: "An audit-ready summary of your verified fieldwork hours and logs.",
      },
      { property: "og:title", content: "Portfolio · Docko" },
      { property: "og:description", content: "Audit-ready summary of your verified fieldwork." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries } = useQuery(myEntriesQuery);
  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const verified = mine.filter((entry) => entry.status === "verified");

  function exportCsv() {
    const rows = [
      ["Date", "Title", "Hours", "Status", "Location", "Notes"],
      ...mine.map((entry) => [
        new Date(entry.captured_at).toISOString(),
        entry.title,
        String(Number(entry.hours)),
        entry.status,
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
    link.download = "docko-portfolio.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="Portfolio"
      subtitle={me?.institution ?? "Your verified fieldwork record"}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} className="press rounded-2xl">
            <Download className="size-4" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button onClick={() => window.print()} className="press rounded-2xl">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      }
    >
      <BentoGrid>
        <StatTile className="lg:col-span-2" label="Verified hours" value={sumHours(verified)} unit="h" />
        <StatTile className="lg:col-span-2" label="Verified logs" value={verified.length} />
        <BentoCard className="flex items-center justify-center lg:col-span-2">
          <ProgressRing
            value={mine.length ? (verified.length / mine.length) * 100 : 0}
            sublabel="verified"
          />
        </BentoCard>
      </BentoGrid>

      <div className="mt-8">
        <SectionTitle title="Verified record" hint="Only mentor-signed logs are included." />
        {verified.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-5" />}
            title="No verified logs yet"
            body="Once your mentor signs off a log, it appears in your portfolio and hour totals."
          />
        ) : (
          <BentoCard className="p-0 sm:p-0">
            <ul className="divide-y divide-border">
              {verified.map((entry) => (
                <li key={entry.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground">
                    {formatDay(entry.captured_at)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{entry.title}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {Number(entry.hours)} h
                  </span>
                </li>
              ))}
            </ul>
          </BentoCard>
        )}
      </div>
    </AppShell>
  );
}
