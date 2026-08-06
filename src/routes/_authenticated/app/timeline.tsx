import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarClock, PlusCircle } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { EmptyState, SkeletonTile } from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Button } from "@/components/ui/button";
import { dayKey, formatDay, sumHours, type EntryStatus } from "@/lib/docko";
import { meQuery, myEntriesQuery, photoUrlsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline · Docko" },
      { name: "description", content: "Every field log you have captured, grouped by day." },
      { property: "og:title", content: "Timeline · Docko" },
      { property: "og:description", content: "Every field log you have captured, grouped by day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

const filters: { key: EntryStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Awaiting review" },
  { key: "verified", label: "Verified" },
  { key: "rejected", label: "Needs changes" },
];

function TimelinePage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries, isLoading } = useQuery(myEntriesQuery);
  const [filter, setFilter] = useState<EntryStatus | "all">("all");

  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const visible = filter === "all" ? mine : mine.filter((entry) => entry.status === filter);

  const { data: photos } = useQuery(
    photoUrlsQuery(
      visible.slice(0, 40).map((entry) => entry.photo_path).filter((p): p is string => Boolean(p)),
    ),
  );

  const groups = new Map<string, typeof visible>();
  for (const entry of visible) {
    const key = dayKey(entry.captured_at);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }

  return (
    <AppShell
      title="Timeline"
      subtitle={`${mine.length} logs · ${sumHours(mine)} hours recorded`}
      actions={
        <Button asChild className="press rounded-2xl">
          <Link to="/app/log">
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">New log</span>
          </Link>
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={cn(
              "press rounded-2xl border px-3.5 py-1.5 text-sm font-medium",
              filter === item.key
                ? "border-primary bg-primary-soft text-primary"
                : "border-border hover:bg-accent",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTile className="h-64" />
          <SkeletonTile className="h-64" />
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="size-5" />}
          title="Nothing here yet"
          body={
            filter === "all"
              ? "Your logs will appear here as you capture them."
              : "No logs match this filter right now."
          }
          action={
            <Button asChild className="press rounded-2xl">
              <Link to="/app/log">Create a log</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([key, dayEntries]) => (
            <section key={key} className="rise">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-sm font-semibold">
                  {formatDay(dayEntries[0]!.captured_at)}
                </h2>
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  {dayEntries.length} log{dayEntries.length > 1 ? "s" : ""} · {sumHours(dayEntries)} h
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {dayEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}
