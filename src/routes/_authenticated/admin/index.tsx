import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Users, Building, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoGrid, StatTile, BentoCard, SectionTitle } from "@/components/docko/bento";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "System Admin · Docko" }] }),
  component: SystemAdminPage,
});

function SystemAdminPage() {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [profiles, institutions] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("institutions").select("id", { count: "exact" })
      ]);
      return {
        users: profiles.count ?? 0,
        institutions: institutions.count ?? 0
      };
    }
  });

  const { data: requests } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institution_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const approveRequest = useMutation({
    mutationFn: async (req: any) => {
      // Create institution
      const { data: inst, error: instErr } = await supabase
        .from("institutions")
        .insert({ name: req.institution_name, contact_email: req.email })
        .select("id").single();
      if (instErr) throw instErr;

      // Update request status
      await supabase.from("institution_requests").update({ status: "approved" }).eq("id", req.id);

      // Grant institution role to the user who requested it
      await supabase.from("user_roles").insert({ user_id: req.user_id, role: "institution" }).select();
      
      // Link user profile to institution
      await supabase.from("profiles").update({ institution_id: inst.id }).eq("id", req.user_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Institution approved and access granted");
    },
    onError: (err: any) => toast.error(err.message)
  });

  return (
    <AppShell title="System Admin" subtitle="Manage the Docko platform">
      <BentoGrid>
        <StatTile className="lg:col-span-3" label="Total Users" value={stats?.users ?? 0} icon={<Users className="size-4" />} />
        <StatTile className="lg:col-span-3" label="Institutions" value={stats?.institutions ?? 0} icon={<Building className="size-4" />} />
        
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Institution Requests" hint="Approve access requests" />
          
          <div className="space-y-4">
            {(!requests || requests.length === 0) ? (
              <p className="text-sm text-muted-foreground py-4">No pending requests.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-bold">{req.institution_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="size-3" /> {req.email}
                    </p>
                  </div>
                  {req.status === "pending" ? (
                    <Button 
                      size="sm" 
                      className="press rounded-xl"
                      disabled={approveRequest.isPending}
                      onClick={() => approveRequest.mutate(req)}
                    >
                      <ShieldCheck className="size-4 mr-2" />
                      Approve
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Approved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
