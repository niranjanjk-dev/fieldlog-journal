import { useEffect, useRef, useState } from "react";

import type { Entry } from "@/lib/docko";

/// <reference types="google.maps" />

type MapsWindow = typeof window & {
  google?: typeof globalThis.google;
  __dockoMapsReady?: boolean;
  __dockoMapsInit?: () => void;
};

const CALLBACK = "__dockoMapsInit";

/** Loads the Maps JS API once and resolves when it is ready to use. */
function loadMaps(apiKey: string, channel?: string): Promise<void> {
  const w = window as MapsWindow;
  if (w.__dockoMapsReady && w.google?.maps) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("docko-google-maps");
    const previous = w[CALLBACK];
    w[CALLBACK] = () => {
      w.__dockoMapsReady = true;
      previous?.();
      resolve();
    };
    if (existing) return;

    const script = document.createElement("script");
    script.id = "docko-google-maps";
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&loading=async&callback=${CALLBACK}${channel ? `&channel=${encodeURIComponent(channel)}` : ""}`;
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
}

export default function LogMap({ entries }: { entries: Entry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as
    | string
    | undefined;
  const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as
    | string
    | undefined;

  const located = entries.filter(
    (entry) => entry.latitude != null && entry.longitude != null,
  );

  useEffect(() => {
    if (!apiKey) {
      setError("Maps are not connected yet.");
      return;
    }
    let cancelled = false;

    loadMaps(apiKey, channel)
      .then(() => {
        if (cancelled || !containerRef.current || !window.google?.maps) return;
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(containerRef.current, {
            center: { lat: 20.5937, lng: 78.9629 },
            zoom: 4,
            disableDefaultUI: true,
            zoomControl: true,
          });
        }

        for (const marker of markersRef.current) marker.setMap(null);
        markersRef.current = [];

        const bounds = new google.maps.LatLngBounds();
        for (const entry of located) {
          const position = { lat: Number(entry.latitude), lng: Number(entry.longitude) };
          const marker = new google.maps.Marker({
            position,
            map: mapRef.current,
            title: entry.title,
          });
          const info = new google.maps.InfoWindow({
            content: `<strong>${entry.title.replace(/</g, "&lt;")}</strong><br/>${Number(
              entry.hours,
            )} h`,
          });
          marker.addListener("click", () => info.open({ anchor: marker, map: mapRef.current! }));
          markersRef.current.push(marker);
          bounds.extend(position);
        }

        if (located.length === 1) {
          mapRef.current.setCenter(bounds.getCenter());
          mapRef.current.setZoom(14);
        } else if (located.length > 1) {
          mapRef.current.fitBounds(bounds, 48);
        }
      })
      .catch(() => setError("Google Maps could not load."));

    return () => {
      cancelled = true;
    };
  }, [apiKey, channel, located]);

  if (error) {
    return (
      <div className="grid h-[420px] place-items-center rounded-2xl border border-dashed border-border px-6 text-center">
        <div>
          <p className="font-medium">{error}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your logs still keep their coordinates — the map appears once Maps is connected.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-[420px] w-full rounded-2xl" />;
}
