import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  LayoutGrid,
  List,
  PlusCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SkeletonTile, StatusChip } from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { currentStreak, dayKey, formatDay, sumHours, type EntryStatus } from "@/lib/docko";
import { meQuery, myEntriesQuery, photoUrlsQuery } from "@/lib/queries";
import { deleteEntry } from "@/lib/entries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline · Docko" },
      { name: "description", content: "Interactive calendar and field log timeline." },
      { property: "og:title", content: "Timeline · Docko" },
      { property: "og:description", content: "Interactive calendar and field log timeline." },
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
  const queryClient = useQueryClient();
  const { data: entries, isLoading } = useQuery(myEntriesQuery);
  const [filter, setFilter] = useState<EntryStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"calendar" | "all">("calendar");

  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", "mine"] });
      toast.success("Log deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const mine = useMemo(
    () => (entries ?? []).filter((entry) => entry.student_id === me?.id),
    [entries, me?.id],
  );

  const visible = useMemo(
    () => (filter === "all" ? mine : mine.filter((entry) => entry.status === filter)),
    [filter, mine],
  );

  // Default to latest log date if available, otherwise today
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (mine.length > 0) {
      return new Date(mine[0]!.captured_at);
    }
    return new Date();
  });

  const selectedDayKey = dayKey(selectedDate);

  // Set of dayKeys that have entries (matching active filter)
  const daysWithEntries = useMemo(() => {
    const set = new Set<string>();
    for (const entry of visible) {
      set.add(dayKey(entry.captured_at));
    }
    return set;
  }, [visible]);

  // All dayKeys sorted chronologically
  const uniqueLoggedDayKeys = useMemo(() => {
    const keys = Array.from(daysWithEntries);
    return keys.sort();
  }, [daysWithEntries]);

  // Entries matching the selected date and current status filter
  const dayEntries = useMemo(() => {
    return visible.filter((entry) => dayKey(entry.captured_at) === selectedDayKey);
  }, [visible, selectedDayKey]);

  // Grouped entries for all-timeline view mode
  const groups = useMemo(() => {
    const map = new Map<string, typeof visible>();
    for (const entry of visible) {
      const key = dayKey(entry.captured_at);
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return map;
  }, [visible]);

  // Fetch photos for visible entries
  const { data: photos } = useQuery(
    photoUrlsQuery(
      (viewMode === "calendar" ? dayEntries : visible)
        .slice(0, 50)
        .map((entry) => entry.photo_path)
        .filter((p): p is string => Boolean(p)),
    ),
  );

  const hasLogModifier = (date: Date) => daysWithEntries.has(dayKey(date));

  // Date shifting helpers
  const handlePrevDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    setSelectedDate(next);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    // Don't allow future dates
    if (next > new Date()) return;
    setSelectedDate(next);
  };

  const handleJumpToLatest = () => {
    if (mine.length > 0) {
      setSelectedDate(new Date(mine[0]!.captured_at));
    } else {
      setSelectedDate(new Date());
    }
  };

  const isToday = dayKey(selectedDate) === dayKey(new Date());

  const formattedSelectedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AppShell
      title="Timeline"
      subtitle={`${mine.length} logs · ${sumHours(mine)} hours recorded across ${daysWithEntries.size} days`}
      actions={
        <Button asChild className="press rounded-2xl">
          <Link to="/app/log">
            <PlusCircle className="size-4" />
            <span className="hidden sm:inline">New log</span>
          </Link>
        </Button>
      }
    >
      {/* ── Status Filter Chips & View Mode Toggle ─────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={cn(
                "press rounded-2xl border px-3 py-1.5 text-xs sm:text-sm font-medium transition-all",
                filter === item.key
                  ? "border-primary bg-primary-soft text-primary shadow-xs"
                  : "border-border hover:bg-accent text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-2xl border border-border/80 bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all",
              viewMode === "calendar"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <CalendarDays className="size-3.5" />
            <span>Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all",
              viewMode === "all"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="size-3.5" />
            <span>All logs</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTile className="h-64" />
          <SkeletonTile className="h-64" />
        </div>
      ) : mine.length === 0 ? (
        <EmptyState
          icon={<CalendarClock className="size-5" />}
          title="Your timeline is empty"
          body="Capture your first field log to start building your verified portfolio and day streak."
          action={
            <Button asChild className="press rounded-2xl">
              <Link to="/app/log">Create first log</Link>
            </Button>
          }
        />
      ) : viewMode === "all" ? (
        /* ── All Logs Chronological List ────────────────────────────── */
        <div className="space-y-8">
          {[...groups.entries()].map(([key, dayGroupEntries]) => (
            <section key={key} className="rise">
              <div className="mb-3.5 flex items-center gap-3">
                <h2 className="text-sm font-bold text-foreground">
                  {formatDay(dayGroupEntries[0]!.captured_at)}
                </h2>
                <span className="h-px flex-1 bg-border/80" />
                <span className="rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {dayGroupEntries.length} log{dayGroupEntries.length > 1 ? "s" : ""} · {sumHours(dayGroupEntries)} h
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dayGroupEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
                    onDelete={() => deleteEntryMutation.mutate(entry.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* ── Interactive Calendar & Day Log View ─────────────────────── */
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Calendar Picker Column */}
          <div className="lg:col-span-5 flex flex-col w-full max-w-full">
            <BentoCard className="p-3 sm:p-5 w-full max-w-full overflow-hidden flex flex-col justify-between h-full">
              <div>
                <div className="mb-2.5 sm:mb-3 flex items-center gap-2.5 px-0.5">
                  <span className="grid size-7 sm:size-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0">
                    <CalendarDays className="size-3.5 sm:size-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
                      Field Calendar
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Touch any date to see logs
                    </p>
                  </div>
                </div>

                {/* DayPicker Calendar with log indicators (fixed size, no jump on click) */}
                <div className="w-full flex justify-center py-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) setSelectedDate(date);
                    }}
                    disabled={{ after: new Date() }}
                    toDate={new Date()}
                    modifiers={{
                      hasLog: hasLogModifier,
                    }}
                    modifiersClassNames={{
                      hasLog: "font-semibold",
                    }}
                    className="w-full flex justify-center p-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Calendar Legend / Stats Strip */}
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 px-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>Days with logs</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Flame className="size-3 text-primary" />
                    {currentStreak(mine)}d streak
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Clock className="size-3 text-primary" />
                    {uniqueLoggedDayKeys.length} active
                  </span>
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Selected Day Logs Column */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            {/* Selected Date Header Bar */}
            <div className="raised rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevDay}
                    className="press size-8 rounded-xl"
                    aria-label="Previous day"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextDay}
                    disabled={isToday}
                    className="press size-8 rounded-xl disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Next day"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>

                <div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground">
                    {formattedSelectedDate}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {dayEntries.length > 0
                      ? `${dayEntries.length} log${dayEntries.length === 1 ? "" : "s"} captured · ${sumHours(dayEntries)}h recorded`
                      : "No entries logged on this date"}
                  </p>
                </div>
              </div>

              {isToday ? (
                <span className="rounded-full bg-primary-soft border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Today
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                  className="press rounded-xl text-xs h-7 px-2 text-primary hover:text-primary"
                >
                  <RotateCcw className="size-3 mr-1" />
                  Go to Today
                </Button>
              )}
            </div>

            {/* Day Entries List or Empty State for Selected Date */}
            {dayEntries.length === 0 ? (
              <div className="raised rounded-3xl p-8 text-center space-y-3 flex-1 flex flex-col justify-center items-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                  <CalendarDays className="size-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    No logs for {formattedSelectedDate}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    {filter !== "all"
                      ? `No logs matching the "${filter}" filter on this day.`
                      : isToday
                        ? "You haven't logged any field activity today yet. Take a quick photo and capture your hours!"
                        : "Pick a date highlighted with a dot on the calendar to review logs from that day."}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button asChild className="press rounded-2xl text-xs h-9">
                    <Link to="/app/log">
                      <PlusCircle className="size-3.5 mr-1.5" />
                      Add new log
                    </Link>
                  </Button>
                  {uniqueLoggedDayKeys.length > 0 && !hasLogModifier(selectedDate) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJumpToLatest}
                      className="press rounded-2xl text-xs h-9"
                    >
                      Jump to latest log
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 items-stretch flex-1">
                {dayEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
                    onDelete={() => deleteEntryMutation.mutate(entry.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}




