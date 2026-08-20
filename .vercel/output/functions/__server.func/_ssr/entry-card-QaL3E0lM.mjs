import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as initials, O as formatDay, S as Button, T as commentsQuery, a as BentoCard, b as StatusChip, k as formatTime, n as Avatar, r as AvatarFallback, w as cn } from "./router-D-Yy82-a.mjs";
import { E as MessageSquare, g as Send, k as MapPin, rt as Clock, s as UserCheck, wt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DeHExzg4.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as addComment } from "./entries-DBJ7D4Uk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entry-card-QaL3E0lM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_FIELD_PHOTOS = [
	"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
];
function getEntryPhoto(entry, photoUrl) {
	if (photoUrl) return photoUrl;
	let hash = 0;
	const str = entry.id || entry.title || "field-entry";
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return FALLBACK_FIELD_PHOTOS[Math.abs(hash) % FALLBACK_FIELD_PHOTOS.length];
}
function EntryCard({ entry, photoUrl, author, footer, className }) {
	const [isPeekOpen, setIsPeekOpen] = (0, import_react.useState)(false);
	const displayPhoto = getEntryPhoto(entry, photoUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
		as: "article",
		className: cn("group/card flex flex-col justify-between h-full min-h-[380px] sm:min-h-[400px] gap-3.5 relative overflow-hidden", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2 sm:gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							author ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1.5 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "size-6 sm:size-7 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-primary-soft text-[10px] sm:text-[11px] text-primary",
											children: initials(author.full_name)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs sm:text-sm font-medium",
										children: author.full_name
									}),
									author.course ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs text-muted-foreground",
										children: author.course
									}) : null
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "truncate font-semibold text-sm sm:text-base leading-snug",
								children: entry.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] sm:text-xs text-muted-foreground mt-0.5",
								children: [
									formatDay(entry.captured_at),
									" · ",
									formatTime(entry.captured_at)
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
							status: entry.status,
							className: "shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon",
							onClick: () => setIsPeekOpen(true),
							className: "press size-7 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors",
							title: "Open full center peek",
							"aria-label": "Open full center peek",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sunken overflow-hidden rounded-2xl cursor-pointer group/img relative h-40 sm:h-44 w-full bg-muted/20",
					onClick: () => setIsPeekOpen(true),
					role: "button",
					tabIndex: 0,
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setIsPeekOpen(true);
						}
					},
					"aria-label": "Expand image and entry details",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: displayPhoto,
						alt: `Photo for ${entry.title}`,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-black/0 group-hover/img:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-background/90 backdrop-blur-md px-2.5 py-1 text-[11px] sm:text-xs font-semibold shadow-md flex items-center gap-1 text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3 sm:size-3.5" }), "Peek"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 text-xs sm:text-sm text-muted-foreground overflow-hidden",
					children: entry.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 leading-relaxed",
						children: entry.note
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "italic text-muted-foreground/40 text-xs leading-relaxed",
						children: "No additional notes"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-auto space-y-2.5 pt-2 border-t border-border/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-medium text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-primary" }),
							" ",
							Number(entry.hours),
							" h"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground max-w-[60%]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: entry.address ?? (entry.latitude != null && entry.longitude != null ? `${entry.latitude.toFixed(3)}, ${entry.longitude.toFixed(3)}` : "No location")
						})]
					})]
				}),
				entry.assigned_mentors && entry.assigned_mentors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 truncate",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: ["Approvers: ", entry.assigned_mentors.join(", ")]
					})]
				}) : null,
				entry.review_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-xl bg-warning-soft px-2.5 py-1 text-[11px] text-warning-foreground truncate",
					children: ["Mentor: ", entry.review_note]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "press rounded-xl text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground",
						onClick: () => setIsPeekOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5" }), "Discussion"]
					}), footer]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isPeekOpen,
		onOpenChange: setIsPeekOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[94vw] max-w-lg sm:max-w-xl max-h-[86vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-2xl space-y-3 sm:space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "text-left space-y-1.5 pr-6 sm:pr-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [author ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "size-6 sm:size-7",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-primary-soft text-[10px] sm:text-xs text-primary font-semibold",
										children: initials(author.full_name)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs sm:text-sm font-semibold text-foreground block leading-tight truncate",
										children: author.full_name
									}), author.course ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground truncate block",
										children: author.course
									}) : null]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-primary bg-primary-soft px-2 py-0.5 rounded-full",
								children: "Field Journal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: entry.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base sm:text-xl font-bold text-foreground pt-0.5 leading-snug",
							children: entry.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-[11px] sm:text-xs text-muted-foreground",
							children: [
								formatDay(entry.captured_at),
								" at ",
								formatTime(entry.captured_at)
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sunken overflow-hidden rounded-xl sm:rounded-2xl max-h-[220px] sm:max-h-[340px] w-full bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: displayPhoto,
						alt: `Full photo for ${entry.title}`,
						className: "w-full h-full max-h-[220px] sm:max-h-[340px] object-cover"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 pt-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 sm:size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Number(entry.hours), " hours logged"] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground max-w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3 sm:size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: entry.address ?? (entry.latitude != null && entry.longitude != null ? `${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}` : "No location attached")
							})]
						}),
						entry.assigned_mentors && entry.assigned_mentors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 sm:size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Approvers: ", entry.assigned_mentors.join(", ")] })]
						}) : null
					]
				}),
				entry.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl sm:rounded-2xl bg-muted/30 p-3 sm:p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed border border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-xs text-muted-foreground block mb-1 uppercase tracking-wider",
						children: "Fieldwork Notes"
					}), entry.note]
				}) : null,
				entry.review_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl sm:rounded-2xl bg-warning-soft/70 border border-warning/30 p-3 sm:p-4 text-xs sm:text-sm text-warning-foreground leading-relaxed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-xs block mb-1 uppercase tracking-wider",
						children: "Mentor Sign-off Feedback"
					}), entry.review_note]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeekComments, { entryId: entry.id })
			]
		})
	})] });
}
function PeekComments({ entryId }) {
	const queryClient = useQueryClient();
	const { data: comments, isLoading } = useQuery(commentsQuery(entryId));
	const [body, setBody] = (0, import_react.useState)("");
	const add = useMutation({
		mutationFn: async (text) => {
			return addComment(entryId, text);
		},
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
			toast.success("Comment added");
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 pt-2 sm:pt-3 border-t border-border/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5 sm:size-4 text-primary" }),
						"Field Discussion (",
						comments?.length ?? 0,
						")"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 max-h-36 sm:max-h-44 overflow-y-auto pr-1",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground italic",
					children: "Loading comments…"
				}) : comments && comments.length > 0 ? comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sunken rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-xs bg-muted/20 border border-border/40 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: comment.author?.full_name ?? "Participant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(comment.created_at) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-foreground/90 leading-relaxed text-xs",
						children: comment.body
					})]
				}, comment.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground/70 italic py-1",
					children: "No notes or feedback yet. Leave a comment below."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (!body.trim()) return;
					add.mutate(body.trim());
				},
				className: "flex items-center gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Leave a note or question…",
					className: "text-xs rounded-xl h-8 sm:h-9"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !body.trim() || add.isPending,
					className: "press rounded-xl h-8 sm:h-9 px-3 gap-1 shrink-0 font-semibold text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Post" })]
				})]
			})
		]
	});
}
//#endregion
export { EntryCard as t };
