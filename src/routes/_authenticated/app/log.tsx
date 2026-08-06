import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Camera,
  CheckCircle2,
  Crosshair,
  Loader2,
  MapPin,
  Sparkles,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEntry, getPosition } from "@/lib/entries";
import { reverseGeocode } from "@/lib/geocode.functions";
import { meQuery, myEntriesQuery, teamsQuery } from "@/lib/queries";
import {
  findNearestWorkspace,
  getSavedWorkspaces,
  type WorkspaceLocation,
} from "@/lib/workspace-matcher";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/log")({
  head: () => ({
    meta: [
      { title: "New log · Docko" },
      {
        name: "description",
        content: "Capture a field log with photo, location, hours and notes.",
      },
      { property: "og:title", content: "New log · Docko" },
      { property: "og:description", content: "Capture a field log with photo, location and hours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewLogPage,
});

const quickHours = [0.5, 1, 2, 4, 8];

type OfflineDraft = {
  id: string;
  title: string;
  note: string;
  hours: number;
  teamId: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  capturedAt: string;
};

function getLocalDrafts(): OfflineDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("docko_offline_drafts");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalDraft(draft: OfflineDraft) {
  if (typeof window === "undefined") return;
  try {
    const drafts = getLocalDrafts();
    drafts.push(draft);
    localStorage.setItem("docko_offline_drafts", JSON.stringify(drafts));
  } catch {
    // ignore
  }
}

function removeLocalDraft(id: string) {
  if (typeof window === "undefined") return;
  try {
    const drafts = getLocalDrafts().filter((d) => d.id !== id);
    localStorage.setItem("docko_offline_drafts", JSON.stringify(drafts));
  } catch {
    // ignore
  }
}

function NewLogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(teamsQuery);
  const { data: entries } = useQuery(myEntriesQuery);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [hours, setHours] = useState(1);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [matchedWorkspace, setMatchedWorkspace] = useState<WorkspaceLocation | null>(null);
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDraft[]>([]);

  useEffect(() => {
    setOfflineDrafts(getLocalDrafts());
  }, []);

  const myTeams = (teams ?? []).filter((team) =>
    (team.team_members as { student_id: string }[] | null)?.some(
      (member) => member.student_id === me?.id,
    ),
  );

  // Compile approved workspaces from verified logs and saved workspaces
  const allKnownWorkspaces: WorkspaceLocation[] = [
    ...getSavedWorkspaces(),
    ...(entries ?? [])
      .filter((e) => e.status === "verified" && e.latitude && e.longitude)
      .map((e) => ({
        id: e.id,
        name: e.address || e.title || "Approved Workspace",
        latitude: e.latitude!,
        longitude: e.longitude!,
        teamId: e.team_id ?? undefined,
      })),
  ];

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  // Check workspace matching whenever coordinates update
  useEffect(() => {
    if (!coords) {
      setMatchedWorkspace(null);
      return;
    }

    const match = findNearestWorkspace(coords, allKnownWorkspaces);
    if (match.matched && match.workspace) {
      setMatchedWorkspace(match.workspace);
      if (!address) {
        setAddress(match.workspace.name);
      }
      if (match.workspace.teamId && !teamId) {
        setTeamId(match.workspace.teamId);
      }
    } else {
      setMatchedWorkspace(null);
    }
  }, [coords, allKnownWorkspaces.length]);

  async function detectLocation() {
    setLocating(true);
    try {
      const position = await getPosition();
      if (!position) {
        toast.error("Location unavailable. You can still save the log.");
        return;
      }
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setCoords({ lat, lng });

      // Reverse geocode place name
      const result = await reverseGeocode({ data: { latitude: lat, longitude: lng } });
      if (result.address) {
        setAddress(result.address);
      }
    } catch {
      // Fallback
    } finally {
      setLocating(false);
    }
  }

  useEffect(() => {
    void detectLocation();
    // Detect once on mount; the user can refresh manually.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useMutation({
    mutationFn: async () => {
      if (!me) throw new Error("Still loading your account — try again in a second.");
      
      const entryAddress = matchedWorkspace
        ? `${matchedWorkspace.name} (${address || "Verified Site"})`
        : address;

      // If browser is offline, store draft locally
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        const draft: OfflineDraft = {
          id: crypto.randomUUID(),
          title: title.trim(),
          note: note.trim(),
          hours,
          teamId,
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
          address: entryAddress,
          capturedAt: new Date().toISOString(),
        };
        saveLocalDraft(draft);
        setOfflineDrafts(getLocalDrafts());
        return { offline: true };
      }

      return createEntry(me.id, {
        title: title.trim(),
        note: note.trim(),
        hours,
        teamId,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        address: entryAddress,
        capturedAt: new Date().toISOString(),
        photo,
      });
    },
    onSuccess: (data) => {
      if (data && "offline" in data && data.offline) {
        toast.success("No connection: Log saved to offline drafts on your device.");
      } else {
        queryClient.invalidateQueries({ queryKey: ["entries"] });
        toast.success("Log saved — sent to your mentor for review.");
        navigate({ to: "/app/timeline" });
      }
    },
    onError: (error: Error) => {
      // If network failed, save to offline drafts
      const draft: OfflineDraft = {
        id: crypto.randomUUID(),
        title: title.trim(),
        note: note.trim(),
        hours,
        teamId,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        address,
        capturedAt: new Date().toISOString(),
      };
      saveLocalDraft(draft);
      setOfflineDrafts(getLocalDrafts());
      toast.info("Connection issue: Saved entry to offline drafts.");
    },
  });

  async function syncDraft(draft: OfflineDraft) {
    if (!me) return;
    try {
      await createEntry(me.id, {
        title: draft.title,
        note: draft.note,
        hours: draft.hours,
        teamId: draft.teamId,
        latitude: draft.latitude,
        longitude: draft.longitude,
        address: draft.address,
        capturedAt: draft.capturedAt,
        photo: null,
      });
      removeLocalDraft(draft.id);
      setOfflineDrafts(getLocalDrafts());
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      toast.success(`Synced draft: "${draft.title}"`);
    } catch {
      toast.error("Could not sync draft. Check connection.");
    }
  }

  return (
    <AppShell title="New log" subtitle="Photo, location, hours — submit for mentor review.">
      {offlineDrafts.length > 0 ? (
        <div className="mb-4 rounded-2xl border border-warning/40 bg-warning-soft p-4 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-warning-foreground">
              <WifiOff className="size-4 shrink-0" />
              <p className="text-sm font-semibold">
                {offlineDrafts.length} offline {offlineDrafts.length === 1 ? "draft" : "drafts"} saved
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => offlineDrafts.forEach((d) => void syncDraft(d))}
              className="press rounded-xl text-xs"
            >
              Sync all drafts
            </Button>
          </div>
        </div>
      ) : null}

      <form
        className="flex flex-col lg:grid lg:gap-4 lg:grid-cols-3 w-full min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) {
            toast.error("Give the log a short title.");
            return;
          }
          save.mutate();
        }}
      >
        <BentoCard className="order-2 lg:order-none lg:col-span-2 min-w-0 w-full mb-4 lg:mb-0 shrink-0">
          <SectionTitle title="What did you do?" hint="A short title and notes about the task." />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Site inspection — block A"
                className="rounded-2xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">Notes</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="Observations, tasks completed, method, mentors/peers worked with…"
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Hours</Label>
              <div className="flex flex-wrap items-center gap-2">
                {quickHours.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setHours(value)}
                    className={cn(
                      "press rounded-2xl border px-3.5 py-2 text-sm font-medium",
                      hours === value
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {value} h
                  </button>
                ))}
                <Input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={hours}
                  onChange={(event) => setHours(Number(event.target.value))}
                  className="w-24 rounded-2xl"
                  aria-label="Custom hours"
                />
              </div>
            </div>

            {myTeams.length > 0 ? (
              <div className="space-y-2">
                <Label>Team / Placement</Label>
                <div className="flex flex-wrap gap-2">
                  {myTeams.map((team) => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => setTeamId(teamId === team.id ? null : team.id)}
                      className={cn(
                        "press rounded-2xl border px-3.5 py-2 text-sm font-medium",
                        teamId === team.id
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border hover:bg-accent",
                      )}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </BentoCard>

        <div className="contents lg:block space-y-0 lg:space-y-4 min-w-0 w-full">
          <BentoCard className="order-1 lg:order-none min-w-0 w-full mb-4 lg:mb-0 shrink-0">
            <SectionTitle title="Photo" hint="Photo taken on site during the activity." />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            />
            {preview ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img src={preview} alt="Selected log photo" className="h-44 w-full object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="press absolute right-2 top-2 rounded-xl"
                  onClick={() => setPhoto(null)}
                  aria-label="Remove photo"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="sunken press grid h-40 w-full place-items-center rounded-2xl border border-dashed border-border text-muted-foreground"
              >
                <span className="flex flex-col items-center gap-2 text-sm">
                  <Camera className="size-5" />
                  Take photo
                </span>
              </button>
            )}
          </BentoCard>

          <BentoCard className="order-3 lg:order-none min-w-0 w-full mb-4 lg:mb-0 shrink-0">
            <SectionTitle title="Location" hint="Recorded when you submit for review." />

            {matchedWorkspace ? (
              <div className="mb-3 flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft p-2.5 text-xs text-primary">
                <Sparkles className="size-4 shrink-0" />
                <div>
                  <p className="font-semibold">Auto-matched Workspace</p>
                  <p className="text-[11px] opacity-90">
                    {matchedWorkspace.name} (Approved by Mentor)
                  </p>
                </div>
              </div>
            ) : null}

            <div className="sunken flex items-start gap-3 rounded-2xl p-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0 text-sm">
                {locating ? (
                  <span className="text-muted-foreground">Finding location…</span>
                ) : coords ? (
                  <>
                    <p className="truncate font-medium">{address ?? "Location captured"}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </p>
                  </>
                ) : (
                  <span className="text-muted-foreground">No location yet</span>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={detectLocation}
              disabled={locating}
              className="press mt-3 w-full rounded-2xl"
            >
              {locating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
              Refresh location
            </Button>
          </BentoCard>

          <Button
            type="submit"
            size="lg"
            disabled={save.isPending}
            className="order-4 lg:order-none press w-full rounded-2xl shrink-0"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit for review
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
