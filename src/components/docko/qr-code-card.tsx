import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Check,
  Copy,
  Download,
  Globe,
  Info,
  QrCode,
  RefreshCw,
  Share2,
  Smartphone,
  Sparkles,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QrCodeCardProps {
  studentId: string;
  studentName?: string;
  institution?: string;
}

export function QrCodeCard({ studentId, studentName = "Student", institution }: QrCodeCardProps) {
  const [mode, setMode] = useState<"mentor" | "team">("mentor");
  const [token, setToken] = useState<string>(() => Math.random().toString(36).substring(2, 10));
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrSvgString, setQrSvgString] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  // Host configuration for Localhost vs Mobile LAN scanning
  const defaultHost = typeof window !== "undefined"
    ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://10.10.42.75:8080" // Primary Wi-Fi LAN IP so phones can scan
      : window.location.origin
    : "https://docko.app";

  const [selectedHost, setSelectedHost] = useState<string>(defaultHost);
  const [customHost, setCustomHost] = useState<string>("");
  const [showHostSelector, setShowHostSelector] = useState<boolean>(false);

  const activeBaseUrl = customHost.trim() || selectedHost;

  const targetUrl =
    mode === "mentor"
      ? `${activeBaseUrl}/mentor/pair?studentId=${encodeURIComponent(studentId)}&token=${token}`
      : `${activeBaseUrl}/teams/join?studentId=${encodeURIComponent(studentId)}&token=${token}`;

  // Generate ISO/IEC standard QR code with high error correction
  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    const darkColor = mode === "mentor" ? "#09090b" : "#022c22";

    Promise.all([
      QRCode.toDataURL(targetUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 600,
        color: {
          dark: darkColor,
          light: "#ffffff",
        },
      }),
      QRCode.toString(targetUrl, {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 2,
        color: {
          dark: darkColor,
          light: "#ffffff",
        },
      }),
    ])
      .then(([dataUrl, svg]) => {
        if (!isMounted) return;
        setQrDataUrl(dataUrl);
        setQrSvgString(svg);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error("QR Code Generation Error:", err);
        setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetUrl, mode]);

  function handleCopy() {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    toast.success(
      mode === "mentor" ? "Mentor pairing link copied!" : "Team enrollment link copied!",
    );
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadPng() {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `docko-${mode}-qr-${studentId.substring(0, 8)}.png`;
    link.href = qrDataUrl;
    link.click();
    toast.success("Standard ISO QR Code downloaded as PNG");
  }

  function handleDownloadSvg() {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `docko-${mode}-qr-${studentId.substring(0, 8)}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Vector QR Code downloaded as SVG");
  }

  function handleRegenerateToken() {
    const newToken = Math.random().toString(36).substring(2, 10);
    setToken(newToken);
    toast.info("Generated a new pairing token for security.");
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: QR Mode & Action Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setMode("mentor")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "mentor"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="size-3.5 text-primary" />
              <span>Mentor Connect QR</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("team")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "team"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-3.5 text-primary" />
              <span>Team Join QR</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {mode === "mentor"
                ? "Scannable Mentor Pairing Code"
                : "Cohort & Squad Enrollment Code"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {mode === "mentor"
                ? `Have your faculty advisor or project supervisor scan this QR code with their mobile phone camera. It immediately links them as your designated log approver.`
                : `Have your team lead or fieldwork cohort coordinator scan to enroll you into collaborative field squads with shared geofenced workspaces.`}
            </p>
          </div>

          {/* Mobile Scan / LAN Host IP Notice */}
          <div className="rounded-2xl bg-muted/40 border border-border p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Smartphone className="size-4 text-primary shrink-0" />
                <span>Phone Scanning Target Host:</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHostSelector(!showHostSelector)}
                className="text-[11px] h-6 px-2 text-primary font-bold hover:bg-primary/10 rounded-lg"
              >
                {showHostSelector ? "Hide Options" : "Switch Host IP"}
              </Button>
            </div>

            <p className="font-mono text-[11px] text-muted-foreground break-all bg-background/80 px-2.5 py-1.5 rounded-xl border border-border/60">
              {targetUrl}
            </p>

            {showHostSelector ? (
              <div className="pt-2 border-t border-border/50 space-y-2">
                <div className="text-[11px] text-muted-foreground">
                  Choose the network host reachable by your mobile phone camera:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHost("http://10.10.42.75:8080");
                      setCustomHost("");
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${
                      activeBaseUrl === "http://10.10.42.75:8080"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    10.10.42.75:8080 (Wi-Fi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHost("http://192.168.137.1:8080");
                      setCustomHost("");
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${
                      activeBaseUrl === "http://192.168.137.1:8080"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    192.168.137.1:8080 (LAN)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHost(typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");
                      setCustomHost("");
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${
                      activeBaseUrl === (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080")
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    localhost:8080
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHost("https://docko.app");
                      setCustomHost("");
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${
                      activeBaseUrl === "https://docko.app"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    docko.app (Cloud)
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    placeholder="Custom Host or Tunnel IP (e.g. http://192.168.1.50:8080)"
                    value={customHost}
                    onChange={(e) => setCustomHost(e.target.value)}
                    className="text-xs h-8 rounded-xl font-mono"
                  />
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Info className="size-3 text-primary shrink-0" />
                <span>Tip: When scanning on mobile, your phone will connect via your local Wi-Fi host.</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={handleCopy}
              className="press rounded-2xl text-xs h-9 px-4 gap-1.5 font-bold shadow-sm"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              <span>{copied ? "Link Copied!" : "Copy Pairing Link"}</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownloadPng}
              className="press rounded-2xl text-xs h-9 px-3 gap-1.5 font-semibold"
            >
              <Download className="size-3.5" />
              <span>Download PNG</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDownloadSvg}
              className="press rounded-2xl text-xs h-9 px-3 gap-1.5 font-semibold"
            >
              <Download className="size-3.5" />
              <span>SVG</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleRegenerateToken}
              title="Regenerate Pairing Token"
              className="press rounded-2xl text-xs h-9 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              <span className="sr-only">Refresh Token</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Visual QR Preview Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative p-5 sm:p-6 bg-white rounded-3xl border border-border shadow-xl w-full max-w-[260px] flex flex-col items-center">
            {/* Student ID Badge Header */}
            <div className="w-full text-center pb-3 mb-3 border-b border-zinc-100 flex flex-col items-center">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
                Docko ID Card
              </span>
              <span className="text-xs font-bold text-zinc-900 truncate max-w-[200px] mt-0.5">
                {studentName}
              </span>
              {institution ? (
                <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                  {institution}
                </span>
              ) : null}
            </div>

            {/* Rendered ISO QR Code Image */}
            <div className="relative size-44 sm:size-48 grid place-items-center bg-white rounded-2xl overflow-hidden">
              {isGenerating || !qrDataUrl ? (
                <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
                  <RefreshCw className="size-6 animate-spin text-zinc-500" />
                  <span className="text-[10px] font-medium">Encoding ISO QR...</span>
                </div>
              ) : (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${studentName} ${mode}`}
                  className="size-full object-contain"
                />
              )}
            </div>

            {/* Scan instruction footer */}
            <div className="w-full text-center pt-3 mt-3 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-600">
              <QrCode className="size-3.5 text-zinc-900" />
              <span>Scan with phone camera</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
