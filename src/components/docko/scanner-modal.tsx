import { useEffect, useState } from "react";
import { Loader2, QrCode, ScanLine, CameraOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;
    
    if (open) {
      setScanning(true);
      setSuccess(false);
      setErrorMsg(null);
      
      codeReader = new BrowserMultiFormatReader();
      
      codeReader.decodeFromVideoDevice(null, 'video-preview', (result, err) => {
        if (result) {
          // Success!
          setScanning(false);
          setSuccess(true);
          
          if (codeReader) {
            (codeReader as any).reset();
          }
          
          setTimeout(() => {
            onScan(result.getText());
            onOpenChange(false);
          }, 800);
        }
        
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
          // Only show error if it's not a generic "not found" frame error
          if (err.name !== 'NotFoundException') {
            setErrorMsg("Camera error: " + err.message);
          }
        }
      }).catch((e) => {
        console.error("Camera startup error", e);
        setErrorMsg("Failed to start camera. Please check permissions.");
        setScanning(false);
      });
    }

    return () => {
      if (codeReader) {
        (codeReader as any).reset();
      }
    };
  }, [open, onScan, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background overflow-hidden border-border rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square w-full max-w-[280px] mx-auto my-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden">
          
          {/* Live Video Feed */}
          <video 
            id="video-preview" 
            className={`absolute inset-0 w-full h-full object-cover ${success ? 'opacity-0' : 'opacity-100'}`}
          />

          {scanning && !errorMsg && (
            <>
              {/* Animated scan line overlay */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-pulse" style={{ animation: "scan 2s linear infinite" }} />
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="absolute inset-0 border-[40px] border-background/60 pointer-events-none" />
            </>
          )}

          {errorMsg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-4 text-center">
              <CameraOff className="size-10 text-red-500 mb-3" />
              <p className="text-sm font-bold text-red-500">{errorMsg}</p>
            </div>
          )}

          {success && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 animate-in fade-in zoom-in duration-300">
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
