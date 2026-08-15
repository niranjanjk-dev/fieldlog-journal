import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { Plus, QrCode, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SectionTitle } from "@/components/docko/bento";
import { ScannerModal } from "@/components/docko/scanner-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/docko";
import { meQuery, peopleQuery, teamsQuery } from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_authenticated/mentor/teams")({
  head: () => ({
    meta: [
      { title: "Teams · docko." },
      { name: "description", content: "Team rosters, student progress, and verification metrics." },
      { property: "og:title", content: "Mentees & Teams · docko." },
      { property: "og:description", content: "Group students into placement teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(teamsQuery);
  const { data: people } = useQuery(peopleQuery);
  const [name, setName] = useState("");
  const [scanningTeamId, setScanningTeamId] = useState<string | null>(null);
  const [isScanningGlobal, setIsScanningGlobal] = useState(false);
  const navigate = useNavigate({ from: "/_authenticated/mentor/teams" });

  const students = (people ?? []).filter((person) => person.roles.includes("student"));

  const createTeam = useMutation({
    mutationFn: async () => {
      if (!me) throw new Error("Still loading your account.");
      const { error } = await supabase
        .from("teams")
        .insert({ name: name.trim(), mentor_id: me.id });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addMember = useMutation({
    mutationFn: async (input: { teamId: string; studentId: string }) => {
      const { error } = await supabase
        .from("team_members")
        .insert({ team_id: input.teamId, student_id: input.studentId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Student added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const myTeams = (teams ?? []).filter(
    (team) => team.mentor_id === me?.id || me?.roles.includes("admin"),
  );

  return (
    <AppShell 
      title="Mentees & Teams" 
      subtitle="Students and placement groups you look after"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="press rounded-2xl" onClick={() => setIsScanningGlobal(true)}>
            <QrCode className="size-4 mr-2" />
            Scan Student
          </Button>
        </div>
      }
    >
      
      {/* ALL MENTEES LIST */}
      <BentoCard className="mb-6">
        <SectionTitle title="Your Mentees" hint={`Total of ${students.length} active students`} />
        {students.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title="No students yet"
            body="Scan a student's QR code to become their mentor."
          />
        ) : (
          <ul className="space-y-3 pt-2">
            {students.map((student) => (
              <li key={student.id} className="flex items-center gap-3 p-2 hover:bg-muted/30 rounded-xl">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-muted text-xs">
                    {initials(student.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{student.full_name}</p>
                  <p className="text-xs text-muted-foreground">{student.institution || "Student"}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>

      <BentoCard className="mb-6">
        <SectionTitle title="New team" hint="Name it after the placement, site, or project group." />
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim()) createTeam.mutate();
          }}
        >
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Fall 2026 Mechatronics Cohort"
            className="rounded-2xl"
          />
          <Button type="submit" disabled={createTeam.isPending} className="press rounded-2xl">
            <Plus className="size-4" />
            Create
          </Button>
        </form>
      </BentoCard>

      {myTeams.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No teams yet"
          body="Create a team, then add the students on that placement."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {myTeams.map((team) => {
            const members =
              (team.team_members as
                | { id: string; student_id: string; profile: { full_name: string } | null }[]
                | null) ?? [];
            return (
              <BentoCard key={team.id}>
                <SectionTitle
                  title={team.name}
                  hint={`${members.length} student${members.length === 1 ? "" : "s"}`}
                />
                <ul className="space-y-2">
                  {members.map((member) => (
                    <li key={member.id} className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-muted text-[11px]">
                          {initials(member.profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.profile?.full_name ?? "Student"}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-border pt-3">
                  <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase flex items-center justify-between">
                    <span>Add student</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] press rounded-md text-primary"
                      onClick={() => setScanningTeamId(team.id)}
                    >
                      <QrCode className="size-3 mr-1" />
                      Scan QR
                    </Button>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {students
                      .filter((student) => !members.some((m) => m.student_id === student.id))
                      .slice(0, 8)
                      .map((student) => (
                        <Button
                          key={student.id}
                          size="sm"
                          variant="outline"
                          className="press rounded-xl"
                          onClick={() =>
                            addMember.mutate({ teamId: team.id, studentId: student.id })
                          }
                        >
                          <UserPlus className="size-3.5" />
                          {student.full_name}
                        </Button>
                      ))}
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </div>
      )}

      <ScannerModal
        open={!!scanningTeamId}
        onOpenChange={(open) => !open && setScanningTeamId(null)}
        title="Scan Student Code"
        description="Scan a student's ID badge to add them to this team."
        mockData={students[0]?.id ?? "00000000-0000-0000-0000-000000000000"}
        onScan={(data) => {
          if (scanningTeamId) {
            try {
              // Try to parse as URL to extract studentId param
              const url = new URL(data);
              const extractedId = url.searchParams.get("studentId");
              if (extractedId) {
                addMember.mutate({ teamId: scanningTeamId, studentId: extractedId });
                return;
              }
            } catch {
              // Not a valid URL, assume it's a raw ID
            }
            addMember.mutate({ teamId: scanningTeamId, studentId: data });
          }
        }}
      />

      <ScannerModal
        open={isScanningGlobal}
        onOpenChange={setIsScanningGlobal}
        title="Scan Student Code"
        description="Scan a student's pairing QR code to become their mentor."
        mockData={students[0]?.id ?? "00000000-0000-0000-0000-000000000000"}
        onScan={(data) => {
          try {
            // Try to parse as URL to extract studentId param
            const url = new URL(data);
            const extractedId = url.searchParams.get("studentId");
            if (extractedId) {
              navigate({ to: "/mentor/pair", search: { studentId: extractedId } });
              return;
            }
          } catch {
            // Not a valid URL, assume it's a raw ID
          }
          navigate({ to: "/mentor/pair", search: { studentId: data } });
        }}
      />
    </AppShell>
  );
}
