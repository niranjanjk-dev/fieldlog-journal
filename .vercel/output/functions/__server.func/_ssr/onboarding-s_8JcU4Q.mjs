import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { P as meQuery, S as Button, c as DockoMark } from "./router-D-Yy82-a.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as Label } from "./label-4t7PierD.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DQxZPlgx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-s_8JcU4Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: me, isLoading } = useQuery(meQuery);
	const [role, setRole] = (0, import_react.useState)("student");
	const [institutionId, setInstitutionId] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [institutions, setInstitutions] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		supabase.from("institutions").select("id, name").eq("status", "approved").then(({ data }) => {
			if (data) setInstitutions(data);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (me && !fullName) setFullName(me.fullName || "");
		const hasActiveRole = me && me.roles.some((r) => r !== "pending");
		if (me && hasActiveRole) navigate({ to: "/app" });
	}, [
		me,
		fullName,
		navigate
	]);
	const completeOnboarding = useMutation({
		mutationFn: async () => {
			if (!fullName.trim()) throw new Error("Full name is required");
			if (!institutionId) throw new Error("Please select an institution");
			const { error } = await supabase.rpc("complete_onboarding", {
				_role: role,
				_institution_id: institutionId,
				_full_name: fullName.trim()
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Welcome aboard!");
			navigate({ to: "/app" });
		},
		onError: (err) => toast.error(err.message)
	});
	if (isLoading || me && me.roles.some((r) => r !== "pending")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-6 text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4 sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md space-y-8 bg-card p-6 sm:p-10 rounded-[32px] shadow-[var(--shadow-elevation-medium)] border border-border/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoMark, { className: "text-4xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-6 text-2xl font-bold tracking-tight",
						children: "Complete your profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Just a few more details to get you started."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-6",
				onSubmit: (e) => {
					e.preventDefault();
					completeOnboarding.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "I am a..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: role,
							onValueChange: (val) => setRole(val),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "rounded-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select your role" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "student",
									className: "rounded-xl",
									children: "Student"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "mentor",
									className: "rounded-xl",
									children: "Mentor"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Institution" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: institutionId,
							onValueChange: setInstitutionId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "rounded-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select your institution" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
								className: "rounded-2xl",
								children: institutions.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: inst.id,
									className: "rounded-xl",
									children: inst.name
								}, inst.id))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: fullName,
							onChange: (e) => setFullName(e.target.value),
							className: "rounded-2xl",
							placeholder: "Your full name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: completeOnboarding.isPending,
						className: "w-full press rounded-2xl",
						children: [completeOnboarding.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Continue"]
					})
				]
			})]
		})
	});
}
//#endregion
export { OnboardingPage as component };
