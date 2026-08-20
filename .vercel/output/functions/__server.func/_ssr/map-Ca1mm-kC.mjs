import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as myEntriesQuery, P as meQuery, a as BentoCard, t as AppShell, v as SkeletonTile } from "./router-Bxv_pBoA.mjs";
import { x as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Ca1mm-kC.js
var import_jsx_runtime = require_jsx_runtime();
function MapPage() {
	const { data: me } = useQuery(meQuery);
	const { data: entries } = useQuery(myEntriesQuery);
	const mine = (entries ?? []).filter((entry) => Boolean(entry) && (!me?.id || entry.student_id === me.id));
	const located = mine.filter((entry) => entry.latitude != null && entry.longitude != null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Map",
		subtitle: `${located.length} of ${mine.length} logs carry coordinates`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoCard, {
			className: "p-2 sm:p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonTile, { className: "h-[520px] rounded-2xl" }) })
		})
	});
}
//#endregion
export { MapPage as component };
