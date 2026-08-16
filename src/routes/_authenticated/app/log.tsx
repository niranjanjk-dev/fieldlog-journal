import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Crosshair,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEntry, getPosition } from "@/lib/entries";
import { reverseGeocode } from "@/lib/geocode.functions";
import { meQuery, myEntriesQuery, myTeamsQuery } from "@/lib/queries";
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

const quickHours = [0.5, 1, 1.5, 2, 2.5, 3];
const MAX_LOG_HOURS = 3;

type OfflineDraft = {
  id: string;
  title: string;
  category?: string | null;
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
  const { data: teams } = useQuery(myTeamsQuery);
  const { data: entries } = useQuery(myEntriesQuery);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [hours, setHours] = useState(2);
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

  const myTeams = teams ?? [];

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

  const uniqueCategories = useMemo(() => {
    if (!entries) return [];
    const set = new Set<string>();
    entries.forEach((e) => e.category && set.add(e.category));
    return Array.from(set).sort();
  }, [entries]);

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    let isMounted = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (isMounted && typeof e.target?.result === "string") {
        setPreview(e.target.result);
      }
    };
    reader.onerror = () => {
      if (isMounted) {
        // Fallback to object URL if FileReader fails
        try {
          const url = URL.createObjectURL(photo);
          setPreview(url);
        } catch {
          setPreview(null);
        }
      }
    };
    reader.readAsDataURL(photo);
    return () => {
      isMounted = false;
    };
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
          category: category.trim() || null,
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
        category: category.trim() || null,
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
        const mentorList = teamId && myTeams ? myTeams.find(t => t.id === teamId)?.mentor?.full_name : "your mentors";
        toast.success(`Log saved — routed to ${mentorList || "your mentors"} for sign-off.`);
        navigate({ to: "/app/timeline" });
      }
    },
    onError: (error: Error) => {
      // If network failed, save to offline drafts
      const draft: OfflineDraft = {
        id: crypto.randomUUID(),
        title: title.trim(),
        category: category.trim() || null,
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
        category: draft.category ?? null,
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
        className="grid gap-5 grid-cols-1 lg:grid-cols-3 lg:items-stretch w-full min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) {
            toast.error("Give the log a short title.");
            return;
          }
          save.mutate();
        }}
      >
        {/* Main Details Card (Left / Order 2 on mobile, matches height of right column in desktop mode) */}
        <BentoCard className="order-2 lg:order-1 lg:col-span-2 min-w-0 w-full p-4 sm:p-6 flex flex-col justify-between h-auto lg:h-full space-y-4">
          <div className="space-y-4 pt-1 flex-1">
            <SectionTitle title="What did you do?" hint="A short title and notes about the task." />
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Firmware update on drone"
                className="rounded-2xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                list="categories-list"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. ROS2, Embedded Systems, CAD..."
                className="rounded-2xl"
              />
              <datalist id="categories-list">
                {uniqueCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">Notes</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="Observations, tasks completed, method, mentors/peers worked with…"
                className="rounded-2xl resize-y min-h-[90px] lg:min-h-[110px]"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label>Hours (Max 3h per log)</Label>
                <span className="text-[11px] text-muted-foreground">Recommended: 2h block</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {quickHours.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setHours(value)}
                    className={cn(
                      "press rounded-2xl border px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium",
                      hours === value
                        ? "border-primary bg-primary-soft text-primary shadow-xs"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {value} h
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                For safety reasons, kindly send multiple logs throughout your session every 2–3 hours.
              </p>
            </div>

            {myTeams.length > 0 ? (
              <div className="space-y-2 pt-1">
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

            {/* Approving Mentors Notice */}
            <div className="space-y-3 pt-3 border-t border-border/60">
              {teamId ? (
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center gap-3 text-[11px] text-primary">
                  <ShieldCheck className="size-4 shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">Routing to Mentor</span>
                    <span>
                      This log will be sent to <strong>{myTeams.find((t: any) => t.id === teamId)?.mentor?.full_name || "the mentor"}</strong> for sign-off.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-muted/40 border border-border/70 p-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <UserCheck className="size-4 shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">No Team Selected</span>
                    <span>Select a team above to route this log to a mentor for verification.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BentoCard>

        {/* Side Column: Photo, Location & Submit (Clean separated gap) */}
        <div className="order-1 lg:order-2 flex flex-col gap-5 min-w-0 w-full h-auto lg:h-full">
          {/* Photo Box */}
          <BentoCard className="min-w-0 w-full p-4 sm:p-5 space-y-3">
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
              <div className="relative overflow-hidden rounded-2xl sunken bg-muted/20 mt-2">
                <img
                  src={preview}
                  alt="Selected log photo preview"
                  className="h-44 sm:h-48 w-full object-cover rounded-2xl"
                  onError={() => setPreview(null)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white shadow-xs">
                    Photo attached
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="press rounded-xl text-xs h-7 px-2.5 bg-background/90 hover:bg-background text-foreground shadow-xs"
                      onClick={() => fileRef.current?.click()}
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="press size-7 rounded-xl shadow-xs"
                      onClick={() => {
                        setPhoto(null);
                        setPreview(null);
                      }}
                      aria-label="Remove photo"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="sunken press grid h-36 sm:h-40 w-full place-items-center rounded-2xl border border-dashed border-border text-muted-foreground mt-2 hover:bg-muted/10 transition-colors"
              >
                <span className="flex flex-col items-center gap-2 text-sm">
                  <Camera className="size-5 text-primary" />
                  Take photo
                </span>
              </button>
            )}
          </BentoCard>

          {/* Location Box */}
          <BentoCard className="min-w-0 w-full p-4 sm:p-5 space-y-3">
            <SectionTitle title="Location" hint="Recorded when you submit for review." />

            {matchedWorkspace ? (
              <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft p-2.5 text-xs text-primary">
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
              className="press w-full rounded-2xl text-xs h-9"
            >
              {locating ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Crosshair className="size-3.5 mr-1.5" />}
              Refresh location
            </Button>
          </BentoCard>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={save.isPending}
            className="press w-full rounded-2xl h-11 text-sm font-semibold shadow-sm"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Submit for review
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
