import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { meQuery } from "@/lib/queries";
import { DockoMark } from "@/components/docko/app-shell";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{ title: "Welcome to docko." }],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery(meQuery);
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [institutionId, setInstitutionId] = useState("");
  const [fullName, setFullName] = useState("");
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    supabase.from("institutions").select("id, name").eq("status", "approved").then(({ data }) => {
      if (data) setInstitutions(data);
    });
  }, []);

  useEffect(() => {
    if (me && !fullName) {
      setFullName(me.fullName || "");
    }
    // If not pending, don't stay here
    if (me && !me.roles.includes("pending") && me.roles.length > 0) {
      navigate({ to: "/app" });
    }
  }, [me, fullName, navigate]);

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      if (!fullName.trim()) throw new Error("Full name is required");
      if (!institutionId) throw new Error("Please select an institution");
      
      const { error } = await supabase.rpc("complete_onboarding", {
        _role: role,
        _institution_id: institutionId,
        _full_name: fullName.trim(),
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome aboard!");
      navigate({ to: "/app" });
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading || (me && !me.roles.includes("pending"))) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin size-6 text-muted-foreground" /></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-md space-y-8 bg-card p-6 sm:p-10 rounded-[32px] shadow-[var(--shadow-elevation-medium)] border border-border/50">
        <div className="text-center">
          <DockoMark className="text-4xl" />
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Complete your profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">Just a few more details to get you started.</p>
        </div>

        <form 
          className="space-y-6" 
          onSubmit={(e) => {
            e.preventDefault();
            completeOnboarding.mutate();
          }}
        >
          <div className="space-y-3">
            <Label>I am a...</Label>
            <Select value={role} onValueChange={(val: any) => setRole(val)}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="student" className="rounded-xl">Student</SelectItem>
                <SelectItem value="mentor" className="rounded-xl">Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Institution</Label>
            <Select value={institutionId} onValueChange={setInstitutionId}>
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Select your institution" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {institutions.map(inst => (
                  <SelectItem key={inst.id} value={inst.id} className="rounded-xl">
                    {inst.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Full name</Label>
            <Input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-2xl"
              placeholder="Your full name"
            />
          </div>

          <Button type="submit" disabled={completeOnboarding.isPending} className="w-full press rounded-2xl">
            {completeOnboarding.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
