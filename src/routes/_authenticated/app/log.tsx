import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, Crosshair, Loader2, MapPin, X } from "lucide-react";
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
import { meQuery, teamsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app/log")({
  head: () => ({
    meta: [
      { title: "New log · Docko" },
      {
        name: "description",
        content: "Capture a field log with photo, GPS location, hours and notes in seconds.",
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

function NewLogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(teamsQuery);
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

  const myTeams = (teams ?? []).filter((team) =>
    (team.team_members as { student_id: string }[] | null)?.some(
      (member) => member.student_id === me?.id,
    ),
  );

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

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
      const result = await reverseGeocode({ data: { latitude: lat, longitude: lng } });
      setAddress(result.address);
    } catch {
      toast.error("Could not detect the place name.");
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
      return createEntry(me.id, {
        title: title.trim(),
        note: note.trim(),
        hours,
        teamId,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        address,
        capturedAt: new Date().toISOString(),
        photo,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      toast.success("Log saved — sent to your mentor for verification.");
      navigate({ to: "/app/timeline" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppShell title="New log" subtitle="Photo, place, hours — then you're done.">
      <form
        className="grid gap-4 lg:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) {
            toast.error("Give the log a short title.");
            return;
          }
          save.mutate();
        }}
      >
        <BentoCard className="lg:col-span-2">
          <SectionTitle title="What did you do?" hint="A short title and a couple of lines is plenty." />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Soil sampling — north plot"
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
                placeholder="Observations, method, who you worked with…"
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
                <Label>Placement team</Label>
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

        <div className="space-y-4">
          <BentoCard>
            <SectionTitle title="Photo" hint="Proof of the work, straight from your camera." />
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
                  Take or choose a photo
                </span>
              </button>
            )}
          </BentoCard>

          <BentoCard>
            <SectionTitle title="Location" hint="Captured automatically where you are." />
            <div className="sunken flex items-start gap-3 rounded-2xl p-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0 text-sm">
                {locating ? (
                  <span className="text-muted-foreground">Finding your location…</span>
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
            className="press w-full rounded-2xl"
          >
            {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Save log
          </Button>
        </div>
      </form>
    </AppShell>
  );
}
