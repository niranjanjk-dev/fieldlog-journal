import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as buttonVariants, D as dayKey, E as currentStreak, F as myEntriesQuery, O as formatDay, P as meQuery, R as photoUrlsQuery, S as Button, V as sumHours, a as BentoCard, l as EmptyState, t as AppShell, v as SkeletonTile, w as cn } from "./router-Bxv_pBoA.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, G as Flame, N as List, _ as RotateCcw, at as ChevronRight, mt as CalendarClock, ot as ChevronLeft, pt as CalendarDays, st as ChevronDown, tt as CirclePlus } from "../_libs/lucide-react.mjs";
import { t as EntryCard } from "./entry-card-BhC8T_kN.mjs";
import { n as getDefaultClassNames, t as DayPicker } from "../_libs/react-day-picker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-Bo1G1PNh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Calendar$1({ className, classNames, showOutsideDays = true, fixedWeeks = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, {
		showOutsideDays,
		fixedWeeks,
		className: cn("bg-transparent group/calendar p-0 w-full max-w-full", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-full max-w-full sm:max-w-[360px] mx-auto", defaultClassNames.root),
			months: cn("relative flex flex-col gap-3 sm:gap-4 w-full", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-2.5 sm:gap-3", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "size-7 sm:size-9 select-none p-0 rounded-xl aria-disabled:opacity-30 hover:bg-muted transition-colors", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "size-7 sm:size-9 select-none p-0 rounded-xl aria-disabled:opacity-30 hover:bg-muted transition-colors", defaultClassNames.button_next),
			month_caption: cn("flex h-7 sm:h-9 w-full items-center justify-center font-bold text-sm sm:text-base text-foreground", defaultClassNames.month_caption),
			dropdowns: cn("flex h-7 sm:h-9 w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
			dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-xl border", defaultClassNames.dropdown_root),
			dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
			caption_label: cn("select-none font-bold text-sm sm:text-base text-foreground", captionLayout === "label" ? "text-sm sm:text-base" : "[&>svg]:text-muted-foreground flex h-7 sm:h-9 items-center gap-1 rounded-xl pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
			table: "w-full border-collapse table-fixed",
			weekdays: cn("flex justify-between mb-1 w-full", defaultClassNames.weekdays),
			weekday: cn("text-muted-foreground flex-1 select-none text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider", defaultClassNames.weekday),
			week: cn("mt-0.5 sm:mt-1 flex w-full justify-between gap-0.5 sm:gap-1", defaultClassNames.week),
			week_number_header: cn("w-8 select-none", defaultClassNames.week_number_header),
			week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
			day: cn("group/day relative aspect-square h-auto w-full select-none p-0 text-center flex items-center justify-center", defaultClassNames.day),
			range_start: cn("bg-primary text-primary-foreground rounded-l-xl", defaultClassNames.range_start),
			range_middle: cn("bg-primary-soft text-primary rounded-none", defaultClassNames.range_middle),
			range_end: cn("bg-primary text-primary-foreground rounded-r-xl", defaultClassNames.range_end),
			today: cn("font-bold text-foreground", defaultClassNames.today),
			outside: cn("text-muted-foreground/35 aria-selected:text-muted-foreground/35", defaultClassNames.outside),
			disabled: cn("text-muted-foreground/25 opacity-35 pointer-events-none", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: ({ className, rootRef, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-slot": "calendar",
					ref: rootRef,
					className: cn("w-full max-w-full", className),
					...props
				});
			},
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: CalendarDayButton,
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					...props,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-8 items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props
	});
}
function CalendarDayButton({ className, day, modifiers, children, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		if (modifiers["focused"]) ref.current?.focus();
	}, [modifiers]);
	const isSelected = Boolean(modifiers["selected"] && !modifiers["range_start"] && !modifiers["range_end"] && !modifiers["range_middle"]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(),
		"data-has-log": Boolean(modifiers["hasLog"]),
		"data-selected-single": isSelected,
		"data-range-start": modifiers["range_start"],
		"data-range-end": modifiers["range_end"],
		"data-range-middle": modifiers["range_middle"],
		className: cn("relative flex aspect-square size-8 xs:size-9 sm:size-10 max-w-[42px] flex-col items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors select-none", isSelected && "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary hover:text-primary-foreground", !isSelected && modifiers["today"] && "ring-1.5 ring-primary/40 font-bold text-foreground hover:bg-muted/70", !isSelected && !modifiers["today"] && "hover:bg-muted/70 text-foreground", modifiers["disabled"] && "opacity-30 pointer-events-none", defaultClassNames.day, className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "leading-none",
			children
		}), modifiers["hasLog"] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("absolute bottom-0.5 sm:bottom-1 size-1 rounded-full shrink-0 transition-colors", isSelected ? "bg-primary-foreground" : "bg-primary"),
			"aria-hidden": "true"
		}) : null]
	});
}
var filters = [
	{
		key: "all",
		label: "All"
	},
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
function TimelinePage() {
	const { data: me } = useQuery(meQuery);
	const { data: entries, isLoading } = useQuery(myEntriesQuery);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("calendar");
	const mine = (0, import_react.useMemo)(() => (entries ?? []).filter((entry) => entry.student_id === me?.id), [entries, me?.id]);
	const visible = (0, import_react.useMemo)(() => filter === "all" ? mine : mine.filter((entry) => entry.status === filter), [filter, mine]);
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(() => {
		if (mine.length > 0) return new Date(mine[0].captured_at);
		return /* @__PURE__ */ new Date();
	});
	const selectedDayKey = dayKey(selectedDate);
	const daysWithEntries = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const entry of visible) set.add(dayKey(entry.captured_at));
		return set;
	}, [visible]);
	const uniqueLoggedDayKeys = (0, import_react.useMemo)(() => {
		return Array.from(daysWithEntries).sort();
	}, [daysWithEntries]);
	const dayEntries = (0, import_react.useMemo)(() => {
		return visible.filter((entry) => dayKey(entry.captured_at) === selectedDayKey);
	}, [visible, selectedDayKey]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const entry of visible) {
			const key = dayKey(entry.captured_at);
			map.set(key, [...map.get(key) ?? [], entry]);
		}
		return map;
	}, [visible]);
	const { data: photos } = useQuery(photoUrlsQuery((viewMode === "calendar" ? dayEntries : visible).slice(0, 50).map((entry) => entry.photo_path).filter((p) => Boolean(p))));
	const hasLogModifier = (date) => daysWithEntries.has(dayKey(date));
	const handlePrevDay = () => {
		const next = new Date(selectedDate);
		next.setDate(next.getDate() - 1);
		setSelectedDate(next);
	};
	const handleNextDay = () => {
		const next = new Date(selectedDate);
		next.setDate(next.getDate() + 1);
		if (next > /* @__PURE__ */ new Date()) return;
		setSelectedDate(next);
	};
	const handleJumpToLatest = () => {
		if (mine.length > 0) setSelectedDate(new Date(mine[0].captured_at));
		else setSelectedDate(/* @__PURE__ */ new Date());
	};
	const isToday = dayKey(selectedDate) === dayKey(/* @__PURE__ */ new Date());
	const formattedSelectedDate = selectedDate.toLocaleDateString(void 0, {
		weekday: "long",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Timeline",
		subtitle: `${mine.length} logs · ${sumHours(mine)} hours recorded across ${daysWithEntries.size} days`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "press rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/log",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: "New log"
				})]
			})
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
				children: filters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(item.key),
					className: cn("press rounded-2xl border px-3 py-1.5 text-xs sm:text-sm font-medium transition-all", filter === item.key ? "border-primary bg-primary-soft text-primary shadow-xs" : "border-border hover:bg-accent text-muted-foreground"),
					children: item.label
				}, item.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center rounded-2xl border border-border/80 bg-muted/40 p-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setViewMode("calendar"),
					className: cn("flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all", viewMode === "calendar" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calendar" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setViewMode("all"),
					className: cn("flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold transition-all", viewMode === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All logs" })]
				})]
			})]
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-64" })]
		}) : mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-5" }),
			title: "Your timeline is empty",
			body: "Capture your first field log to start building your verified portfolio and day streak.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "press rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/log",
					children: "Create first log"
				})
			})
		}) : viewMode === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-8",
			children: [...groups.entries()].map(([key, dayGroupEntries]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rise",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3.5 flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-foreground",
							children: formatDay(dayGroupEntries[0].captured_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
							children: [
								dayGroupEntries.length,
								" log",
								dayGroupEntries.length > 1 ? "s" : "",
								" · ",
								sumHours(dayGroupEntries),
								" h"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: dayGroupEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
						entry,
						photoUrl: entry.photo_path ? photos?.[entry.photo_path] : void 0
					}, entry.id))
				})]
			}, key))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-12 items-stretch",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-5 flex flex-col w-full max-w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
					className: "p-3 sm:p-5 w-full max-w-full overflow-hidden flex flex-col justify-between h-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2.5 sm:mb-3 flex items-center gap-2.5 px-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 sm:size-8 place-items-center rounded-xl bg-primary-soft text-primary shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3.5 sm:size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-foreground truncate",
								children: "Field Calendar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground truncate",
								children: "Touch any date to see logs"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full flex justify-center py-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar$1, {
							mode: "single",
							selected: selectedDate,
							onSelect: (date) => {
								if (date) setSelectedDate(date);
							},
							disabled: { after: /* @__PURE__ */ new Date() },
							toDate: /* @__PURE__ */ new Date(),
							modifiers: { hasLog: hasLogModifier },
							modifiersClassNames: { hasLog: "font-semibold" },
							className: "w-full flex justify-center p-0 bg-transparent"
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t border-border/50 pt-3 px-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Days with logs" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3 text-primary" }),
									currentStreak(mine),
									"d streak"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 font-medium text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-primary" }),
									uniqueLoggedDayKeys.length,
									" active"
								]
							})]
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7 flex flex-col gap-4 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "raised rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: handlePrevDay,
								className: "press size-8 rounded-xl",
								"aria-label": "Previous day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: handleNextDay,
								disabled: isToday,
								className: "press size-8 rounded-xl disabled:opacity-30 disabled:pointer-events-none",
								"aria-label": "Next day",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm sm:text-base font-bold text-foreground",
							children: formattedSelectedDate
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] sm:text-xs text-muted-foreground",
							children: dayEntries.length > 0 ? `${dayEntries.length} log${dayEntries.length === 1 ? "" : "s"} captured · ${sumHours(dayEntries)}h recorded` : "No entries logged on this date"
						})] })]
					}), isToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary-soft border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary",
						children: "Today"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setSelectedDate(/* @__PURE__ */ new Date()),
						className: "press rounded-xl text-xs h-7 px-2 text-primary hover:text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 mr-1" }), "Go to Today"]
					})]
				}), dayEntries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "raised rounded-3xl p-8 text-center space-y-3 flex-1 flex flex-col justify-center items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid size-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold text-foreground",
							children: ["No logs for ", formattedSelectedDate]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto mt-1",
							children: filter !== "all" ? `No logs matching the "${filter}" filter on this day.` : isToday ? "You haven't logged any field activity today yet. Take a quick photo and capture your hours!" : "Pick a date highlighted with a dot on the calendar to review logs from that day."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "press rounded-2xl text-xs h-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/log",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-3.5 mr-1.5" }), "Add new log"]
								})
							}), uniqueLoggedDayKeys.length > 0 && !hasLogModifier(selectedDate) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: handleJumpToLatest,
								className: "press rounded-2xl text-xs h-9",
								children: "Jump to latest log"
							}) : null]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 grid-cols-1 sm:grid-cols-2 items-stretch flex-1",
					children: dayEntries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
						entry,
						photoUrl: entry.photo_path ? photos?.[entry.photo_path] : void 0
					}, entry.id))
				})]
			})]
		})]
	});
}
//#endregion
export { TimelinePage as component };
