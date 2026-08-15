import { useEffect, useState } from "react";
import { Loader2, QrCode, ScanLine } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ScannerModal({
  open,
  onOpenChange,
  onScan,
  title = "Scan QR Code",
  description = "Align the QR code within the frame to scan.",
  mockData = "mock-scanned-data",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (data: string) => void;
  title?: string;
  description?: string;
  mockData?: string;
}) {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setScanning(true);
      setSuccess(false);
      // Simulate scanning process
      const timer = setTimeout(() => {
        setScanning(false);
        setSuccess(true);
        setTimeout(() => {
          onScan(mockData);
          onOpenChange(false);
        }, 500);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [open, onScan, mockData, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background overflow-hidden border-border rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square w-full max-w-[280px] mx-auto my-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden">
          {scanning && (
            <>
              {/* Animated scan line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-pulse" style={{ animation: "scan 2s linear infinite" }} />
              <div className="absolute inset-0 bg-primary/5" />
              <ScanLine className="size-16 text-muted-foreground/30" />
              <p className="mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                Detecting Code...
              </p>
            </>
          )}

          {success && (
            <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="size-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                <QrCode className="size-8" />
              </div>
              <p className="mt-4 text-sm font-bold text-emerald-600">Captured!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
