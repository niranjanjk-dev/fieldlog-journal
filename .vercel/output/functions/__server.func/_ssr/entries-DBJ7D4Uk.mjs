import { t as supabase } from "./client-D9Cas0bA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entries-DBJ7D4Uk.js
async function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (typeof e.target?.result === "string") resolve(e.target.result);
			else reject(/* @__PURE__ */ new Error("Failed to read file"));
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
/** Uploads the log photo to the private bucket and returns its storage path, with local cache fallback. */
async function uploadEntryPhoto(userId, file) {
	const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
	const path = `${userId}/${crypto.randomUUID()}.${extension}`;
	try {
		const dataUrl = await fileToDataUrl(file);
		if (typeof window !== "undefined") localStorage.setItem(`docko_photo_${path}`, dataUrl);
	} catch {}
	try {
		const { error } = await supabase.storage.from("entry-photos").upload(path, file, {
			cacheControl: "3600",
			upsert: false,
			contentType: file.type || "image/jpeg"
		});
		if (error) console.warn("Supabase photo upload notice (using local storage fallback):", error.message);
	} catch (err) {
		console.warn("Storage upload fallback active:", err);
	}
	return path;
}
async function createEntry(userId, input) {
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
		status: "pending",
		review_note: null,
		reviewed_at: null,
		reviewed_by: null
	};
	try {
		if (typeof window !== "undefined") {
			const stored = localStorage.getItem("docko_custom_entries");
			const existing = stored ? JSON.parse(stored) : [];
			localStorage.setItem("docko_custom_entries", JSON.stringify([newEntryRecord, ...existing]));
		}
	} catch {}
	try {
		const { data, error } = await supabase.from("entries").insert({
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
			photo_path: photoPath
		}).select("id").single();
		if (!error && data) return data;
	} catch {}
	return { id: entryId };
}
async function reviewEntry(entryId, status, reviewNote) {
	const { data: auth } = await supabase.auth.getUser();
	const { data, error } = await supabase.from("entries").update({
		status,
		review_note: reviewNote,
		reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
		reviewed_by: auth.user?.id ?? null
	}).eq("id", entryId).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Not authorized to review this entry, or it doesn't exist.");
}
async function addComment(entryId, body) {
	const { data: auth } = await supabase.auth.getUser();
	if (!auth.user) throw new Error("You need to be signed in to comment.");
	const { error } = await supabase.from("entry_comments").insert({
		entry_id: entryId,
		author_id: auth.user.id,
		body
	});
	if (error) throw error;
}
async function sendNudge(studentId, message) {
	const { data: auth } = await supabase.auth.getUser();
	if (!auth.user) throw new Error("You need to be signed in to nudge.");
	const { error } = await supabase.from("nudges").insert({
		student_id: studentId,
		sender_id: auth.user.id,
		message
	});
	if (error) throw error;
}
/** Reads the browser's current position; resolves to null when unavailable. */
function getPosition() {
	if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition((position) => resolve(position), () => resolve(null), {
			enableHighAccuracy: true,
			timeout: 8e3,
			maximumAge: 3e4
		});
	});
}
//#endregion
export { sendNudge as a, reviewEntry as i, createEntry as n, getPosition as r, addComment as t };
