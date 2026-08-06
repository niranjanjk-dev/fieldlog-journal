import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import {
  DEV_QUEUE_ENTRIES,
  DEV_STUDENT_ENTRIES,
  getDevMe,
  isDevModeActive,
} from "./dev-mode";
import type { AppRole, Entry } from "./docko";

export type Me = {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  headline: string | null;
  institution: string | null;
  course: string | null;
  department: string | null;
  roles: AppRole[];
};

export const meQuery = queryOptions({
  queryKey: ["me"],
  staleTime: 5_000,
  queryFn: async (): Promise<Me | null> => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (user) {
        const [{ data: profile }, { data: roles }] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
          supabase.from("user_roles").select("role").eq("user_id", user.id),
        ]);

        return {
          id: user.id,
          email: user.email ?? null,
          fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "Member",
          avatarUrl: profile?.avatar_url ?? null,
          headline: profile?.headline ?? null,
          institution: profile?.institution ?? null,
          course: profile?.course ?? null,
          department: profile?.department ?? null,
          roles: ((roles ?? []).map((r) => r.role) as AppRole[]) ?? [],
        };
      }
    } catch {
      // Fall through to dev mode fallback
    }

    if (isDevModeActive()) {
      return getDevMe();
    }
    return null;
  },
});

export const myEntriesQuery = queryOptions({
  queryKey: ["entries", "mine"],
  queryFn: async (): Promise<Entry[]> => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("captured_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Entry[];
      }
    } catch {
      // Fall through
    }

    if (isDevModeActive()) {
      return DEV_STUDENT_ENTRIES;
    }
    return [];
  },
});

export type QueueEntry = Entry & {
  student: { full_name: string; avatar_url: string | null; course: string | null } | null;
};

export const reviewQueueQuery = queryOptions({
  queryKey: ["entries", "queue"],
  queryFn: async (): Promise<QueueEntry[]> => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*, student:profiles!entries_student_profile_fkey (full_name, avatar_url, course)")
        .order("captured_at", { ascending: false })
        .limit(200);
      if (!error && data && data.length > 0) {
        return data as unknown as QueueEntry[];
      }
    } catch {
      // Fall through
    }

    if (isDevModeActive()) {
      return DEV_QUEUE_ENTRIES;
    }
    return [];
  },
});

export const teamsQuery = queryOptions({
  queryKey: ["teams"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("teams")
      .select("*, team_members (id, student_id, profile:profiles!team_members_student_profile_fkey (full_name, avatar_url))")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
});

export const peopleQuery = queryOptions({
  queryKey: ["people"],
  staleTime: 60_000,
  queryFn: async () => {
    const [{ data: profiles, error }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").order("full_name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (error) throw error;
    return (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as AppRole),
    }));
  },
});

export const myNudgesQuery = queryOptions({
  queryKey: ["nudges"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("nudges")
      .select("*, sender:profiles!nudges_sender_profile_fkey (full_name)")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data ?? [];
  },
});

export function commentsQuery(entryId: string) {
  return queryOptions({
    queryKey: ["comments", entryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entry_comments")
        .select("*, author:profiles!entry_comments_author_profile_fkey (full_name, avatar_url)")
        .eq("entry_id", entryId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Signed URLs for private log photos, cached per path set. */
export function photoUrlsQuery(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))].sort();
  return queryOptions({
    queryKey: ["photo-urls", unique],
    enabled: unique.length > 0,
    staleTime: 45 * 60 * 1000,
    queryFn: async (): Promise<Record<string, string>> => {
      if (unique.length === 0) return {};
      const { data, error } = await supabase.storage
        .from("entry-photos")
        .createSignedUrls(unique, 60 * 60);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const item of data ?? []) {
        if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
      }
      return map;
    },
  });
}