import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  ImageOff,
  PenLine,
  PlusCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currentStreak, formatDay, sumHours, weeklyActivity } from "@/lib/docko";
import { meQuery, myEntriesQuery, myNudgesQuery, photoUrlsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

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
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const mine = (entries ?? []).filter((entry) => Boolean(entry) && (!me?.id || entry.student_id === me.id));
  const verified = mine.filter((entry) => entry.status === "verified");
  const pending = mine.filter((entry) => entry.status === "pending");
  const recent = mine.slice(0, 4);

  const { data: photos } = useQuery(
    photoUrlsQuery(
      recent.map((entry) => entry?.photo_path).filter((p): p is string => Boolean(p)),
    ),
  );

  const activityData = weeklyActivity(mine);
  const totalWeekHours = Math.round(activityData.reduce((acc, d) => acc + (d.hours ?? 0), 0) * 10) / 10;
  const activeDaysCount = activityData.filter((d) => (d.hours ?? 0) > 0).length;
  const totalWeekLogs = activityData.reduce((acc, d) => acc + d.logs, 0);
  const avgHours = activeDaysCount > 0 ? (totalWeekHours / activeDaysCount).toFixed(1) : "0.0";

  const verifiedPct = mine.length ? (verified.length / mine.length) * 100 : 0;
  const firstName = me?.fullName ? me.fullName.split(" ")[0] : "there";

  return (
    <AppShell
      title={`Hey, ${firstName}`}
      actions={
        <Button
          asChild
          className="press rounded-full h-9 w-9 p-0 sm:w-auto sm:px-4 gap-1.5 text-sm font-semibold shadow-[var(--shadow-lift)] flex items-center justify-center"
        >
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
        <div className="grid grid-cols-2 gap-2">
          {/* Streak pill */}
          <div className="raised rounded-2xl p-3 flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Flame className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="text-base font-bold leading-tight tabular-nums text-foreground">
                {currentStreak(mine)}
                <span className="text-[11px] font-normal text-muted-foreground ml-0.5">days</span>
              </div>
              <div className="text-[10px] text-muted-foreground truncate">Active streak</div>
            </div>
          </div>

          {/* Hours pill */}
          <div className="raised rounded-2xl p-3 flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Clock className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="text-base font-bold leading-tight tabular-nums text-foreground">
                {sumHours(mine)}
                <span className="text-[11px] font-normal text-muted-foreground ml-0.5">h</span>
              </div>
              <div className="text-[10px] text-muted-foreground truncate">{mine.length} logs total</div>
            </div>
          </div>
        </div>

        {/* Verification banner with compact progress ring */}
        <div className="raised rounded-2xl p-3.5 flex items-center gap-3">
          <div className="shrink-0 flex flex-col items-center">
            <ProgressRing value={verifiedPct} size={48} label="" />
            <span className="text-[10px] font-semibold text-primary mt-1">
              {Math.round(verifiedPct)}% verified
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground">
              {verified.length} of {mine.length || 0} signed off
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {pending.length === 0
                ? "All caught up"
                : `${pending.length} log${pending.length > 1 ? "s" : ""} awaiting mentor review`}
            </div>
          </div>
        </div>

        {/* Weekly activity mini card */}
        <div className="raised rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold text-foreground">This week</span>
              <span className="text-[10px] text-muted-foreground ml-1.5">· Hours per day</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAnalyticsOpen(true)}
              className="press rounded-xl text-[11px] h-6 px-2 text-primary hover:text-primary gap-1"
            >
              Peek
              <ArrowUpRight className="size-3" />
            </Button>
          </div>
          <MiniBars data={activityData} />
        </div>
      </div>

      {/* ── Desktop Bento Grid (hidden on mobile, visible on sm+) ───── */}
      <BentoGrid className="hidden sm:grid">
        <StatTile
          className="col-span-1 lg:col-span-2"
          label="Day streak"
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

        <BentoCard className="col-span-2 md:col-span-2 lg:col-span-4 relative">
          <div className="flex items-center justify-between">
            <SectionTitle title="This week" hint="Hours logged per day" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAnalyticsOpen(true)}
              className="press rounded-xl text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1"
            >
              <span className="hidden sm:inline text-[11px]">Center Peek</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
          <MiniBars data={activityData} />
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

      {/* ── Recent Logs Section ─────────────────────────────────────── */}
      <div className="mt-6">
        <SectionTitle
          title="Recent logs"
          hint="Your latest field entries"
          action={
            <Button asChild variant="ghost" size="sm" className="press rounded-xl text-xs h-8">
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
                  <StatusChip status={entry.status} className="shrink-0" />
                </div>
              ))}
            </div>

            {/* ── Desktop: 2-col EntryCard grid ────────────────────────── */}
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

      {/* ── Center Peek Modal for Analytics ────────────────────────── */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto p-4 sm:p-6 rounded-3xl gap-4">
          <DialogHeader className="text-left space-y-1.5 pb-2 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
                <BarChart3 className="size-4" />
              </span>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                  Weekly Field Activity & Hours
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Detailed distribution of field hours logged across the past 7 days.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* 4 Highlights Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="raised rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Total Hours
              </span>
              <div className="text-lg sm:text-xl font-bold text-primary mt-0.5 tabular-nums">
                {totalWeekHours}h
              </div>
              <span className="text-[10px] text-muted-foreground">Past 7 days</span>
            </div>

            <div className="raised rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Active Days
              </span>
              <div className="text-lg sm:text-xl font-bold text-foreground mt-0.5 tabular-nums">
                {activeDaysCount} <span className="text-xs font-normal text-muted-foreground">/ 7d</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{currentStreak(mine)}d streak</span>
            </div>

            <div className="raised rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Daily Avg
              </span>
              <div className="text-lg sm:text-xl font-bold text-foreground mt-0.5 tabular-nums">
                {avgHours}h
              </div>
              <span className="text-[10px] text-muted-foreground">per active day</span>
            </div>

            <div className="raised rounded-2xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Verified Logs
              </span>
              <div className="text-lg sm:text-xl font-bold text-success mt-0.5 tabular-nums">
                {Math.round(verifiedPct)}%
              </div>
              <span className="text-[10px] text-muted-foreground">{verified.length} of {mine.length} signed</span>
            </div>
          </div>

          {/* Expanded Visual Daily Chart */}
          <div className="raised rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Hours Spent Per Day</span>
              <span className="text-[11px] text-muted-foreground">Same baseline track</span>
            </div>
            <MiniBars data={activityData} />
          </div>

          {/* Day-by-Day Detailed Breakdown List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              Day-by-Day Log Breakdown
            </h4>
            <div className="raised rounded-2xl overflow-hidden divide-y divide-border/40">
              {activityData.map((d, i) => {
                const hours = Number(d.hours ?? 0);
                return (
                  <div
                    key={`${d.dateStr}-${i}`}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors",
                      d.isToday ? "bg-primary-soft/40 font-medium" : "hover:bg-accent/40",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("size-2 rounded-full", hours > 0 ? "bg-primary" : "bg-muted-foreground/30")} />
                      <span className="font-medium text-foreground">
                        {d.fullLabel} {d.isToday ? "(Today)" : ""}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">{d.dateStr}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {d.logs} {d.logs === 1 ? "log" : "logs"}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-xs font-semibold tabular-nums",
                          hours > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {hours}h
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="press rounded-2xl text-xs"
              onClick={() => setAnalyticsOpen(false)}
            >
              <Link to="/app/timeline">
                <Calendar className="size-3.5 mr-1.5" />
                View Full Timeline
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="press rounded-2xl text-xs"
              onClick={() => setAnalyticsOpen(false)}
            >
              <Link to="/app/log">
                <PlusCircle className="size-3.5 mr-1.5" />
                New Log
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
