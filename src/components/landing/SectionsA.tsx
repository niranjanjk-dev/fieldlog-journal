import { CountUp, Reveal } from "./anim";
import { CheckIcon, EntryCard, Glyph, PhoneFrame, PinIcon } from "./ui";

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">{title}</h2>
      {sub && <p className="mt-3.5 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Overview() {
  return (
    <section id="overview" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead
            eyebrow="Academic Journey"
            title="One app for your complete academic record"
            sub="Log daily project progress, lab sessions, and research milestones. Get every achievement verified by your mentor."
          />
        </Reveal>
        <Reveal className="mt-10 sm:mt-14 grid gap-4 sm:grid-cols-6" stagger>
          <article className="bento lift p-7 sm:p-9 sm:col-span-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold">Every achievement carries verifiable proof</h3>
            <p className="mt-2.5 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground">
              Work photo, campus or lab coordinates, exact timestamp and technical notes — saved together when you log,
              so your mentors and professors can verify your progress with complete confidence.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              {([
                ["camera", "Photo Evidence"],
                ["gps", "Campus / Lab"],
                ["timeline", "Exact Timestamp"],
                ["shield", "Mentor Sign-Off"],
              ] as const).map(([icon, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-[var(--shadow-soft)]"
                >
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Glyph name={icon} className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-xs sm:text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="bento-dark lift p-7 sm:p-9 sm:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-5xl sm:text-6xl font-extrabold">
                <CountUp to={9} suffix="s" />
              </p>
              <p className="mt-2 text-base sm:text-lg opacity-85">
                Average time to document today's achievement.
              </p>
            </div>
            <div className="mt-8 space-y-2.5">
              {["Capture work photo", "Add milestone notes", "Submit for verification"].map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 rounded-xl bg-white/12 px-3.5 py-2.5 text-sm sm:text-base font-semibold"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
                    {i + 1}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </article>
          <article className="bento lift p-7 sm:p-8 sm:col-span-3">
            <h3 className="font-display text-lg sm:text-xl font-bold">Faculty verify where &amp; what you worked on</h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Mentors review attached photos, location tags, and project notes before approving your daily entries.
            </p>
            <div className="mt-6 space-y-2.5">
              {["Robotics lab sensor calibration", "Capstone architecture & dataset review", "Design studio prototype validation"].map(
                (t) => (
                  <div
                    key={t}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)]"
                  >
                    <span className="truncate text-sm sm:text-base font-medium">{t}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  </div>
                ),
              )}
            </div>
          </article>
          <article className="bento lift p-7 sm:p-8 sm:col-span-3">
            <h3 className="font-display text-lg sm:text-xl font-bold">Audit-ready portfolio export</h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Export comprehensive academic portfolios with all verified achievements, photos, and approved hours.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-secondary/70 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.8)]">
              <div className="h-2.5 w-28 rounded-full bg-foreground/15" />
              <div className="mt-2.5 h-2.5 w-44 rounded-full bg-foreground/10" />
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                <div className="h-14 rounded-xl bg-primary-soft" />
                <div className="h-14 rounded-xl bg-accent-soft" />
                <div className="h-14 rounded-xl bg-sky/25" />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary">
                <Glyph name="pdf" className="h-5 w-5" /> academic-achievement-portfolio.pdf
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function Problem() {
  const fails = [
    ["Unrecorded milestones", "Months of intensive project and lab work fade away without daily documentation."],
    ["End-of-term scramble", "Chasing faculty and mentors for retrospective signatures during finals week."],
    ["Unverified claims", "Portfolios and resumes with ambitious claims but zero proof or supervisor verification."],
    ["Scattered notes", "Spending days transcribing disorganized notebooks into final submission reports."],
  ];
  return (
    <section className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead
            eyebrow="The problem"
            title="Why traditional academic logging falls short"
            sub="Tracking projects, research, and coursework on paper or scattered docs makes it hard to prove what you accomplished."
          />
        </Reveal>
        <Reveal className="mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2" stagger>
          {fails.map(([t, d]) => (
            <article key={t} className="bento lift flex gap-4 p-6 sm:p-7">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-clay/20 text-xl font-bold text-clay">
                ✕
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base sm:text-lg font-bold">{t}</h3>
                <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = ([
    ["Capture", "camera", "Snap a photo of your work, code, circuit, or notes with hours spent."],
    ["Locate", "gps", "Campus coordinates and timestamps record exactly where and when you worked."],
    ["Verify", "shield", "Your mentor or advisor reviews the submission and approves it in one tap."],
    ["Export", "pdf", "Download your organized, verified achievement portfolio whenever needed."],
  ] as const);
  return (
    <section id="how" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead eyebrow="How it works" title="Four seamless steps" />
        </Reveal>
        <Reveal className="relative mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {steps.map(([t, icon, d], i) => (
            <article key={t} className="bento lift p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-13 w-13 p-2.5 place-items-center rounded-2xl bg-[image:var(--gradient-field)] text-primary-foreground shadow-[var(--shadow-soft)]">
                  <Glyph name={icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground/10">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg sm:text-xl font-bold">{t}</h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">{d}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Showcase() {
  return (
    <section id="showcase" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead
            eyebrow="Product showcase"
            title="Clean workflow for students and mentors"
            sub="Students log daily achievements. Mentors verify submissions in real time."
          />
        </Reveal>
        <Reveal className="mt-10 sm:mt-14 grid gap-5 lg:grid-cols-2" stagger>
          <article className="bento lift flex flex-col items-center overflow-hidden p-7 sm:p-9 pb-0">
            <div className="w-full text-center">
              <h3 className="font-display text-xl sm:text-2xl font-bold">Student view</h3>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">Log entries with photo evidence and location.</p>
            </div>
            <PhoneFrame className="mt-8 translate-y-4">
              <div className="space-y-3.5 px-3.5 pb-8 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="font-display text-sm font-bold">Alex Rivera</p>
                    <p className="text-[11px] text-muted-foreground">Robotics &amp; AI · Year 3</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                    Active streak
                  </span>
                </div>
                <EntryCard title="Embedded systems firmware test" place="Robotics Lab 2" time="9:12 AM" />
                <EntryCard
                  title="Research dataset cleanup & EDA"
                  place="Data Science Studio"
                  time="11:30 AM"
                  tone="sky"
                  verified={false}
                />
              </div>
            </PhoneFrame>
          </article>
          <article className="bento lift flex flex-col gap-5 p-7 sm:p-9">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold">Mentor view</h3>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
                Review assigned students and approve daily achievements in seconds.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-primary-foreground">
                Pending (3)
              </span>
              <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                Approved (14)
              </span>
              <span className="rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                All Logs
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between">
                <p className="text-sm sm:text-base font-bold">Verification queue</p>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-foreground">
                  Today
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["Aarav Patel", "Robotics lab sensor calibration", "Engineering Lab 4", "primary"],
                  ["Elena Rostova", "Capstone dataset validation", "Innovation Hub", "accent"],
                  ["Marcus Chen", "Structural CAD simulation test", "Design Studio", "sky"],
                ].map(([n, task, loc, tone]) => (
                  <div
                    key={n}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl border border-border bg-secondary/50 p-3"
                  >
                    <span
                      className={`h-11 w-11 shrink-0 rounded-xl ${
                        tone === "primary"
                          ? "bg-primary-soft"
                          : tone === "accent"
                            ? "bg-accent-soft"
                            : "bg-sky/25"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm sm:text-base font-semibold">{n}</span>
                      <span className="block truncate text-xs sm:text-sm text-muted-foreground">
                        {task} · <span className="text-foreground/70 font-medium">{loc}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label="Approve log"
                      className="press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
                    >
                      <CheckIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">3 pending logs ready for approval</span>
              <span className="font-bold text-primary hover:underline cursor-pointer">Verify all</span>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function Features() {
  const features = ([
    ["gps", "Location & Campus Tagging", "Coordinates and room/lab tags recorded when you log."],
    ["camera", "Photo Evidence", "Attach photos of your physical or digital work as you build."],
    ["timeline", "Journey Timeline", "A chronological feed of your daily learning and achievements."],
    ["team", "Cohorts & Teams", "Group students by course, lab group, supervisor, or project."],
    ["pdf", "Portfolio Export", "Export verified logs and achievements into clean PDF reports."],
    ["offline", "Offline Drafts", "Save entries locally if signal drops, sync when connected."],
    ["chart", "Hours & Streaks", "Track active learning streaks and cumulative project hours."],
    ["shield", "Mentor Verification", "Mentors verify daily achievements with complete confidence."],
  ] as const);
  return (
    <section id="features" className="px-4 py-14 sm:py-24">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal>
          <SectionHead
            eyebrow="Core features"
            title="Built for every academic journey"
            sub="Everything students, researchers, and mentors need to maintain reliable achievement records."
          />
        </Reveal>
        <Reveal className="mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger>
          {features.map(([icon, t, d]) => (
            <article key={t} className="bento lift p-6 sm:p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary shadow-[var(--shadow-soft),var(--shadow-inset)]">
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

export { PinIcon };
