import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Flame, Loader2, MapPin } from "lucide-react";

import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "request";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode | undefined } => ({
    mode: search["mode"] === "signup" ? "signup" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — docko." },
      {
        name: "description",
        content:
          "Sign in or create your docko. account to track your academic journey and get achievements verified daily.",
      },
      { property: "og:title", content: "Sign in — docko." },
      {
        property: "og:description",
        content: "Access your academic journal, daily milestones, and mentor review portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode === "signup" ? "signup" : "signin");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/app" });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { role: "pending" },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSentTo(email);
          return;
        }
        navigate({ to: "/app" });
      } else if (mode === "request") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: institution, institution: institution, role: "pending" },
          },
        });
        if (error) throw error;
        
        if (data.user) {
          const { error: reqError } = await supabase.from("institution_requests").insert({
            user_id: data.user.id,
            institution_name: institution,
            email
          });
          if (reqError) throw reqError;
        }

        // Sign out immediately so they see the success screen instead of being redirected
        await supabase.auth.signOut();
        setSentTo("request");
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:h-screen lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr] lg:overflow-hidden">
      {/* Left Column: Visual Showcase & Brand Story (visible on desktop lg/xl screens) */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-sidebar p-6 lg:flex lg:p-8 xl:p-12">
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Top Branding */}
        <div className="relative flex items-center">
          <Link to="/" className="group flex items-center">
            <DockoLogo className="text-2xl sm:text-3xl" />
          </Link>
        </div>

        {/* Showcase Content */}
        <div className="relative my-auto max-w-md space-y-5 py-4 xl:max-w-lg">
          <h2 className="font-display text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl xl:text-4xl">
            Every achievement carries verified proof.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Photo evidence, campus coordinates, and exact timestamps — verified by your mentors in real time.
          </p>

          {/* Interactive Preview Card */}
          <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:p-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-lg bg-primary-soft text-primary sm:size-8">
                  <CheckCircle2 className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-bold sm:text-sm">Robotics Lab Milestone</p>
                  <p className="text-[11px] text-muted-foreground">Alex Rivera · Engineering</p>
                </div>
              </div>
              <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold text-primary sm:text-xs">
                Verified
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <MapPin className="size-3.5 text-primary" /> Engineering Lab 4
              </span>
              <span>Today · 10:15 AM</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                <Flame className="size-3 text-orange-500" /> 14-Day streak
              </span>
              <span className="rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/80">
                94% verified same day
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <p className="relative text-xs text-muted-foreground">
          Built for research labs, project teams, coursework, and capstones.
        </p>
      </div>

      {/* Right Column: Auth Form with persistent top logo on mobile */}
      <div className="flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:p-6 xl:p-10">
        {/* Mobile top bar - ALWAYS at the top of the mobile screen */}
        <div className="flex items-center px-5 pt-5 pb-2 lg:hidden">
          <Link to="/" className="flex items-center">
            <DockoLogo className="text-2xl" />
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center p-3 sm:p-6 md:p-8">
          <div className="w-full max-w-sm sm:max-w-md">
            {sentTo ? (
            <BentoCard className="p-5 sm:p-6 text-center">
              <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight">
                Check your inbox
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                We sent a confirmation link to <span className="font-semibold text-foreground">{sentTo}</span>. Open it
                to activate your docko. account, then sign in.
              </p>
              <Button
                variant="outline"
                className="press mt-5 h-10 w-full rounded-xl text-xs font-semibold sm:text-sm"
                onClick={() => {
                  setSentTo(null);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </BentoCard>
          ) : sentTo === "request" ? (
            <BentoCard className="p-5 sm:p-6 text-center">
              <div className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
                <CheckCircle2 className="size-6" />
              </div>
              <h1 className="font-display text-xl font-bold tracking-tight">
                Request Sent
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Your institution request has been sent to our team. We'll be in touch soon at <span className="font-semibold text-foreground">{email}</span>.
              </p>
              <Button
                variant="outline"
                className="press mt-5 h-10 w-full rounded-xl text-xs font-semibold sm:text-sm"
                onClick={() => {
                  setSentTo(null);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </BentoCard>
          ) : (
            <BentoCard className="p-4 sm:p-6 shadow-[var(--shadow-lift)]">
              {/* Header Title & Subtitle */}
              <div>
                <h1 className="font-display text-lg font-extrabold tracking-tight sm:text-2xl">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h1>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  {mode === "signup"
                    ? "Start tracking your academic journey."
                    : mode === "request"
                    ? "Request to onboard your university or lab."
                    : "Sign in to access your journal."}
                </p>
              </div>

              {/* Segmented Mode Switcher */}
              <div className="mt-4 grid grid-cols-2 rounded-2xl bg-secondary/80 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={cn(
                    "press flex h-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all",
                    mode === "signin"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={cn(
                    "press flex h-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all",
                    mode === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Create account
                </button>
              </div>


              {/* Social Logins - Only for signin/signup */}
              {mode !== "request" && (
                <div className="mt-5 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="press h-9.5 w-full rounded-xl bg-card text-xs font-semibold shadow-xs sm:h-10 sm:text-sm"
                    onClick={google}
                  >
                    <svg viewBox="0 0 24 24" className="mr-2 size-4 sm:size-5" aria-hidden="true">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.15-1.66.15-1.18z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              )}

              {mode !== "request" && (
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={submit} className="space-y-2.5 sm:space-y-3">
                {/* We removed the Role, Full Name, and Institution fields from the signup flow. */}
                {/* Users will now fill those out in the Onboarding flow instead. */}

                {mode === "request" && (
                  <div className="space-y-1">
                    <Label htmlFor="institutionName" className="text-[11px] font-semibold sm:text-xs">
                      Institution name
                    </Label>
                    <Input
                      id="institutionName"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      required
                      placeholder="University of Science"
                      className="h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[11px] font-semibold sm:text-xs">
                    {mode === "request" ? "Contact email" : "Email address"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="name@university.edu"
                    className="h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[11px] font-semibold sm:text-xs">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={mode === "signup" || mode === "request" ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    className="h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
                  />
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={busy}
                  className="press mt-1 h-9.5 w-full rounded-xl text-xs font-bold shadow-[var(--shadow-lift)] sm:h-10 sm:text-sm"
                >
                  {busy ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : null}
                  {mode === "signup" ? "Create account" : mode === "request" ? "Request access" : "Sign in"}
                </Button>
              </form>

              {/* Switch Mode Prompt */}
              <p className="mt-3.5 text-center text-xs text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New to docko.?"}{" "}
                <button
                  type="button"
                  className="font-bold text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </button>
                <br />
                {mode !== "request" && (
                  <button
                    type="button"
                    className="font-semibold text-primary/70 mt-2 hover:text-primary transition-colors underline-offset-4 hover:underline"
                    onClick={() => setMode("request")}
                  >
                    Are you an institution? Request access
                  </button>
                )}
              </p>
            </BentoCard>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
