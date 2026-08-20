import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as myEntriesQuery, L as myTeamsQuery, P as meQuery, S as Button, _ as SectionTitle, a as BentoCard, t as AppShell, w as cn } from "./router-D-Yy82-a.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Crosshair, P as LoaderCircle, ht as Camera, k as MapPin, p as ShieldCheck, r as WifiOff, s as UserCheck, t as X, u as Sparkles } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as Label } from "./label-4t7PierD.mjs";
import { n as createEntry, r as getPosition } from "./entries-DBJ7D4Uk.mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./server-DC2w2jvT.mjs";
import { n as objectType, t as numberType } from "../_libs/zod.mjs";
import { t as Textarea } from "./textarea-BCWJOMO7.mjs";
import { n as getSavedWorkspaces, t as findNearestWorkspace } from "./workspace-matcher-bdM_i8mP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/log-BqOia984.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var reverseGeocode = createServerFn({ method: "POST" }).validator((input) => objectType({
	latitude: numberType().min(-90).max(90),
	longitude: numberType().min(-180).max(180)
}).parse(input)).handler(createSsrRpc("33d28cf81a684e99f43f74ae939b7eccf8810610ac9db7142c41cf93d9c6f3d4"));
var quickHours = [
	.5,
	1,
	1.5,
	2,
	2.5,
	3
];
function getLocalDrafts() {
	if (typeof window === "undefined") return [];
	try {
		const data = localStorage.getItem("docko_offline_drafts");
		return data ? JSON.parse(data) : [];
	} catch {
		return [];
	}
}
function saveLocalDraft(draft) {
	if (typeof window === "undefined") return;
	try {
		const drafts = getLocalDrafts();
		drafts.push(draft);
		localStorage.setItem("docko_offline_drafts", JSON.stringify(drafts));
	} catch {}
}
function removeLocalDraft(id) {
	if (typeof window === "undefined") return;
	try {
		const drafts = getLocalDrafts().filter((d) => d.id !== id);
		localStorage.setItem("docko_offline_drafts", JSON.stringify(drafts));
	} catch {}
}
function NewLogPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: teams } = useQuery(myTeamsQuery);
	const { data: entries } = useQuery(myEntriesQuery);
	const fileRef = (0, import_react.useRef)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [hours, setHours] = (0, import_react.useState)(2);
	const [teamId, setTeamId] = (0, import_react.useState)(null);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [coords, setCoords] = (0, import_react.useState)(null);
	const [address, setAddress] = (0, import_react.useState)(null);
	const [locating, setLocating] = (0, import_react.useState)(false);
	const [matchedWorkspace, setMatchedWorkspace] = (0, import_react.useState)(null);
	const [offlineDrafts, setOfflineDrafts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setOfflineDrafts(getLocalDrafts());
	}, []);
	const myTeams = teams ?? [];
	const allKnownWorkspaces = [...getSavedWorkspaces(), ...(entries ?? []).filter((e) => e.status === "verified" && e.latitude && e.longitude).map((e) => ({
		id: e.id,
		name: e.address || e.title || "Approved Workspace",
		latitude: e.latitude,
		longitude: e.longitude,
		teamId: e.team_id ?? void 0
	}))];
	const uniqueCategories = (0, import_react.useMemo)(() => {
		if (!entries) return [];
		const set = /* @__PURE__ */ new Set();
		entries.forEach((e) => e.category && set.add(e.category));
		return Array.from(set).sort();
	}, [entries]);
	(0, import_react.useEffect)(() => {
		if (!photo) {
			setPreview(null);
			return;
		}
		let isMounted = true;
		const reader = new FileReader();
		reader.onload = (e) => {
			if (isMounted && typeof e.target?.result === "string") setPreview(e.target.result);
		};
		reader.onerror = () => {
			if (isMounted) try {
				const url = URL.createObjectURL(photo);
				setPreview(url);
			} catch {
				setPreview(null);
			}
		};
		reader.readAsDataURL(photo);
		return () => {
			isMounted = false;
		};
	}, [photo]);
	(0, import_react.useEffect)(() => {
		if (!coords) {
			setMatchedWorkspace(null);
			return;
		}
		const match = findNearestWorkspace(coords, allKnownWorkspaces);
		if (match.matched && match.workspace) {
			setMatchedWorkspace(match.workspace);
			if (!address) setAddress(match.workspace.name);
			if (match.workspace.teamId && !teamId) setTeamId(match.workspace.teamId);
		} else setMatchedWorkspace(null);
	}, [coords, allKnownWorkspaces.length]);
	async function detectLocation() {
		setLocating(true);
		try {
			const position = await getPosition();
			if (!position) {
				toast.error("Location unavailable. You can still save the log.");
				return;
			}
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			setCoords({
				lat,
				lng
			});
			const result = await reverseGeocode({ data: {
				latitude: lat,
				longitude: lng
			} });
			if (result.address) setAddress(result.address);
		} catch {} finally {
			setLocating(false);
		}
	}
	(0, import_react.useEffect)(() => {
		detectLocation();
	}, []);
	const save = useMutation({
		mutationFn: async () => {
			if (!me) throw new Error("Still loading your account — try again in a second.");
			const entryAddress = matchedWorkspace ? `${matchedWorkspace.name} (${address || "Verified Site"})` : address;
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				saveLocalDraft({
					id: crypto.randomUUID(),
					title: title.trim(),
					category: category.trim() || null,
					note: note.trim(),
					hours,
					teamId,
					latitude: coords?.lat ?? null,
					longitude: coords?.lng ?? null,
					address: entryAddress,
					capturedAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				setOfflineDrafts(getLocalDrafts());
				return { offline: true };
			}
			return createEntry(me.id, {
				title: title.trim(),
				category: category.trim() || null,
				note: note.trim(),
				hours,
				teamId,
				latitude: coords?.lat ?? null,
				longitude: coords?.lng ?? null,
				address: entryAddress,
				capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
				photo
			});
		},
		onSuccess: (data) => {
			if (data && "offline" in data && data.offline) toast.success("No connection: Log saved to offline drafts on your device.");
			else {
				queryClient.invalidateQueries({ queryKey: ["entries"] });
				const mentorList = teamId && myTeams ? myTeams.find((t) => t.id === teamId)?.mentor?.full_name : "your mentors";
				toast.success(`Log saved — routed to ${mentorList || "your mentors"} for sign-off.`);
				navigate({ to: "/app/timeline" });
			}
		},
		onError: (error) => {
			saveLocalDraft({
				id: crypto.randomUUID(),
				title: title.trim(),
				category: category.trim() || null,
				note: note.trim(),
				hours,
				teamId,
				latitude: coords?.lat ?? null,
				longitude: coords?.lng ?? null,
				address,
				capturedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			setOfflineDrafts(getLocalDrafts());
			toast.info("Connection issue: Saved entry to offline drafts.");
		}
	});
	async function syncDraft(draft) {
		if (!me) return;
		try {
			await createEntry(me.id, {
				title: draft.title,
				category: draft.category ?? null,
				note: draft.note,
				hours: draft.hours,
				teamId: draft.teamId,
				latitude: draft.latitude,
				longitude: draft.longitude,
				address: draft.address,
				capturedAt: draft.capturedAt,
				photo: null
			});
			removeLocalDraft(draft.id);
			setOfflineDrafts(getLocalDrafts());
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			toast.success(`Synced draft: "${draft.title}"`);
		} catch {
			toast.error("Could not sync draft. Check connection.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "New log",
		subtitle: "Photo, location, hours — submit for mentor review.",
		children: [offlineDrafts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-2xl border border-warning/40 bg-warning-soft p-4 w-full min-w-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-warning-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold",
						children: [
							offlineDrafts.length,
							" offline ",
							offlineDrafts.length === 1 ? "draft" : "drafts",
							" saved"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => offlineDrafts.forEach((d) => void syncDraft(d)),
					className: "press rounded-xl text-xs",
					children: "Sync all drafts"
				})]
			})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-5 grid-cols-1 lg:grid-cols-3 lg:items-stretch w-full min-w-0",
			onSubmit: (event) => {
				event.preventDefault();
				if (!title.trim()) {
					toast.error("Give the log a short title.");
					return;
				}
				save.mutate();
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoCard, {
				className: "order-2 lg:order-1 lg:col-span-2 min-w-0 w-full p-4 sm:p-6 flex flex-col justify-between h-auto lg:h-full space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 pt-1 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							title: "What did you do?",
							hint: "A short title and notes about the task."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "title",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								value: title,
								onChange: (event) => setTitle(event.target.value),
								placeholder: "e.g. Firmware update on drone",
								className: "rounded-2xl",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "category",
									children: "Category (Optional)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "category",
									list: "categories-list",
									value: category,
									onChange: (event) => setCategory(event.target.value),
									placeholder: "e.g. ROS2, Embedded Systems, CAD...",
									className: "rounded-2xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "categories-list",
									children: uniqueCategories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "note",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "note",
								value: note,
								onChange: (event) => setNote(event.target.value),
								rows: 4,
								placeholder: "Observations, tasks completed, method, mentors/peers worked with…",
								className: "rounded-2xl resize-y min-h-[90px] lg:min-h-[110px]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hours (Max 3h per log)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Recommended: 2h block"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: quickHours.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setHours(value),
										className: cn("press rounded-2xl border px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium", hours === value ? "border-primary bg-primary-soft text-primary shadow-xs" : "border-border hover:bg-accent"),
										children: [value, " h"]
									}, value))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed",
									children: "For safety reasons, kindly send multiple logs throughout your session every 2–3 hours."
								})
							]
						}),
						myTeams.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Team / Placement" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: myTeams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTeamId(teamId === team.id ? null : team.id),
									className: cn("press rounded-2xl border px-3.5 py-2 text-sm font-medium", teamId === team.id ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-accent"),
									children: team.name
								}, team.id))
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-3 border-t border-border/60",
							children: teamId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center gap-3 text-[11px] text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold block text-xs",
									children: "Routing to Mentor"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"This log will be sent to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: myTeams.find((t) => t.id === teamId)?.mentor?.full_name || "the mentor" }),
									" for sign-off."
								] })] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-muted/40 border border-border/70 p-3 flex items-center gap-3 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold block text-xs",
									children: "No Team Selected"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select a team above to route this log to a mentor for verification." })] })]
							})
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "order-1 lg:order-2 flex flex-col gap-5 min-w-0 w-full h-auto lg:h-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "min-w-0 w-full p-4 sm:p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								title: "Photo",
								hint: "Photo taken on site during the activity."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*",
								capture: "environment",
								className: "hidden",
								onChange: (event) => setPhoto(event.target.files?.[0] ?? null)
							}),
							preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-2xl sunken bg-muted/20 mt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: preview,
										alt: "Selected log photo preview",
										className: "h-44 sm:h-48 w-full object-cover rounded-2xl",
										onError: () => setPreview(null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white shadow-xs",
											children: "Photo attached"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "sm",
												variant: "secondary",
												className: "press rounded-xl text-xs h-7 px-2.5 bg-background/90 hover:bg-background text-foreground shadow-xs",
												onClick: () => fileRef.current?.click(),
												children: "Change"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "icon",
												variant: "destructive",
												className: "press size-7 rounded-xl shadow-xs",
												onClick: () => {
													setPhoto(null);
													setPreview(null);
												},
												"aria-label": "Remove photo",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
											})]
										})]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => fileRef.current?.click(),
								className: "sunken press grid h-36 sm:h-40 w-full place-items-center rounded-2xl border border-dashed border-border text-muted-foreground mt-2 hover:bg-muted/10 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-col items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5 text-primary" }), "Take photo"]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "min-w-0 w-full p-4 sm:p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								title: "Location",
								hint: "Recorded when you submit for review."
							}),
							matchedWorkspace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary-soft p-2.5 text-xs text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Auto-matched Workspace"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] opacity-90",
									children: [matchedWorkspace.name, " (Approved by Mentor)"]
								})] })]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sunken flex items-start gap-3 rounded-2xl p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-w-0 text-sm",
									children: locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Finding location…"
									}) : coords ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: address ?? "Location captured"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground tabular-nums",
										children: [
											coords.lat.toFixed(5),
											", ",
											coords.lng.toFixed(5)
										]
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "No location yet"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: detectLocation,
								disabled: locating,
								className: "press w-full rounded-2xl text-xs h-9",
								children: [locating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin mr-1.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3.5 mr-1.5" }), "Refresh location"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "lg",
						disabled: save.isPending,
						className: "press w-full rounded-2xl h-11 text-sm font-semibold shadow-sm",
						children: [save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }) : null, "Submit for review"]
					})
				]
			})]
		})]
	});
}
//#endregion
export { NewLogPage as component };
