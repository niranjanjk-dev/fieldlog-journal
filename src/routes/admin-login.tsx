import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

import { DockoLogo } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [{ title: "System Administration — docko." }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) {
        // If already logged in, redirect them. They might not be an admin, 
        // but the AppShell will handle blocking them if they aren't.
        navigate({ to: "/admin" });
      }
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      // 1. Sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      if (authError) throw authError;

      // 2. Verify they are actually an admin before letting them proceed
      if (authData.user) {
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authData.user.id);
          
        if (rolesError) throw rolesError;
        
        const hasAdmin = roles?.some(r => r.role === "admin");
        
        if (!hasAdmin) {
          await supabase.auth.signOut();
          throw new Error("Access denied: You do not have System Administrator privileges.");
        }
      }

      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-start">
        <Link to="/" className="flex items-center">
          <DockoLogo className="text-xl sm:text-2xl text-foreground" />
        </Link>
        <span className="ml-3 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
          System Admin
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 -mt-12">
        <div className="w-full max-w-sm">
          <BentoCard className="p-6 sm:p-8 shadow-[var(--shadow-lift)]">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-red-500/10 text-red-500">
              <ShieldAlert className="size-6" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight">
              Restricted Access
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Please authenticate to access the Docko administration controls.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="sysadmin@docko.app"
                className="h-10 rounded-xl px-3 text-sm focus-visible:ring-red-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-10 rounded-xl px-3 text-sm focus-visible:ring-red-500/50"
              />
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="press mt-2 h-10 w-full rounded-xl text-sm font-bold shadow-sm"
            >
              {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Authenticate
            </Button>
          </form>
        </BentoCard>
        
        <p className="mt-6 text-center text-xs text-muted-foreground">
          This portal is strictly for authorized personnel. <br/> Not an admin? <a href="/auth" className="text-primary hover:underline underline-offset-4">Go to the main app</a>.
        </p>
        </div>
      </main>
    </div>
  );
}
