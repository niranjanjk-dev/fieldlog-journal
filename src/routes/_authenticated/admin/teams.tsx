import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SectionTitle } from "@/components/docko/bento";
import { teamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/teams")({
  head: () => ({
    meta: [
      { title: "All teams · Docko" },
      { name: "description", content: "Every placement team across your institution and its members." },
      { property: "og:title", content: "All teams · Docko" },
      { property: "og:description", content: "Every placement team across your institution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminTeamsPage,
});

function AdminTeamsPage() {
  const { data: teams } = useQuery(teamsQuery);

  return (
    <AppShell title="All teams" subtitle={`${teams?.length ?? 0} placement teams`}>
      {!teams || teams.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No teams yet"
          body="Mentors create teams and add the students on each placement."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => {
            const members =
              (team.team_members as
                | { id: string; profile: { full_name: string } | null }[]
                | null) ?? [];
            return (
              <BentoCard key={team.id}>
                <SectionTitle
                  title={team.name}
                  hint={`${members.length} student${members.length === 1 ? "" : "s"}`}
                />
                <p className="text-sm text-muted-foreground">
                  {members.map((m) => m.profile?.full_name ?? "Student").join(", ") || "No members yet"}
                </p>
              </BentoCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
