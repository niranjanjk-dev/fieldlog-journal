import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Clock, Users } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid, MiniBars, SectionTitle, StatTile } from "@/components/docko/bento";
import { sumHours, weeklyActivity } from "@/lib/docko";
import { peopleQuery, reviewQueueQuery, teamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Institution · Docko" },
      { name: "description", content: "Institution-wide fieldwork hours, verification rate and teams." },
      { property: "og:title", content: "Institution · Docko" },
      { property: "og:description", content: "Institution-wide fieldwork hours and verification rate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: entries } = useQuery(reviewQueueQuery);
  const { data: people } = useQuery(peopleQuery);
  const { data: teams } = useQuery(teamsQuery);

  const all = entries ?? [];
  const verified = all.filter((entry) => entry.status === "verified");

  return (
    <AppShell title="Institution" subtitle="Everything happening across your cohorts">
      <BentoGrid>
        <StatTile className="lg:col-span-2" label="Members" value={people?.length ?? 0} icon={<Users className="size-4" />} />
        <StatTile className="lg:col-span-2" label="Hours logged" value={sumHours(all)} unit="h" icon={<Clock className="size-4" />} />
        <StatTile
          className="lg:col-span-2"
          label="Verification rate"
          value={all.length ? Math.round((verified.length / all.length) * 100) : 0}
          unit="%"
          hint={`${teams?.length ?? 0} teams`}
          icon={<BadgeCheck className="size-4" />}
        />
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Institution activity" hint="Logs captured per day" />
          <MiniBars data={weeklyActivity(all)} />
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
