import { t as supabase } from "./client-D9Cas0bA.mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as initials, S as Button, _ as SectionTitle, a as BentoCard, i as AvatarImage, n as Avatar, o as BentoGrid, r as AvatarFallback, t as AppShell } from "./router-Bxv_pBoA.mjs";
import { f as ShieldX, nt as CircleCheck, p as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-CvH3e_q9.js
var import_jsx_runtime = require_jsx_runtime();
function InstitutionPeoplePage() {
	const queryClient = useQueryClient();
	const { data: people, isLoading } = useQuery({
		queryKey: ["institution", "people"],
		queryFn: async () => {
			const { data: me } = await supabase.auth.getUser();
			if (!me.user) return [];
			const { data: profile } = await supabase.from("profiles").select("institution_id").eq("id", me.user.id).single();
			if (!profile?.institution_id) return [];
			const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").eq("institution_id", profile.institution_id).order("created_at", { ascending: false });
			if (pErr) throw pErr;
			const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("user_id", (profiles ?? []).map((p) => p.id));
			return (profiles ?? []).map((p) => ({
				...p,
				roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role)
			}));
		}
	});
	const verifyUser = useMutation({
		mutationFn: async (userId) => {
			const { error } = await supabase.rpc("verify_institution_member", { _target_user_id: userId });
			if (error) throw error;
		},
		onMutate: async (userId) => {
			await queryClient.cancelQueries({ queryKey: ["institution", "people"] });
			const previousPeople = queryClient.getQueryData(["institution", "people"]);
			queryClient.setQueryData(["institution", "people"], (old) => {
				if (!old) return old;
				return old.map((p) => p.id === userId ? {
					...p,
					institution_verified: true
				} : p);
			});
			return { previousPeople };
		},
		onSuccess: () => {
			toast.success("User verified successfully");
		},
		onError: (err, _userId, context) => {
			if (context?.previousPeople) queryClient.setQueryData(["institution", "people"], context.previousPeople);
			toast.error(err.message || "Failed to verify user");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["institution", "people"] });
		}
	});
	const unverifyUser = useMutation({
		mutationFn: async (userId) => {
			const { error } = await supabase.rpc("unverify_institution_member", { _target_user_id: userId });
			if (error) throw error;
		},
		onMutate: async (userId) => {
			await queryClient.cancelQueries({ queryKey: ["institution", "people"] });
			const previousPeople = queryClient.getQueryData(["institution", "people"]);
			queryClient.setQueryData(["institution", "people"], (old) => {
				if (!old) return old;
				return old.map((p) => p.id === userId ? {
					...p,
					institution_verified: false
				} : p);
			});
			return { previousPeople };
		},
		onSuccess: () => toast.success("Member verification removed"),
		onError: (err, _userId, context) => {
			if (context?.previousPeople) queryClient.setQueryData(["institution", "people"], context.previousPeople);
			toast.error(err.message || "Failed to unverify member");
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["institution", "people"] })
	});
	const pendingPeople = people?.filter((p) => !p.institution_verified) || [];
	const verifiedPeople = people?.filter((p) => p.institution_verified) || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "People",
		subtitle: "Manage students and mentors",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
			className: "lg:col-span-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				title: "Pending Verification",
				hint: "Approve users claiming to be from your institution"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-4 px-2",
					children: "Loading..."
				}) : pendingPeople.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-4 px-2",
					children: "No pending verifications."
				}) : pendingPeople.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-10 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: person.avatar_url || "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-primary-soft text-primary font-bold",
								children: initials(person.full_name)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold flex items-center gap-2",
							children: [person.full_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded",
								children: person.roles?.[0] || "Pending"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: person.department || person.position ? [person.position, person.department].filter(Boolean).join(" · ") : "Pending Approval"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "press rounded-xl shrink-0",
						disabled: verifyUser.isPending,
						onClick: () => verifyUser.mutate(person.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 mr-2" }), "Verify"]
					})]
				}, person.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
			className: "lg:col-span-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				title: "Verified Members",
				hint: "Officially recognized students and mentors"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-4 px-2",
					children: "Loading..."
				}) : verifiedPeople.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground py-4 px-2",
					children: "No verified members yet."
				}) : verifiedPeople.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "size-10 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: person.avatar_url || "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-primary-soft text-primary font-bold",
								children: initials(person.full_name)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold flex items-center gap-2",
							children: [person.full_name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded",
								children: person.roles?.[0] || "Member"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-green-600 font-semibold mt-1 flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), person.position || "Verified Member"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "press rounded-xl shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30",
						disabled: unverifyUser.isPending,
						onClick: () => unverifyUser.mutate(person.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldX, { className: "size-4 mr-1" }), "Remove"]
					})]
				}, person.id))
			})]
		})] })
	});
}
//#endregion
export { InstitutionPeoplePage as component };
