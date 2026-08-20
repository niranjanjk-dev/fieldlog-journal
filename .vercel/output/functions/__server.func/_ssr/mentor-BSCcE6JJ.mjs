import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as reviewQueueQuery, S as Button, U as teamsQuery, V as sumHours, W as weeklyActivity, _ as SectionTitle, a as BentoCard, o as BentoGrid, t as AppShell, u as MiniBars, y as StatTile } from "./router-D-Yy82-a.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Users, ot as CircleCheck, rt as Clock, y as QrCode } from "../_libs/lucide-react.mjs";
import { t as ScannerModal } from "./scanner-modal-tJU_Ymh_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mentor-BSCcE6JJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MentorOverview() {
	const navigate = useNavigate();
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	const { data: queue } = useQuery(reviewQueueQuery);
	const { data: teams } = useQuery(teamsQuery);
	const all = queue ?? [];
	const pending = all.filter((entry) => entry.status === "pending");
	const students = new Set(all.map((entry) => entry.student_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mentor overview",
		subtitle: "Where your students are, at a glance",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "press rounded-2xl",
				onClick: () => setIsScanning(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4 mr-2" }), "Scan Student"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "press rounded-2xl hidden sm:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mentor/verify",
					children: "Review queue"
				})
			})]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerModal, {
				open: isScanning,
				onOpenChange: setIsScanning,
				title: "Scan Student Code",
				description: "Scan a student's pairing QR code to become their mentor.",
				mockData: all[0]?.student_id ?? "00000000-0000-0000-0000-000000000000",
				onScan: (data) => {
					try {
						const extractedId = new URL(data).searchParams.get("studentId");
						if (extractedId) {
							navigate({
								to: "/mentor/pair",
								search: { studentId: extractedId }
							});
							return;
						}
					} catch {}
					navigate({
						to: "/mentor/pair",
						search: { studentId: data }
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:hidden space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "raised rounded-3xl p-4 flex items-stretch divide-x divide-border/60 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-primary" }), " Queue"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-bold tabular-nums text-foreground",
									children: pending.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "logs"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-primary" }), " Hours"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-bold tabular-nums text-foreground",
									children: sumHours(all)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "h"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3 text-primary" }), " Students"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-bold tabular-nums text-foreground",
									children: students.size
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "active"
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "raised rounded-3xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-foreground mb-0.5",
							children: "Team activity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mb-3",
							children: "Logs per day across your students"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: weeklyActivity(all) })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, {
				className: "hidden sm:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-1 lg:col-span-2",
						label: "Awaiting you",
						value: pending.length,
						hint: "Logs needing verification",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-1 lg:col-span-2",
						label: "Total team hours",
						value: sumHours(all),
						unit: "h",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-2 md:col-span-1 lg:col-span-2",
						label: "Active students",
						value: students.size,
						hint: `${teams?.length ?? 0} teams`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "col-span-2 lg:col-span-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							title: "Team activity",
							hint: "Logs captured per day across your students"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: weeklyActivity(all) })]
					})
				]
			})
		]
	});
}
//#endregion
export { MentorOverview as component };
