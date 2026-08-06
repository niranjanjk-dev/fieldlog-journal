import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SkeletonTile } from "@/components/docko/bento";
import { meQuery, myEntriesQuery } from "@/lib/queries";

const LogMap = lazy(() => import("@/components/docko/log-map"));

export const Route = createFileRoute("/_authenticated/app/map")({
  head: () => ({
    meta: [
      { title: "Map · Docko" },
      { name: "description", content: "See every field log pinned where it was captured." },
      { property: "og:title", content: "Map · Docko" },
      { property: "og:description", content: "See every field log pinned where it was captured." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries } = useQuery(myEntriesQuery);
  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const located = mine.filter((entry) => entry.latitude != null && entry.longitude != null);

  return (
    <AppShell title="Map" subtitle={`${located.length} of ${mine.length} logs carry coordinates`}>
      <BentoCard className="p-3 sm:p-3">
        <ClientOnly fallback={<SkeletonTile className="h-[420px] rounded-2xl" />}>
          <Suspense fallback={<SkeletonTile className="h-[420px] rounded-2xl" />}>
            <LogMap entries={located} />
          </Suspense>
        </ClientOnly>
      </BentoCard>
    </AppShell>
  );
}
