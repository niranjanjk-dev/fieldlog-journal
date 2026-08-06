import { type ReactNode } from "react";

/** Skeuomorphic phone shell scaled smoothly with screen size. */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-[280px] shrink-0 rounded-[2.8rem] border border-border bg-card p-2.5 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:w-[330px] md:w-[360px] lg:w-[380px] ${className}`}
    >
      <div className="absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />
      <div className="relative overflow-hidden rounded-[2.3rem] bg-secondary">
        <div className="flex items-center justify-between px-6 pb-1 pt-3.5 text-xs font-semibold text-muted-foreground">
          <span>9:41</span>
          <span className="tracking-widest">••••</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EntryCard({
  title,
  place,
  time,
  tone = "primary",
  verified = true,
}: {
  title: string;
  place: string;
  time: string;
  tone?: "primary" | "accent" | "sky";
  verified?: boolean;
}) {
  const toneBg =
    tone === "primary"
      ? "bg-primary-soft"
      : tone === "accent"
        ? "bg-accent-soft"
        : "bg-sky/25";
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-soft)] sm:p-4">
      <div className={`mb-3 h-24 rounded-xl ${toneBg} relative overflow-hidden sm:h-28`}>
        <div className="absolute inset-x-3 bottom-2 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80 sm:text-xs">
          <PinIcon className="h-3.5 w-3.5" />
          {place}
        </div>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-[15px]">{title}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        {verified && (
          <span className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold text-primary sm:text-xs">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export function PinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Tiny inline icon set — keeps the bundle lean. */
export function Glyph({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    camera: (
      <>
        <path
          d="M4 8.5h3l1.4-2.2h7.2L17 8.5h3v10H4v-10Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13.2" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      </>
    ),
    gps: (
      <>
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    timeline: (
      <>
        <path d="M6 4v16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="6" cy="8" r="2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M11 8h8M11 16h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    team: (
      <>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M16 7.2a3 3 0 0 1 0 5.6M17 19c0-2-.6-3.6-1.6-4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    pdf: (
      <>
        <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M14 3v4h4M10 13h5M10 16.5h3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    offline: (
      <>
        <path
          d="M6.5 18a3.5 3.5 0 0 1 .4-7A5.5 5.5 0 0 1 17.6 10a3.9 3.9 0 0 1 .3 7.9H6.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </>
    ),
    chart: (
      <>
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M7.5 20v-6M12 20V6M16.5 20v-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3.5 19 6v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
