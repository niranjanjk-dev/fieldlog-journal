import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { type EntryStatus, statusMeta } from "@/lib/docko";

/** The core Docko layout primitive: a raised, tactile tile in a bento grid. */
export function BentoCard({
  children,
  className,
  interactive = false,
  tone = "surface",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  tone?: "surface" | "primary" | "sunken";
  as?: "section" | "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-3xl p-3.5 sm:p-5 lg:p-6",
        tone === "sunken" ? "sunken border border-border" : "raised",
        tone === "primary" && "soft-veil",
        interactive && "lift cursor-pointer",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {hint ? <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  unit,
  hint,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <BentoCard className={cn("flex flex-col justify-between min-h-[100px]", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-medium tracking-wide text-muted-foreground uppercase leading-tight">
          {label}
        </span>
        {icon ? (
          <span className="grid size-7 sm:size-8 place-items-center rounded-full bg-primary-soft text-primary shrink-0">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 sm:mt-6 flex items-baseline gap-1">
        <span className="text-2xl sm:text-3xl font-semibold tabular-nums">{value}</span>
        {unit ? <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      {hint ? <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-tight">{hint}</p> : null}
    </BentoCard>
  );
}

export function StatusChip({ status, className }: { status: EntryStatus; className?: string }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 leading-none",
        meta.chip,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full shrink-0", meta.dot)} aria-hidden />
      <span>{meta.label}</span>
    </span>
  );
}

export function ProgressRing({
  value,
  size = 96,
  label,
  sublabel,
  textSize = "text-lg",
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
  textSize?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
          style={{ transition: "stroke-dashoffset 300ms var(--ease-soft)" }}
        />
      </svg>
      {label !== "" ? (
        <div className="absolute text-center">
          <div className={`${textSize} font-semibold tabular-nums`}>
            {label ?? `${Math.round(clamped)}%`}
          </div>
          {sublabel ? <div className="text-[11px] text-muted-foreground">{sublabel}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

export function MiniBars({
  data,
}: {
  data: { label: string; fullLabel?: string; logs: number; hours?: number; isToday?: boolean }[];
}) {
  const maxHours = Math.max(6, ...data.map((d) => Number(d.hours ?? 0)));
  return (
    <div className="flex h-24 sm:h-28 items-end gap-2 sm:gap-3 pt-2">
      {data.map((d, i) => {
        const hours = Number(d.hours ?? 0);
        const heightPct = hours > 0 ? Math.max(14, Math.min(100, Math.round((hours / maxHours) * 100))) : 0;
        return (
          <div key={`${d.label}-${i}`} className="group/bar relative flex flex-1 h-full flex-col items-center justify-end">
            {/* Background track & active baseline-aligned bar */}
            <div className="relative flex h-[68px] sm:h-[76px] w-full items-end justify-center rounded-xl bg-muted/25 p-1">
              {hours > 0 ? (
                <div
                  className={cn(
                    "w-full rounded-lg transition-all duration-300",
                    d.isToday ? "bg-primary shadow-xs" : "bg-primary/80 group-hover/bar:bg-primary",
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              ) : (
                <div className="h-1.5 w-full rounded-full bg-muted/40" />
              )}
            </div>

            {/* Day Label with Today dot indicator */}
            <div className="mt-1.5 flex flex-col items-center">
              <span
                className={cn(
                  "text-[10px] sm:text-[11px] font-medium leading-none",
                  d.isToday ? "font-bold text-primary" : "text-muted-foreground",
                )}
              >
                {d.label}
              </span>
              {d.isToday ? <span className="mt-0.5 size-1 rounded-full bg-primary" /> : null}
            </div>

            {/* Hover Tooltip - ONLY appears for the specific hovered bar */}
            <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity duration-150 group-hover/bar:opacity-100 whitespace-nowrap shadow-md z-30 pointer-events-none">
              {d.fullLabel ?? d.label}: {hours}h{d.logs > 0 ? ` · ${d.logs} ${d.logs === 1 ? "log" : "logs"}` : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      {icon ? (
        <span className="mb-3 grid size-11 place-items-center rounded-2xl bg-muted text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function SkeletonTile({ className }: { className?: string }) {
  return <div className={cn("h-32 animate-pulse rounded-3xl bg-muted/70", className)} aria-hidden />;
}
