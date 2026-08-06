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
        "relative overflow-hidden rounded-3xl p-5 sm:p-6",
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
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6", className)}>
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
    <BentoCard className={cn("flex flex-col justify-between", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        {icon ? (
          <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums">{value}</span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </BentoCard>
  );
}

export function StatusChip({ status, className }: { status: EntryStatus; className?: string }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        meta.chip,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}

export function ProgressRing({
  value,
  size = 96,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
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
      <div className="absolute text-center">
        <div className="text-lg font-semibold tabular-nums">
          {label ?? `${Math.round(clamped)}%`}
        </div>
        {sublabel ? <div className="text-[11px] text-muted-foreground">{sublabel}</div> : null}
      </div>
    </div>
  );
}

export function MiniBars({ data }: { data: { label: string; logs: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.logs));
  return (
    <div className="flex h-24 items-end gap-2">
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-lg bg-primary/85"
            style={{
              height: `${Math.max(6, (d.logs / max) * 100)}%`,
              transition: "height 300ms var(--ease-soft)",
            }}
            title={`${d.logs} logs`}
          />
          <span className="text-[11px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
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
