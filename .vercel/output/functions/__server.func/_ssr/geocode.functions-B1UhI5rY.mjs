import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./server-DC2w2jvT.mjs";
import { n as objectType, t as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/geocode.functions-B1UhI5rY.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Turns captured coordinates into a human place name.
* Uses direct Google Maps Geocoding API if configured, with open OpenStreetMap
* Nominatim reverse geocoding fallback, so field logs always resolve cleanly
* without any proprietary gateway.
*/
var reverseGeocode_createServerFn_handler = createServerRpc({
	id: "33d28cf81a684e99f43f74ae939b7eccf8810610ac9db7142c41cf93d9c6f3d4",
	name: "reverseGeocode",
	filename: "src/lib/geocode.functions.ts"
}, (opts) => reverseGeocode.__executeServer(opts));
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => objectType({
	latitude: numberType().min(-90).max(90),
	longitude: numberType().min(-180).max(180)
}).parse(input)).handler(reverseGeocode_createServerFn_handler, async ({ data }) => {
	const mapsKey = process.env["GOOGLE_MAPS_API_KEY"] || process.env["VITE_GOOGLE_MAPS_API_KEY"];
	if (mapsKey) try {
		const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&key=${mapsKey}`);
		if (response.ok) {
			const payload = await response.json();
			if (payload.results?.[0]?.formatted_address) return { address: payload.results[0].formatted_address };
		}
	} catch (err) {
		console.warn("[Geocode] Google Maps geocoding request failed:", err);
	}
	try {
		const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=16`, { headers: { "User-Agent": "Docko-Fieldlog-App/1.0" } });
		if (osmResponse.ok) {
			const osmPayload = await osmResponse.json();
			if (osmPayload.display_name) return { address: osmPayload.display_name };
		}
	} catch (err) {
		console.warn("[Geocode] Nominatim reverse geocoding failed:", err);
	}
	return { address: null };
});
//#endregion
export { reverseGeocode_createServerFn_handler };
