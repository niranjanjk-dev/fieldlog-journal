import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { P as meQuery, S as Button, U as teamsQuery, a as BentoCard, g as Route$4, t as AppShell } from "./router-Bxv_pBoA.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as LoaderCircle, bt as ArrowRight, i as Users, p as ShieldCheck, s as UserCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-Bje0GZFn.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CeAvvLqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pair-DROK8pHu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MentorPairPage() {
	const { studentId } = Route$4.useSearch();
	useNavigate();
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: teams } = useQuery(teamsQuery);
	const [selectedTeamId, setSelectedTeamId] = (0, import_react.useState)("");
	const [paired, setPaired] = (0, import_react.useState)(false);
	const { data: studentProfile, isLoading: loadingStudent } = useQuery({
		queryKey: ["student_profile", studentId],
		enabled: !!studentId,
		queryFn: async () => {
			if (!studentId) return null;
			const { data, error } = await supabase.from("profiles").select("id, full_name, avatar_url, course, institution").eq("id", studentId).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const myTeams = (teams ?? []).filter((t) => t.mentor_id === me?.id);
	const pairStudent = useMutation({
		mutationFn: async () => {
			if (!studentId) throw new Error("No student ID provided.");
			if (!selectedTeamId) throw new Error("Please select a team to add this student to.");
			const { error } = await supabase.from("team_members").insert({
				team_id: selectedTeamId,
				student_id: studentId
			});
			if (error && !error.message.includes("duplicate")) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			setPaired(true);
			toast.success(`${studentProfile?.full_name ?? "Student"} added to your team.`);
		},
		onError: (err) => toast.error(err.message)
	});
	const studentName = studentProfile?.full_name ?? "Fieldwork Student";
	if (!studentId) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Pair with Student",
		subtitle: "No student ID provided",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
			className: "p-8 text-center space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "This page requires a student ID from a QR scan. Use the scanner on your teams page."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				className: "press rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mentor/teams",
					children: "Go to Teams"
				})
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Mentor Link & Authorization",
		subtitle: "Add student to one of your teams to supervise their field logs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-2xl mx-auto space-y-6 pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "p-6 sm:p-8 space-y-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider",
								children: paired ? "Pairing Confirmed" : "QR Pairing Token"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-black tracking-tight text-foreground",
								children: paired ? "Pairing Complete!" : loadingStudent ? "Loading student…" : `Pair with ${studentName}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed",
								children: paired ? `${studentName} is now in your team. Their logs will appear in your review queue.` : `You are adding ${studentName} to one of your teams. Once added, you can review, approve, and sign off their fieldwork logs.`
							})
						]
					}),
					studentProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 text-left pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-muted/40 border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "Student"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-foreground mt-0.5",
								children: studentProfile.full_name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3.5 rounded-2xl bg-muted/40 border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground font-medium",
								children: "Course / Program"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold text-foreground mt-1 truncate",
								children: studentProfile.course || studentProfile.institution || "—"
							})]
						})]
					}),
					!paired && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-left space-y-2 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["Add to team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: "*"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedTeamId,
								onValueChange: setSelectedTeamId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "rounded-2xl h-11",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: myTeams.length === 0 ? "Create a team first" : "Select a team…" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
									className: "rounded-2xl",
									children: myTeams.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: team.id,
										className: "rounded-xl",
										children: team.name
									}, team.id))
								})]
							}),
							myTeams.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["You have no teams yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/mentor/teams",
									className: "text-primary underline",
									children: "Create one first."
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3",
						children: !paired ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => pairStudent.mutate(),
							disabled: pairStudent.isPending || !selectedTeamId,
							className: "press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto",
							children: [pairStudent.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pairStudent.isPending ? "Adding to team…" : "Confirm & Add to Team" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/mentor",
								children: "Cancel"
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mentor/verify",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Review Queue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mentor/teams",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 mr-1.5" }), "My Teams"]
							})
						})] })
					})
				]
			})
		})
	});
}
//#endregion
export { MentorPairPage as component };
