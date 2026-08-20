import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as Button, V as sumHours, p as Route$17, s as DockoLogo, z as publicProfileQuery } from "./router-Bxv_pBoA.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._handle-kuRFVJQl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicPortfolioPage() {
	const { handle } = Route$17.useParams();
	const cleanHandle = handle.replace(/^@/, "");
	const { data } = useQuery(publicProfileQuery(cleanHandle));
	const profile = data?.profile;
	const verified = data?.entries ?? [];
	profile?.full_name ?? (cleanHandle && cleanHandle.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
	profile?.institution;
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
	showAllCategories || categoryBreakdown.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "press rounded-2xl text-xs font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Sign In"
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md w-full space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid size-20 place-items-center rounded-3xl bg-primary/10 text-primary shadow-inner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-10" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground",
								children: "Coming Soon"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-muted-foreground leading-relaxed",
								children: "Public verifiable portfolios are currently under construction. Soon, you will be able to share your tamper-proof fieldwork profile with prospective employers and accrediting boards right here."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "press h-11 px-8 rounded-2xl font-bold shadow-[var(--shadow-lift)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "Return Home"
								})
							})
						})
					]
				})
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
