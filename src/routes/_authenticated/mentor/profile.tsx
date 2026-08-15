import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/mentor/profile")({
  component: MentorProfilePage,
});

const INSTITUTIONS = [
  "Massachusetts Institute of Technology (MIT)",
  "Stanford University",
  "Georgia Institute of Technology",
  "California Institute of Technology (Caltech)",
  "Local Metro Engineering Institute",
  "National Robotics Laboratory",
];

function MentorProfilePage() {
  const [institution, setInstitution] = useState<string>("");
  const [status, setStatus] = useState<"unverified" | "pending" | "verified">("unverified");
  const [isSimulating, setIsSimulating] = useState(false);

  function handleRequestVerification() {
    if (!institution) {
      toast.error("Please select an institution first.");
      return;
    }
    setStatus("pending");
    toast.success("Verification request sent to institution.");
  }

  function simulateInstitutionApproval() {
    setIsSimulating(true);
    setTimeout(() => {
      setStatus("verified");
      setIsSimulating(false);
      toast.success("Institution has verified your mentor status!");
    }, 1000);
  }

  return (
    <AppShell
      title="Mentor Profile"
      subtitle="Manage your credentials and affiliations"
    >
      <div className="max-w-xl mx-auto pt-4 space-y-6">
        <div>
          <SectionTitle title="Institutional Affiliation" hint="Select your primary lab or university." />
          <BentoCard className="p-6 space-y-6">
            <div className="space-y-3">
              <Label>Primary Institution</Label>
              <Select value={institution} onValueChange={setInstitution} disabled={status === "verified"}>
                <SelectTrigger className="w-full h-11 rounded-2xl">
                  <SelectValue placeholder="Select an institution..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {INSTITUTIONS.map((inst) => (
                    <SelectItem key={inst} value={inst} className="rounded-xl">
                      {inst}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              {status === "unverified" && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-3">
                  <ShieldAlert className="size-5 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Verification Required</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You must link your profile to an institution before you can officially sign off on student logs.
                    </p>
                    <Button onClick={handleRequestVerification} className="mt-2 press rounded-xl h-8 text-xs">
                      Request Verification
                    </Button>
                  </div>
                </div>
              )}

              {status === "pending" && (
                <div className="p-4 rounded-2xl bg-warning-soft border border-warning/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="size-5 text-warning shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-warning-foreground">Pending Approval</p>
                      <p className="text-xs text-warning-foreground/80">
                        {institution} is reviewing your request.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={simulateInstitutionApproval}
                    disabled={isSimulating}
                    className="press rounded-xl text-xs h-8 border-warning/30 hover:bg-warning/20 shrink-0"
                  >
                    {isSimulating ? "Approving..." : "[Dev] Simulate Approval"}
                  </Button>
                </div>
              )}

              {status === "verified" && (
                <div className="p-4 rounded-2xl bg-success-soft border border-success/20 flex items-start gap-3">
                  <BadgeCheck className="size-5 text-success shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-success">Verified Mentor</p>
                    <p className="text-xs text-success/80">
                      Authorized by {institution}. You can now sign off on fieldwork hours.
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
