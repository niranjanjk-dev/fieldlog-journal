/** Shared Docko domain helpers — browser-safe, no side effects. */

export type EntryStatus = "pending" | "verified" | "rejected";
export type AppRole = "student" | "mentor" | "admin";

export type Entry = {
  id: string;
  student_id: string;
  team_id: string | null;
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

export function dayKey(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDay(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function sumHours(entries: Pick<Entry, "hours">[]): number {
  return Math.round(entries.reduce((total, e) => total + Number(e.hours ?? 0), 0) * 10) / 10;
}

/** Consecutive days (ending today or yesterday) that have at least one log. */
export function currentStreak(entries: Pick<Entry, "captured_at">[]): number {
  const days = new Set(entries.map((e) => dayKey(e.captured_at)));
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
  entries: Pick<Entry, "captured_at" | "hours">[],
  days = 7,
): { label: string; logs: number; hours: number }[] {
  const buckets: { label: string; logs: number; hours: number }[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    const matched = entries.filter((e) => dayKey(e.captured_at) === key);
    buckets.push({
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      logs: matched.length,
      hours: sumHours(matched),
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