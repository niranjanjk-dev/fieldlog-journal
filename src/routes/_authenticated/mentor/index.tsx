import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Users } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid, MiniBars, SectionTitle, StatTile } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { sumHours, weeklyActivity } from "@/lib/docko";
import { reviewQueueQuery, teamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/mentor/")({
  head: () => ({
    meta: [
      { title: "Mentor overview · Docko" },
      { name: "description", content: "Team activity, pending verifications and logged hours." },
      { property: "og:title", content: "Mentor overview · Docko" },
      { property: "og:description", content: "Team activity and pending verifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorOverview,
});

function MentorOverview() {
  const { data: queue } = useQuery(reviewQueueQuery);
  const { data: teams } = useQuery(teamsQuery);

  const all = queue ?? [];
  const pending = all.filter((entry) => entry.status === "pending");
  const students = new Set(all.map((entry) => entry.student_id));

  return (
    <AppShell
      title="Mentor overview"
      subtitle="Where your students are, at a glance"
      actions={
        <Button asChild className="press rounded-2xl">
          <Link to="/mentor/verify">Review queue</Link>
        </Button>
      }
    >
      <BentoGrid>
        <StatTile
          className="lg:col-span-2"
          label="Awaiting you"
          value={pending.length}
          hint="Logs needing verification"
          icon={<CheckCircle2 className="size-4" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Hours this cohort"
          value={sumHours(all)}
          unit="h"
          icon={<Clock className="size-4" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Active students"
          value={students.size}
          hint={`${teams?.length ?? 0} teams`}
          icon={<Users className="size-4" />}
        />
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Team activity" hint="Logs captured per day across your students" />
          <MiniBars data={weeklyActivity(all)} />
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
