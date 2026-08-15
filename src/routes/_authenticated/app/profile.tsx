import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { meQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/app/profile")({
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const [name, setName] = useState(me?.fullName ?? "");

  useEffect(() => {
    if (me?.fullName) {
      setName(me.fullName);
    }
  }, [me?.fullName]);

  const updateName = useMutation({
    mutationFn: async () => {
      if (!me) throw new Error("Not loaded");
      if (me.hasChangedName) throw new Error("Name already changed once.");
      
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim(), has_changed_name: true })
        .eq("id", me.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Name updated successfully!");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!me) return null;

  return (
    <AppShell title="Profile settings" subtitle="Manage your account details">
      <div className="max-w-xl mx-auto pt-4 space-y-6">
        <SectionTitle title="Personal Information" hint="Basic account details." />
        <BentoCard className="p-6 space-y-6">
          <div className="space-y-3">
            <Label>Email address</Label>
            <Input value={me.email ?? ""} disabled className="bg-muted/50 rounded-2xl" />
          </div>

          <div className="space-y-3">
            <Label>Full name</Label>
            <div className="flex gap-2">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={me.hasChangedName || updateName.isPending}
                className="rounded-2xl flex-1"
                placeholder="Enter your full name"
              />
              {!me.hasChangedName && (
                <Button 
                  onClick={() => name.trim() !== me.fullName && updateName.mutate()}
                  disabled={name.trim() === me.fullName || !name.trim() || updateName.isPending}
                  className="press rounded-2xl"
                >
                  Save
                </Button>
              )}
            </div>
            {me.hasChangedName ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-warning" />
                You have already changed your name once. Please contact your Institution's support to change it again.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="size-3.5 text-success" />
                You may update your name exactly once.
              </p>
            )}
          </div>
        </BentoCard>
      </div>
    </AppShell>
  );
}
