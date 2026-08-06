import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { DockoLogo } from "@/components/docko/app-shell";
import { Reveal } from "./anim";
import { CheckIcon, EntryCard, Glyph, PhoneFrame, PinIcon } from "./ui";

export function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Overview", "#overview"],
    ["How it works", "#how"],
    ["Features", "#features"],
    ["FAQ", "#faq"],
  ];
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:pt-4">
      <nav className="mx-auto flex max-w-6xl xl:max-w-7xl items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-4 py-2.5 shadow-[0_4px_20px_oklch(0_0_0/0.05),var(--shadow-inset)] backdrop-blur-xl sm:px-6 sm:py-3">
        {/* Brand Logo - Distinct font, text-only wordmark */}
        <Link to="/" className="flex shrink-0 items-center px-1" onClick={() => setOpen(false)}>
          <DockoLogo className="text-2xl sm:text-[1.75rem]" />
        </Link>

        {/* Desktop Navigation Links & CTAs */}
        <div className="hidden items-center gap-2 md:flex sm:gap-3">
          <ul className="mr-2 flex items-center gap-1.5">
            {links.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-base"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            to="/auth"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-base"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] sm:text-base"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="press grid h-9 w-9 place-items-center rounded-full border border-border bg-secondary/80 text-foreground transition-colors hover:bg-secondary"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Drawer */}
      {open && (
        <div className="mx-auto mt-2 max-w-md animate-in fade-in zoom-in-95 duration-200 md:hidden">
          <div className="rounded-3xl border border-border bg-card/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl">
            <ul className="space-y-1">
              {links.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                onClick={() => setOpen(false)}
                className="press flex items-center justify-center rounded-2xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-12 pt-8 sm:pb-20 sm:pt-14 lg:pt-16">
      <div className="relative mx-auto max-w-6xl xl:max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center" stagger>
          <h1 className="text-3xl font-extrabold tracking-tight leading-[1.12] sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            <span className="block">Track your academic journey.</span>
            <span className="block">Get verified every day.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Log daily milestones with photo proof. Mentors verify your achievements in seconds.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="press rounded-2xl bg-primary px-8 py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lift)]"
            >
              Start tracking free
            </Link>
            <a
              href="#showcase"
              className="press rounded-2xl border border-border bg-card px-8 py-4 text-base sm:text-lg font-semibold shadow-[var(--shadow-soft),var(--shadow-inset)]"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
            Free for students &amp; researchers · Sign up in 30 seconds
          </p>
        </Reveal>

        <Reveal className="relative mt-12 flex justify-center sm:mt-16 lg:mt-20" y={40} delay={0.15}>
          <div className="relative">
            <PhoneFrame>
              <div className="space-y-3.5 px-3.5 pb-6 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="font-display text-base font-bold sm:text-[17px]">Academic Journal</p>
                    <p className="text-xs text-muted-foreground">Alex Rivera · Year 3</p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-foreground">
                    Active streak
                  </span>
                </div>
                <EntryCard
                  title="Robotics lab sensor calibration"
                  place="Engineering Lab 4"
                  time="Today · 10:15 AM"
                />
                <EntryCard
                  title="Capstone dataset validation"
                  place="Innovation Hub"
                  time="Yesterday · 4:40 PM"
                  tone="accent"
                />
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="block rounded-2xl border border-dashed border-border bg-secondary/60 p-3.5 text-center text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  + Log today's achievement
                </Link>
              </div>
            </PhoneFrame>

            <div className="animate-float-a absolute -left-6 top-16 hidden w-52 sm:w-60 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:block md:-left-48 lg:-left-56">
              <div className="flex items-center gap-2.5 text-primary">
                <Glyph name="gps" className="h-5 w-5" />
                <p className="text-xs sm:text-sm font-bold">Verified evidence</p>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Photo evidence &amp; campus coordinates attached
              </p>
            </div>

            <div className="animate-float-b absolute -right-6 bottom-20 hidden w-56 sm:w-64 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:block md:-right-48 lg:-right-56">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-bold">Daily mentor sign-off</p>
                  <p className="text-xs text-muted-foreground">Advisors verify your achievements</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
