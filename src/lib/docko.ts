/** Shared Docko domain helpers — browser-safe, no side effects. */

export type EntryStatus = "pending" | "verified" | "rejected";
export type AppRole = "student" | "mentor" | "admin";

export type Entry = {
  id: string;
  student_id: string;
  team_id: string | null;
  assigned_mentor_ids?: string[] | null;
  assigned_mentors?: string[] | null;
  title: string;
  note: string | null;
  photo_path: string | null;
  hours: number;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  captured_at: string;
  status: EntryStatus;
  review_note: string | null;
  reviewed_at: string | null;
};

export const statusMeta: Record<
  EntryStatus,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Awaiting review",
    dot: "bg-warning",
    chip: "bg-warning-soft text-warning-foreground",
  },
  verified: {
    label: "Verified",
    dot: "bg-success",
    chip: "bg-success-soft text-success",
  },
  rejected: {
    label: "Needs changes",
    dot: "bg-destructive",
    chip: "bg-destructive-soft text-destructive",
  },
};

export function dayKey(value: string | Date | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (!d || isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDay(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function sumHours(entries: (Pick<Entry, "hours"> | null | undefined)[]): number {
  if (!Array.isArray(entries)) return 0;
  return Math.round(entries.reduce((total, e) => total + Number(e?.hours ?? 0), 0) * 10) / 10;
}

/** Consecutive days (ending today or yesterday) that have at least one log. */
export function currentStreak(entries: (Pick<Entry, "captured_at"> | null | undefined)[]): number {
  if (!Array.isArray(entries)) return 0;
  const days = new Set(
    entries
      .filter((e): e is Pick<Entry, "captured_at"> => Boolean(e?.captured_at))
      .map((e) => dayKey(e.captured_at))
      .filter(Boolean),
  );
  if (days.size === 0) return 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Logs per day for the last `days` days, oldest first. */
export function weeklyActivity(
  entries: (Pick<Entry, "captured_at" | "hours"> | null | undefined)[],
  days = 7,
): { label: string; fullLabel: string; logs: number; hours: number; isToday: boolean; dateStr: string }[] {
  const buckets: { label: string; fullLabel: string; logs: number; hours: number; isToday: boolean; dateStr: string }[] = [];
  const safeEntries = Array.isArray(entries) ? entries.filter((e): e is Pick<Entry, "captured_at" | "hours"> => Boolean(e?.captured_at)) : [];
  const todayKey = dayKey(new Date());
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const matched = safeEntries.filter((e) => dayKey(e.captured_at) === key);
    buckets.push({
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      fullLabel: d.toLocaleDateString(undefined, { weekday: "short" }),
      logs: matched.length,
      hours: sumHours(matched),
      isToday: key === todayKey,
      dateStr: key,
    });
  }
  return buckets;
}

export function initials(name: string | null | undefined): string {
  if (!name) return "D";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}