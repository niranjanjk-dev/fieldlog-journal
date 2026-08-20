import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as currentStreak, F as myEntriesQuery, I as myNudgesQuery, O as formatDay, P as meQuery, R as photoUrlsQuery, S as Button, V as sumHours, W as weeklyActivity, _ as SectionTitle, a as BentoCard, b as StatusChip, d as ProgressRing, l as EmptyState, o as BentoGrid, t as AppShell, u as MiniBars, v as SkeletonTile, w as cn, y as StatTile } from "./router-Bxv_pBoA.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, G as Flame, _t as BellRing, ft as Calendar, lt as ChartColumn, nt as CircleCheck, tt as CirclePlus, w as PenLine, yt as ArrowUpRight, z as ImageOff } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DPxFNeYe.mjs";
import { t as EntryCard } from "./entry-card-BhC8T_kN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-BgNAmYVs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TodayPage() {
	const { data: me } = useQuery(meQuery);
	const { data: entries, isLoading } = useQuery(myEntriesQuery);
	const { data: nudges } = useQuery(myNudgesQuery);
	const [analyticsOpen, setAnalyticsOpen] = (0, import_react.useState)(false);
	const mine = (entries ?? []).filter((entry) => Boolean(entry) && (!me?.id || entry.student_id === me.id));
	const verified = mine.filter((entry) => entry.status === "verified");
	const pending = mine.filter((entry) => entry.status === "pending");
	const recent = mine.slice(0, 4);
	const { data: photos } = useQuery(photoUrlsQuery(recent.map((entry) => entry?.photo_path).filter((p) => Boolean(p))));
	const activityData = weeklyActivity(mine);
	const totalWeekHours = Math.round(activityData.reduce((acc, d) => acc + (d.hours ?? 0), 0) * 10) / 10;
	const activeDaysCount = activityData.filter((d) => (d.hours ?? 0) > 0).length;
	activityData.reduce((acc, d) => acc + d.logs, 0);
	const avgHours = activeDaysCount > 0 ? (totalWeekHours / activeDaysCount).toFixed(1) : "0.0";
	const verifiedPct = mine.length ? verified.length / mine.length * 100 : 0;
	const firstName = me?.fullName ? me.fullName.split(" ")[0] : "there";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: `Hey, ${firstName}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "press rounded-full h-9 w-9 p-0 sm:w-auto sm:px-4 gap-1.5 text-sm font-semibold shadow-[var(--shadow-lift)] flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/log",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "New log"
				})]
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:hidden space-y-3 rise rounded-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "raised rounded-2xl p-3 flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold leading-tight tabular-nums text-foreground",
									children: [currentStreak(mine), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-normal text-muted-foreground ml-0.5",
										children: "days"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground truncate",
									children: "Active streak"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "raised rounded-2xl p-3 flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold leading-tight tabular-nums text-foreground",
									children: [sumHours(mine), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-normal text-muted-foreground ml-0.5",
										children: "h"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground truncate",
									children: [mine.length, " logs total"]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "raised rounded-2xl p-3.5 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
								value: verifiedPct,
								size: 48,
								label: ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-semibold text-primary mt-1",
								children: [Math.round(verifiedPct), "% verified"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-foreground",
								children: [
									verified.length,
									" of ",
									mine.length || 0,
									" signed off"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: pending.length === 0 ? "All caught up" : `${pending.length} log${pending.length > 1 ? "s" : ""} awaiting mentor review`
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "raised rounded-2xl p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-foreground",
								children: "This week"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground ml-1.5",
								children: "· Hours per day"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setAnalyticsOpen(true),
								className: "press rounded-xl text-[11px] h-6 px-2 text-primary hover:text-primary gap-1",
								children: ["Peek", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: activityData })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, {
				className: "hidden sm:grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-1 lg:col-span-2",
						label: "Day streak",
						value: currentStreak(mine),
						unit: "days",
						hint: "Consecutive logging days",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-1 lg:col-span-2",
						label: "Hours logged",
						value: sumHours(mine),
						unit: "h",
						hint: `${mine.length} total logs`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
						className: "col-span-2 md:col-span-1 lg:col-span-2",
						label: "Awaiting review",
						value: pending.length,
						hint: pending.length === 0 ? "All caught up" : "Your mentor has been notified",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "col-span-2 md:col-span-2 lg:col-span-4 relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								title: "This week",
								hint: "Hours logged per day"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: () => setAnalyticsOpen(true),
								className: "press rounded-xl text-xs h-7 px-2 text-muted-foreground hover:text-foreground gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline text-[11px]",
									children: "Center Peek"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: activityData })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "col-span-2 md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressRing, {
							value: verifiedPct,
							sublabel: "verified"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: [
								verified.length,
								" of ",
								mine.length || 0,
								" logs signed off"
							]
						})]
					})
				]
			}),
			nudges && nudges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				tone: "primary",
				className: "mt-4 flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [(nudges[0]?.sender)?.full_name ?? "Your mentor", " nudged you"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: nudges[0]?.message
				})] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Recent logs",
					hint: "Your latest field entries",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						className: "press rounded-xl text-xs h-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/timeline",
							children: "View all"
						})
					})
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:hidden raised rounded-2xl overflow-hidden divide-y divide-border/50",
					children: [
						0,
						1,
						2
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-3 animate-pulse",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-9 shrink-0 rounded-xl bg-muted/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 rounded bg-muted/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-1/2 rounded bg-muted/60" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-14 rounded-full bg-muted/60" })
						]
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" })]
				})] }) : recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-5" }),
					title: "Your log book is empty",
					body: "Capture your first entry with a photo and location — it becomes part of your verified portfolio.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "press rounded-2xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/log",
							children: "Create first log"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:hidden raised rounded-2xl overflow-hidden divide-y divide-border/50",
					children: recent.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 shrink-0 rounded-xl overflow-hidden bg-muted",
								children: entry.photo_path && photos?.[entry.photo_path] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photos[entry.photo_path],
									alt: "",
									className: "size-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-full grid place-items-center text-muted-foreground/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium text-foreground",
									children: entry.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										formatDay(entry.captured_at),
										" · ",
										Number(entry.hours),
										"h"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								status: entry.status,
								className: "shrink-0"
							})
						]
					}, entry.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:grid gap-4 sm:grid-cols-2",
					children: recent.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
						entry,
						photoUrl: entry.photo_path ? photos?.[entry.photo_path] : void 0
					}, entry.id))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: analyticsOpen,
				onOpenChange: setAnalyticsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[88vh] overflow-y-auto p-4 sm:p-6 rounded-3xl gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
							className: "text-left space-y-1.5 pb-2 border-b border-border/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "text-base sm:text-lg font-bold text-foreground",
									children: "Weekly Field Activity & Hours"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
									className: "text-xs text-muted-foreground",
									children: "Detailed distribution of field hours logged across the past 7 days."
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "raised rounded-2xl p-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
											children: "Total Hours"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg sm:text-xl font-bold text-primary mt-0.5 tabular-nums",
											children: [totalWeekHours, "h"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Past 7 days"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "raised rounded-2xl p-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
											children: "Active Days"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg sm:text-xl font-bold text-foreground mt-0.5 tabular-nums",
											children: [
												activeDaysCount,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-normal text-muted-foreground",
													children: "/ 7d"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [currentStreak(mine), "d streak"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "raised rounded-2xl p-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
											children: "Daily Avg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg sm:text-xl font-bold text-foreground mt-0.5 tabular-nums",
											children: [avgHours, "h"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "per active day"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "raised rounded-2xl p-3 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
											children: "Verified Logs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg sm:text-xl font-bold text-success mt-0.5 tabular-nums",
											children: [Math.round(verifiedPct), "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [
												verified.length,
												" of ",
												mine.length,
												" signed"
											]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "raised rounded-2xl p-4 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Hours Spent Per Day"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Same baseline track"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: activityData })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground px-1",
								children: "Day-by-Day Log Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "raised rounded-2xl overflow-hidden divide-y divide-border/40",
								children: activityData.map((d, i) => {
									const hours = Number(d.hours ?? 0);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors", d.isToday ? "bg-primary-soft/40 font-medium" : "hover:bg-accent/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 min-w-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", hours > 0 ? "bg-primary" : "bg-muted-foreground/30") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium text-foreground",
													children: [
														d.fullLabel,
														" ",
														d.isToday ? "(Today)" : ""
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground truncate",
													children: d.dateStr
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground",
												children: [
													d.logs,
													" ",
													d.logs === 1 ? "log" : "logs"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn("px-2 py-0.5 rounded-lg text-xs font-semibold tabular-nums", hours > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
												children: [hours, "h"]
											})]
										})]
									}, `${d.dateStr}-${i}`);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2 pt-2 border-t border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "press rounded-2xl text-xs",
								onClick: () => setAnalyticsOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/timeline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 mr-1.5" }), "View Full Timeline"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "press rounded-2xl text-xs",
								onClick: () => setAnalyticsOpen(false),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/log",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-3.5 mr-1.5" }), "New Log"]
								})
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { TodayPage as component };
