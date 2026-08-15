import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SectionTitle } from "@/components/docko/bento";
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
      { property: "og:title", content: "Teams · docko." },
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
    <AppShell title="Teams" subtitle="Placement groups you look after">
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
                  <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
                    Add student
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
    </AppShell>
  );
}
