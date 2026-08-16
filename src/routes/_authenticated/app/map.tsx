import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SkeletonTile } from "@/components/docko/bento";
import LogMap from "@/components/docko/log-map";
import { meQuery, myEntriesQuery, photoUrlsQuery, reviewQueueQuery } from "@/lib/queries";
import { getSavedWorkspaces } from "@/lib/workspace-matcher";

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
  const { data: queue } = useQuery(reviewQueueQuery);

  const mine = (entries ?? []).filter((entry) => Boolean(entry) && (!me?.id || entry.student_id === me.id));
  const located = mine.filter((entry) => entry.latitude != null && entry.longitude != null);

  const photoPaths = useMemo(
    () => located.map((e) => e.photo_path).filter((p): p is string => Boolean(p)),
    [located],
  );
  const { data: photoUrls } = useQuery(photoUrlsQuery(photoPaths));

  const workspaces = useMemo(() => getSavedWorkspaces(), []);

  return (
    <AppShell title="Map" subtitle={`${located.length} of ${mine.length} logs carry coordinates`}>
      <BentoCard className="p-2 sm:p-3">
        <ClientOnly fallback={<SkeletonTile className="h-[520px] rounded-2xl" />}>
          <LogMap
            entries={located}
            peerEntries={queue ?? []}
            workspaces={workspaces}
            photoUrls={photoUrls ?? {}}
            currentUserId={me?.id ?? ""}
          />
        </ClientOnly>
      </BentoCard>
    </AppShell>
  );
}
