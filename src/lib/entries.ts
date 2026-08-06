import { supabase } from "@/integrations/supabase/client";
import type { EntryStatus } from "./docko";

export type NewEntryInput = {
  title: string;
  note: string;
  hours: number;
  teamId: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  capturedAt: string;
  photo: File | null;
};

/** Uploads the log photo to the private bucket and returns its storage path. */
export async function uploadEntryPhoto(userId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("entry-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return path;
}

export async function createEntry(userId: string, input: NewEntryInput) {
  const photoPath = input.photo ? await uploadEntryPhoto(userId, input.photo) : null;

  const { data, error } = await supabase
    .from("entries")
    .insert({
      student_id: userId,
      team_id: input.teamId,
      title: input.title,
      note: input.note || null,
      hours: input.hours,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      captured_at: input.capturedAt,
      photo_path: photoPath,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function reviewEntry(
  entryId: string,
  status: Extract<EntryStatus, "verified" | "rejected">,
  reviewNote: string | null,
) {
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("entries")
    .update({
      status,
      review_note: reviewNote,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user?.id ?? null,
    })
    .eq("id", entryId);
  if (error) throw error;
}

export async function addComment(entryId: string, body: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("You need to be signed in to comment.");
  const { error } = await supabase
    .from("entry_comments")
    .insert({ entry_id: entryId, author_id: auth.user.id, body });
  if (error) throw error;
}

export async function sendNudge(studentId: string, message: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("You need to be signed in to nudge.");
  const { error } = await supabase
    .from("nudges")
    .insert({ student_id: studentId, sender_id: auth.user.id, message });
  if (error) throw error;
}

/** Reads the browser's current position; resolves to null when unavailable. */
export function getPosition(): Promise<GeolocationPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  });
}
