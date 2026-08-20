import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { S as Button, a as BentoCard, s as DockoLogo } from "./router-Bxv_pBoA.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as LoaderCircle, m as ShieldAlert } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Dg9UVl2Y.mjs";
import { t as Label } from "./label-Bje0GZFn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-login--kzWdB-g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getSession().then(({ data }) => {
			if (active && data.session) navigate({ to: "/admin" });
		});
		return () => {
			active = false;
		};
	}, [navigate]);
	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		try {
			const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (authError) throw authError;
			if (authData.user) {
				const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id);
				if (rolesError) throw rolesError;
				if (!roles?.some((r) => r.role === "admin")) {
					await supabase.auth.signOut();
					throw new Error("Access denied: You do not have System Administrator privileges.");
				}
			}
			navigate({ to: "/admin" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Authentication failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-xl sm:text-2xl text-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-3 rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500",
				children: "System Admin"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 flex items-center justify-center p-4 sm:p-8 -mt-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
					className: "p-6 sm:p-8 shadow-[var(--shadow-lift)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 grid size-12 place-items-center rounded-full bg-red-500/10 text-red-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-xl font-bold tracking-tight",
								children: "Restricted Access"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-muted-foreground",
								children: "Please authenticate to access the Docko administration controls."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									className: "text-xs font-semibold",
									children: "Admin Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									autoComplete: "email",
									placeholder: "sysadmin@docko.app",
									className: "h-10 rounded-xl px-3 text-sm focus-visible:ring-red-500/50"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									className: "text-xs font-semibold",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									autoComplete: "current-password",
									placeholder: "••••••••",
									className: "h-10 rounded-xl px-3 text-sm focus-visible:ring-red-500/50"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: busy,
								className: "press mt-2 h-10 w-full rounded-xl text-sm font-bold shadow-sm",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : null, "Authenticate"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: [
						"This portal is strictly for authorized personnel. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						" Not an admin? ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/auth",
							className: "text-primary hover:underline underline-offset-4",
							children: "Go to the main app"
						}),
						"."
					]
				})]
			})
		})]
	});
}
//#endregion
export { AdminLoginPage as component };
