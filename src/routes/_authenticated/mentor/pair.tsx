import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Loader2,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { meQuery, teamsQuery } from "@/lib/queries";

interface PairSearchParams {
  studentId?: string;
  token?: string;
}

export const Route = createFileRoute("/_authenticated/mentor/pair")({
  validateSearch: (search: Record<string, unknown>): PairSearchParams => {
    const params: PairSearchParams = {};
    if (typeof search["studentId"] === "string") params.studentId = search["studentId"];
    if (typeof search["token"] === "string") params.token = search["token"];
    return params;
  },
  head: () => ({
    meta: [
      { title: "Pair with Student · Mentor Portal · Docko" },
      { name: "description", content: "Link with student to become their authorized fieldwork log approver." },
    ],
  }),
  component: MentorPairPage,
});

function MentorPairPage() {
  const { studentId } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(teamsQuery);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [paired, setPaired] = useState(false);

  // Fetch the scanned student's profile
  const { data: studentProfile, isLoading: loadingStudent } = useQuery({
    queryKey: ["student_profile", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      if (!studentId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, course, institution")
        .eq("id", studentId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Only show teams this mentor owns
  const myTeams = (teams ?? []).filter((t) => t.mentor_id === me?.id);

  const pairStudent = useMutation({
    mutationFn: async () => {
      if (!studentId) throw new Error("No student ID provided.");
      if (!selectedTeamId) throw new Error("Please select a team to add this student to.");

      const { error } = await supabase
        .from("team_members")
        .insert({ team_id: selectedTeamId, student_id: studentId });

      // If duplicate (already in team) treat as success
      if (error && !error.message.includes("duplicate")) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setPaired(true);
      toast.success(`${studentProfile?.full_name ?? "Student"} added to your team.`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const studentName = studentProfile?.full_name ?? "Fieldwork Student";

  if (!studentId) {
    return (
      <AppShell title="Pair with Student" subtitle="No student ID provided">
        <BentoCard className="p-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            This page requires a student ID from a QR scan. Use the scanner on your teams page.
          </p>
          <Button asChild variant="outline" className="press rounded-2xl">
            <Link to="/mentor/teams">Go to Teams</Link>
          </Button>
        </BentoCard>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Mentor Link & Authorization"
      subtitle="Add student to one of your teams to supervise their field logs"
    >
      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        <BentoCard className="p-6 sm:p-8 space-y-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <UserCheck className="size-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {paired ? "Pairing Confirmed" : "QR Pairing Token"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {paired ? "Pairing Complete!" : loadingStudent ? "Loading student…" : `Pair with ${studentName}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {paired
                ? `${studentName} is now in your team. Their logs will appear in your review queue.`
                : `You are adding ${studentName} to one of your teams. Once added, you can review, approve, and sign off their fieldwork logs.`}
            </p>
          </div>

          {/* Student details */}
          {studentProfile && (
            <div className="grid grid-cols-2 gap-3 text-left pt-2">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Student</span>
                <p className="text-sm font-bold text-foreground mt-0.5">{studentProfile.full_name}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
                <span className="text-[11px] text-muted-foreground font-medium">Course / Program</span>
                <p className="text-xs font-bold text-foreground mt-1 truncate">
                  {studentProfile.course || studentProfile.institution || "—"}
                </p>
              </div>
            </div>
          )}

          {/* Team selector */}
          {!paired && (
            <div className="text-left space-y-2 pt-2">
              <Label>Add to team <span className="text-destructive">*</span></Label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="rounded-2xl h-11">
                  <SelectValue placeholder={myTeams.length === 0 ? "Create a team first" : "Select a team…"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {myTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="rounded-xl">
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {myTeams.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  You have no teams yet. <Link to="/mentor/teams" className="text-primary underline">Create one first.</Link>
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!paired ? (
              <>
                <Button
                  onClick={() => pairStudent.mutate()}
                  disabled={pairStudent.isPending || !selectedTeamId}
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  {pairStudent.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  <span>{pairStudent.isPending ? "Adding to team…" : "Confirm & Add to Team"}</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/mentor">Cancel</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <Link to="/mentor/verify">
                    <span>Review Queue</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/mentor/teams">
                    <Users className="size-4 mr-1.5" />
                    My Teams
                  </Link>
                </Button>
              </>
            )}
          </div>
        </BentoCard>
      </div>
    </AppShell>
  );
}
