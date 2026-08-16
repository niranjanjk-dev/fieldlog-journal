import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, BadgeCheck, Building2, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { meQuery, institutionsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/mentor/profile")({
  component: MentorProfilePage,
});

function MentorProfilePage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: institutions, isLoading: loadingInstitutions } = useQuery(institutionsQuery);

  const [name, setName] = useState("");
  const [institutionId, setInstitutionId] = useState<string>("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (me) {
      setName(me.fullName);
      setInstitutionId(me.institutionId ?? "");
      setDepartment(me.department ?? "");
      setPosition(me.position ?? "");
      setPhone(me.phone ?? "");
    }
  }, [me]);

  // Derive verification status from DB fields
  const isVerified = me?.institutionVerified ?? false;
  const hasPendingInstitution = !!me?.institutionId && !isVerified;

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

  const requestVerification = useMutation({
    mutationFn: async () => {
      if (!me) throw new Error("Not loaded");
      if (!institutionId) throw new Error("Please select your institution first.");
      if (!department.trim() || !position.trim() || !phone.trim()) {
        throw new Error("Please fill out all affiliation details.");
      }

      // Save profile with institution_id, department, position, phone
      // Setting institution_verified = false means they appear in institution /people as pending
      const { error } = await supabase
        .from("profiles")
        .update({
          institution_id: institutionId,
          institution: institutions?.find((i) => i.id === institutionId)?.name ?? null,
          department: department.trim() || null,
          position: position.trim() || null,
          phone: phone.trim() || null,
          institution_verified: false,
        })
        .eq("id", me.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Verification request sent to your institution.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!me) return null;

  return (
    <AppShell
      title="Mentor Profile"
      subtitle="Manage your credentials and affiliations"
    >
      <div className="max-w-xl mx-auto pt-4 space-y-6">
        
        {/* PERSONAL INFORMATION */}
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
                  {updateName.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
                </Button>
              )}
            </div>
            {me.hasChangedName ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-warning" />
                You have already changed your name once. Please contact support to change it again.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="size-3.5 text-success" />
                You may update your name exactly once.
              </p>
            )}
          </div>
        </BentoCard>

        {/* INSTITUTIONAL AFFILIATION */}
        <div>
          <SectionTitle title="Institutional Affiliation" hint="Details required for mentor verification." />
          <BentoCard className="p-6 space-y-6">
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Primary Institution <span className="text-destructive">*</span></Label>
                <Select
                  value={institutionId}
                  onValueChange={setInstitutionId}
                  disabled={isVerified || requestVerification.isPending}
                >
                  <SelectTrigger className="w-full h-11 rounded-2xl">
                    <SelectValue placeholder={loadingInstitutions ? "Loading institutions..." : "Select your institution..."} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {(institutions ?? []).map((inst) => (
                      <SelectItem key={inst.id} value={inst.id} className="rounded-xl">
                        {inst.name}
                      </SelectItem>
                    ))}
                    {!loadingInstitutions && (institutions ?? []).length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">No institutions available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Department or Lab <span className="text-destructive">*</span></Label>
                <Input 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  disabled={isVerified || requestVerification.isPending}
                  className="rounded-2xl"
                  placeholder="e.g. Robotics Laboratory"
                />
              </div>

              <div className="space-y-3">
                <Label>Position / Title <span className="text-destructive">*</span></Label>
                <Input 
                  value={position} 
                  onChange={(e) => setPosition(e.target.value)} 
                  disabled={isVerified || requestVerification.isPending}
                  className="rounded-2xl"
                  placeholder="e.g. Senior Research Scientist"
                />
              </div>

              <div className="space-y-3">
                <Label>Contact Phone Number <span className="text-destructive">*</span></Label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  disabled={isVerified || requestVerification.isPending}
                  className="rounded-2xl"
                  placeholder="e.g. +1 555-0123"
                  type="tel"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              {!me.institutionId && !isVerified && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-3">
                  <ShieldAlert className="size-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1 w-full">
                    <p className="text-sm font-semibold">Verification Required</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Select your institution and fill in your affiliation details to request verification. Your institution admin will confirm your membership.
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => requestVerification.mutate()} 
                        disabled={requestVerification.isPending}
                        className="mt-3 press rounded-xl h-8 text-xs"
                      >
                        {requestVerification.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        Request Verification
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {hasPendingInstitution && (
                <div className="p-4 rounded-2xl bg-warning-soft border border-warning/20 flex items-start gap-3">
                  <Building2 className="size-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-warning-foreground">Pending Institution Approval</p>
                    <p className="text-xs text-warning-foreground/80">
                      Your verification request has been sent. Your institution admin will review and confirm your membership.
                    </p>
                  </div>
                </div>
              )}

              {isVerified && (
                <div className="p-4 rounded-2xl bg-success-soft border border-success/20 flex items-start gap-3">
                  <BadgeCheck className="size-5 text-success shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-success">Verified Mentor</p>
                    <p className="text-xs text-success/80">
                      Authorized by {me.institution ?? "your institution"}. You can now sign off on fieldwork hours.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </BentoCard>
        </div>
      </div>
    </AppShell>
  );
}
