import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { N as institutionsQuery, P as meQuery, S as Button, _ as SectionTitle, a as BentoCard, o as BentoGrid, t as AppShell } from "./router-D-Yy82-a.mjs";
import { Ct as BadgeCheck, P as LoaderCircle, m as ShieldAlert, ot as CircleCheck, st as CircleAlert, xt as Building2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as Label } from "./label-4t7PierD.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DQxZPlgx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DfhGtGbc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MentorProfilePage() {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: institutions, isLoading: loadingInstitutions } = useQuery(institutionsQuery);
	const [name, setName] = (0, import_react.useState)("");
	const [institutionId, setInstitutionId] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [position, setPosition] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (me) {
			setName(me.fullName);
			setInstitutionId(me.institutionId ?? "");
			setDepartment(me.department ?? "");
			setPosition(me.position ?? "");
			setPhone(me.phone ?? "");
		}
	}, [me]);
	const isVerified = me?.institutionVerified ?? false;
	const hasPendingInstitution = !!me?.institutionId && !isVerified;
	const updateName = useMutation({
		mutationFn: async () => {
			if (!me) throw new Error("Not loaded");
			if (me.hasChangedName) throw new Error("Name already changed once.");
			const { error } = await supabase.from("profiles").update({
				full_name: name.trim(),
				has_changed_name: true
			}).eq("id", me.id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Name updated successfully!");
		},
		onError: (error) => toast.error(error.message)
	});
	const requestVerification = useMutation({
		mutationFn: async () => {
			if (!me) throw new Error("Not loaded");
			if (!institutionId) throw new Error("Please select your institution first.");
			if (!department.trim() || !position.trim() || !phone.trim()) throw new Error("Please fill out all affiliation details.");
			const { error } = await supabase.from("profiles").update({
				institution_id: institutionId,
				institution: institutions?.find((i) => i.id === institutionId)?.name ?? null,
				department: department.trim() || null,
				position: position.trim() || null,
				phone: phone.trim() || null,
				institution_verified: false
			}).eq("id", me.id);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
			toast.success("Verification request sent to your institution.");
		},
		onError: (err) => toast.error(err.message)
	});
	if (!me) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Mentor Profile",
		subtitle: "Manage your credentials and affiliations",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-5xl mx-auto pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-6 space-y-4 self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Personal Information",
					hint: "Basic account details."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
					className: "p-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: me.email ?? "",
							disabled: true,
							className: "bg-muted/50 rounded-2xl"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									disabled: me.hasChangedName || updateName.isPending,
									className: "rounded-2xl flex-1",
									placeholder: "Enter your full name"
								}), !me.hasChangedName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => name.trim() !== me.fullName && updateName.mutate(),
									disabled: name.trim() === me.fullName || !name.trim() || updateName.isPending,
									className: "press rounded-2xl",
									children: updateName.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Save"
								})]
							}),
							me.hasChangedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground flex items-center gap-1.5 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5 text-warning" }), "You have already changed your name once. Please contact support to change it again."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground flex items-center gap-1.5 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success" }), "You may update your name exactly once."]
							})
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-6 space-y-4 self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Institutional Affiliation",
					hint: "Details required for mentor verification."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
					className: "p-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Primary Institution ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: institutionId,
									onValueChange: setInstitutionId,
									disabled: isVerified || requestVerification.isPending,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full h-11 rounded-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: loadingInstitutions ? "Loading institutions..." : "Select your institution..." })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "rounded-2xl",
										children: [(institutions ?? []).map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: inst.id,
											className: "rounded-xl",
											children: inst.name
										}, inst.id)), !loadingInstitutions && (institutions ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-3 py-2 text-sm text-muted-foreground",
											children: "No institutions available"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Department or Lab ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: department,
									onChange: (e) => setDepartment(e.target.value),
									disabled: isVerified || requestVerification.isPending,
									className: "rounded-2xl",
									placeholder: "e.g. Robotics Laboratory"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Position / Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: position,
									onChange: (e) => setPosition(e.target.value),
									disabled: isVerified || requestVerification.isPending,
									className: "rounded-2xl",
									placeholder: "e.g. Senior Research Scientist"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Contact Phone Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: "*"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									disabled: isVerified || requestVerification.isPending,
									className: "rounded-2xl",
									placeholder: "e.g. +1 555-0123",
									type: "tel"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-border",
						children: [
							!me.institutionId && !isVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-warning shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold",
											children: "Verification Required"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: "Select your institution and fill in your affiliation details to request verification. Your institution admin will confirm your membership."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: () => requestVerification.mutate(),
												disabled: requestVerification.isPending,
												className: "mt-3 press rounded-xl h-8 text-xs",
												children: [requestVerification.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : null, "Request Verification"]
											})
										})
									]
								})]
							}),
							hasPendingInstitution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-warning-soft border border-warning/20 flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-5 text-warning shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-warning-foreground",
										children: "Pending Institution Approval"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-warning-foreground/80",
										children: "Your verification request has been sent. Your institution admin will review and confirm your membership."
									})]
								})]
							}),
							isVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-2xl bg-success-soft border border-success/20 flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-5 text-success shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-success",
										children: "Verified Mentor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-success/80",
										children: [
											"Authorized by ",
											me.institution ?? "your institution",
											". You can now sign off on fieldwork hours."
										]
									})]
								})]
							})
						]
					})]
				})]
			})] })
		})
	});
}
//#endregion
export { MentorProfilePage as component };
