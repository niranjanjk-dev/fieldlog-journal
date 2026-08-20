import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as reviewQueueQuery, P as meQuery, R as photoUrlsQuery, S as Button, l as EmptyState, t as AppShell, v as SkeletonTile, w as cn } from "./router-D-Yy82-a.mjs";
import { B as Inbox, St as BellRing, it as CircleX, ot as CircleCheck, p as ShieldCheck, s as UserCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as sendNudge, i as reviewEntry } from "./entries-DBJ7D4Uk.mjs";
import { t as EntryCard } from "./entry-card-QaL3E0lM.mjs";
import { r as saveApprovedWorkspace } from "./workspace-matcher-bdM_i8mP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-DSniywDY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	{
		key: "pending",
		label: "Awaiting review"
	},
	{
		key: "verified",
		label: "Verified"
	},
	{
		key: "rejected",
		label: "Needs changes"
	}
];
function VerifyPage() {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: queue, isLoading } = useQuery(reviewQueueQuery);
	const [tab, setTab] = (0, import_react.useState)("pending");
	const [assignedOnly, setAssignedOnly] = (0, import_react.useState)(false);
	const allVisible = (queue ?? []).filter((entry) => entry.status === tab);
	const visible = assignedOnly ? allVisible.filter((entry) => {
		if (!entry.assigned_mentor_ids || entry.assigned_mentor_ids.length === 0) return true;
		return me?.id ? entry.assigned_mentor_ids.includes(me.id) : true;
	}) : allVisible;
	const { data: photos } = useQuery(photoUrlsQuery(visible.slice(0, 30).map((entry) => entry.photo_path).filter((p) => Boolean(p))));
	const review = useMutation({
		mutationFn: (input) => {
			if (input.status === "verified" && input.entryData?.latitude && input.entryData?.longitude) saveApprovedWorkspace({
				id: input.id,
				name: input.entryData.address || input.entryData.title || "Approved Workspace",
				latitude: input.entryData.latitude,
				longitude: input.entryData.longitude,
				teamId: input.entryData.team_id ?? void 0
			});
			return reviewEntry(input.id, input.status, input.note);
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ["entries", "queue"] });
			const previousQueue = queryClient.getQueryData(["entries", "queue"]);
			queryClient.setQueryData(["entries", "queue"], (old) => {
				if (!old) return old;
				return old.map((entry) => entry.id === input.id ? {
					...entry,
					status: input.status
				} : entry);
			});
			return { previousQueue };
		},
		onSuccess: (_data, input) => {
			toast.success(input.status === "verified" ? input.asWorkspace ? "Log verified & saved as approved workspace location" : "Log verified" : "Changes requested");
		},
		onError: (error, _input, context) => {
			if (context?.previousQueue) queryClient.setQueryData(["entries", "queue"], context.previousQueue);
			toast.error(error.message);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
		}
	});
	const nudge = useMutation({
		mutationFn: (studentId) => sendNudge(studentId, "Your mentor is waiting on your latest field log."),
		onSuccess: () => toast.success("Nudge sent"),
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Verify",
		subtitle: "One review queue for all your assigned students",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(item.key),
					className: cn("press rounded-2xl border px-3.5 py-1.5 text-sm font-medium", tab === item.key ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-accent"),
					children: item.label
				}, item.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 bg-muted/60 p-1 rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setAssignedOnly(false),
					className: cn("px-3 py-1 rounded-xl text-xs font-semibold transition-all", !assignedOnly ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
					children: [
						"All Queue (",
						allVisible.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setAssignedOnly(true),
					className: cn("flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all", assignedOnly ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assigned to Me" })]
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" })]
		}) : me && !me.institutionVerified && !me.roles.includes("admin") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-destructive" }),
			title: "Account not verified",
			body: "Your mentor account must be verified by your institution before you can review student logs."
		}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-5" }),
			title: "Queue is clear",
			body: "Nothing in this state right now. New student logs land here automatically."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: visible.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
				entry,
				author: entry.student,
				photoUrl: entry.photo_path ? photos?.[entry.photo_path] : void 0,
				footer: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "press rounded-xl",
							onClick: () => nudge.mutate(entry.student_id),
							"aria-label": "Nudge student",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "press rounded-xl",
							onClick: () => {
								const note = window.prompt("What needs changing?");
								if (note) review.mutate({
									id: entry.id,
									status: "rejected",
									note
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" }), "Changes"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "press rounded-xl",
							onClick: () => review.mutate({
								id: entry.id,
								status: "verified",
								note: null,
								asWorkspace: true,
								entryData: {
									latitude: entry.latitude,
									longitude: entry.longitude,
									address: entry.address,
									title: entry.title,
									team_id: entry.team_id
								}
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), "Verify"]
						})
					]
				})
			}, entry.id))
		})]
	});
}
//#endregion
export { VerifyPage as component };
