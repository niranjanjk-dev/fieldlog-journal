import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SectionTitle } from "@/components/docko/bento";
import { meQuery, institutionTeamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/institution/teams")({
  head: () => ({
    meta: [
      { title: "Teams · Institution · Docko" },
      { name: "description", content: "Every placement team across your institution and its members." },
      { property: "og:title", content: "Teams · Institution · Docko" },
      { property: "og:description", content: "Every placement team across your institution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionTeamsPage,
});

function InstitutionTeamsPage() {
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(institutionTeamsQuery(me?.institutionId ?? null));

  return (
    <AppShell title="Teams" subtitle={`${teams?.length ?? 0} teams at your institution`}>
      {!teams || teams.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No teams yet"
          body="Verified mentors from your institution create teams and add their students."
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
