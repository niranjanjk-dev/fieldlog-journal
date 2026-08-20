import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Crosshair,
  Flame,
  Info,
  Layers,
  MapPin,
  Navigation,
  Radio,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Entry } from "@/lib/docko";
import { formatDay, formatTime } from "@/lib/docko";
import type { QueueEntry } from "@/lib/queries";
import { getDistanceInMeters, type WorkspaceLocation } from "@/lib/workspace-matcher";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L?: any;
  }
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window not available"));
      return;
    }

    if (window.L) {
      resolve(window.L);
      return;
    }

    if (!document.getElementById("leaflet-cdn-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-cdn-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById("leaflet-cdn-js");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.L));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "leaflet-cdn-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      if (window.L) {
        resolve(window.L);
      } else {
        reject(new Error("Leaflet failed to load"));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export type FilterTimeOption = "all" | "today" | "week" | "verified" | "pending";

interface LogMapProps {
  entries: Entry[];
  peerEntries?: QueueEntry[];
  workspaces?: WorkspaceLocation[];
  photoUrls?: Record<string, string>;
  currentUserId?: string;
}

export default function LogMap({
  entries,
  peerEntries = [],
  workspaces = [],
  photoUrls = {},
  currentUserId,
}: LogMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layersRef = useRef<{ markers: any[]; circles: any[]; heatmaps: any[]; peers: any[]; userMarker?: any }>({
    markers: [],
    circles: [],
    heatmaps: [],
    peers: [],
  });

  const [activeFilter, setActiveFilter] = useState<FilterTimeOption>("all");
  const [viewMode, setViewMode] = useState<"pins" | "heatmap">("pins");
  const [showWorkspaces, setShowWorkspaces] = useState<boolean>(true);
  const [showPeers, setShowPeers] = useState<boolean>(true);
  const [locating, setLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locateMessage, setLocateMessage] = useState<string | null>(null);
  const [hoveredTip, setHoveredTip] = useState<string | null>(null);

  // 1. Filter located user entries
  const located = useMemo(() => {
    return entries.filter(
      (entry) =>
        entry.latitude != null &&
        entry.longitude != null &&
        !isNaN(Number(entry.latitude)) &&
        !isNaN(Number(entry.longitude)),
    );
  }, [entries]);

  // 2. Filter by date/status
  const filteredEntries = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(startOfToday - 6 * 24 * 60 * 60 * 1000).getTime();

    return located.filter((entry) => {
      const entryTime = new Date(entry.captured_at).getTime();
      if (activeFilter === "today") return entryTime >= startOfToday;
      if (activeFilter === "week") return entryTime >= startOfWeek;
      if (activeFilter === "verified") return entry.status === "verified";
      if (activeFilter === "pending") return entry.status === "pending";
      return true;
    });
  }, [located, activeFilter]);

  // 3. Locate active peers: STRICTLY ONLY people lively sharing & logged in nearby location within the past 30 minutes (<= 30 mins)
  const nearbyPeers = useMemo(() => {
    const now = Date.now();
    const thirtyMinutesMs = 30 * 60 * 1000;
    const maxProximityMeters = 10000; // 10km radius max for nearby

    // Base reference coordinate (user's live location or first located entry)
    const baseLat = userLocation?.lat ?? (located[0] ? Number(located[0]?.latitude ?? 0) : 20.5937);
    const baseLng = userLocation?.lng ?? (located[0] ? Number(located[0]?.longitude ?? 0) : 78.9629);

    // Candidates from real peer entries
    const activePeers = peerEntries
      .filter((p) => {
        if (!p.latitude || !p.longitude) return false;
        if (currentUserId && p.student_id === currentUserId) return false;
        const diffMs = now - new Date(p.captured_at).getTime();
        // Strictly within 30 minutes
        return diffMs >= 0 && diffMs <= thirtyMinutesMs;
      })
      .map((p) => {
        const diffMs = now - new Date(p.captured_at).getTime();
        const minsAgo = Math.max(1, Math.round(diffMs / 60000));
        const distMeters = getDistanceInMeters(baseLat, baseLng, Number(p.latitude), Number(p.longitude));

        return {
          ...p,
          minsAgo,
          distMeters,
          isLiveSharing: true,
        };
      })
      .filter((p) => p.distMeters <= maxProximityMeters);

    return activePeers.sort((a, b) => a.minsAgo - b.minsAgo);
  }, [peerEntries, currentUserId, userLocation, located]);

  // Initialize Map
  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;

        if (!mapInstanceRef.current) {
          const defaultCenter: [number, number] =
            located.length > 0
              ? [Number(located[0]?.latitude ?? 0), Number(located[0]?.longitude ?? 0)]
              : [20.5937, 78.9629];

          const map = L.map(containerRef.current, {
            center: defaultCenter,
            zoom: located.length > 0 ? 13 : 5,
            minZoom: 3,
            maxBounds: [
              [-85, -180],
              [85, 180],
            ],
            maxBoundsViscosity: 1.0,
            zoomControl: false,
            attributionControl: true,
          });

          // Zoom control top-right
          L.control.zoom({ position: "topright" }).addTo(map);

          // Tile Layer - CartoDB Voyager (noWrap prevents duplicate horizontal world copies)
          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
              maxZoom: 19,
              minZoom: 3,
              noWrap: true,
              bounds: [
                [-85, -180],
                [85, 180],
              ],
              subdomains: "abcd",
            },
          ).addTo(map);

          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear previous layers
        layersRef.current.markers.forEach((m) => map.removeLayer(m));
        layersRef.current.circles.forEach((c) => map.removeLayer(c));
        layersRef.current.heatmaps.forEach((h) => map.removeLayer(h));
        layersRef.current.peers.forEach((p) => map.removeLayer(p));
        layersRef.current.markers = [];
        layersRef.current.circles = [];
        layersRef.current.heatmaps = [];
        layersRef.current.peers = [];

        const bounds = L.latLngBounds([]);

        // 1. Geofenced Workspace Circles (Colorful Blue Cyan Zones)
        if (showWorkspaces) {
          const allZones: WorkspaceLocation[] = [
            ...workspaces,
            ...located
              .filter((e) => e.status === "verified" && e.latitude && e.longitude)
              .map((e) => ({
                id: `ws-${e.id}`,
                name: e.address || e.title,
                latitude: e.latitude!,
                longitude: e.longitude!,
                radiusMeters: 100,
              })),
          ];

          const uniqueZones = allZones.filter(
            (z, idx, arr) =>
              arr.findIndex(
                (item) =>
                  Math.abs(item.latitude - z.latitude) < 0.0005 &&
                  Math.abs(item.longitude - z.longitude) < 0.0005,
              ) === idx,
          );

          uniqueZones.forEach((ws) => {
            const radius = ws.radiusMeters || 100;
            const circle = L.circle([ws.latitude, ws.longitude], {
              radius: radius,
              color: "#2563eb",
              weight: 2,
              opacity: 0.85,
              fillColor: "#3b82f6",
              fillOpacity: 0.12,
              dashArray: "5, 7",
            }).addTo(map);

            circle.bindPopup(`
              <div style="font-family: system-ui, sans-serif; padding: 2px;">
                <div style="display: flex; align-items: center; gap: 6px; color: #2563eb; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                  <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #3b82f6;"></span>
                  Authorized Workspace
                </div>
                <h4 style="margin: 4px 0 2px; font-size: 13px; font-weight: 700; color: #0f172a;">${ws.name}</h4>
                <p style="margin: 0; font-size: 11px; color: #64748b;">${radius}m Authorized Geofence Zone</p>
              </div>
            `);

            layersRef.current.circles.push(circle);
          });
        }

        // 2. Heatmap Density View (Vivid Warm Amber & Crimson Radial Rings)
        if (viewMode === "heatmap") {
          filteredEntries.forEach((entry) => {
            const lat = Number(entry.latitude);
            const lng = Number(entry.longitude);
            const hours = Math.max(0.5, Number(entry.hours || 1));
            const radius = Math.min(250, 45 + hours * 40);

            const heatRing = L.circle([lat, lng], {
              radius: radius,
              color: "#f59e0b",
              weight: 0,
              fillColor: "#f97316",
              fillOpacity: 0.32,
            }).addTo(map);

            const innerRing = L.circle([lat, lng], {
              radius: radius * 0.45,
              color: "#ef4444",
              weight: 0,
              fillColor: "#ef4444",
              fillOpacity: 0.5,
            }).addTo(map);

            heatRing.bindPopup(`
              <div style="font-family: system-ui, sans-serif; padding: 2px;">
                <span style="background: #ffedd5; color: #c2410c; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Activity Hotspot</span>
                <h4 style="margin: 4px 0 0; font-size: 13px; font-weight: 700; color: #0f172a;">${entry.title}</h4>
                <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">${hours} hours logged at this site</p>
              </div>
            `);

            layersRef.current.heatmaps.push(heatRing, innerRing);
            bounds.extend([lat, lng]);
          });
        }

        // 3. Field Log Pins (Vibrant Colors: Emerald for Verified, Amber for Pending)
        if (viewMode === "pins") {
          filteredEntries.forEach((entry) => {
            const lat = Number(entry.latitude);
            const lng = Number(entry.longitude);
            const latLng: [number, number] = [lat, lng];
            const isVerified = entry.status === "verified";
            const photoUrl = entry.photo_path ? photoUrls[entry.photo_path] : null;

            const primaryColor = isVerified ? "#10b981" : "#f59e0b";
            const shadowColor = isVerified ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)";

            let iconHtml = "";
            if (photoUrl) {
              iconHtml = `
                <div class="group relative flex items-center justify-center cursor-pointer" style="width: 44px; height: 44px;">
                  <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${shadowColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="position: relative; width: 38px; height: 38px; border-radius: 9999px; border: 3px solid ${primaryColor}; box-shadow: 0 4px 14px rgba(0,0,0,0.25); overflow: hidden; background: #000;">
                    <img src="${photoUrl}" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                  <div style="position: absolute; bottom: -2px; right: -2px; width: 15px; height: 15px; border-radius: 9999px; background: ${primaryColor}; border: 2px solid white; display: grid; place-items: center;">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
              `;
            } else {
              iconHtml = `
                <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
                  <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: ${shadowColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: ${primaryColor}; border: 2.5px solid white; box-shadow: 0 4px 14px ${shadowColor}; display: flex; align-items: center; justify-content: center; color: white;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                </div>
              `;
            }

            const customIcon = L.divIcon({
              className: "custom-field-pin",
              html: iconHtml,
              iconSize: photoUrl ? [44, 44] : [36, 36],
              iconAnchor: photoUrl ? [22, 22] : [18, 18],
              popupAnchor: [0, -22],
            });

            const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

            const statusBadge = isVerified
              ? `<span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Verified</span>`
              : `<span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Pending</span>`;

            const safeTitle = (entry.title ?? "Field Log").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const safeNotes = entry.note
              ? `<p style="margin: 4px 0 0; font-size: 12px; color: #64748b; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${entry.note.replace(/</g, "&lt;")}</p>`
              : "";

            const photoPreview = photoUrl
              ? `<div style="margin-top: 8px; border-radius: 8px; overflow: hidden; height: 100px; width: 100%;">
                  <img src="${photoUrl}" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>`
              : "";

            const popupContent = `
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; max-width: 260px; padding: 2px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  ${statusBadge}
                  <span style="font-size: 11px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 1px 6px; border-radius: 6px;">${Number(entry.hours)}h</span>
                </div>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.3;">${safeTitle}</h4>
                ${safeNotes}
                ${photoPreview}
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                  <span>${formatDay(entry.captured_at)}</span>
                  <span>${formatTime(entry.captured_at)}</span>
                </div>
              </div>
            `;

            marker.bindPopup(popupContent);
            layersRef.current.markers.push(marker);
            bounds.extend(latLng);
          });
        }

        // 4. Teammates / Peer Pins (STRICTLY ONLY Live Sharing & Within 30 Minutes)
        if (showPeers && nearbyPeers.length > 0) {
          nearbyPeers.forEach((peer) => {
            const lat = Number(peer.latitude);
            const lng = Number(peer.longitude);
            const peerName = peer.student?.full_name || "Teammate";

            const peerIconHtml = `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
                <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: rgba(219, 39, 119, 0.45); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="position: relative; width: 30px; height: 30px; border-radius: 9999px; background: #db2777; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(219, 39, 119, 0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 11px;">
                  ${peerName.charAt(0).toUpperCase()}
                </div>
                <span style="position: absolute; top: -1px; right: -1px; width: 11px; height: 11px; border-radius: 9999px; background: #22c55e; border: 2px solid white;"></span>
              </div>
            `;

            const peerMarker = L.marker([lat, lng], {
              icon: L.divIcon({
                className: "custom-peer-pin",
                html: peerIconHtml,
                iconSize: [38, 38],
                iconAnchor: [19, 19],
                popupAnchor: [0, -20],
              }),
            }).addTo(map);

            peerMarker.bindPopup(`
              <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 2px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: #22c55e;"></span>
                    Live Sharing (&lt; 30m)
                  </span>
                </div>
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a;">${peerName}</h4>
                <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">${peer.title}</p>
                <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #94a3b8;">
                  <span style="color: #059669; font-weight: 600;">Active ${peer.minsAgo}m ago</span>
                  <span>${peer.distMeters > 0 ? `${peer.distMeters}m away` : ""}</span>
                </div>
              </div>
            `);

            layersRef.current.peers.push(peerMarker);
            bounds.extend([lat, lng]);
          });
        }

        // Fit Bounds
        if (bounds.isValid() && !userLocation) {
          if (filteredEntries.length === 1 && (!showPeers || nearbyPeers.length === 0)) {
            map.setView(bounds.getCenter(), 14);
          } else {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
          }
        }

        setTimeout(() => {
          if (!cancelled && mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      })
      .catch((err) => {
        console.error("Leaflet map initialization error:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [located, filteredEntries, viewMode, showWorkspaces, showPeers, nearbyPeers, photoUrls, workspaces, userLocation]);

  // Robust Geolocation ("Locate Me") -> Centers Map Directly on User
  async function handleLocateMe() {
    setLocating(true);
    setLocateMessage("Acquiring GPS location...");

    const getPosition = (enableHighAccuracy: boolean): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser."));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy, timeout: enableHighAccuracy ? 7000 : 10000, maximumAge: 0 },
        );
      });
    };

    try {
      let coords: { lat: number; lng: number };
      try {
        coords = await getPosition(true);
      } catch {
        // Fallback to network/wifi geolocation
        coords = await getPosition(false);
      }

      setUserLocation(coords);
      setLocateMessage("Centered on your live location.");

      const map = mapInstanceRef.current;
      if (map) {
        const L = await loadLeaflet();

        if (layersRef.current.userMarker) {
          map.removeLayer(layersRef.current.userMarker);
        }

        const userIcon = L.divIcon({
          className: "custom-user-live-pin",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
              <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background: rgba(37, 99, 235, 0.45); animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 20px; height: 20px; border-radius: 9999px; background: #2563eb; border: 3.5px solid white; box-shadow: 0 0 16px rgba(37, 99, 235, 0.9);"></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
          popupAnchor: [0, -19],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: userIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; color: #2563eb; padding: 2px;">
            📍 You Are Here
          </div>
        `);

        layersRef.current.userMarker = marker;

        // Force center on user position with high zoom
        map.setView([coords.lat, coords.lng], 16, { animate: true });
        setTimeout(() => {
          marker.openPopup();
          map.invalidateSize();
        }, 300);
      }
    } catch {
      // Fallback: If device has blocked geolocation or no GPS, center on user's latest log or first site
      if (located.length > 0) {
        const fallback = located[0];
        setLocateMessage("GPS access restricted: Centered on your latest field log.");
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([Number(fallback?.latitude ?? 0), Number(fallback?.longitude ?? 0)], 15, {
            animate: true,
          });
        }
      } else {
        setLocateMessage("Please enable location permissions to center on your current position.");
      }
    } finally {
      setLocating(false);
      setTimeout(() => setLocateMessage(null), 3500);
    }
  }

  const livePeersCount = nearbyPeers.length;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
      {/* Top Map Controls Bar (Uniform Monochrome Buttons) */}
      <div className="p-3 sm:p-4 border-b border-border bg-background/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 z-10 relative">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            onMouseEnter={() => setHoveredTip("View all your recorded GPS field log pins")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 font-semibold"
          >
            All Time ({located.length})
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "today" ? "default" : "outline"}
            onClick={() => setActiveFilter("today")}
            onMouseEnter={() => setHoveredTip("Show only logs captured today")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 font-semibold"
          >
            Today
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "week" ? "default" : "outline"}
            onClick={() => setActiveFilter("week")}
            onMouseEnter={() => setHoveredTip("Show logs captured within the past 7 days")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 font-semibold"
          >
            This Week
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "verified" ? "default" : "outline"}
            onClick={() => setActiveFilter("verified")}
            onMouseEnter={() => setHoveredTip("Filter to supervisor-verified field logs")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 font-semibold gap-1.5"
          >
            <CheckCircle2 className="size-3.5" />
            Verified
          </Button>
          <Button
            size="sm"
            variant={activeFilter === "pending" ? "default" : "outline"}
            onClick={() => setActiveFilter("pending")}
            onMouseEnter={() => setHoveredTip("Filter to field logs awaiting supervisor review")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 font-semibold gap-1.5"
          >
            <Clock className="size-3.5" />
            Pending
          </Button>
        </div>

        {/* View Toggles & Actions */}
        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          {/* Pins vs Heatmap */}
          <div className="flex items-center rounded-2xl bg-muted/60 p-0.5 border border-border h-8">
            <button
              onClick={() => setViewMode("pins")}
              onMouseEnter={() => setHoveredTip("Pin View: Individual markers and photo previews")}
              onMouseLeave={() => setHoveredTip(null)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all h-full ${
                viewMode === "pins"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="size-3.5" />
              <span>Pins</span>
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              onMouseEnter={() => setHoveredTip("Heatmap View: Density visualization of hours spent at fieldwork sites")}
              onMouseLeave={() => setHoveredTip(null)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all h-full ${
                viewMode === "heatmap"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="size-3.5" />
              <span>Heatmap</span>
            </button>
          </div>

          {/* Workspace Circles Toggle */}
          <Button
            size="sm"
            variant={showWorkspaces ? "secondary" : "outline"}
            onClick={() => setShowWorkspaces(!showWorkspaces)}
            onMouseEnter={() => setHoveredTip("Toggle 100m authorized geofenced workspace zones")}
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold"
          >
            <Layers className="size-3.5" />
            <span className="hidden sm:inline">Workspaces</span>
          </Button>

          {/* Peers Toggle (Live Sharing & Logged Within 30 Mins) */}
          <Button
            size="sm"
            variant={showPeers ? "secondary" : "outline"}
            onClick={() => setShowPeers(!showPeers)}
            onMouseEnter={() =>
              setHoveredTip(
                livePeersCount > 0
                  ? `${livePeersCount} peer${livePeersCount === 1 ? "" : "s"} live sharing & logged within the past 30m`
                  : "No teammates currently live sharing or logged in nearby area within past 30 mins",
              )
            }
            onMouseLeave={() => setHoveredTip(null)}
            className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold"
          >
            <Users className="size-3.5" />
            <span className="hidden sm:inline">Peers</span>
            {livePeersCount > 0 ? (
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground font-bold">({livePeersCount})</span>
              </span>
            ) : null}
          </Button>

          {/* Locate Me Button */}
          <Button
            size="sm"
            onClick={handleLocateMe}
            onMouseEnter={() => setHoveredTip("Center the map directly on your current GPS location")}
            onMouseLeave={() => setHoveredTip(null)}
            disabled={locating}
            className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold bg-primary text-primary-foreground shadow-sm"
          >
            <Crosshair className={`size-3.5 ${locating ? "animate-spin" : ""}`} />
            <span>{locating ? "Locating..." : "Locate Me"}</span>
          </Button>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative w-full h-[400px] sm:h-[580px] bg-muted/20">
        <div ref={containerRef} className="size-full z-0" />

        {/* Hovered Tooltip Balloon (Appears only on button hover) */}
        {hoveredTip ? (
          <div className="absolute top-3 right-4 z-20 raised rounded-xl px-3 py-1.5 bg-background/95 backdrop-blur-md border border-border shadow-md text-[11px] font-medium text-foreground flex items-center gap-1.5 animate-in fade-in duration-150 pointer-events-none">
            <Info className="size-3 text-muted-foreground shrink-0" />
            <span>{hoveredTip}</span>
          </div>
        ) : null}

        {/* Locate Me Status Toast */}
        {locateMessage ? (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 raised rounded-2xl px-4 py-2 bg-background/95 backdrop-blur-md border border-border shadow-md text-xs font-semibold text-foreground animate-in fade-in slide-in-from-top-2 duration-200">
            {locateMessage}
          </div>
        ) : null}

        {/* Live Teammates Nearby Radar Bar (Strictly ONLY active <= 30 mins) */}
        {showPeers && livePeersCount > 0 ? (
          <div className="absolute top-4 left-4 z-10 max-w-sm w-full raised rounded-2xl p-3 bg-background/95 backdrop-blur-md border border-pink-500/30 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-border/50">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400">
                <Radio className="size-3.5 animate-pulse" />
                <span>Live Sharing Teammates (&lt; 30m)</span>
              </div>
              <span className="text-[10px] font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">
                {livePeersCount} Live
              </span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {nearbyPeers.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => {
                    if (mapInstanceRef.current && peer.latitude && peer.longitude) {
                      mapInstanceRef.current.setView([Number(peer.latitude), Number(peer.longitude)], 15, {
                        animate: true,
                      });
                    }
                  }}
                  className="flex items-center justify-between p-1.5 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-6 rounded-full bg-pink-500 text-white font-bold text-[10px] grid place-items-center shrink-0">
                      {(peer.student?.full_name || "T").charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate text-[11px]">
                        {peer.student?.full_name || "Teammate"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">{peer.title}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-600 font-semibold">{peer.minsAgo}m ago</span>
                    {peer.distMeters > 0 ? (
                      <p className="text-[9px] text-muted-foreground">{peer.distMeters}m away</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Empty State Banner */}
        {filteredEntries.length === 0 && located.length > 0 ? (
          <div className="absolute bottom-4 left-4 right-4 z-10 raised rounded-2xl p-3 bg-background/95 backdrop-blur-md border border-border shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-muted text-muted-foreground">
                <MapPin className="size-4" />
              </span>
              <p className="text-xs text-muted-foreground font-medium">
                No logs match the "{activeFilter}" filter. Try switching to "All Time".
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setActiveFilter("all")} className="text-xs font-semibold">
              Show All
            </Button>
          </div>
        ) : null}

        {located.length === 0 ? (
          <div className="absolute bottom-4 left-4 right-4 z-10 raised rounded-2xl p-4 bg-background/95 backdrop-blur-md border border-border shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid size-9 place-items-center rounded-2xl bg-primary-soft text-primary shrink-0">
                <Navigation className="size-4.5" />
              </span>
              <div>
                <p className="text-xs font-bold text-foreground">No GPS Coordinate Logs Yet</p>
                <p className="text-[11px] text-muted-foreground">
                  When you submit logs with location enabled, your fieldwork pins, photo evidence, and geofenced workspaces appear here.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
