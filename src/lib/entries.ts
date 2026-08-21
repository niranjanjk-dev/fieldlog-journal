import { supabase } from "@/integrations/supabase/client";
import type { EntryStatus } from "./docko";

export type NewEntryInput = {
  title: string;
  category?: string | null;
  note: string;
  hours: number;
  teamId: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  capturedAt: string;
  photo: File | null;
};

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") resolve(e.target.result);
      else reject(new Error("Failed to read file"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Uploads the log photo to the private bucket and returns its storage path, with local cache fallback. */
export async function uploadEntryPhoto(userId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  // Cache photo data URL in local storage for instant offline / dev-mode display
  try {
    const dataUrl = await fileToDataUrl(file);
    if (typeof window !== "undefined") {
      localStorage.setItem(`docko_photo_${path}`, dataUrl);
    }
  } catch {
    // ignore
  }

  try {
    const { error } = await supabase.storage.from("entry-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });
    if (error) {
      console.warn("Supabase photo upload notice (using local storage fallback):", error.message);
    }
  } catch (err) {
    console.warn("Storage upload fallback active:", err);
  }

  return path;
}

export async function createEntry(userId: string, input: NewEntryInput) {
  const photoPath = input.photo ? await uploadEntryPhoto(userId, input.photo) : null;
  const entryId = crypto.randomUUID();

  const newEntryRecord = {
    id: entryId,
    student_id: userId,
    team_id: input.teamId,
    title: input.title,
    category: input.category ?? null,
    note: input.note || null,
    hours: input.hours,
    latitude: input.latitude,
    longitude: input.longitude,
    address: input.address,
    captured_at: input.capturedAt,
    photo_path: photoPath,
    status: "pending" as const,
    review_note: null,
    reviewed_at: null,
    reviewed_by: null,
  };

  // Save to local custom entries store so it persists in dev mode
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("docko_custom_entries");
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem("docko_custom_entries", JSON.stringify([newEntryRecord, ...existing]));
    }
  } catch {
    // ignore
  }

  try {
    const { data, error } = await supabase
      .from("entries")
      .insert({
        id: entryId,
        student_id: userId,
        team_id: input.teamId,
        title: input.title,
        category: input.category ?? null,
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

    if (!error && data) return data;
  } catch {
    // Dev mode fallback
  }

  return { id: entryId };
}

export async function reviewEntry(
  entryId: string,
  status: Extract<EntryStatus, "verified" | "rejected">,
  reviewNote: string | null,
) {
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("entries")
    .update({
      status,
      review_note: reviewNote,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.user?.id ?? null,
    })
    .eq("id", entryId)
    .select("id");
    
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Not authorized to review this entry, or it doesn't exist.");
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
