import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as initials, P as meQuery, S as Button, U as teamsQuery, _ as SectionTitle, a as BentoCard, l as EmptyState, n as Avatar, r as AvatarFallback, t as AppShell } from "./router-D-Yy82-a.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Users, o as UserPlus, x as Plus, y as QrCode } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as ScannerModal } from "./scanner-modal-tJU_Ymh_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams-CxN4Ovkf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamsPage() {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: teams } = useQuery(teamsQuery);
	const [name, setName] = (0, import_react.useState)("");
	const [scanningTeamId, setScanningTeamId] = (0, import_react.useState)(null);
	const [isScanningGlobal, setIsScanningGlobal] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const myTeams = (teams ?? []).filter((team) => team.mentor_id === me?.id || me?.roles.includes("admin"));
	const myStudentIds = new Set(myTeams.flatMap((team) => (team.team_members ?? []).map((m) => m.student_id)));
	const { data: allStudents } = useQuery({
		queryKey: ["students_for_teams", me?.id],
		enabled: !!me?.id,
		queryFn: async () => {
			const { data: roles, error: rErr } = await supabase.from("user_roles").select("user_id").eq("role", "student");
			if (rErr) throw rErr;
			const studentIds = (roles ?? []).map((r) => r.user_id);
			if (studentIds.length === 0) return [];
			const { data: profiles, error: pErr } = await supabase.from("profiles").select("id, full_name, institution, course").in("id", studentIds).order("full_name");
			if (pErr) throw pErr;
			return profiles ?? [];
		}
	});
	const myStudents = (allStudents ?? []).filter((s) => myStudentIds.has(s.id));
	const availableStudents = (allStudents ?? []).filter((s) => !myStudentIds.has(s.id));
	const createTeam = useMutation({
		mutationFn: async () => {
			if (!me) throw new Error("Still loading your account.");
			const { error } = await supabase.from("teams").insert({
				name: name.trim(),
				mentor_id: me.id
			});
			if (error) throw error;
		},
		onSuccess: () => {
			setName("");
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			toast.success("Team created");
		},
		onError: (error) => toast.error(error.message)
	});
	const addMember = useMutation({
		mutationFn: async (input) => {
			const { error } = await supabase.from("team_members").insert({
				team_id: input.teamId,
				student_id: input.studentId
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			toast.success("Student added");
		},
		onError: (error) => toast.error(error.message)
	});
	const myTeamsFinal = myTeams;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mentees & Teams",
		subtitle: "Students and placement groups you look after",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "press rounded-2xl",
				onClick: () => setIsScanningGlobal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4 mr-2" }), "Scan Student"]
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Your Mentees",
					hint: `${myStudents.length} student${myStudents.length === 1 ? "" : "s"} across your teams`
				}), myStudents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
					title: "No students yet",
					body: "Scan a student's QR code or add them to a team below."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3 pt-2",
					children: myStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 p-2 hover:bg-muted/30 rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "size-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-muted text-xs",
								children: initials(student.full_name)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold",
							children: student.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: student.institution || "Student"
						})] })]
					}, student.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "New team",
					hint: "Name it after the placement, site, or project group."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						if (name.trim()) createTeam.mutate();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (event) => setName(event.target.value),
						placeholder: "e.g. Fall 2026 Mechatronics Cohort",
						className: "rounded-2xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: createTeam.isPending,
						className: "press rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Create"]
					})]
				})]
			}),
			myTeamsFinal.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
				title: "No teams yet",
				body: "Create a team, then add the students on that placement."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: myTeamsFinal.map((team) => {
					const members = team.team_members ?? [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
							title: team.name,
							hint: `${members.length} student${members.length === 1 ? "" : "s"}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: members.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "size-7",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-muted text-[11px]",
										children: initials(member.profile?.full_name)
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: member.profile?.full_name ?? "Student"
								})]
							}, member.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2 text-xs tracking-widest text-muted-foreground uppercase flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add student" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-6 px-2 text-[10px] press rounded-md text-primary",
									onClick: () => setScanningTeamId(team.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3 mr-1" }), "Scan QR"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [availableStudents.filter((student) => !members.some((m) => m.student_id === student.id)).slice(0, 8).map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "press rounded-xl",
									onClick: () => addMember.mutate({
										teamId: team.id,
										studentId: student.id
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3.5" }), student.full_name]
								}, student.id)), availableStudents.filter((s) => !members.some((m) => m.student_id === s.id)).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "All students are already in this team."
								})]
							})]
						})
					] }, team.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerModal, {
				open: !!scanningTeamId,
				onOpenChange: (open) => !open && setScanningTeamId(null),
				title: "Scan Student Code",
				description: "Scan a student's ID badge to add them to this team.",
				mockData: availableStudents[0]?.id ?? "00000000-0000-0000-0000-000000000000",
				onScan: (data) => {
					if (scanningTeamId) {
						try {
							const extractedId = new URL(data).searchParams.get("studentId");
							if (extractedId) {
								addMember.mutate({
									teamId: scanningTeamId,
									studentId: extractedId
								});
								return;
							}
						} catch {}
						addMember.mutate({
							teamId: scanningTeamId,
							studentId: data
						});
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScannerModal, {
				open: isScanningGlobal,
				onOpenChange: setIsScanningGlobal,
				title: "Scan Student Code",
				description: "Scan a student's pairing QR code to become their mentor.",
				mockData: availableStudents[0]?.id ?? "00000000-0000-0000-0000-000000000000",
				onScan: (data) => {
					try {
						const extractedId = new URL(data).searchParams.get("studentId");
						if (extractedId) {
							navigate({
								to: "/mentor/pair",
								search: { studentId: extractedId }
							});
							return;
						}
					} catch {}
					navigate({
						to: "/mentor/pair",
						search: { studentId: data }
					});
				}
			})
		]
	});
}
//#endregion
export { TeamsPage as component };
