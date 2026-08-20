import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { H as systemSettingsQuery, P as meQuery, S as Button, a as BentoCard } from "./router-Bxv_pBoA.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Clock, M as LoaderCircle, j as LogOut, nt as CircleCheck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/waiting-qDcA3Bio.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WaitingPage() {
	const navigate = useNavigate();
	const { data: me, isLoading: loadingMe } = useQuery(meQuery);
	const { data: settings, isLoading: loadingSettings } = useQuery(systemSettingsQuery);
	const { data: institution } = useQuery({
		queryKey: ["institution", me?.institutionId],
		enabled: !!me?.institutionId,
		queryFn: async () => {
			const { data, error } = await supabase.from("institutions").select("name").eq("id", me.institutionId).maybeSingle();
			if (error) return null;
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		const hasActiveRole = me && me.roles.some((r) => r !== "pending");
		if (me && hasActiveRole) navigate({ to: "/app" });
	}, [me, navigate]);
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/" });
	}
	if (loadingMe || loadingSettings || me && me.roles.some((r) => r !== "pending")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-6 text-muted-foreground" })
	});
	const institutionName = institution?.name ?? me?.institution ?? "your institution";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-6 left-6 sm:top-8 sm:left-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl font-bold tracking-tight text-foreground",
				children: "docko."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-md space-y-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "p-6 sm:p-10 text-center shadow-[var(--shadow-elevation-medium)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-secondary text-primary shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight",
						children: "Waiting for approval"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: [
							"Your institution request for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: institutionName }),
							" is currently pending approval from our system administrators."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-2xl bg-secondary/50 p-4 text-left border border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " What happens next?"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[13px] text-foreground/80",
							children: "We are reviewing your request to ensure authenticity. Once approved, you will gain full access to the institution dashboard."
						})]
					}),
					settings?.show_admin_email_on_waiting && settings?.admin_contact_email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-xs text-muted-foreground border-t border-border/50 pt-5",
						children: [
							"If you have any questions or need to expedite the process, please contact us at",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${settings.admin_contact_email}`,
								className: "font-semibold text-primary hover:underline underline-offset-4",
								children: settings.admin_contact_email
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "press mt-8 w-full rounded-2xl text-xs font-semibold",
						onClick: signOut,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Sign out"]
					})
				]
			})
		})]
	});
}
//#endregion
export { WaitingPage as component };
