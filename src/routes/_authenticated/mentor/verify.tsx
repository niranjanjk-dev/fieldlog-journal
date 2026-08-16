import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, Inbox, MapPin, XCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { EmptyState, SkeletonTile } from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Button } from "@/components/ui/button";
import { reviewEntry, sendNudge } from "@/lib/entries";
import type { EntryStatus } from "@/lib/docko";
import { photoUrlsQuery, reviewQueueQuery, meQuery } from "@/lib/queries";
import { saveApprovedWorkspace } from "@/lib/workspace-matcher";
import { cn } from "@/lib/utils";
import { UserCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mentor/verify")({
  head: () => ({
    meta: [
      { title: "Verify logs · docko." },
      { name: "description", content: "Approve or request changes on student field logs in one tap." },
      { property: "og:title", content: "Verify logs · docko." },
      { property: "og:description", content: "Approve or request changes on student field logs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

const tabs: { key: EntryStatus; label: string }[] = [
  { key: "pending", label: "Awaiting review" },
  { key: "verified", label: "Verified" },
  { key: "rejected", label: "Needs changes" },
];

function VerifyPage() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: queue, isLoading } = useQuery(reviewQueueQuery);
  const [tab, setTab] = useState<EntryStatus>("pending");
  const [assignedOnly, setAssignedOnly] = useState<boolean>(false);

  const allVisible = (queue ?? []).filter((entry) => entry.status === tab);
  const visible = assignedOnly
    ? allVisible.filter((entry) => {
        if (!entry.assigned_mentor_ids || entry.assigned_mentor_ids.length === 0) return true;
        return me?.id ? entry.assigned_mentor_ids.includes(me.id) : true;
      })
    : allVisible;

  const { data: photos } = useQuery(
    photoUrlsQuery(
      visible.slice(0, 30).map((entry) => entry.photo_path).filter((p): p is string => Boolean(p)),
    ),
  );

  const review = useMutation({
    mutationFn: (input: {
      id: string;
      status: "verified" | "rejected";
      note: string | null;
      asWorkspace?: boolean;
      entryData?: { latitude: number | null; longitude: number | null; address: string | null; title: string; team_id: string | null };
    }) => {
      if (input.status === "verified" && input.entryData?.latitude && input.entryData?.longitude) {
        saveApprovedWorkspace({
          id: input.id,
          name: input.entryData.address || input.entryData.title || "Approved Workspace",
          latitude: input.entryData.latitude,
          longitude: input.entryData.longitude,
          teamId: input.entryData.team_id ?? undefined,
        });
      }
      return reviewEntry(input.id, input.status, input.note);
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["entries", "queue"] });
      const previousQueue = queryClient.getQueryData(["entries", "queue"]);
      
      queryClient.setQueryData(["entries", "queue"], (old: any) => {
        if (!old) return old;
        return old.map((entry: any) => 
          entry.id === input.id ? { ...entry, status: input.status } : entry
        );
      });
      
      return { previousQueue };
    },
    onSuccess: (_data, input) => {
      toast.success(
        input.status === "verified"
          ? input.asWorkspace
            ? "Log verified & saved as approved workspace location"
            : "Log verified"
          : "Changes requested",
      );
    },
    onError: (error: Error, _input, context: any) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(["entries", "queue"], context.previousQueue);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const nudge = useMutation({
    mutationFn: (studentId: string) =>
      sendNudge(studentId, "Your mentor is waiting on your latest field log."),
    onSuccess: () => toast.success("Nudge sent"),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell title="Verify" subtitle="One review queue for all your assigned students">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={cn(
                "press rounded-2xl border px-3.5 py-1.5 text-sm font-medium",
                tab === item.key
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border hover:bg-accent",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Assigned filter toggle */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setAssignedOnly(false)}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-semibold transition-all",
              !assignedOnly
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All Queue ({allVisible.length})
          </button>
          <button
            type="button"
            onClick={() => setAssignedOnly(true)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all",
              assignedOnly
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <UserCheck className="size-3.5" />
            <span>Assigned to Me</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTile className="h-64" />
          <SkeletonTile className="h-64" />
        </div>
      ) : me && !me.institutionVerified && !me.roles.includes("admin") ? (
        <EmptyState
          icon={<ShieldCheck className="size-5 text-destructive" />}
          title="Account not verified"
          body="Your mentor account must be verified by your institution before you can review student logs."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="Queue is clear"
          body="Nothing in this state right now. New student logs land here automatically."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              author={entry.student}
              photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
              footer={
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="press rounded-xl"
                    onClick={() => nudge.mutate(entry.student_id)}
                    aria-label="Nudge student"
                  >
                    <BellRing className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="press rounded-xl"
                    onClick={() => {
                      const note = window.prompt("What needs changing?");
                      if (note) review.mutate({ id: entry.id, status: "rejected", note });
                    }}
                  >
                    <XCircle className="size-4" />
                    Changes
                  </Button>
                  <Button
                    size="sm"
                    className="press rounded-xl"
                    onClick={() =>
                      review.mutate({
                        id: entry.id,
                        status: "verified",
                        note: null,
                        asWorkspace: true,
                        entryData: {
                          latitude: entry.latitude,
                          longitude: entry.longitude,
                          address: entry.address,
                          title: entry.title,
                          team_id: entry.team_id,
                        },
                      })
                    }
                  >
                    <CheckCircle2 className="size-4" />
                    Verify
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
