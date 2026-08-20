import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { s as DockoLogo } from "./router-Bxv_pBoA.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as Menu, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DHqu_ypt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Soft upward reveal on scroll, powered by GSAP + ScrollTrigger. */
function Reveal({ children, className = "", delay = 0, y = 20, stagger = false, as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		let ctx;
		let cancelled = false;
		(async () => {
			try {
				const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("../_libs/gsap.mjs").then((n) => n.t), import("../_libs/gsap.mjs").then((n) => n.n)]);
				if (cancelled) return;
				gsap.registerPlugin(ScrollTrigger);
				if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					gsap.set(el, {
						opacity: 1,
						autoAlpha: 1
					});
					return;
				}
				ctx = gsap.context(() => {
					const targets = stagger ? Array.from(el.children) : [el];
					if (stagger) gsap.set(el, { autoAlpha: 1 });
					gsap.fromTo(targets, {
						autoAlpha: 0,
						y
					}, {
						autoAlpha: 1,
						y: 0,
						duration: .65,
						delay,
						ease: "power2.out",
						stagger: stagger ? .08 : 0,
						scrollTrigger: {
							trigger: el,
							start: "top 92%",
							once: true
						}
					});
				}, el);
			} catch {
				if (el) el.style.opacity = "1";
			}
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	}, [
		delay,
		y,
		stagger
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className,
		style: { opacity: 0 },
		children
	});
}
/** Scroll-triggered number count-up. */
function CountUp({ to, suffix = "", decimals = 0 }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		let ctx;
		let cancelled = false;
		(async () => {
			try {
				const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("../_libs/gsap.mjs").then((n) => n.t), import("../_libs/gsap.mjs").then((n) => n.n)]);
				if (cancelled) return;
				gsap.registerPlugin(ScrollTrigger);
				const obj = { v: 0 };
				ctx = gsap.context(() => {
					gsap.to(obj, {
						v: to,
						duration: 1.4,
						ease: "power2.out",
						scrollTrigger: {
							trigger: el,
							start: "top 90%",
							once: true
						},
						onUpdate: () => {
							el.textContent = obj.v.toFixed(decimals) + suffix;
						}
					});
				}, el);
			} catch {
				if (el) el.textContent = to.toFixed(decimals) + suffix;
			}
		})();
		return () => {
			cancelled = true;
			ctx?.revert();
		};
	}, [
		to,
		suffix,
		decimals
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		children: ["0", suffix]
	});
}
/** Skeuomorphic phone shell scaled smoothly with screen size. */
function PhoneFrame({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative w-[280px] shrink-0 rounded-[2.8rem] border border-border bg-card p-2.5 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:w-[330px] md:w-[360px] lg:w-[380px] ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-4 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-[2.3rem] bg-secondary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-6 pb-1 pt-3.5 text-xs font-semibold text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "9:41" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tracking-widest",
					children: "••••"
				})]
			}), children]
		})]
	});
}
function EntryCard({ title, place, time, tone = "primary", verified = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-3.5 shadow-[var(--shadow-soft)] sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mb-3 h-24 rounded-xl ${tone === "primary" ? "bg-primary-soft" : tone === "accent" ? "bg-accent-soft" : "bg-sky/25"} relative overflow-hidden sm:h-28`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-3 bottom-2 flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80 sm:text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinIcon, { className: "h-3.5 w-3.5" }), place]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold sm:text-[15px]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: time
				})]
			}), verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-bold text-primary sm:text-xs",
				children: "Verified"
			})]
		})]
	});
}
function PinIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z",
			stroke: "currentColor",
			strokeWidth: "1.7",
			strokeLinejoin: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "10",
			r: "2.4",
			stroke: "currentColor",
			strokeWidth: "1.7"
		})]
	});
}
function CheckIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "m5 12.5 4.5 4.5L19 7",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})
	});
}
/** Tiny inline icon set — keeps the bundle lean. */
function Glyph({ name, className = "h-5 w-5" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		"aria-hidden": "true",
		children: {
			camera: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 8.5h3l1.4-2.2h7.2L17 8.5h3v10H4v-10Z",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinejoin: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "13.2",
				r: "3.2",
				stroke: "currentColor",
				strokeWidth: "1.7"
			})] }),
			gps: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "6",
					stroke: "currentColor",
					strokeWidth: "1.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "1.8",
					fill: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				})
			] }),
			timeline: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M6 4v16",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "6",
					cy: "8",
					r: "2",
					stroke: "currentColor",
					strokeWidth: "1.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "6",
					cy: "16",
					r: "2",
					stroke: "currentColor",
					strokeWidth: "1.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M11 8h8M11 16h6",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				})
			] }),
			team: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "9",
					r: "3",
					stroke: "currentColor",
					strokeWidth: "1.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M16 7.2a3 3 0 0 1 0 5.6M17 19c0-2-.6-3.6-1.6-4.7",
					stroke: "currentColor",
					strokeWidth: "1.7",
					strokeLinecap: "round"
				})
			] }),
			pdf: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M7 3h7l4 4v14H7V3Z",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinejoin: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 3v4h4M10 13h5M10 16.5h3.5",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round"
			})] }),
			offline: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6.5 18a3.5 3.5 0 0 1 .4-7A5.5 5.5 0 0 1 17.6 10a3.9 3.9 0 0 1 .3 7.9H6.5Z",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinejoin: "round"
			}) }),
			chart: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 20h16",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M7.5 20v-6M12 20V6M16.5 20v-9",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round"
			})] }),
			shield: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 3.5 19 6v6c0 4.2-3 7.3-7 8.5-4-1.2-7-4.3-7-8.5V6l7-2.5Z",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinejoin: "round"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "m9 12 2.2 2.2L15.5 10",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})] })
		}[name]
	});
}
function Nav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const links = [
		["Overview", "#overview"],
		["How it works", "#how"],
		["Features", "#features"],
		["FAQ", "#faq"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 px-4 pt-3 sm:pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "mx-auto flex max-w-6xl xl:max-w-7xl items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-4 py-2.5 shadow-[0_4px_20px_oklch(0_0_0/0.05),var(--shadow-inset)] backdrop-blur-xl sm:px-6 sm:py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex shrink-0 items-center px-1",
					onClick: () => setOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-2xl sm:text-[1.75rem]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 md:flex sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mr-2 flex items-center gap-1.5",
							children: links.map(([label, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href,
								className: "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-base",
								children: label
							}) }, href))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-base",
							children: "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							className: "press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] sm:text-base",
							children: "Get started"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setOpen((prev) => !prev),
						"aria-label": "Toggle menu",
						"aria-expanded": open,
						className: "press grid h-9 w-9 place-items-center rounded-full border border-border bg-secondary/80 text-foreground transition-colors hover:bg-secondary",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
					})
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-2 max-w-md animate-in fade-in zoom-in-95 duration-200 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: links.map(([label, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						onClick: () => setOpen(false),
						className: "flex w-full items-center rounded-2xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary",
						children: label
					}) }, href))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						onClick: () => setOpen(false),
						className: "flex items-center justify-center rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "signup" },
						onClick: () => setOpen(false),
						className: "press flex items-center justify-center rounded-2xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-sm",
						children: "Start free"
					})]
				})]
			})
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "top",
		className: "relative overflow-hidden px-4 pb-12 pt-8 sm:pb-20 sm:pt-14 lg:pt-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "mx-auto max-w-3xl text-center",
				stagger: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl font-extrabold tracking-tight leading-[1.12] sm:text-5xl md:text-[3.25rem] lg:text-6xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "Track your academic journey."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "Get verified every day."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl",
						children: "Log daily milestones with photo proof. Mentors verify your achievements in seconds."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-stretch justify-center gap-3.5 sm:flex-row sm:gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							search: { mode: "signup" },
							className: "press rounded-2xl bg-primary px-8 py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lift)]",
							children: "Start tracking free"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#showcase",
							className: "press rounded-2xl border border-border bg-card px-8 py-4 text-base sm:text-lg font-semibold shadow-[var(--shadow-soft),var(--shadow-inset)]",
							children: "See how it works"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs sm:text-sm text-muted-foreground",
						children: "Free for students & researchers · Sign up in 30 seconds"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "relative mt-12 flex justify-center sm:mt-16 lg:mt-20",
				y: 40,
				delay: .15,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5 px-3.5 pb-6 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-base font-bold sm:text-[17px]",
										children: "Academic Journal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Alex Rivera · Year 3"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-foreground",
										children: "Active streak"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
									title: "Robotics lab sensor calibration",
									place: "Engineering Lab 4",
									time: "Today · 10:15 AM"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
									title: "Capstone dataset validation",
									place: "Innovation Hub",
									time: "Yesterday · 4:40 PM",
									tone: "accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									className: "block rounded-2xl border border-dashed border-border bg-secondary/60 p-3.5 text-center text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors",
									children: "+ Log today's achievement"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-float-a absolute -left-6 top-16 hidden w-52 sm:w-60 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:block md:-left-48 lg:-left-56",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
									name: "gps",
									className: "h-5 w-5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm font-bold",
									children: "Verified evidence"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-muted-foreground",
								children: "Photo evidence & campus coordinates attached"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "animate-float-b absolute -right-6 bottom-20 hidden w-56 sm:w-64 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-lift),var(--shadow-inset)] sm:block md:-right-48 lg:-right-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs sm:text-sm font-bold",
										children: "Daily mentor sign-off"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Advisors verify your achievements"
									})]
								})]
							})
						})
					]
				})
			})]
		})
	});
}
function SectionHead({ eyebrow, title, sub, align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight",
				children: title
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3.5 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground",
				children: sub
			})
		]
	});
}
function Overview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "overview",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Academic Journey",
				title: "One app for your complete academic record",
				sub: "Log daily project progress, lab sessions, and research milestones. Get every achievement verified by your mentor."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "mt-10 sm:mt-14 grid gap-4 sm:grid-cols-6",
				stagger: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift p-7 sm:p-9 sm:col-span-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl sm:text-2xl font-bold",
								children: "Every achievement carries verifiable proof"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2.5 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground",
								children: "Work photo, campus or lab coordinates, exact timestamp and technical notes — saved together when you log, so your mentors and professors can verify your progress with complete confidence."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-4",
								children: [
									["camera", "Photo Evidence"],
									["gps", "Campus / Lab"],
									["timeline", "Exact Timestamp"],
									["shield", "Mentor Sign-Off"]
								].map(([icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-[var(--shadow-soft)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-auto grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
											name: icon,
											className: "h-6 w-6"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs sm:text-sm font-semibold",
										children: label
									})]
								}, label))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento-dark lift p-7 sm:p-9 sm:col-span-2 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-5xl sm:text-6xl font-extrabold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
								to: 9,
								suffix: "s"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base sm:text-lg opacity-85",
							children: "Average time to document today's achievement."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 space-y-2.5",
							children: [
								"Capture work photo",
								"Add milestone notes",
								"Submit for verification"
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 rounded-xl bg-white/12 px-3.5 py-2.5 text-sm sm:text-base font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs",
									children: i + 1
								}), s]
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift p-7 sm:p-8 sm:col-span-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg sm:text-xl font-bold",
								children: "Faculty verify where & what you worked on"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm sm:text-base text-muted-foreground",
								children: "Mentors review attached photos, location tags, and project notes before approving your daily entries."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 space-y-2.5",
								children: [
									"Robotics lab sensor calibration",
									"Capstone architecture & dataset review",
									"Design studio prototype validation"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-sm sm:text-base font-medium",
										children: t
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-4 w-4" })
									})]
								}, t))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift p-7 sm:p-8 sm:col-span-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg sm:text-xl font-bold",
								children: "Audit-ready portfolio export"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm sm:text-base text-muted-foreground",
								children: "Export comprehensive academic portfolios with all verified achievements, photos, and approved hours."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 rounded-2xl border border-border bg-secondary/70 p-5 shadow-[inset_0_1px_0_oklch(1_0_0/0.8)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-28 rounded-full bg-foreground/15" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2.5 h-2.5 w-44 rounded-full bg-foreground/10" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 grid grid-cols-3 gap-2.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 rounded-xl bg-primary-soft" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 rounded-xl bg-accent-soft" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 rounded-xl bg-sky/25" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
											name: "pdf",
											className: "h-5 w-5"
										}), " academic-achievement-portfolio.pdf"]
									})
								]
							})
						]
					})
				]
			})]
		})
	});
}
function Problem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "The problem",
				title: "Why traditional academic logging falls short",
				sub: "Tracking projects, research, and coursework on paper or scattered docs makes it hard to prove what you accomplished."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2",
				stagger: true,
				children: [
					["Unrecorded milestones", "Months of intensive project and lab work fade away without daily documentation."],
					["End-of-term scramble", "Chasing faculty and mentors for retrospective signatures during finals week."],
					["Unverified claims", "Portfolios and resumes with ambitious claims but zero proof or supervisor verification."],
					["Scattered notes", "Spending days transcribing disorganized notebooks into final submission reports."]
				].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift flex gap-4 p-6 sm:p-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-clay/20 text-xl font-bold text-clay",
						children: "✕"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base sm:text-lg font-bold",
							children: t
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground",
							children: d
						})]
					})]
				}, t))
			})]
		})
	});
}
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "How it works",
				title: "Four seamless steps"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "relative mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				stagger: true,
				children: [
					[
						"Capture",
						"camera",
						"Snap a photo of your work, code, circuit, or notes with hours spent."
					],
					[
						"Locate",
						"gps",
						"Campus coordinates and timestamps record exactly where and when you worked."
					],
					[
						"Verify",
						"shield",
						"Your mentor or advisor reviews the submission and approves it in one tap."
					],
					[
						"Export",
						"pdf",
						"Download your organized, verified achievement portfolio whenever needed."
					]
				].map(([t, icon, d], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift p-6 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-13 w-13 p-2.5 place-items-center rounded-2xl bg-[image:var(--gradient-field)] text-primary-foreground shadow-[var(--shadow-soft)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
									name: icon,
									className: "h-6 w-6"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-4xl sm:text-5xl font-extrabold text-foreground/10",
								children: ["0", i + 1]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 font-display text-lg sm:text-xl font-bold",
							children: t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground",
							children: d
						})
					]
				}, t))
			})]
		})
	});
}
function Showcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "showcase",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Product showcase",
				title: "Clean workflow for students and mentors",
				sub: "Students log daily achievements. Mentors verify submissions in real time."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "mt-10 sm:mt-14 grid gap-5 lg:grid-cols-2",
				stagger: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift flex flex-col items-center overflow-hidden p-7 sm:p-9 pb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl sm:text-2xl font-bold",
							children: "Student view"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm sm:text-base text-muted-foreground",
							children: "Log entries with photo evidence and location."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, {
						className: "mt-8 translate-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5 px-3.5 pb-8 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-sm font-bold",
										children: "Alex Rivera"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Robotics & AI · Year 3"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground",
										children: "Active streak"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
									title: "Embedded systems firmware test",
									place: "Robotics Lab 2",
									time: "9:12 AM"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EntryCard, {
									title: "Research dataset cleanup & EDA",
									place: "Data Science Studio",
									time: "11:30 AM",
									tone: "sky",
									verified: false
								})
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift flex flex-col gap-5 p-7 sm:p-9",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl sm:text-2xl font-bold",
							children: "Mentor view"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm sm:text-base text-muted-foreground",
							children: "Review assigned students and approve daily achievements in seconds."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-primary-foreground",
									children: "Pending (3)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-muted-foreground",
									children: "Approved (14)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-3.5 py-1 text-xs font-semibold text-muted-foreground",
									children: "All Logs"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm sm:text-base font-bold",
									children: "Verification queue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent-foreground",
									children: "Today"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-3",
								children: [
									[
										"Aarav Patel",
										"Robotics lab sensor calibration",
										"Engineering Lab 4",
										"primary"
									],
									[
										"Elena Rostova",
										"Capstone dataset validation",
										"Innovation Hub",
										"accent"
									],
									[
										"Marcus Chen",
										"Structural CAD simulation test",
										"Design Studio",
										"sky"
									]
								].map(([n, task, loc, tone]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3.5 rounded-2xl border border-border bg-secondary/50 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-11 w-11 shrink-0 rounded-xl ${tone === "primary" ? "bg-primary-soft" : tone === "accent" ? "bg-accent-soft" : "bg-sky/25"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate text-sm sm:text-base font-semibold",
												children: n
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "block truncate text-xs sm:text-sm text-muted-foreground",
												children: [
													task,
													" · ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-foreground/70 font-medium",
														children: loc
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Approve log",
											className: "press grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-4.5 w-4.5" })
										})
									]
								}, n))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-xs sm:text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-medium",
								children: "3 pending logs ready for approval"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-primary hover:underline cursor-pointer",
								children: "Verify all"
							})]
						})
					]
				})]
			})]
		})
	});
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "features",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Core features",
				title: "Built for every academic journey",
				sub: "Everything students, researchers, and mentors need to maintain reliable achievement records."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 sm:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				stagger: true,
				children: [
					[
						"gps",
						"Location & Campus Tagging",
						"Coordinates and room/lab tags recorded when you log."
					],
					[
						"camera",
						"Photo Evidence",
						"Attach photos of your physical or digital work as you build."
					],
					[
						"timeline",
						"Journey Timeline",
						"A chronological feed of your daily learning and achievements."
					],
					[
						"team",
						"Cohorts & Teams",
						"Group students by course, lab group, supervisor, or project."
					],
					[
						"pdf",
						"Portfolio Export",
						"Export verified logs and achievements into clean PDF reports."
					],
					[
						"offline",
						"Offline Drafts",
						"Save entries locally if signal drops, sync when connected."
					],
					[
						"chart",
						"Hours & Streaks",
						"Track active learning streaks and cumulative project hours."
					],
					[
						"shield",
						"Mentor Verification",
						"Mentors verify daily achievements with complete confidence."
					]
				].map(([icon, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift p-6 sm:p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary shadow-[var(--shadow-soft),var(--shadow-inset)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
								name: icon,
								className: "h-6 w-6"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-display text-base sm:text-lg font-bold",
							children: t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: d
						})
					]
				}, t))
			})]
		})
	});
}
function Experiences() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "bento grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						align: "left",
						eyebrow: "For students",
						title: "Log the progress, own the achievement",
						sub: "docko. documents every step of your academic journey. From laboratory experiments and design studios to capstone projects — capture your milestones and get them verified daily."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-3.5",
						children: [
							"Evidence photos attached directly from your phone or camera",
							"Automatic workspace recognition at approved campus labs & sites",
							"Export an audit-ready portfolio of verified achievements anytime"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm sm:text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 text-muted-foreground",
								children: t
							})]
						}, t))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 pb-7 pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-base font-bold sm:text-[17px]",
									children: "Academic streak"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-7 gap-2",
									children: Array.from({ length: 28 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `aspect-square rounded-[7px] ${i % 7 === 6 ? "bg-secondary" : i % 5 === 3 ? "bg-primary/45" : "bg-primary/80"}` }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 rounded-2xl bg-accent-soft p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-accent-foreground",
										children: "Learning hours"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-3xl font-extrabold text-accent-foreground",
										children: "Active"
									})]
								})
							]
						}) })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "bento-dark grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "order-2 lg:order-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl bg-white/10 p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base font-bold",
								children: "Team overview"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 space-y-4",
								children: [
									["On track", 74],
									["Needs review", 18],
									["Falling behind", 8]
								].map(([label, pct]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs sm:text-sm opacity-85",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 h-2.5 overflow-hidden rounded-full bg-white/15",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-white/85",
										style: { width: `${pct}%` }
									})
								})] }, label))
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "order-1 lg:order-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm font-bold uppercase tracking-[0.18em] opacity-75",
								children: "For mentors & faculty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight",
								children: "Verify student achievements in seconds"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3.5 text-base sm:text-lg leading-relaxed opacity-85",
								children: "No end-of-semester evaluation rush. Review submitted work photos, notes, and locations directly from your phone or desktop."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "grid gap-4 sm:grid-cols-3",
					stagger: true,
					children: [
						[
							"team",
							"Academic groups",
							"Group students by course, lab group, supervisor, or project."
						],
						[
							"timeline",
							"Daily activity feed",
							"See achievements in real time as students submit."
						],
						[
							"shield",
							"Role views",
							"Students, faculty mentors, and administrators each get dedicated views."
						]
					].map(([icon, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift p-6 sm:p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-sky/25 text-foreground/70",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
									name: icon,
									className: "h-6 w-6"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-base sm:text-lg font-bold",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: d
							})
						]
					}, t))
				})
			]
		})
	});
}
function TimelineShowcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Timeline",
				title: "An academic journey in sequence",
				sub: "Every approved milestone and lab log is organized chronologically on your timeline."
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "relative mt-12 space-y-4",
				stagger: true,
				children: [
					[
						"Phase 1",
						"Foundational research & project scoping",
						"primary"
					],
					[
						"Phase 2",
						"Prototyping & laboratory experiment trials",
						"accent"
					],
					[
						"Phase 3",
						"Data validation & mentor check-in",
						"sky"
					],
					[
						"Phase 4",
						"Final evaluation & verified portfolio",
						"primary"
					]
				].map(([w, t, tone]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "bento lift grid grid-cols-[auto_minmax(0,1fr)] gap-5 p-6 sm:p-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-4 w-4 rounded-full ring-4 ${tone === "primary" ? "bg-primary ring-primary-soft" : tone === "accent" ? "bg-accent ring-accent-soft" : "bg-sky ring-sky/25"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 w-px flex-1 bg-border" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
								children: w
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 font-display text-base sm:text-lg font-bold",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-16 w-24 rounded-xl bg-secondary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-16 w-24 rounded-xl bg-primary-soft" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "hidden h-16 w-24 rounded-xl bg-accent-soft sm:block" })
								]
							})
						]
					})]
				}, w))
			})]
		})
	});
}
function MapSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "bento grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					align: "left",
					eyebrow: "Location & Lab review",
					title: "See where learning happened",
					sub: "Each log attaches coordinates from when the entry was submitted. Mentors can recognize campus labs, classrooms, and verified project sites."
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-[var(--shadow-soft),var(--shadow-inset)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72 w-full sm:h-80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 300 220",
							className: "h-full w-full",
							"aria-hidden": "true",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "300",
									height: "220",
									fill: "oklch(0.95 0.02 150)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
									stroke: "oklch(0.46 0.098 158 / 0.16)",
									strokeWidth: "7",
									fill: "none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M-10 60h320M-10 150h320M70 -10v240M210 -10v240" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M70 150 L70 60 L210 60",
									stroke: "oklch(0.79 0.145 72)",
									strokeWidth: "4",
									fill: "none",
									strokeDasharray: "8 8",
									strokeLinecap: "round"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: "210",
									cy: "60",
									r: "26",
									fill: "oklch(0.46 0.098 158 / 0.12)"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-float-a absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-lift)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-xs sm:text-sm font-bold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinIcon, { className: "h-4 w-4" }), " Campus Lab & Workspace"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Coordinates attached · Verified"
						})]
					})]
				})]
			})
		})
	});
}
function FAQ() {
	const faqs = [
		["What kinds of academic journeys can I track?", "docko. works for any academic program — from engineering lab experiments, design studio projects, and software capstones to clinical rotations, field studies, thesis research, and independent coursework."],
		["How does daily mentor verification work?", "When a student logs an entry with photo evidence, notes, and location, the assigned mentor or advisor receives a notification. They can view the submission and verify the achievement in a single tap."],
		["How does offline logging work?", "If you're in a basement lab or field site with low or no signal, your entry is saved locally in browser drafts with the exact timestamp and GPS coordinates. As soon as you reconnect, tap submit to sync with your mentor."],
		["How do workspace tags work?", "When a mentor approves an entry at a lab, studio, or work site, that location is remembered as an approved workspace. Subsequent entries logged nearby automatically recognize that workspace."],
		["How do I export my verified portfolio?", "You can export your verified entries with their photos, timestamps, mentor approvals, and total hours into an organized, audit-ready PDF portfolio anytime."]
	];
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "FAQ",
				title: "Frequently asked questions"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 space-y-3.5",
				stagger: true,
				children: faqs.map(([q, a], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bento",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(open === i ? null : i),
						"aria-expanded": open === i,
						className: "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6 sm:p-7 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 font-display text-base sm:text-lg font-bold",
							children: q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-transform duration-300 ${open === i ? "rotate-45" : ""}`,
							children: "+"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid transition-all duration-300 ease-out",
						style: { gridTemplateRows: open === i ? "1fr" : "0fr" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-6 pb-6 text-sm sm:text-base leading-relaxed text-muted-foreground",
								children: a
							})
						})
					})]
				}, q))
			})]
		})
	});
}
function FinalCTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "cta",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "bento grain-glow p-10 text-center sm:p-16 lg:p-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight",
							children: "Elevate your academic journey."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-5 max-w-xl text-base sm:text-xl text-muted-foreground",
							children: "Start capturing your daily milestones and build an advisor-verified portfolio today."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								search: { mode: "signup" },
								className: "press rounded-2xl bg-primary px-8 py-4 text-base sm:text-lg font-semibold text-primary-foreground shadow-[var(--shadow-lift)]",
								children: "Start tracking free"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "press rounded-2xl border border-border bg-card px-8 py-4 text-base sm:text-lg font-semibold shadow-[var(--shadow-soft),var(--shadow-inset)]",
								children: "Sign in to account"
							})]
						})
					]
				})
			})
		})
	});
}
function AnalyticsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "analytics",
		className: "px-4 py-14 sm:py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
					eyebrow: "Analytics",
					title: "Progress you can actually measure",
					sub: "Hours, consistency and skill coverage across your academic journey."
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "mt-10 sm:mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]",
					stagger: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift flex flex-col justify-between p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/60 pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base sm:text-lg font-bold",
									children: "Weekly hours logged"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-muted-foreground",
									children: "Target: 35.0 hrs/week"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-display text-2xl sm:text-3xl font-extrabold text-primary",
											children: "38.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs sm:text-sm text-muted-foreground",
											children: " hrs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 inline-block rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary",
											children: "+10%"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-7 items-end gap-3 sm:gap-4 h-48 sm:h-56 px-2",
									children: [
										{
											day: "M",
											hours: 7.5,
											hPct: "78%",
											active: true
										},
										{
											day: "T",
											hours: 8,
											hPct: "84%",
											active: true
										},
										{
											day: "W",
											hours: 8.5,
											hPct: "90%",
											active: true
										},
										{
											day: "T",
											hours: 7,
											hPct: "72%",
											active: true
										},
										{
											day: "F",
											hours: 7.5,
											hPct: "78%",
											active: true
										},
										{
											day: "S",
											hours: 0,
											hPct: "6%",
											active: false
										},
										{
											day: "S",
											hours: 0,
											hPct: "6%",
											active: false
										}
									].map((bar, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-2.5 h-full justify-end group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-semibold text-muted-foreground transition-opacity",
												children: bar.hours > 0 ? `${bar.hours}h` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-full max-w-[44px] h-full rounded-2xl bg-secondary/80 flex items-end justify-center p-1 relative overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `w-full rounded-xl transition-all duration-700 ${bar.active ? "bg-[image:var(--gradient-field)] shadow-sm" : "bg-muted-foreground/20"}`,
													style: { height: bar.hPct }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs sm:text-sm font-bold text-muted-foreground",
												children: bar.day
											})
										]
									}, idx))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-2xl border border-border bg-secondary/50 px-4 py-3 text-xs sm:text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Logged 5 of 5 weekdays"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-primary",
									children: "Full week attendance"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "bento lift flex flex-col justify-between p-6 sm:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-4xl sm:text-5xl font-extrabold text-primary",
									children: "18"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm sm:text-base font-bold",
									children: "skills evidenced this term"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs sm:text-sm text-muted-foreground",
									children: "Linked directly to verified lab experiments, code builds, and design reviews."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex flex-wrap gap-1.5",
								children: [
									"Data Analysis",
									"Sensor Calibration",
									"Circuit QA",
									"Research Review"
								].map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground/80",
									children: tag
								}, tag))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "bento lift flex flex-col justify-between p-6 sm:p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-4xl sm:text-5xl font-extrabold text-accent",
									children: "94%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm sm:text-base font-bold",
									children: "entries verified same day"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs sm:text-sm text-muted-foreground",
									children: "Faculty and advisors verify quickly with attached evidence on any device."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center gap-2 text-xs font-bold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, { className: "h-4 w-4" }), " Zero end-of-term review backlog"]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-10 grid gap-5 sm:grid-cols-3",
					stagger: true,
					children: [
						{
							icon: "shield",
							title: "Guaranteed Academic Credit",
							desc: "Every log has photo evidence and faculty verification. No lost work, zero disputed hours, and 100% accepted credits."
						},
						{
							icon: "pdf",
							title: "Career-Ready Evidence Portfolio",
							desc: "Turn your semester's verified logs into an exportable PDF portfolio with real project photos to impress recruiters and admissions committees."
						},
						{
							icon: "timeline",
							title: "Zero End-of-Term Scramble",
							desc: "Advisors verify your achievements day-by-day in seconds. Never spend finals week hunting down professors for retrospective signatures."
						}
					].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bento lift p-6 sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary shadow-[var(--shadow-soft)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
									name: g.icon,
									className: "h-6 w-6"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-4 font-display text-base sm:text-lg font-bold",
								children: g.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground leading-relaxed",
								children: g.desc
							})
						]
					}, g.title))
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "px-4 pb-10 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl xl:max-w-7xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bento grid gap-8 p-8 sm:grid-cols-2 sm:p-12 lg:grid-cols-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-2xl" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3.5 max-w-[18rem] text-sm leading-relaxed text-muted-foreground",
					children: "Daily achievement tracking & mentor verification for every academic journey."
				})] }), [
					["Product", [
						["Overview", "#overview"],
						["Features", "#features"],
						["How it works", "#how"],
						["FAQ", "#faq"]
					]],
					["Account", [
						["Student Sign In", "/auth"],
						["Create Account", "/auth?mode=signup"],
						["Mentor Portal", "/mentor"],
						["Admin Portal", "/admin"]
					]],
					["Platform", [
						["Academic Log", "/app/log"],
						["Timeline", "/app/timeline"],
						["Map View", "/app/map"],
						["Portfolio Export", "/app/portfolio"]
					]]
				].map(([title, links]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3.5 space-y-2.5",
					children: links.map(([l, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: href.startsWith("/") && !href.includes("?") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: href,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: l
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href,
						className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
						children: l
					}) }, l))
				})] }, title))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-xs sm:text-sm text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" docko."
				]
			})]
		})
	});
}
function LandingPage() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/app" });
		});
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Showcase, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Experiences, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineShowcase, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCTA, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LandingPage as component };
