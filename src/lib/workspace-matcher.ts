/**
 * Workspace Location Matcher & Auto-tagging.
 *
 * If a mentor approves a location as a workspace, any student under that mentor
 * logging near that location automatically gets the workspace tag attached.
 */

export type WorkspaceLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  mentorId?: string | undefined;
  teamId?: string | undefined;
  radiusMeters?: number | undefined; // default 400m
};

const WORKSPACES_STORAGE_KEY = "docko_approved_workspaces";

/** Calculates distance in meters between two lat/lng coordinates (Haversine formula). */
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/** Finds if a given coordinate is within proximity of any approved workspace. */
export function findNearestWorkspace(
  coords: { lat: number; lng: number },
  workspaces: WorkspaceLocation[],
  defaultRadius = 400,
): { matched: boolean; workspace: WorkspaceLocation | null; distanceMeters: number } {
  let closest: WorkspaceLocation | null = null;
  let minDistance = Infinity;

  for (const ws of workspaces) {
    const dist = getDistanceInMeters(coords.lat, coords.lng, ws.latitude, ws.longitude);
    const radius = ws.radiusMeters ?? defaultRadius;
    if (dist <= radius && dist < minDistance) {
      minDistance = dist;
      closest = ws;
    }
  }

  if (closest) {
    return {
      matched: true,
      workspace: closest,
      distanceMeters: minDistance,
    };
  }

  return {
    matched: false,
    workspace: null,
    distanceMeters: Infinity,
  };
}

/** Reads locally stored approved workspaces. */
export function getSavedWorkspaces(): WorkspaceLocation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Saves or updates an approved workspace for a mentor/team. */
export function saveApprovedWorkspace(workspace: WorkspaceLocation) {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedWorkspaces();
    const updated = existing.filter((w) => w.id !== workspace.id);
    updated.push(workspace);
    localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
