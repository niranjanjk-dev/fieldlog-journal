import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Loader2, ShieldCheck } from "lucide-react";

import { DockoMark } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode | undefined } => ({
    mode: search["mode"] === "signup" ? "signup" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in to Docko" },
      {
        name: "description",
        content:
          "Sign in or create a Docko account to log verified fieldwork, review student logs and manage placement teams.",
      },
      { property: "og:title", content: "Sign in to Docko" },
      {
        property: "og:description",
        content: "Access your Docko field log book, review queue or institution dashboard.",
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
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [fullName, setFullName] = useState("");
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
            data: { full_name: fullName, institution, role },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSentTo(email);
          return;
        }
        navigate({ to: "/app" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/app" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-sidebar p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <DockoMark />
          <span className="text-lg font-semibold tracking-tight">Docko</span>
        </Link>
        <div>
          <h2 className="max-w-sm text-3xl leading-tight font-semibold tracking-tight">
            Every log carries its own proof.
          </h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            Photo, place and time captured as you work — verified by your mentor, not reconstructed
            from memory.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Built for placements, fieldwork and clinicals.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <DockoMark />
            <span className="text-lg font-semibold tracking-tight">Docko</span>
          </Link>

          {sentTo ? (
            <BentoCard>
              <h1 className="text-xl font-semibold tracking-tight">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium">{sentTo}</span>. Open it
                to activate your Docko account, then come back and sign in.
              </p>
              <Button
                variant="outline"
                className="press mt-5 w-full rounded-2xl"
                onClick={() => {
                  setSentTo(null);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </BentoCard>
          ) : (
            <BentoCard>
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === "signup" ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Start logging fieldwork in under a minute."
                  : "Sign in to pick up your log book."}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={google}
                className="press mt-6 w-full rounded-2xl"
              >
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or use email
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { key: "student", label: "Student", icon: GraduationCap },
                          { key: "mentor", label: "Mentor", icon: ShieldCheck },
                        ] as const
                      ).map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => setRole(option.key)}
                          className={cn(
                            "press flex flex-col items-start gap-1 rounded-2xl border p-3 text-left",
                            role === option.key
                              ? "border-primary bg-primary-soft text-primary"
                              : "border-border hover:bg-accent",
                          )}
                          aria-pressed={role === option.key}
                        >
                          <option.icon className="size-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        autoComplete="name"
                        className="rounded-2xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="institution">Institution</Label>
                      <Input
                        id="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Barkatullah University"
                        className="rounded-2xl"
                      />
                    </div>
                  </>
                ) : null}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="rounded-2xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="rounded-2xl"
                  />
                </div>

                <Button type="submit" disabled={busy} className="press w-full rounded-2xl">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                  {mode === "signup" ? "Create account" : "Sign in"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New to Docko?"}{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </button>
              </p>
            </BentoCard>
          )}
        </div>
      </div>
    </div>
  );
}
