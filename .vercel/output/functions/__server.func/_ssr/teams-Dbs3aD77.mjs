import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as institutionTeamsQuery, P as meQuery, _ as SectionTitle, a as BentoCard, l as EmptyState, t as AppShell } from "./router-D-Yy82-a.mjs";
import { i as Users } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teams-Dbs3aD77.js
var import_jsx_runtime = require_jsx_runtime();
function InstitutionTeamsPage() {
	const { data: me } = useQuery(meQuery);
	const { data: teams } = useQuery(institutionTeamsQuery(me?.institutionId ?? null));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Teams",
		subtitle: `${teams?.length ?? 0} teams at your institution`,
		children: !teams || teams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
			title: "No teams yet",
			body: "Verified mentors from your institution create teams and add their students."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: teams.map((team) => {
				const members = team.team_members ?? [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: team.name,
					hint: `${members.length} student${members.length === 1 ? "" : "s"}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: members.map((m) => m.profile?.full_name ?? "Student").join(", ") || "No members yet"
				})] }, team.id);
			})
		})
	});
}
//#endregion
export { InstitutionTeamsPage as component };
