import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { P as meQuery, S as Button, a as BentoCard, f as Route, t as AppShell } from "./router-D-Yy82-a.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as LoaderCircle, Tt as ArrowRight, U as HardHat, i as Users, k as MapPin, p as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-CJMOEpKt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamJoinPage() {
	const { teamId } = Route.useSearch();
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const [joined, setJoined] = (0, import_react.useState)(false);
	const { data: team, isLoading: loadingTeam } = useQuery({
		queryKey: ["team_detail", teamId],
		enabled: !!teamId,
		queryFn: async () => {
			if (!teamId) return null;
			const { data, error } = await supabase.from("teams").select("*, mentor:profiles!teams_mentor_profile_fkey(full_name, institution)").eq("id", teamId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const joinTeam = useMutation({
		mutationFn: async () => {
			if (!teamId) throw new Error("No team ID provided.");
			if (!me?.id) throw new Error("You must be signed in to join a team.");
			const { error } = await supabase.from("team_members").insert({
				team_id: teamId,
				student_id: me.id
			});
			if (error && !error.message.includes("duplicate")) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams", "mine"] });
			setJoined(true);
			toast.success(`You have joined ${team?.name ?? "the team"}!`);
		},
		onError: (err) => toast.error(err.message)
	});
	if (!teamId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Join Team",
		subtitle: "No team ID provided",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
			className: "p-8 text-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "This page requires a team invite link with a valid team ID. Ask your mentor to share the invite link from their Teams page."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "press rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					children: "Go to Dashboard"
				})
			})]
		})
	});
	const mentorName = (team?.mentor)?.full_name ?? "Your Mentor";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Team Enrollment",
		subtitle: "Join a fieldwork team and start logging hours",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-2xl mx-auto space-y-6 pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "p-6 sm:p-8 space-y-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-black tracking-tight text-foreground",
							children: joined ? "Enrollment Complete!" : loadingTeam ? "Loading team…" : `Join ${team?.name ?? "Team"}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed",
							children: joined ? `You are now a member of ${team?.name ?? "this team"}. Your mentor can now review and sign off your fieldwork logs.` : `You have been invited to join ${team?.name ?? "a fieldwork team"}. Once enrolled, your mentor will be able to review and verify your field logs.`
						})]
					}),
					team && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-bold text-muted-foreground",
								children: "Mentor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground mt-0.5",
								children: mentorName
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-9 place-items-center rounded-xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-bold text-muted-foreground",
								children: "Team"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground mt-0.5",
								children: team.name
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3",
						children: !joined ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => joinTeam.mutate(),
							disabled: joinTeam.isPending || loadingTeam || !team,
							className: "press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto",
							children: [joinTeam.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: joinTeam.isPending ? "Enrolling…" : "Confirm & Join Team" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app",
								children: "Cancel"
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/log",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log Field Hours" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app",
								children: "Dashboard"
							})
						})] })
					})
				]
			})
		})
	});
}
//#endregion
export { TeamJoinPage as component };
