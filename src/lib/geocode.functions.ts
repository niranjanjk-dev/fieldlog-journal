import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

/**
 * Turns captured coordinates into a human place name. Returns null when the
 * Google Maps connection is not configured yet, so logging never blocks.
 */
export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ address: string | null }> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableKey || !mapsKey) return { address: null };

    const response = await fetch(
      `${GATEWAY_URL}/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": mapsKey,
        },
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`Reverse geocode failed [${response.status}]: ${body}`);
      return { address: null };
    }

    const payload = (await response.json()) as {
      results?: { formatted_address?: string }[];
    };
    return { address: payload.results?.[0]?.formatted_address ?? null };
  });
