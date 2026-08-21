import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, CheckCircle2, ShieldX } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoGrid, BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/docko";

export const Route = createFileRoute("/_authenticated/institution/people")({
  head: () => ({ meta: [{ title: "People · Institution" }] }),
  component: InstitutionPeoplePage,
});

function InstitutionPeoplePage() {
  const queryClient = useQueryClient();

  const { data: people, isLoading } = useQuery({
    queryKey: ["institution", "people"],
    queryFn: async () => {
      // Get the current user's institution
      const { data: me } = await supabase.auth.getUser();
      if (!me.user) return [];
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("institution_id")
        .eq("id", me.user.id)
        .single();
        
      if (!profile?.institution_id) return [];

      // Get everyone in this institution
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("institution_id", profile.institution_id)
        .order("created_at", { ascending: false });

      if (pErr) throw pErr;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", (profiles ?? []).map((p: any) => p.id));

      const peopleWithRoles = (profiles ?? []).map((p: any) => ({
        ...p,
        roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
      }));

      // Filter out institution admins (they shouldn't need to approve themselves)
      return peopleWithRoles.filter((p: any) => !p.roles.includes("institution"));
    }
  });

  const verifyUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc("verify_institution_member", { _target_user_id: userId });
      if (error) throw error;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["institution", "people"] });
      const previousPeople = queryClient.getQueryData(["institution", "people"]);
      
      queryClient.setQueryData(["institution", "people"], (old: any) => {
        if (!old) return old;
        return old.map((p: any) => p.id === userId ? { ...p, institution_verified: true } : p);
      });
      
      return { previousPeople };
    },
    onSuccess: () => {
      toast.success("User verified successfully");
    },
    onError: (err: any, _userId, context: any) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(["institution", "people"], context.previousPeople);
      }
      toast.error(err.message || "Failed to verify user")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "people"] });
    }
  });

  const unverifyUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc("unverify_institution_member", { _target_user_id: userId });
      if (error) throw error;
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["institution", "people"] });
      const previousPeople = queryClient.getQueryData(["institution", "people"]);
      queryClient.setQueryData(["institution", "people"], (old: any) => {
        if (!old) return old;
        return old.map((p: any) => p.id === userId ? { ...p, institution_verified: false } : p);
      });
      return { previousPeople };
    },
    onSuccess: () => toast.success("Member verification removed"),
    onError: (err: any, _userId, context: any) => {
      if (context?.previousPeople) {
        queryClient.setQueryData(["institution", "people"], context.previousPeople);
      }
      toast.error(err.message || "Failed to unverify member");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["institution", "people"] }),
  });

  const pendingPeople = people?.filter(p => !p.institution_verified) || [];
  const verifiedPeople = people?.filter(p => p.institution_verified) || [];

  return (
    <AppShell title="People" subtitle="Manage students and mentors">
      <BentoGrid>
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Pending Verification" hint="Approve users claiming to be from your institution" />
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4 px-2">Loading...</p>
            ) : pendingPeople.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 px-2">No pending verifications.</p>
            ) : (
              pendingPeople.map((person: any) => (
                <div key={person.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={person.avatar_url || ""} />
                      <AvatarFallback className="bg-primary-soft text-primary font-bold">
                        {initials(person.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {person.full_name}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {person.roles?.[0] || "Pending"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {person.department || person.position
                          ? [person.position, person.department].filter(Boolean).join(" · ")
                          : "Pending Approval"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="press rounded-xl shrink-0"
                    disabled={verifyUser.isPending}
                    onClick={() => verifyUser.mutate(person.id)}
                  >
                    <ShieldCheck className="size-4 mr-2" />
                    Verify
                  </Button>
                </div>
              ))
            )}
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Verified Members" hint="Officially recognized students and mentors" />
          
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground py-4 px-2">Loading...</p>
            ) : verifiedPeople.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 px-2">No verified members yet.</p>
            ) : (
              verifiedPeople.map((person: any) => (
                <div key={person.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={person.avatar_url || ""} />
                      <AvatarFallback className="bg-primary-soft text-primary font-bold">
                        {initials(person.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {person.full_name}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {person.roles?.[0] || "Member"}
                        </span>
                      </p>
                      <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        {person.position || "Verified Member"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="press rounded-xl shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                    disabled={unverifyUser.isPending}
                    onClick={() => unverifyUser.mutate(person.id)}
                  >
                    <ShieldX className="size-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
