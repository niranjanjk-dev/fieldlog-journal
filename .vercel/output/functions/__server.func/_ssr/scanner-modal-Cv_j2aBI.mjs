import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { dt as CameraOff, y as QrCode } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DPxFNeYe.mjs";
import { n as NotFoundException, t as BrowserMultiFormatReader } from "../_libs/ts-custom-error+zxing__library.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scanner-modal-Cv_j2aBI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScannerModal({ open, onOpenChange, onScan, title = "Scan QR Code", description = "Align the QR code within the frame to scan.", mockData = "mock-scanned-data" }) {
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let codeReader = null;
		if (open) {
			setScanning(true);
			setSuccess(false);
			setErrorMsg(null);
			codeReader = new BrowserMultiFormatReader();
			codeReader.decodeFromVideoDevice(null, "video-preview", (result, err) => {
				if (result) {
					setScanning(false);
					setSuccess(true);
					if (codeReader) codeReader.reset();
					setTimeout(() => {
						onScan(result.getText());
						onOpenChange(false);
					}, 800);
				}
				if (err && !(err instanceof NotFoundException)) {
					console.error(err);
					if (err.name !== "NotFoundException") setErrorMsg("Camera error: " + err.message);
				}
			}).catch((e) => {
				console.error("Camera startup error", e);
				setErrorMsg("Failed to start camera. Please check permissions.");
				setScanning(false);
			});
		}
		return () => {
			if (codeReader) codeReader.reset();
		};
	}, [
		open,
		onScan,
		onOpenChange
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background overflow-hidden border-border rounded-3xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "text-muted-foreground",
				children: description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-square w-full max-w-[280px] mx-auto my-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						id: "video-preview",
						className: `absolute inset-0 w-full h-full object-cover ${success ? "opacity-0" : "opacity-100"}`
					}),
					scanning && !errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-pulse",
							style: { animation: "scan 2s linear infinite" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-primary/5 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 border-[40px] border-background/60 pointer-events-none" })
					] }),
					errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center bg-background/90 p-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-10 text-red-500 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-red-500",
							children: errorMsg
						})]
					}),
					success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center bg-background/80 animate-in fade-in zoom-in duration-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-8" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm font-bold text-emerald-600",
							children: "Captured!"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { ScannerModal as t };
