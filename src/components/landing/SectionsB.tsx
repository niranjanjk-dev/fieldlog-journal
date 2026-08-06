import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { DockoLogo } from "@/components/docko/app-shell";
import { Reveal } from "./anim";
import { CheckIcon, Glyph, PhoneFrame, PinIcon } from "./ui";
import { SectionHead } from "./SectionsA";

export function Experiences() {
  return (
    <section className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl space-y-5">
        <Reveal className="bento grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2">
          <div>
            <SectionHead
              align="left"
              eyebrow="For students"
              title="Log the progress, own the achievement"
              sub="docko. documents every step of your academic journey. From laboratory experiments and design studios to capstone projects — capture your milestones and get them verified daily."
            />
            <ul className="mt-8 space-y-3.5">
              {[
                "Evidence photos attached directly from your phone or camera",
                "Automatic workspace recognition at approved campus labs & sites",
                "Export an audit-ready portfolio of verified achievements anytime",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <PhoneFrame>
              <div className="px-4 pb-7 pt-3">
                <p className="font-display text-base font-bold sm:text-[17px]">Academic streak</p>
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className={`aspect-square rounded-[7px] ${
                        i % 7 === 6
                          ? "bg-secondary"
                          : i % 5 === 3
                            ? "bg-primary/45"
                            : "bg-primary/80"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-accent-soft p-4">
                  <p className="text-xs font-bold text-accent-foreground">Learning hours</p>
                  <p className="font-display text-3xl font-extrabold text-accent-foreground">
                    Active
                  </p>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </Reveal>

        <Reveal className="bento-dark grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm sm:text-base font-bold">Team overview</p>
              <div className="mt-5 space-y-4">
                {(
                  [
                    ["On track", 74],
                    ["Needs review", 18],
                    ["Falling behind", 8],
                  ] as const
                ).map(([label, pct]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs sm:text-sm opacity-85">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-white/85"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] opacity-75">For mentors &amp; faculty</p>
            <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Verify student achievements in seconds
            </h2>
            <p className="mt-3.5 text-base sm:text-lg leading-relaxed opacity-85">
              No end-of-semester evaluation rush. Review submitted work photos, notes, and locations directly
              from your phone or desktop.
            </p>
          </div>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-3" stagger>
          {(
            [
              ["team", "Academic groups", "Group students by course, lab group, supervisor, or project."],
              ["timeline", "Daily activity feed", "See achievements in real time as students submit."],
              ["shield", "Role views", "Students, faculty mentors, and administrators each get dedicated views."],
            ] as const
          ).map(([icon, t, d]) => (
            <article key={t} className="bento lift p-6 sm:p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky/25 text-foreground/70">
                <Glyph name={icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-base sm:text-lg font-bold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function TimelineShowcase() {
  const items = [
    ["Phase 1", "Foundational research & project scoping", "primary"],
    ["Phase 2", "Prototyping & laboratory experiment trials", "accent"],
    ["Phase 3", "Data validation & mentor check-in", "sky"],
    ["Phase 4", "Final evaluation & verified portfolio", "primary"],
  ] as const;
  return (
    <section className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHead
            eyebrow="Timeline"
            title="An academic journey in sequence"
            sub="Every approved milestone and lab log is organized chronologically on your timeline."
          />
        </Reveal>
        <Reveal className="relative mt-12 space-y-4" stagger>
          {items.map(([w, t, tone]) => (
            <article key={w} className="bento lift grid grid-cols-[auto_minmax(0,1fr)] gap-5 p-6 sm:p-7">
              <div className="flex flex-col items-center">
                <span
                  className={`h-4 w-4 rounded-full ring-4 ${
                    tone === "primary"
                      ? "bg-primary ring-primary-soft"
                      : tone === "accent"
                        ? "bg-accent ring-accent-soft"
                        : "bg-sky ring-sky/25"
                  }`}
                />
                <span className="mt-2 w-px flex-1 bg-border" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {w}
                </p>
                <h3 className="mt-1 font-display text-base sm:text-lg font-bold">{t}</h3>
                <div className="mt-4 flex gap-3">
                  <span className="h-16 w-24 rounded-xl bg-secondary" />
                  <span className="h-16 w-24 rounded-xl bg-primary-soft" />
                  <span className="hidden h-16 w-24 rounded-xl bg-accent-soft sm:block" />
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function MapSection() {
  return (
    <section className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal className="bento grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2">
          <div>
            <SectionHead
              align="left"
              eyebrow="Location &amp; Lab review"
              title="See where learning happened"
              sub="Each log attaches coordinates from when the entry was submitted. Mentors can recognize campus labs, classrooms, and verified project sites."
            />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-[var(--shadow-soft),var(--shadow-inset)]">
            <div className="h-72 w-full sm:h-80">
              <svg viewBox="0 0 300 220" className="h-full w-full" aria-hidden="true">
                <rect width="300" height="220" fill="oklch(0.95 0.02 150)" />
                <g stroke="oklch(0.46 0.098 158 / 0.16)" strokeWidth="7" fill="none">
                  <path d="M-10 60h320M-10 150h320M70 -10v240M210 -10v240" />
                </g>
                <path
                  d="M70 150 L70 60 L210 60"
                  stroke="oklch(0.79 0.145 72)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                />
                <circle cx="210" cy="60" r="26" fill="oklch(0.46 0.098 158 / 0.12)" />
              </svg>
            </div>
            <div className="animate-float-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)]">
              <p className="flex items-center gap-2 text-xs sm:text-sm font-bold text-primary">
                <PinIcon className="h-4 w-4" /> Campus Lab &amp; Workspace
              </p>
              <p className="text-xs text-muted-foreground">Coordinates attached · Verified</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    [
      "What kinds of academic journeys can I track?",
      "docko. works for any academic program — from engineering lab experiments, design studio projects, and software capstones to clinical rotations, field studies, thesis research, and independent coursework.",
    ],
    [
      "How does daily mentor verification work?",
      "When a student logs an entry with photo evidence, notes, and location, the assigned mentor or advisor receives a notification. They can view the submission and verify the achievement in a single tap.",
    ],
    [
      "How does offline logging work?",
      "If you're in a basement lab or field site with low or no signal, your entry is saved locally in browser drafts with the exact timestamp and GPS coordinates. As soon as you reconnect, tap submit to sync with your mentor.",
    ],
    [
      "How do workspace tags work?",
      "When a mentor approves an entry at a lab, studio, or work site, that location is remembered as an approved workspace. Subsequent entries logged nearby automatically recognize that workspace.",
    ],
    [
      "How do I export my verified portfolio?",
      "You can export your verified entries with their photos, timestamps, mentor approvals, and total hours into an organized, audit-ready PDF portfolio anytime.",
    ],
  ] as const;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        </Reveal>
        <Reveal className="mt-10 space-y-3.5" stagger>
          {faqs.map(([q, a], i) => (
            <div key={q} className="bento">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6 sm:p-7 text-left"
              >
                <span className="min-w-0 font-display text-base sm:text-lg font-bold">{q}</span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-transform duration-300 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm sm:text-base leading-relaxed text-muted-foreground">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="cta" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="bento grain-glow p-10 text-center sm:p-16 lg:p-20">
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Elevate your academic journey.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-xl text-muted-foreground">
              Start capturing your daily milestones and build an advisor-verified portfolio today.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="press rounded-2xl bg-primary px-8 py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
              >
                Start tracking free
              </Link>
              <Link
                to="/auth"
                className="press rounded-2xl border border-border bg-card px-8 py-4 text-base sm:text-lg font-semibold shadow-[var(--shadow-soft),var(--shadow-inset)]"
              >
                Sign in to account
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AnalyticsSection() {
  const bars = [
    { day: "M", hours: 7.5, hPct: "78%", active: true },
    { day: "T", hours: 8.0, hPct: "84%", active: true },
    { day: "W", hours: 8.5, hPct: "90%", active: true },
    { day: "T", hours: 7.0, hPct: "72%", active: true },
    { day: "F", hours: 7.5, hPct: "78%", active: true },
    { day: "S", hours: 0.0, hPct: "6%", active: false },
    { day: "S", hours: 0.0, hPct: "6%", active: false },
  ];

  const goals = [
    {
      icon: "shield" as const,
      title: "Guaranteed Academic Credit",
      desc: "Every log has photo evidence and faculty verification. No lost work, zero disputed hours, and 100% accepted credits.",
    },
    {
      icon: "pdf" as const,
      title: "Career-Ready Evidence Portfolio",
      desc: "Turn your semester's verified logs into an exportable PDF portfolio with real project photos to impress recruiters and admissions committees.",
    },
    {
      icon: "timeline" as const,
      title: "Zero End-of-Term Scramble",
      desc: "Advisors verify your achievements day-by-day in seconds. Never spend finals week hunting down professors for retrospective signatures.",
    },
  ];

  return (
    <section id="analytics" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead
            eyebrow="Analytics"
            title="Progress you can actually measure"
            sub="Hours, consistency and skill coverage across your academic journey."
          />
        </Reveal>

        <Reveal className="mt-10 sm:mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]" stagger>
          {/* Weekly Hours Logged Chart */}
          <article className="bento lift flex flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold">Weekly hours logged</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Target: 35.0 hrs/week</p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-primary">38.5</span>
                <span className="text-xs sm:text-sm text-muted-foreground"> hrs</span>
                <span className="ml-2 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">
                  +10%
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="my-6">
              <div className="grid grid-cols-7 items-end gap-3 sm:gap-4 h-48 sm:h-56 px-2">
                {bars.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2.5 h-full justify-end group">
                    <span className="text-[11px] font-semibold text-muted-foreground transition-opacity">
                      {bar.hours > 0 ? `${bar.hours}h` : "—"}
                    </span>
                    <div className="w-full max-w-[44px] h-full rounded-2xl bg-secondary/80 flex items-end justify-center p-1 relative overflow-hidden">
                      <div
                        className={`w-full rounded-xl transition-all duration-700 ${
                          bar.active
                            ? "bg-[image:var(--gradient-field)] shadow-sm"
                            : "bg-muted-foreground/20"
                        }`}
                        style={{ height: bar.hPct }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-xs sm:text-sm">
              <span className="text-muted-foreground">Logged 5 of 5 weekdays</span>
              <span className="font-semibold text-primary">Full week attendance</span>
            </div>
          </article>

          {/* Metric Highlights */}
          <div className="grid gap-5">
            <article className="bento lift flex flex-col justify-between p-6 sm:p-8">
              <div>
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-primary">18</span>
                <p className="mt-2 text-sm sm:text-base font-bold">skills evidenced this term</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Linked directly to verified lab experiments, code builds, and design reviews.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {["Data Analysis", "Sensor Calibration", "Circuit QA", "Research Review"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            <article className="bento lift flex flex-col justify-between p-6 sm:p-8">
              <div>
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-accent">94%</span>
                <p className="mt-2 text-sm sm:text-base font-bold">entries verified same day</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Faculty and advisors verify quickly with attached evidence on any device.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary">
                <CheckIcon className="h-4 w-4" /> Zero end-of-term review backlog
              </div>
            </article>
          </div>
        </Reveal>

        {/* How this UI helps students & mentors achieve their ultimate desires */}
        <Reveal className="mt-10 grid gap-5 sm:grid-cols-3" stagger>
          {goals.map((g) => (
            <article key={g.title} className="bento lift p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary shadow-[var(--shadow-soft)]">
                <Glyph name={g.icon} className="h-6 w-6" />
              </span>
              <h4 className="mt-4 font-display text-base sm:text-lg font-bold">{g.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    ["Product", [["Overview", "#overview"], ["Features", "#features"], ["How it works", "#how"], ["FAQ", "#faq"]]],
    ["Account", [["Student Sign In", "/auth"], ["Create Account", "/auth?mode=signup"], ["Mentor Portal", "/mentor"], ["Admin Portal", "/admin"]]],
    ["Platform", [["Academic Log", "/app/log"], ["Timeline", "/app/timeline"], ["Map View", "/app/map"], ["Portfolio Export", "/app/portfolio"]]],
  ] as const;
  return (
    <footer className="px-4 pb-10 pt-4">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <div className="bento grid gap-8 p-8 sm:grid-cols-2 sm:p-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              <DockoLogo className="text-2xl" />
            </div>
            <p className="mt-3.5 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
              Daily achievement tracking &amp; mentor verification for every academic journey.
            </p>
          </div>
          {cols.map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-bold">{title}</p>
              <ul className="mt-3.5 space-y-2.5">
                {links.map(([l, href]) => (
                  <li key={l}>
                    {href.startsWith("/") && !href.includes("?") ? (
                      <Link
                        to={href as any}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} docko.
        </p>
      </div>
    </footer>
  );
}
