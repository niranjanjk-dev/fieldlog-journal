//#region node_modules/.nitro/vite/services/ssr/assets/workspace-matcher-bdM_i8mP.js
var WORKSPACES_STORAGE_KEY = "docko_approved_workspaces";
/** Calculates distance in meters between two lat/lng coordinates (Haversine formula). */
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
	const R = 6371e3;
	const φ1 = lat1 * Math.PI / 180;
	const φ2 = lat2 * Math.PI / 180;
	const Δφ = (lat2 - lat1) * Math.PI / 180;
	const Δλ = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round(R * c);
}
/** Finds if a given coordinate is within proximity of any approved workspace. */
function findNearestWorkspace(coords, workspaces, defaultRadius = 400) {
	let closest = null;
	let minDistance = Infinity;
	for (const ws of workspaces) {
		const dist = getDistanceInMeters(coords.lat, coords.lng, ws.latitude, ws.longitude);
		if (dist <= (ws.radiusMeters ?? defaultRadius) && dist < minDistance) {
			minDistance = dist;
			closest = ws;
		}
	}
	if (closest) return {
		matched: true,
		workspace: closest,
		distanceMeters: minDistance
	};
	return {
		matched: false,
		workspace: null,
		distanceMeters: Infinity
	};
}
/** Reads locally stored approved workspaces. */
function getSavedWorkspaces() {
	if (typeof window === "undefined") return [];
	try {
		const data = localStorage.getItem(WORKSPACES_STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}
/** Saves or updates an approved workspace for a mentor/team. */
function saveApprovedWorkspace(workspace) {
	if (typeof window === "undefined") return;
	try {
		const updated = getSavedWorkspaces().filter((w) => w.id !== workspace.id);
		updated.push(workspace);
		localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(updated));
	} catch {}
}
//#endregion
export { getSavedWorkspaces as n, saveApprovedWorkspace as r, findNearestWorkspace as t };
