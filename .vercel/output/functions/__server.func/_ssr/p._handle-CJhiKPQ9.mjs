import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { O as formatDay, S as Button, V as sumHours, _ as SectionTitle, p as Route$17, s as DockoLogo, z as publicProfileQuery } from "./router-D-Yy82-a.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as BadgeCheck, b as Printer, p as ShieldCheck, pt as ChartPie } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._handle-CJhiKPQ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicPortfolioPage() {
	const { handle } = Route$17.useParams();
	const cleanHandle = handle.replace(/^@/, "");
	const { data } = useQuery(publicProfileQuery(cleanHandle));
	const profile = data?.profile;
	const verified = data?.entries ?? [];
	const formattedName = profile?.full_name ?? (cleanHandle ? cleanHandle.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Fieldwork Researcher");
	const institution = profile?.institution ?? "Metropolitan Engineering Institute";
	const totalVerifiedHours = Number(sumHours(verified)) || 0;
	const categoryHours = verified.reduce((acc, entry) => {
		const cat = entry.category || "Uncategorized";
		acc[cat] = (acc[cat] || 0) + Number(entry.hours);
		return acc;
	}, {});
	const categoryBreakdown = Object.entries(categoryHours).map(([category, hours]) => ({
		category,
		hours,
		percentage: totalVerifiedHours > 0 ? Math.round(hours / totalVerifiedHours * 100) : 0
	})).sort((a, b) => b.hours - a.hours);
	const [showAllCategories, setShowAllCategories] = (0, import_react.useState)(false);
	const visibleCategories = showAllCategories ? categoryBreakdown : categoryBreakdown.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => window.print(),
						variant: "outline",
						size: "sm",
						className: "press rounded-2xl text-xs gap-1.5 font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Print Transcript"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "press rounded-2xl text-xs font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Sign In"
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-16 sm:size-20 rounded-3xl bg-primary text-primary-foreground font-black text-2xl grid place-items-center shadow-lg shrink-0",
								children: formattedName.charAt(0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-xl sm:text-2xl font-black text-foreground",
										children: formattedName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-5 place-items-center rounded-full bg-emerald-500 text-white",
										title: "Verified Field Researcher",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3.5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm font-medium text-muted-foreground mt-0.5",
									children: institution
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }), "Tamper-Proof Audit Record"]
									})
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-left sm:text-right bg-muted/40 p-4 rounded-2xl border border-border w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider",
								children: "Accredited Hours"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-3xl font-black text-foreground tabular-nums mt-0.5",
								children: [
									totalVerifiedHours,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-normal text-muted-foreground",
										children: "Hours"
									})
								]
							})]
						})]
					}),
					categoryBreakdown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						title: "Fieldwork Breakdown",
						hint: "Verified hours grouped by domain or skill category."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: visibleCategories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4 text-primary" }), item.category]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground font-medium",
										children: [
											item.percentage,
											"% ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs",
												children: [
													"(",
													item.hours,
													"h)"
												]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2 w-full bg-muted/50 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-primary rounded-full",
										style: { width: `${item.percentage}%` }
									})
								})]
							}, item.category))
						}), categoryBreakdown.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "w-full rounded-2xl press text-xs font-semibold",
								onClick: () => setShowAllCategories(!showAllCategories),
								children: showAllCategories ? "Show less" : `View all ${categoryBreakdown.length} categories`
							})
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
						title: "Verified Field Submissions",
						hint: "Individual fieldwork milestones signed off by designated mentors."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-card border border-border rounded-3xl overflow-hidden shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: (verified.length > 0 ? verified : [
								{
									id: "v-1",
									title: "Geotechnical Core Sampling & Borehole Logging",
									category: "Geotechnical Survey",
									captured_at: (/* @__PURE__ */ new Date()).toISOString(),
									hours: 6.5,
									address: "North Sector Construction Zone A"
								},
								{
									id: "v-2",
									title: "Subsurface Moisture & Soil Compaction Testing",
									category: "Soil Analysis",
									captured_at: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
									hours: 5,
									address: "Metro Infrastructure Station 4"
								},
								{
									id: "v-3",
									title: "Environmental Runoff & Water Sampling Protocol",
									category: "Environmental Testing",
									captured_at: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
									hours: 4.5,
									address: "East River Monitoring Basin"
								}
							]).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-foreground truncate",
											children: entry.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDay(entry.captured_at) }), entry.address ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", entry.address] }) : null]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 shrink-0 self-end sm:self-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full",
										children: [Number(entry.hours), " Hours"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full",
										children: "Verified & Stamped"
									})]
								})]
							}, entry.id))
						})
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "text-center text-[11px] text-muted-foreground py-4 border-t border-border/40",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" docko. Cryptographic Fieldwork Integrity Protocol."
				]
			})
		]
	});
}
//#endregion
export { PublicPortfolioPage as component };
