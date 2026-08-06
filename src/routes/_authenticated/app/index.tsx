import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Clock, Flame, PenLine, PlusCircle } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import {
  BentoCard,
  BentoGrid,
  EmptyState,
  MiniBars,
  ProgressRing,
  SectionTitle,
  SkeletonTile,
  StatTile,
} from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Button } from "@/components/ui/button";
import { currentStreak, dayKey, sumHours, weeklyActivity } from "@/lib/docko";
import { meQuery, myEntriesQuery, myNudgesQuery, photoUrlsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "Today · Docko" },
      { name: "description", content: "Your field logging streak, hours and pending verifications." },
      { property: "og:title", content: "Today · Docko" },
      { property: "og:description", content: "Your field logging streak, hours and verifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries, isLoading } = useQuery(myEntriesQuery);
  const { data: nudges } = useQuery(myNudgesQuery);

  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const today = mine.filter((entry) => dayKey(entry.captured_at) === dayKey(new Date()));
  const verified = mine.filter((entry) => entry.status === "verified");
  const pending = mine.filter((entry) => entry.status === "pending");
  const recent = mine.slice(0, 4);

  const { data: photos } = useQuery(
    photoUrlsQuery(recent.map((entry) => entry.photo_path).filter((p): p is string => Boolean(p))),
  );

  const verifiedPct = mine.length ? (verified.length / mine.length) * 100 : 0;
  const firstName = me?.fullName.split(" ")[0] ?? "there";

  return (
    <AppShell
      title={`Hey ${firstName}`}
      subtitle={
        today.length > 0
          ? `${today.length} log${today.length > 1 ? "s" : ""} captured today — nice work.`
          : "No log yet today. It takes about twenty seconds."
      }
      actions={
        <Button asChild className="press rounded-2xl">
          <Link to="/app/log">
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">New log</span>
          </Link>
        </Button>
      }
    >
      <BentoGrid className="rise">
        <StatTile
          className="lg:col-span-2"
          label="Streak"
          value={currentStreak(mine)}
          unit="days"
          hint="Consecutive logging days"
          icon={<Flame className="size-4" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Hours logged"
          value={sumHours(mine)}
          unit="h"
          hint={`${mine.length} total logs`}
          icon={<Clock className="size-4" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Awaiting review"
          value={pending.length}
          hint={pending.length === 0 ? "All caught up" : "Your mentor has been notified"}
          icon={<CheckCircle2 className="size-4" />}
        />

        <BentoCard className="lg:col-span-4">
          <SectionTitle title="This week" hint="Logs captured per day" />
          <MiniBars data={weeklyActivity(mine)} />
        </BentoCard>

        <BentoCard className="flex flex-col items-center justify-center gap-3 lg:col-span-2">
          <ProgressRing value={verifiedPct} sublabel="verified" />
          <p className="text-center text-xs text-muted-foreground">
            {verified.length} of {mine.length || 0} logs signed off
          </p>
        </BentoCard>
      </BentoGrid>

      {nudges && nudges.length > 0 ? (
        <BentoCard tone="primary" className="mt-4 flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
            <BellRing className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">
              {(nudges[0]?.sender as { full_name?: string } | null)?.full_name ?? "Your mentor"} nudged
              you
            </p>
            <p className="text-sm text-muted-foreground">{nudges[0]?.message}</p>
          </div>
        </BentoCard>
      ) : null}

      <div className="mt-8">
        <SectionTitle
          title="Recent logs"
          hint="Your latest field entries"
          action={
            <Button asChild variant="ghost" size="sm" className="press rounded-xl">
              <Link to="/app/timeline">View timeline</Link>
            </Button>
          }
        />

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonTile className="h-64" />
            <SkeletonTile className="h-64" />
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<PenLine className="size-5" />}
            title="Your log book is empty"
            body="Capture your first entry with a photo and location — it becomes part of your verified portfolio."
            action={
              <Button asChild className="press rounded-2xl">
                <Link to="/app/log">Create first log</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recent.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
