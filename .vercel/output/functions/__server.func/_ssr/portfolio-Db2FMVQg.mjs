import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as myEntriesQuery, L as myTeamsQuery, O as formatDay, P as meQuery, S as Button, V as sumHours, _ as SectionTitle, a as BentoCard, d as ProgressRing, k as formatTime, l as EmptyState, o as BentoGrid, t as AppShell, y as StatTile } from "./router-Bxv_pBoA.mjs";
import { C as Pen, J as ExternalLink, K as FileSpreadsheet, L as Info, W as FolderOpen, Y as Download, Z as Copy, b as Printer, ct as Check, d as Smartphone, i as Users, nt as CircleCheck, p as ShieldCheck, q as FileCodeCorner, rt as CircleAlert, s as UserCheck, v as RefreshCw, vt as BadgeCheck, y as QrCode } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Dg9UVl2Y.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolio-Db2FMVQg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function QrCodeCard({ studentId, studentName = "Student", institution }) {
	const [mode, setMode] = (0, import_react.useState)("mentor");
	const [token, setToken] = (0, import_react.useState)(() => Math.random().toString(36).substring(2, 10));
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [qrDataUrl, setQrDataUrl] = (0, import_react.useState)("");
	const [qrSvgString, setQrSvgString] = (0, import_react.useState)("");
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(true);
	const defaultHost = typeof window !== "undefined" ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://10.10.42.75:8080" : window.location.origin : "https://docko.app";
	const [selectedHost, setSelectedHost] = (0, import_react.useState)(defaultHost);
	const [customHost, setCustomHost] = (0, import_react.useState)("");
	const [showHostSelector, setShowHostSelector] = (0, import_react.useState)(false);
	const activeBaseUrl = customHost.trim() || selectedHost;
	const targetUrl = mode === "mentor" ? `${activeBaseUrl}/mentor/pair?studentId=${encodeURIComponent(studentId)}&token=${token}` : `${activeBaseUrl}/teams/join?studentId=${encodeURIComponent(studentId)}&token=${token}`;
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		setIsGenerating(true);
		const darkColor = mode === "mentor" ? "#09090b" : "#022c22";
		Promise.all([import_lib.toDataURL(targetUrl, {
			errorCorrectionLevel: "H",
			margin: 2,
			width: 600,
			color: {
				dark: darkColor,
				light: "#ffffff"
			}
		}), import_lib.toString(targetUrl, {
			type: "svg",
			errorCorrectionLevel: "H",
			margin: 2,
			color: {
				dark: darkColor,
				light: "#ffffff"
			}
		})]).then(([dataUrl, svg]) => {
			if (!isMounted) return;
			setQrDataUrl(dataUrl);
			setQrSvgString(svg);
			setIsGenerating(false);
		}).catch((err) => {
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
		toast.success(mode === "mentor" ? "Mentor pairing link copied!" : "Team enrollment link copied!");
		setTimeout(() => setCopied(false), 2e3);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl w-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("mentor"),
							className: `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${mode === "mentor" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mentor Connect QR" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("team"),
							className: `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${mode === "team" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Team Join QR" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base sm:text-lg font-bold text-foreground",
							children: mode === "mentor" ? "Scannable Mentor Pairing Code" : "Cohort & Squad Enrollment Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-muted-foreground leading-relaxed",
							children: mode === "mentor" ? `Have your faculty advisor or project supervisor scan this QR code with their mobile phone camera. It immediately links them as your designated log approver.` : `Have your team lead or fieldwork cohort coordinator scan to enroll you into collaborative field squads with shared geofenced workspaces.`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-muted/40 border border-border p-3.5 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs font-semibold text-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone Scanning Target Host:" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => setShowHostSelector(!showHostSelector),
									className: "text-[11px] h-6 px-2 text-primary font-bold hover:bg-primary/10 rounded-lg",
									children: showHostSelector ? "Hide Options" : "Switch Host IP"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] text-muted-foreground break-all bg-background/80 px-2.5 py-1.5 rounded-xl border border-border/60",
								children: targetUrl
							}),
							showHostSelector ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border/50 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: "Choose the network host reachable by your mobile phone camera:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setSelectedHost("http://10.10.42.75:8080");
													setCustomHost("");
												},
												className: `px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${activeBaseUrl === "http://10.10.42.75:8080" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`,
												children: "10.10.42.75:8080 (Wi-Fi)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setSelectedHost("http://192.168.137.1:8080");
													setCustomHost("");
												},
												className: `px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${activeBaseUrl === "http://192.168.137.1:8080" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`,
												children: "192.168.137.1:8080 (LAN)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setSelectedHost(typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");
													setCustomHost("");
												},
												className: `px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${activeBaseUrl === (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080") ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`,
												children: "localhost:8080"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setSelectedHost("https://docko.app");
													setCustomHost("");
												},
												className: `px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium border ${activeBaseUrl === "https://docko.app" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-muted"}`,
												children: "docko.app (Cloud)"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2 pt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Custom Host or Tunnel IP (e.g. http://192.168.1.50:8080)",
											value: customHost,
											onChange: (e) => setCustomHost(e.target.value),
											className: "text-xs h-8 rounded-xl font-mono"
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-3 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tip: When scanning on mobile, your phone will connect via your local Wi-Fi host." })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								onClick: handleCopy,
								className: "press rounded-2xl text-xs h-9 px-4 gap-1.5 font-bold shadow-sm",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "Link Copied!" : "Copy Pairing Link" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: handleDownloadPng,
								className: "press rounded-2xl text-xs h-9 px-3 gap-1.5 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download PNG" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: handleDownloadSvg,
								className: "press rounded-2xl text-xs h-9 px-3 gap-1.5 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SVG" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: handleRegenerateToken,
								title: "Regenerate Pairing Token",
								className: "press rounded-2xl text-xs h-9 px-2.5 text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Refresh Token"
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-5 flex flex-col items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative p-5 sm:p-6 bg-white rounded-3xl border border-border shadow-xl w-full max-w-[260px] flex flex-col items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full text-center pb-3 mb-3 border-b border-zinc-100 flex flex-col items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-black tracking-widest text-zinc-400 uppercase",
									children: "Docko ID Card"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-zinc-900 truncate max-w-[200px] mt-0.5",
									children: studentName
								}),
								institution ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-zinc-500 truncate max-w-[200px]",
									children: institution
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative size-44 sm:size-48 grid place-items-center bg-white rounded-2xl overflow-hidden",
							children: isGenerating || !qrDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center gap-2 text-zinc-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-6 animate-spin text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium",
									children: "Encoding ISO QR..."
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: qrDataUrl,
								alt: `QR Code for ${studentName} ${mode}`,
								className: "size-full object-contain"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full text-center pt-3 mt-3 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5 text-zinc-900" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan with phone camera" })]
						})
					]
				})
			})]
		})
	});
}
function PortfolioPage() {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: entries } = useQuery(myEntriesQuery);
	const { data: teams } = useQuery(myTeamsQuery);
	const [name, setName] = (0, import_react.useState)("");
	const [isEditingName, setIsEditingName] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (me?.fullName) setName(me.fullName);
	}, [me?.fullName]);
	const updateName = useMutation({
		mutationFn: async () => {
			if (!me) throw new Error("Not loaded");
			if (me.hasChangedName) throw new Error("Name already changed once.");
			const { error } = await supabase.from("profiles").update({
				full_name: name.trim(),
				has_changed_name: true
			}).eq("id", me.id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Name updated successfully!");
			setIsEditingName(false);
		},
		onError: (error) => toast.error(error.message)
	});
	const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
	const verified = mine.filter((entry) => entry.status === "verified");
	const pending = mine.filter((entry) => entry.status === "pending");
	const studentId = me?.id || "student-preview-id";
	const studentName = me?.fullName || "Fieldwork Student";
	const studentInstitution = me?.institution || "Metropolitan Engineering Institute";
	const totalVerifiedHours = Number(sumHours(verified)) || 0;
	const targetRequirementHours = 120;
	Math.min(100, Math.round(totalVerifiedHours / targetRequirementHours * 100));
	function exportCsv() {
		const csv = [[
			"Date",
			"Title",
			"Hours",
			"Status",
			"Latitude",
			"Longitude",
			"Location",
			"Notes"
		], ...mine.map((entry) => [
			new Date(entry.captured_at).toISOString(),
			entry.title,
			String(Number(entry.hours)),
			entry.status,
			entry.latitude ? String(entry.latitude) : "",
			entry.longitude ? String(entry.longitude) : "",
			entry.address ?? "",
			(entry.note ?? "").replace(/\n/g, " ")
		])].map((row) => row.map((cell) => `"${cell.replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = `docko-portfolio-${studentName.toLowerCase().replace(/\s+/g, "-")}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("CSV audit report exported successfully.");
	}
	function exportGeoJson() {
		const featureCollection = {
			type: "FeatureCollection",
			features: mine.filter((e) => e.latitude && e.longitude).map((entry) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [Number(entry.longitude), Number(entry.latitude)]
				},
				properties: {
					id: entry.id,
					title: entry.title,
					hours: Number(entry.hours),
					status: entry.status,
					captured_at: entry.captured_at,
					address: entry.address,
					note: entry.note,
					student_id: entry.student_id,
					verified: entry.status === "verified"
				}
			}))
		};
		const jsonStr = JSON.stringify(featureCollection, null, 2);
		const url = URL.createObjectURL(new Blob([jsonStr], { type: "application/geo+json" }));
		const link = document.createElement("a");
		link.href = url;
		link.download = `docko-fieldwork-geodata-${studentName.toLowerCase().replace(/\s+/g, "-")}.geojson`;
		link.click();
		URL.revokeObjectURL(url);
		toast.success("GeoJSON fieldwork dataset exported.");
	}
	const publicUrl = `https://docko.app/p/@${studentName.toLowerCase().replace(/\s+/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Portfolio & Credential Hub",
		subtitle: studentInstitution,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCsv,
					className: "press rounded-2xl h-9 px-3 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "CSV Export"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportGeoJson,
					className: "press rounded-2xl h-9 px-3 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCodeCorner, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "GeoJSON"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => window.print(),
					className: "press rounded-2xl h-9 px-3.5 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Audit PDF"
					})]
				})
			]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: !isEditingName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-foreground",
						children: me?.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground",
						onClick: () => setIsEditingName(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "size-4" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5 w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								disabled: me?.hasChangedName || updateName.isPending,
								className: "rounded-2xl h-9 text-sm flex-1 font-bold",
								placeholder: "Enter your full name"
							}),
							!me?.hasChangedName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => name.trim() !== me?.fullName && updateName.mutate(),
								disabled: name.trim() === me?.fullName || !name.trim() || updateName.isPending,
								className: "press rounded-2xl h-9 px-3 text-xs",
								children: "Save"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									setName(me?.fullName ?? "");
									setIsEditingName(false);
								},
								className: "press rounded-2xl h-9 px-3 text-xs text-muted-foreground",
								children: "Cancel"
							})
						]
					}), me?.hasChangedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground flex items-center gap-1.5 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3 text-warning shrink-0" }), "Already changed once. Contact support."]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground flex items-center gap-1.5 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-success shrink-0" }), "Can be changed exactly once."]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "lg:col-span-2",
						label: "Verified hours",
						value: sumHours(verified),
						unit: "h",
						hint: `${targetRequirementHours}h Institutional target`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "lg:col-span-2",
						label: "Verified logs",
						value: verified.length,
						hint: `${pending.length} pending review`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoCard, {
						className: "flex items-center justify-center lg:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
							value: mine.length ? verified.length / mine.length * 100 : 0,
							sublabel: "verified"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Student Digital ID & Scannable QR Hub",
					hint: "Allow mentors to pair directly via camera or team leads to enroll you in field squads."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCodeCard, {
					studentId,
					studentName,
					institution: studentInstitution
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "My Teams & Mentors",
					hint: "Teams you are currently enrolled in and the mentors leading them."
				}), !teams || teams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" }),
					title: "No active teams",
					body: "You are not part of any field teams yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-card border border-border rounded-3xl overflow-hidden shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: teams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 place-items-center rounded-xl bg-primary/10 text-primary font-bold shrink-0 uppercase",
									children: team.name.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-foreground truncate",
										children: team.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold text-muted-foreground/70",
											children: "Mentor:"
										}), team.mentor?.full_name ?? "Unknown"]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center shrink-0 self-end sm:self-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									className: "press rounded-2xl text-xs h-8 px-3 font-semibold text-destructive hover:bg-destructive/10",
									onClick: async () => {
										const loadingToast = toast.loading("Leaving team...");
										try {
											const { error } = await supabase.rpc("leave_team", { _team_id: team.id });
											if (error) throw error;
											toast.success("Successfully left team", { id: loadingToast });
											queryClient.invalidateQueries({ queryKey: ["teams", "mine"] });
										} catch (err) {
											toast.error(err.message || "Failed to leave team", { id: loadingToast });
										}
									},
									children: "Leave Team"
								})
							})]
						}, team.id))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Public Verifiable Portfolio Link",
					hint: "Share your tamper-proof fieldwork profile with prospective employers and accrediting boards."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shrink-0 shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-sm font-bold text-foreground",
									children: "Cryptographically Signed Portfolio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full",
									children: "GPS-Verified"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground mt-0.5",
								children: publicUrl
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									navigator.clipboard.writeText(publicUrl);
									toast.success("Public portfolio URL copied to clipboard!");
								},
								className: "press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy Link" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => window.open(publicUrl, "_blank"),
								className: "press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preview" })]
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Verified Fieldwork Record",
					hint: "Formal audit register with mentor approvals and timestamps."
				}), verified.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-5" }),
					title: "No verified logs yet",
					body: "Once your mentor signs off a log, it appears in your portfolio and hour totals."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-card border border-border rounded-3xl overflow-hidden shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: verified.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-bold text-foreground truncate",
										children: entry.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											formatDay(entry.captured_at),
											" · ",
											formatTime(entry.captured_at)
										] }), entry.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", entry.address] }) : null]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 shrink-0 self-end sm:self-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full",
									children: [Number(entry.hours), " Hours"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full",
									children: "Signed Off"
								})]
							})]
						}, entry.id))
					})
				})]
			})
		]
	});
}
//#endregion
export { PortfolioPage as component };
