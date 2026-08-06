import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { BentoCard, StatusChip } from "@/components/docko/bento";
import { DockoMark } from "@/components/docko/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Docko — Verified field logs for students and mentors" },
      {
        name: "description",
        content:
          "Docko is the fastest way to log placement and fieldwork: photo, GPS and hours in under 20 seconds, verified by your mentor, audit-ready for your institution.",
      },
      { property: "og:title", content: "Docko — Verified field logs for students and mentors" },
      {
        property: "og:description",
        content:
          "Log fieldwork in seconds with photo and GPS. Mentors verify in one tap. Institutions get audit-ready records.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <DockoMark />
            <span className="text-lg font-semibold tracking-tight">Docko</span>
          </Link>
          <div className="flex-1" />
          <Button asChild variant="ghost" className="press rounded-2xl">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild className="press rounded-2xl">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                Built for placements, fieldwork &amp; clinicals
              </span>
              <h1 className="mt-5 text-4xl leading-[1.05] font-semibold sm:text-5xl">
                Field logs students
                <span className="text-primary"> actually keep.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                One tap captures the photo, the place and the time. Mentors verify from their phone.
                Your institution gets an audit-ready record without chasing paperwork.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="press rounded-2xl">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Start logging free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="press rounded-2xl">
                  <Link to="/auth">I have an account</Link>
                </Button>
              </div>
              <dl className="mt-9 grid max-w-md grid-cols-3 gap-4">
                {[
                  { value: "18s", label: "Average log time" },
                  { value: "1 tap", label: "Mentor verify" },
                  { value: "100%", label: "Timestamped" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-semibold tabular-nums">{stat.value}</dt>
                    <dd className="text-xs text-muted-foreground">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rise relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] soft-veil" aria-hidden />
              <div className="relative grid gap-4 sm:grid-cols-2">
                <BentoCard className="sm:col-span-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-widest text-muted-foreground uppercase">
                        Today&apos;s log
                      </p>
                      <p className="mt-1 font-medium">Soil sampling — North plot</p>
                    </div>
                    <StatusChip status="verified" />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4" /> Bhopal, MP
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4" /> 2.5 h
                    </span>
                  </div>
                  <div className="sunken mt-4 grid h-24 grid-cols-3 gap-2 rounded-2xl p-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="grid place-items-center rounded-xl bg-muted text-muted-foreground"
                      >
                        <Camera className="size-4" />
                      </div>
                    ))}
                  </div>
                </BentoCard>
                <BentoCard>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">Streak</p>
                  <p className="mt-4 text-3xl font-semibold tabular-nums">12</p>
                  <p className="text-xs text-muted-foreground">days in a row</p>
                </BentoCard>
                <BentoCard>
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">Verified</p>
                  <p className="mt-4 text-3xl font-semibold tabular-nums">96%</p>
                  <p className="text-xs text-muted-foreground">of 48 logs</p>
                </BentoCard>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Three roles, one honest record
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Docko keeps every side of a placement in sync — without spreadsheets, WhatsApp photos or
            end-of-term panic.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-6">
            <BentoCard className="lg:col-span-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Camera className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">Students log in seconds</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Snap a photo, confirm the auto-detected location and hours, add a line about what you
                did. Offline-friendly and honest by design — every log carries its own timestamp.
              </p>
            </BentoCard>
            <BentoCard className="lg:col-span-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-success-soft text-success">
                <CheckCircle2 className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">Mentors verify in one tap</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                A single review queue per team. Approve, request changes with a note, or nudge a
                student who has gone quiet — all from a phone between site visits.
              </p>
            </BentoCard>
            <BentoCard className="lg:col-span-2">
              <span className="grid size-10 place-items-center rounded-2xl bg-warning-soft text-warning-foreground">
                <Users className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">Teams &amp; cohorts</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Group students by placement, assign a mentor, and see progress at a glance.
              </p>
            </BentoCard>
            <BentoCard className="lg:col-span-2">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <MapPin className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">Map of proof</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Every log pinned where it happened, so field coverage is visible, not claimed.
              </p>
            </BentoCard>
            <BentoCard className="lg:col-span-2">
              <span className="grid size-10 place-items-center rounded-2xl bg-success-soft text-success">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">Audit-ready exports</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Portfolios and hour totals that hold up in a review, generated from real logs.
              </p>
            </BentoCard>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <BentoCard tone="primary" className="flex flex-col items-start gap-5 p-8 sm:p-10">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Stop reconstructing your field diary the night before submission.
            </h2>
            <Button asChild size="lg" className="press rounded-2xl">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create your Docko account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </BentoCard>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <span className="inline-flex items-center gap-2">
            <DockoMark className="size-7 rounded-xl" /> Docko
          </span>
          <span>Verified fieldwork, without the paperwork.</span>
        </div>
      </footer>
    </div>
  );
}
