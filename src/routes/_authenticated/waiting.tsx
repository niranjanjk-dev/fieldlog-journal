import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CheckCircle2, Clock, Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { meQuery, systemSettingsQuery } from "@/lib/queries";
import { BentoCard } from "@/components/docko/bento";

export const Route = createFileRoute("/_authenticated/waiting")({
  head: () => ({
    meta: [{ title: "Waiting for approval — docko." }],
  }),
  component: WaitingPage,
});

function WaitingPage() {
  const navigate = useNavigate();
  const { data: me, isLoading: loadingMe } = useQuery(meQuery);
  const { data: settings, isLoading: loadingSettings } = useQuery(systemSettingsQuery);

  // Fetch the institution name from the institutions table using institutionId
  const { data: institution } = useQuery({
    queryKey: ["institution", me?.institutionId],
    enabled: !!me?.institutionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutions")
        .select("name")
        .eq("id", me!.institutionId!)
        .maybeSingle();
      if (error) return null;
      return data;
    },
  });

  useEffect(() => {
    // If they have an active role (not just pending), redirect to app
    const hasActiveRole = me && me.roles.some((r: string) => r !== "pending");
    if (me && hasActiveRole) {
      navigate({ to: "/app" });
      return;
    }

    // SELF-HEALING: If this is an institution request that failed to insert (due to no session at signup)
    if (me && !hasActiveRole && !me.institutionId && me.institution) {
      supabase.from("institution_requests")
        .select("id")
        .eq("user_id", me.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) {
            // Fetch user metadata to get phone_number and proof_details
            supabase.auth.getUser().then(({ data: authData }) => {
              if (authData?.user) {
                const meta = authData.user.user_metadata;
                supabase.from("institution_requests").insert({
                  user_id: me.id,
                  institution_name: me.institution!,
                  email: authData.user.email!,
                  phone_number: meta?.phone_number || "",
                  proof_details: meta?.proof_details || ""
                }).then(() => {
                  console.log("Self-healed institution request");
                });
              }
            });
          }
        });
    }
  }, [me, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loadingMe || loadingSettings || (me && me.roles.some((r: string) => r !== "pending"))) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }

  // Determine institution name: from institutions table, or old text field, or generic
  const institutionName = institution?.name ?? me?.institution ?? "your institution";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <span className="font-display text-2xl font-bold tracking-tight text-foreground">docko.</span>
      </div>

      <div className="w-full max-w-md space-y-8">
        <BentoCard className="p-6 sm:p-10 text-center shadow-[var(--shadow-elevation-medium)]">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-secondary text-primary shadow-sm">
            <Clock className="size-8" />
          </div>
          
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Waiting for approval
          </h1>
          
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Your institution request for <strong>{institutionName}</strong> is currently pending approval from our system administrators.
          </p>

          <div className="mt-8 rounded-2xl bg-secondary/50 p-4 text-left border border-border/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="size-3.5" /> What happens next?
            </h3>
            <p className="mt-2 text-[13px] text-foreground/80">
              We are reviewing your request to ensure authenticity. Once approved, you will gain full access to the institution dashboard.
            </p>
          </div>

          {settings?.show_admin_email_on_waiting && settings?.admin_contact_email && (
            <p className="mt-6 text-xs text-muted-foreground border-t border-border/50 pt-5">
              If you have any questions or need to expedite the process, please contact us at{" "}
              <a href={`mailto:${settings.admin_contact_email}`} className="font-semibold text-primary hover:underline underline-offset-4">
                {settings.admin_contact_email}
              </a>.
            </p>
          )}

          <Button 
            variant="outline" 
            className="press mt-8 w-full rounded-2xl text-xs font-semibold"
            onClick={signOut}
          >
            <LogOut className="mr-2 size-4" /> Sign out
          </Button>
        </BentoCard>
      </div>
    </div>
  );
}
