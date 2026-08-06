import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Turns captured coordinates into a human place name.
 * Uses direct Google Maps Geocoding API if configured, with open OpenStreetMap
 * Nominatim reverse geocoding fallback, so field logs always resolve cleanly
 * without any proprietary gateway.
 */
export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((input) =>
    z
      .object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ address: string | null }> => {
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"] || process.env["VITE_GOOGLE_MAPS_API_KEY"];

    // 1. If Google Maps API key is configured, use official Google Geocoding endpoint
    if (mapsKey) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&key=${mapsKey}`,
        );
        if (response.ok) {
          const payload = (await response.json()) as {
            results?: { formatted_address?: string }[];
          };
          if (payload.results?.[0]?.formatted_address) {
            return { address: payload.results[0].formatted_address };
          }
        }
      } catch (err) {
        console.warn("[Geocode] Google Maps geocoding request failed:", err);
      }
    }

    // 2. Fallback to OpenStreetMap Nominatim reverse geocoder
    try {
      const osmResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=16`,
        {
          headers: {
            "User-Agent": "Docko-Fieldlog-App/1.0",
          },
        },
      );
      if (osmResponse.ok) {
        const osmPayload = (await osmResponse.json()) as { display_name?: string };
        if (osmPayload.display_name) {
          return { address: osmPayload.display_name };
        }
      }
    } catch (err) {
      console.warn("[Geocode] Nominatim reverse geocoding failed:", err);
    }

    return { address: null };
  });
