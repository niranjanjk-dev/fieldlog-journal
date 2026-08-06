import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Clock, Flame, ImageOff, PenLine, PlusCircle } from "lucide-react";

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
  StatusChip,
} from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Button } from "@/components/ui/button";
import { currentStreak, dayKey, formatDay, sumHours, weeklyActivity } from "@/lib/docko";
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
      title={`Hey, ${firstName}`}
      actions={
        <Button asChild className="press rounded-full h-9 w-9 p-0 sm:w-auto sm:px-4 gap-1.5 text-sm font-semibold shadow-[var(--shadow-lift)] flex items-center justify-center">
          <Link to="/app/log">
            <PlusCircle className="size-4 shrink-0" />
            <span className="hidden sm:inline">New log</span>
          </Link>
        </Button>
      }
    >
      {/* ── Mobile Stats Layout (phone only, hidden on sm+) ─────────── */}
      <div className="sm:hidden space-y-3 rise rounded-3xl">
        {/* Horizontal stat strip */}
        <div className="raised rounded-3xl p-4 flex items-stretch gap-0 overflow-hidden divide-x divide-border/60">
          {/* Streak */}
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <Flame className="size-3 text-primary" /> Streak
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{currentStreak(mine)}</span>
              <span className="text-[11px] text-muted-foreground">d</span>
            </div>
          </div>
          {/* Hours */}
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <Clock className="size-3 text-primary" /> Hours
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{sumHours(mine)}</span>
              <span className="text-[11px] text-muted-foreground">h</span>
            </div>
          </div>
          {/* Pending */}
          <div className="flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0">
            <span className="flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              <CheckCircle2 className="size-3 text-primary" /> Queue
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold tabular-nums text-foreground">{pending.length}</span>
              <span className="text-[11px] text-muted-foreground">pending</span>
            </div>
          </div>
        </div>

        {/* Chart + Ring in a single compact card */}
        <div className="raised rounded-3xl p-4 flex items-center gap-4">
          {/* Mini Bars — takes most space */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground mb-0.5">This week</p>
            <p className="text-[11px] text-muted-foreground mb-3">Logs per day</p>
            <MiniBars data={weeklyActivity(mine)} />
          </div>
          {/* Divider */}
          <div className="w-px self-stretch bg-border/60 shrink-0" />
          {/* Progress ring — compact */}
          <div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
            <ProgressRing value={verifiedPct} size={48} label="" />
            <div className="text-center">
              <span className="block text-sm font-bold text-foreground">{Math.round(verifiedPct)}%</span>
              <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop Stats Layout (sm and above) ─────────────────────── */}
      <BentoGrid className="rise hidden sm:grid">
        <StatTile
          className="col-span-1 lg:col-span-2"
          label="Streak"
          value={currentStreak(mine)}
          unit="days"
          hint="Consecutive logging days"
          icon={<Flame className="size-4" />}
        />
        <StatTile
          className="col-span-1 lg:col-span-2"
          label="Hours logged"
          value={sumHours(mine)}
          unit="h"
          hint={`${mine.length} total logs`}
          icon={<Clock className="size-4" />}
        />
        <StatTile
          className="col-span-2 md:col-span-1 lg:col-span-2"
          label="Awaiting review"
          value={pending.length}
          hint={pending.length === 0 ? "All caught up" : "Your mentor has been notified"}
          icon={<CheckCircle2 className="size-4" />}
        />

        <BentoCard className="col-span-2 md:col-span-2 lg:col-span-4">
          <SectionTitle title="This week" hint="Logs captured per day" />
          <MiniBars data={weeklyActivity(mine)} />
        </BentoCard>

        <BentoCard className="col-span-2 md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center gap-3">
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

      <div className="mt-6">
        <SectionTitle
          title="Recent logs"
          hint="Your latest field entries"
          action={
            <Button asChild variant="ghost" size="sm" className="press rounded-xl">
              <Link to="/app/timeline">View all</Link>
            </Button>
          }
        />

        {isLoading ? (
          <>
            {/* Mobile skeleton */}
            <div className="sm:hidden raised rounded-2xl overflow-hidden divide-y divide-border/50">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                  <div className="size-9 shrink-0 rounded-xl bg-muted/70" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded bg-muted/70" />
                    <div className="h-2.5 w-1/2 rounded bg-muted/60" />
                  </div>
                  <div className="h-5 w-14 rounded-full bg-muted/60" />
                </div>
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden sm:grid gap-4 sm:grid-cols-2">
              <SkeletonTile className="h-64" />
              <SkeletonTile className="h-64" />
            </div>
          </>
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
          <>
            {/* ── Mobile: compact list rows ────────────────────────────── */}
            <div className="sm:hidden raised rounded-2xl overflow-hidden divide-y divide-border/50">
              {recent.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
                  {/* Photo thumb or placeholder */}
                  <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-muted">
                    {entry.photo_path && photos?.[entry.photo_path] ? (
                      <img
                        src={photos[entry.photo_path]}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full grid place-items-center text-muted-foreground/50">
                        <ImageOff className="size-4" />
                      </div>
                    )}
                  </div>
                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDay(entry.captured_at)} · {Number(entry.hours)}h
                    </p>
                  </div>
                  {/* Status chip */}
                  <StatusChip status={entry.status} />
                </div>
              ))}
            </div>

            {/* ── Desktop: full entry cards ─────────────────────────────── */}
            <div className="hidden sm:grid gap-4 sm:grid-cols-2">
              {recent.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
