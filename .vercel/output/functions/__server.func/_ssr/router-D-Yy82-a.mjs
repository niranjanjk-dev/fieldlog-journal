import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime, l as Slot, n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as useQueryClient, i as QueryClientProvider, n as queryOptions, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { B as redirect, _ as createFileRoute, b as useNavigate, d as useLocation, f as useRouterState, g as lazyRouteComponent, h as Outlet, l as Scripts, m as createRouter, u as HeadContent, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ct as BadgeCheck, E as MessageSquare, Et as ArrowLeft, G as GraduationCap, H as House, K as Gauge, L as LifeBuoy, M as Lock, N as LockOpen, O as Menu, R as LayoutDashboard, T as Moon, dt as ChevronDown, h as Settings, i as Users, j as LogOut, k as MapPin, l as Sun, nt as CodeXml, ot as CircleCheck, q as FolderOpen, st as CircleAlert, t as X, tt as Compass, v as RefreshCw, w as PenLine, yt as CalendarClock } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-2J9nniCt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var DEV_MODE_KEY = "docko_dev_mode_enabled";
var DEV_ROLE_KEY = "docko_dev_role";
function isDevModeActive() {
	if (typeof window === "undefined") return false;
	return false;
}
function setDevModeActive(active) {
	if (typeof window === "undefined") return;
	localStorage.setItem(DEV_MODE_KEY, active ? "true" : "false");
	window.dispatchEvent(new CustomEvent("docko:dev-mode-change", { detail: { active } }));
}
function getDevRole() {
	if (typeof window === "undefined") return "student";
	const stored = localStorage.getItem(DEV_ROLE_KEY);
	if (stored === "mentor" || stored === "admin" || stored === "student") return stored;
	return "student";
}
function setDevRole(role) {
	if (typeof window === "undefined") return;
	localStorage.setItem(DEV_ROLE_KEY, role);
	window.dispatchEvent(new CustomEvent("docko:dev-role-change", { detail: { role } }));
}
var DEV_STUDENT = {
	id: "a8003d09-d867-4311-948f-d9f1095c0674",
	email: "alex.rivera@stanford.edu",
	fullName: "Alex Rivera",
	avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
	headline: "Junior · Biomedical Engineering & Robotics",
	institution: "Stanford University",
	institutionId: null,
	institutionVerified: false,
	course: "BIO-402 Advanced Biomechanics",
	department: "Bioengineering Department",
	phone: null,
	position: null,
	hasChangedName: false,
	roles: ["student"]
};
var DEV_MENTOR = {
	id: "685a2b32-c0b4-4aea-a296-ecde68de8d34",
	email: "dr.vance@stanford.edu",
	fullName: "Dr. Elena Vance",
	avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
	headline: "Associate Professor & Lab Director",
	institution: "Stanford University",
	institutionId: null,
	institutionVerified: true,
	course: null,
	department: "Robotics Laboratory",
	phone: "+1 555-123-4567",
	position: "Senior Research Scientist",
	hasChangedName: false,
	roles: ["mentor"]
};
var DEV_ADMIN = {
	id: "e50bdb5e-9823-4d8b-bd3c-0feb2b2483ef",
	email: "dean.holloway@stanford.edu",
	fullName: "Dean Marcus Holloway",
	avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
	headline: "Dean of Academic Affairs & Accreditation",
	institution: "Stanford University",
	institutionId: null,
	institutionVerified: false,
	course: null,
	department: "Administration",
	phone: null,
	position: "Program Director",
	hasChangedName: false,
	roles: ["admin"]
};
function getDevMe(role = getDevRole()) {
	if (role === "mentor") return DEV_MENTOR;
	if (role === "admin") return DEV_ADMIN;
	return DEV_STUDENT;
}
var DEV_STUDENT_ENTRIES = [
	{
		id: "4d508a64-a590-499d-aca5-63db724637a6",
		student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
		team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
		assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34", "dev-mentor-marcus"],
		assigned_mentors: ["Dr. Elena Vance", "Marcus Sterling"],
		title: "Micro-actuator calibration for prosthetic joint torque",
		category: "Hardware Testing",
		note: "Completed baseline current tests across 5 load cycles. Verified 0.02% error margin in telemetry feed.",
		photo_path: "samples/actuator-test.jpg",
		hours: 3.5,
		latitude: 37.4275,
		longitude: -122.1697,
		address: "Stanford Bioengineering Lab 4, Stanford, CA",
		captured_at: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
		status: "verified",
		review_note: "Calibration verified against sensor telemetry specs. Great progress on cycle 4.",
		reviewed_at: (/* @__PURE__ */ new Date(Date.now() - 18e5)).toISOString()
	},
	{
		id: "124e2583-a186-4e94-a87a-10e82c5a0b8b",
		student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
		team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
		assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34"],
		assigned_mentors: ["Dr. Elena Vance"],
		title: "EMG sensor signal filtering and noise gate tuning",
		category: "Software Development",
		note: "Wrote bandpass filtering script in Python to eliminate 60Hz ambient electrical interference.",
		photo_path: "samples/emg-graph.jpg",
		hours: 2.5,
		latitude: 37.428,
		longitude: -122.17,
		address: "Clark Center Room S360, Stanford, CA",
		captured_at: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
		status: "verified",
		review_note: "Clean signal trace. Ready for real-time test.",
		reviewed_at: (/* @__PURE__ */ new Date(Date.now() - 648e5)).toISOString()
	},
	{
		id: "7a05bf17-5ea0-46c7-8489-48aaa660fc77",
		student_id: "a8003d09-d867-4311-948f-d9f1095c0674",
		team_id: "05960b1f-baf5-43e5-bc2f-854c518b42a4",
		assigned_mentor_ids: ["685a2b32-c0b4-4aea-a296-ecde68de8d34", "dev-mentor-marcus"],
		assigned_mentors: ["Dr. Elena Vance", "Marcus Sterling"],
		title: "3D Print socket mount iteration 3 in carbon nylon",
		category: "Fabrication",
		note: "Print completed in 6.2 hours. Testing mechanical rigidity under compressive axial force.",
		photo_path: "samples/carbon-socket.jpg",
		hours: 4,
		latitude: 37.4272,
		longitude: -122.171,
		address: "Product Realization Lab, Stanford, CA",
		captured_at: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		status: "pending",
		review_note: null,
		reviewed_at: null
	}
];
(/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(), (/* @__PURE__ */ new Date(Date.now() - 18e6)).toISOString(), (/* @__PURE__ */ new Date(Date.now() - 288e5)).toISOString();
var statusMeta = {
	pending: {
		label: "Awaiting review",
		dot: "bg-warning",
		chip: "bg-warning-soft text-warning-foreground"
	},
	verified: {
		label: "Verified",
		dot: "bg-success",
		chip: "bg-success-soft text-success"
	},
	rejected: {
		label: "Needs changes",
		dot: "bg-destructive",
		chip: "bg-destructive-soft text-destructive"
	}
};
function dayKey(value) {
	if (!value) return "";
	const d = typeof value === "string" ? new Date(value) : value;
	if (!d || isNaN(d.getTime())) return "";
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatTime(value) {
	if (!value) return "";
	const d = new Date(value);
	if (isNaN(d.getTime())) return "";
	return d.toLocaleTimeString(void 0, {
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatDay(value) {
	if (!value) return "";
	const d = new Date(value);
	if (isNaN(d.getTime())) return "";
	return d.toLocaleDateString(void 0, {
		weekday: "short",
		day: "numeric",
		month: "short"
	});
}
function sumHours(entries) {
	if (!Array.isArray(entries)) return 0;
	return Math.round(entries.reduce((total, e) => total + Number(e?.hours ?? 0), 0) * 10) / 10;
}
/** Consecutive days (ending today or yesterday) that have at least one log. */
function currentStreak(entries) {
	if (!Array.isArray(entries)) return 0;
	const days = new Set(entries.filter((e) => Boolean(e?.captured_at)).map((e) => dayKey(e.captured_at)).filter(Boolean));
	if (days.size === 0) return 0;
	const cursor = /* @__PURE__ */ new Date();
	if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
	let streak = 0;
	while (days.has(dayKey(cursor))) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}
/** Logs per day for the last `days` days, oldest first. */
function weeklyActivity(entries, days = 7) {
	const buckets = [];
	const safeEntries = Array.isArray(entries) ? entries.filter((e) => Boolean(e?.captured_at)) : [];
	const todayKey = dayKey(/* @__PURE__ */ new Date());
	for (let i = days - 1; i >= 0; i -= 1) {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - i);
		const key = dayKey(d);
		const matched = safeEntries.filter((e) => dayKey(e.captured_at) === key);
		buckets.push({
			label: d.toLocaleDateString(void 0, { weekday: "narrow" }),
			fullLabel: d.toLocaleDateString(void 0, { weekday: "short" }),
			logs: matched.length,
			hours: sumHours(matched),
			isToday: key === todayKey,
			dateStr: key
		});
	}
	return buckets;
}
function initials(name) {
	if (!name) return "D";
	return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}
var meQuery = queryOptions({
	queryKey: ["me"],
	staleTime: 5e3,
	queryFn: async () => {
		try {
			const { data: auth } = await supabase.auth.getUser();
			const user = auth.user;
			if (user) {
				const [{ data: profile }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", user.id)]);
				return {
					id: user.id,
					email: user.email ?? null,
					fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "Member",
					avatarUrl: profile?.avatar_url ?? null,
					headline: profile?.headline ?? null,
					institution: profile?.institution ?? null,
					institutionId: profile?.institution_id ?? null,
					institutionVerified: profile?.institution_verified ?? false,
					course: profile?.course ?? null,
					department: profile?.department ?? null,
					phone: profile?.phone ?? null,
					position: profile?.position ?? null,
					hasChangedName: profile?.has_changed_name ?? false,
					roles: (roles ?? []).map((r) => r.role) ?? []
				};
			}
		} catch {}
		if (isDevModeActive()) return getDevMe();
		return null;
	}
});
var myEntriesQuery = queryOptions({
	queryKey: ["entries", "mine"],
	queryFn: async () => {
		const localCustom = [];
		if (typeof window !== "undefined") try {
			const stored = localStorage.getItem("docko_custom_entries");
			if (stored) localCustom.push(...JSON.parse(stored));
		} catch {}
		try {
			const { data, error } = await supabase.from("entries").select("*").order("captured_at", { ascending: false });
			if (!error && data) {
				const ids = new Set(data.map((d) => d.id));
				return [...localCustom.filter((e) => !ids.has(e.id)), ...data];
			}
		} catch {}
		if (isDevModeActive()) {
			const ids = new Set(DEV_STUDENT_ENTRIES.map((d) => d.id));
			return [...localCustom.filter((e) => !ids.has(e.id)), ...DEV_STUDENT_ENTRIES];
		}
		return localCustom;
	}
});
var reviewQueueQuery = queryOptions({
	queryKey: ["entries", "queue"],
	queryFn: async () => {
		try {
			const { data, error } = await supabase.from("entries").select("*, student:profiles!entries_student_profile_fkey (full_name, avatar_url, course)").order("captured_at", { ascending: false }).limit(200);
			if (!error && data) return data;
		} catch {}
		if (isDevModeActive()) {}
		return [];
	}
});
var teamsQuery = queryOptions({
	queryKey: ["teams"],
	queryFn: async () => {
		const { data, error } = await supabase.from("teams").select("*, team_members (id, student_id, profile:profiles!team_members_student_profile_fkey (full_name, avatar_url))").order("created_at", { ascending: true });
		if (error) throw error;
		return data ?? [];
	}
});
var systemSettingsQuery = queryOptions({
	queryKey: ["system_settings"],
	staleTime: 6e4,
	queryFn: async () => {
		const { data, error } = await supabase.from("system_settings").select("*").eq("id", 1).maybeSingle();
		if (error) throw error;
		return data ?? {
			show_admin_email_on_waiting: true,
			admin_contact_email: "support@docko.edu"
		};
	}
});
queryOptions({
	queryKey: ["people"],
	staleTime: 6e4,
	queryFn: async () => {
		const [{ data: profiles, error }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").order("full_name"), supabase.from("user_roles").select("user_id, role")]);
		if (error) throw error;
		return (profiles ?? []).map((p) => ({
			...p,
			roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role)
		}));
	}
});
var myNudgesQuery = queryOptions({
	queryKey: ["nudges"],
	queryFn: async () => {
		const { data, error } = await supabase.from("nudges").select("*, sender:profiles!nudges_sender_profile_fkey (full_name)").order("created_at", { ascending: false }).limit(20);
		if (error) throw error;
		return data ?? [];
	}
});
function commentsQuery(entryId) {
	return queryOptions({
		queryKey: ["comments", entryId],
		queryFn: async () => {
			const { data, error } = await supabase.from("entry_comments").select("*, author:profiles!entry_comments_author_profile_fkey (full_name, avatar_url)").eq("entry_id", entryId).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
}
var SAMPLE_PHOTO_MAP = {
	"samples/actuator-test.jpg": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
	"samples/emg-graph.jpg": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
	"samples/carbon-socket.jpg": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
	"samples/battery-test.jpg": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80",
	"samples/circuit-board.jpg": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
};
/** Signed URLs for private log photos, cached per path set. */
function photoUrlsQuery(paths) {
	const unique = [...new Set(paths.filter(Boolean))].sort();
	return queryOptions({
		queryKey: ["photo-urls", unique],
		enabled: unique.length > 0,
		staleTime: 27e5,
		queryFn: async () => {
			if (unique.length === 0) return {};
			const map = {};
			if (typeof window !== "undefined") for (const p of unique) try {
				const cached = localStorage.getItem(`docko_photo_${p}`);
				if (cached) map[p] = cached;
			} catch {}
			for (const p of unique) if (!map[p] && SAMPLE_PHOTO_MAP[p]) map[p] = SAMPLE_PHOTO_MAP[p];
			const nonCachedPaths = unique.filter((p) => !map[p]);
			if (nonCachedPaths.length > 0) try {
				const { data, error } = await supabase.storage.from("entry-photos").createSignedUrls(nonCachedPaths, 3600);
				if (!error && data) {
					for (const item of data) if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
				}
			} catch {}
			return map;
		}
	});
}
var myTeamsQuery = queryOptions({
	queryKey: ["teams", "mine"],
	queryFn: async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return [];
		const { data, error } = await supabase.from("team_members").select("id, team:teams!inner(*, mentor:profiles!teams_mentor_profile_fkey(full_name, avatar_url))").eq("student_id", user.id);
		if (error) throw error;
		return (data ?? []).map((m) => m.team).filter(Boolean);
	}
});
function publicProfileQuery(handle) {
	return queryOptions({
		queryKey: ["public_profile", handle],
		queryFn: async () => {
			const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", handle).maybeSingle();
			if (error || !profile) return {
				profile: null,
				entries: []
			};
			const { data: entries } = await supabase.from("entries").select("*").eq("student_id", profile.id).eq("status", "verified").order("captured_at", { ascending: false });
			return {
				profile,
				entries: entries ?? []
			};
		}
	});
}
/** Fetch all approved institutions for dropdowns */
var institutionsQuery = queryOptions({
	queryKey: ["institutions"],
	staleTime: 3e5,
	queryFn: async () => {
		const { data, error } = await supabase.from("institutions").select("id, name, domain").eq("status", "approved").order("name");
		if (error) throw error;
		return data ?? [];
	}
});
/** Entries visible to this institution (entries by institution-verified members) */
function institutionEntriesQuery(institutionId) {
	return queryOptions({
		queryKey: [
			"institution",
			"entries",
			institutionId
		],
		enabled: !!institutionId,
		queryFn: async () => {
			if (!institutionId) return [];
			const { data: members, error: mErr } = await supabase.from("profiles").select("id").eq("institution_id", institutionId).eq("institution_verified", true);
			if (mErr) throw mErr;
			if (!members || members.length === 0) return [];
			const memberIds = members.map((m) => m.id);
			const { data, error } = await supabase.from("entries").select("*, student:profiles!entries_student_profile_fkey(full_name, avatar_url, course)").in("student_id", memberIds).order("captured_at", { ascending: false }).limit(500);
			if (error) throw error;
			return data ?? [];
		}
	});
}
/** Teams where the mentor is a verified member of this institution */
function institutionTeamsQuery(institutionId) {
	return queryOptions({
		queryKey: [
			"institution",
			"teams",
			institutionId
		],
		enabled: !!institutionId,
		queryFn: async () => {
			if (!institutionId) return [];
			const { data: mentors, error: mErr } = await supabase.from("profiles").select("id").eq("institution_id", institutionId).eq("institution_verified", true);
			if (mErr) throw mErr;
			if (!mentors || mentors.length === 0) return [];
			const mentorIds = mentors.map((m) => m.id);
			const { data, error } = await supabase.from("teams").select("*, team_members(id, student_id, profile:profiles!team_members_student_profile_fkey(full_name, avatar_url))").in("mentor_id", mentorIds).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-D-Yy82-a.js
var router_D_Yy82_a_exports = /* @__PURE__ */ __exportAll({
	_: () => DockoLogo,
	a: () => Route$21,
	b: () => AvatarFallback,
	c: () => BentoGrid,
	d: () => ProgressRing,
	f: () => SectionTitle,
	g: () => AppShell,
	getRouter: () => getRouter,
	h: () => StatusChip,
	i: () => Route$17,
	l: () => EmptyState,
	m: () => StatTile,
	n: () => Route,
	o: () => Route$22,
	p: () => SkeletonTile,
	r: () => Route$4,
	s: () => BentoCard,
	t: () => router_exports,
	u: () => MiniBars,
	v: () => DockoMark,
	x: () => AvatarImage,
	y: () => Avatar
});
var styles_default = "/assets/styles-v9jedrbJ.css";
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
function DevToolbar() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const [role, setRoleState] = (0, import_react.useState)("student");
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		setEnabled(isDevModeActive());
		setRoleState(getDevRole());
		const handleRoleChange = (e) => {
			const customEvent = e;
			if (customEvent.detail?.role) setRoleState(customEvent.detail.role);
		};
		const handleDevModeChange = (e) => {
			const customEvent = e;
			if (typeof customEvent.detail?.active === "boolean") setEnabled(customEvent.detail.active);
		};
		window.addEventListener("docko:dev-role-change", handleRoleChange);
		window.addEventListener("docko:dev-mode-change", handleDevModeChange);
		return () => {
			window.removeEventListener("docko:dev-role-change", handleRoleChange);
			window.removeEventListener("docko:dev-mode-change", handleDevModeChange);
		};
	}, []);
	if (!mounted) return null;
	const currentProfile = getDevMe(role);
	function handleSwitchRole(newRole, redirectPath) {
		setDevRole(newRole);
		setRoleState(newRole);
		queryClient.invalidateQueries({ queryKey: ["me"] });
		queryClient.invalidateQueries({ queryKey: ["entries"] });
		if (redirectPath) navigate({ to: redirectPath });
		else if (newRole === "student" && location.pathname.startsWith("/mentor")) navigate({ to: "/app" });
		else if (newRole === "mentor" && location.pathname.startsWith("/app")) navigate({ to: "/mentor" });
		else if (newRole === "admin" && !location.pathname.startsWith("/admin")) navigate({ to: "/admin" });
	}
	function handleToggleDevMode() {
		const next = !enabled;
		setEnabled(next);
		setDevModeActive(next);
		queryClient.invalidateQueries({ queryKey: ["me"] });
		queryClient.invalidateQueries({ queryKey: ["entries"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"aria-label": "Developer mode toolbar",
		className: "fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2 font-sans transition-all duration-300 print:hidden",
		children: [expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[340px] max-w-[calc(100vw-24px)] rounded-3xl border border-border/80 bg-background/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/50 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5",
							children: ["Developer Mode", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary",
								children: "Active"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Auth bypass & Role Switcher"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "size-7 rounded-lg text-muted-foreground hover:text-foreground",
						onClick: () => setExpanded(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between rounded-2xl bg-muted/40 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-foreground",
							children: enabled ? "Sign-in Bypass ON" : "Sign-in Bypass OFF"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: enabled ? "default" : "outline",
						size: "sm",
						className: "h-7 rounded-xl text-xs font-semibold px-2.5",
						onClick: handleToggleDevMode,
						children: enabled ? "Bypassing" : "Enforce Auth"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3.5 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Switch Persona / Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-1 rounded-2xl bg-muted/50 p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSwitchRole("student", "/app"),
								className: cn("flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all", role === "student" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-background/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSwitchRole("mentor", "/mentor"),
								className: cn("flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all", role === "mentor" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-background/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mentor" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleSwitchRole("admin", "/admin"),
								className: cn("flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all", role === "admin" ? "bg-background text-primary shadow-sm ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground hover:bg-background/40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin" })]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/50 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "size-8 rounded-xl ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: currentProfile.avatarUrl ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "rounded-xl text-xs font-bold bg-primary-soft text-primary",
							children: currentProfile.fullName.charAt(0)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-bold text-foreground",
							children: currentProfile.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-muted-foreground",
							children: currentProfile.headline ?? currentProfile.course
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3.5 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Quick Jump Pages"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: role === "student" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today (/app)" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/log",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Log" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/timeline",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Timeline" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/app/portfolio",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Portfolio" })]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mentor",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overview" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mentor/verify",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify Queue" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/mentor/teams",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Teams" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: "flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Admin" })]
							})
						] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-primary transition-colors",
						children: "← Landing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "hover:text-primary transition-colors",
						children: "Auth Page →"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => handleSwitchRole("student", "/app"),
					className: cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all", role === "student" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"),
					title: "Switch to Student Dashboard (/app)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Student"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => handleSwitchRole("mentor", "/mentor"),
					className: cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all", role === "mentor" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"),
					title: "Switch to Mentor Dashboard (/mentor)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Mentor"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "size-7 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted",
				onClick: () => setExpanded(!expanded),
				title: "Developer Options",
				children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-4 text-primary" })
			})]
		})]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var studentNav = [
	{
		to: "/app",
		label: "Today",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4" })
	},
	{
		to: "/app/log",
		label: "New log",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" })
	},
	{
		to: "/app/timeline",
		label: "Timeline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4" })
	},
	{
		to: "/app/inbox",
		label: "Inbox",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" })
	},
	{
		to: "/app/map",
		label: "Map",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
	},
	{
		to: "/app/portfolio",
		label: "Portfolio",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" })
	}
];
var mentorNav = [
	{
		to: "/mentor",
		label: "Overview",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "size-4" })
	},
	{
		to: "/mentor/verify",
		label: "Verify",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
	},
	{
		to: "/mentor/teams",
		label: "Teams",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
	},
	{
		to: "/mentor/inbox",
		label: "Inbox",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" })
	},
	{
		to: "/mentor/profile",
		label: "Profile",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
	}
];
var institutionNav = [
	{
		to: "/institution",
		label: "Overview",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" })
	},
	{
		to: "/institution/people",
		label: "People",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
	},
	{
		to: "/institution/teams",
		label: "Teams",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
	}
];
var adminNav = [{
	to: "/admin",
	label: "System",
	icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" })
}];
function DockoLogo({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("font-['Outfit',sans-serif] text-xl sm:text-2xl font-black tracking-[-0.045em] text-foreground select-none leading-none inline-flex items-baseline", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "docko" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary font-black ml-[1px]",
			children: "."
		})]
	});
}
function DockoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className });
}
function useTheme() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("docko-theme");
		const next = stored ? stored === "dark" : false;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
	}, []);
	function toggle() {
		setDark((prev) => {
			const next = !prev;
			document.documentElement.classList.toggle("dark", next);
			localStorage.setItem("docko-theme", next ? "dark" : "light");
			return next;
		});
	}
	return {
		dark,
		toggle
	};
}
function ThemeToggle() {
	const { dark, toggle } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		onClick: toggle,
		className: "press rounded-2xl",
		"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
		children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" })
	});
}
function NavList({ items, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.to,
			onClick: onNavigate,
			activeOptions: { exact: item.to === "/app" || item.to === "/mentor" || item.to === "/admin" || item.to === "/institution" },
			className: "press flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[var(--inset-top)]",
			children: [item.icon, item.label]
		}, item.to))
	});
}
function AppShell({ children, title, subtitle, actions }) {
	const { data: me } = useQuery(meQuery);
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [pathname]);
	const roles = me?.roles ?? [];
	const devActive = isDevModeActive();
	(0, import_react.useEffect)(() => {
		const isAdmin = roles.includes("admin");
		const isInstitution = roles.includes("institution");
		const isPending = roles.includes("pending") && !isAdmin && !isInstitution;
		const isPendingInstitution = isPending && !!me?.institutionId;
		const isPendingStandard = isPending && !me?.institutionId;
		if (isPendingInstitution && pathname !== "/waiting") navigate({
			to: "/waiting",
			replace: true
		});
		else if (isPendingStandard && pathname !== "/onboarding") navigate({
			to: "/onboarding",
			replace: true
		});
		else if (isInstitution && !isAdmin && !roles.includes("student") && pathname === "/app") navigate({
			to: "/institution",
			replace: true
		});
	}, [
		roles,
		pathname,
		navigate,
		me
	]);
	const sections = [
		{
			label: "Student",
			items: studentNav,
			show: devActive || roles.length === 0 || roles.includes("student")
		},
		{
			label: "Mentor",
			items: mentorNav,
			show: devActive || roles.includes("mentor")
		},
		{
			label: "Institution",
			items: institutionNav,
			show: devActive || roles.includes("institution")
		},
		{
			label: "Admin",
			items: adminNav,
			show: devActive || roles.includes("admin")
		}
	].filter((s) => s.show);
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/" });
	}
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-6 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				className: "flex items-center px-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-2xl" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 flex-col gap-5 overflow-y-auto",
				children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1.5 px-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase",
					children: section.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, {
					items: section.items,
					onNavigate: () => setOpen(false)
				})] }, section.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-auto px-2 pb-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/support",
					onClick: () => setOpen(false),
					activeOptions: { exact: true },
					className: "press flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[var(--inset-top)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-4" }), "Help & Support"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "raised flex items-center gap-3 rounded-2xl p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "size-9",
						children: [me?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: me.avatarUrl,
							alt: ""
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-primary-soft text-primary",
							children: initials(me?.fullName)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: me?.fullName ?? "Loading…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: roles.includes("admin") ? "System Admin" : roles.includes("institution") ? "Institution" : roles.includes("mentor") ? "Mentor" : roles.includes("student") ? "Student" : roles[0] ? roles[0][0]?.toUpperCase() + roles[0].slice(1) : "Student"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: signOut,
						className: "press rounded-xl",
						"aria-label": "Sign out",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block",
				children: sidebar
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute inset-0 bg-foreground/25",
					onClick: () => setOpen(false),
					"aria-label": "Close menu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rise absolute inset-y-0 left-0 w-72 bg-sidebar shadow-[var(--raise-2)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "absolute right-2 top-3 rounded-xl",
						onClick: () => setOpen(false),
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}), sidebar]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-3 sm:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "press rounded-2xl shrink-0",
								onClick: () => setOpen(true),
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "size-8 shrink-0 ring-2 ring-primary/20",
									children: [me?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: me.avatarUrl,
										alt: ""
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-primary-soft text-[11px] font-bold text-primary",
										children: initials(me?.fullName)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-base font-bold tracking-tight text-foreground",
									children: title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 shrink-0",
								children: [actions, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto hidden max-w-6xl items-center gap-3 px-4 sm:flex sm:py-3 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "press rounded-2xl lg:hidden",
								onClick: () => setOpen(true),
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-lg font-semibold tracking-tight",
									children: title
								}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: subtitle
								}) : null]
							}),
							actions,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8",
					children
				})]
			})
		]
	});
}
/** The core Docko layout primitive: a raised, tactile tile in a bento grid. */
function BentoCard({ children, className, interactive = false, tone = "surface", as: Tag = "section" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		className: cn("relative overflow-hidden rounded-3xl p-3.5 sm:p-5 lg:p-6", tone === "sunken" ? "sunken border border-border" : "raised", tone === "primary" && "soft-veil", interactive && "lift cursor-pointer", className),
		children
	});
}
function BentoGrid({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6", className),
		children
	});
}
function SectionTitle({ title, hint, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-base font-semibold tracking-tight",
			children: title
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-0.5 text-sm text-muted-foreground",
			children: hint
		}) : null] }), action]
	});
}
function StatTile({ label, value, unit, hint, icon, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
		className: cn("flex flex-col justify-between min-h-[100px]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] sm:text-xs font-medium tracking-wide text-muted-foreground uppercase leading-tight",
					children: label
				}), icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-7 sm:size-8 place-items-center rounded-full bg-primary-soft text-primary shrink-0",
					children: icon
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 sm:mt-6 flex items-baseline gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl sm:text-3xl font-semibold tabular-nums",
					children: value
				}), unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs sm:text-sm text-muted-foreground",
					children: unit
				}) : null]
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] sm:text-xs text-muted-foreground leading-tight",
				children: hint
			}) : null
		]
	});
}
function StatusChip({ status, className }) {
	const meta = statusMeta[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 leading-none", meta.chip, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("size-1.5 rounded-full shrink-0", meta.dot),
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.label })]
	});
}
function ProgressRing({ value, size = 96, label, sublabel, textSize = "text-lg" }) {
	const clamped = Math.max(0, Math.min(100, value));
	const stroke = 10;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid place-items-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			className: "-rotate-90",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				fill: "none",
				stroke: "var(--color-muted)",
				strokeWidth: stroke
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				fill: "none",
				stroke: "var(--color-primary)",
				strokeWidth: stroke,
				strokeLinecap: "round",
				strokeDasharray: circumference,
				strokeDashoffset: circumference - clamped / 100 * circumference,
				style: { transition: "stroke-dashoffset 300ms var(--ease-soft)" }
			})]
		}), label !== "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${textSize} font-semibold tabular-nums`,
				children: label ?? `${Math.round(clamped)}%`
			}), sublabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground",
				children: sublabel
			}) : null]
		}) : null]
	});
}
function MiniBars({ data }) {
	const maxHours = Math.max(6, ...data.map((d) => Number(d.hours ?? 0)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-24 sm:h-28 items-end gap-2 sm:gap-3 pt-2",
		children: data.map((d, i) => {
			const hours = Number(d.hours ?? 0);
			const heightPct = hours > 0 ? Math.max(14, Math.min(100, Math.round(hours / maxHours * 100))) : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group/bar relative flex flex-1 h-full flex-col items-center justify-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-[68px] sm:h-[76px] w-full items-end justify-center rounded-xl bg-muted/25 p-1",
						children: hours > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("w-full rounded-lg transition-all duration-300", d.isToday ? "bg-primary shadow-xs" : "bg-primary/80 group-hover/bar:bg-primary"),
							style: { height: `${heightPct}%` }
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-full rounded-full bg-muted/40" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-[10px] sm:text-[11px] font-medium leading-none", d.isToday ? "font-bold text-primary" : "text-muted-foreground"),
							children: d.label
						}), d.isToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 size-1 rounded-full bg-primary" }) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background opacity-0 transition-opacity duration-150 group-hover/bar:opacity-100 whitespace-nowrap shadow-md z-30 pointer-events-none",
						children: [
							d.fullLabel ?? d.label,
							": ",
							hours,
							"h",
							d.logs > 0 ? ` · ${d.logs} ${d.logs === 1 ? "log" : "logs"}` : ""
						]
					})
				]
			}, `${d.label}-${i}`);
		})
	});
}
function EmptyState({ title, body, action, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-12 text-center",
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-3 grid size-11 place-items-center rounded-2xl bg-muted text-muted-foreground",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			}) : null
		]
	});
}
function SkeletonTile({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-32 animate-pulse rounded-3xl bg-muted/70", className),
		"aria-hidden": true
	});
}
var Route$27 = createFileRoute("/404")({
	head: () => ({ meta: [
		{ title: "Page Not Found (404) · Docko" },
		{
			name: "description",
			content: "The requested fieldlog page could not be located."
		},
		{
			property: "og:title",
			content: "Page Not Found · Docko"
		},
		{
			property: "og:description",
			content: "Explore other pages in the Docko Field Journal platform."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: NotFoundPage
});
function NotFoundPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "press rounded-2xl text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home, { className: "size-3.5 mr-1.5" }), "Go to Dashboard"]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center p-4 sm:p-6 my-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-3xl w-full mx-auto space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "p-6 sm:p-10 space-y-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative inline-flex items-center justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-7xl sm:text-8xl font-black tracking-tighter text-primary/20 select-none",
									children: "404"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, {
											className: "size-6 animate-spin",
											style: { animationDuration: "12s" }
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 max-w-md mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl sm:text-3xl font-black tracking-tight text-foreground",
									children: "Off the Beaten Path"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed",
									children: "We couldn't find the page or log you were looking for."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => window.history.back(),
									className: "press rounded-2xl px-5 text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5 mr-1.5" }), "Back to Previous Page"]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "text-center text-[11px] text-muted-foreground py-2",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" docko. Field Journal Integrity Platform."
				]
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundPage, {});
}
function ErrorComponent({ error, reset }) {
	console.error("[Application Error Caught]:", error);
	const router = useRouter();
	const currentPath = router.state.location.pathname;
	const navLinks = [
		{
			to: "/app",
			label: "Today",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4" })
		},
		{
			to: "/app/log",
			label: "New log",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" })
		},
		{
			to: "/app/timeline",
			label: "Timeline",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4" })
		},
		{
			to: "/app/map",
			label: "Map",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" })
		},
		{
			to: "/app/portfolio",
			label: "Portfolio",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" })
		}
	].filter((item) => item.to !== currentPath && item.to !== currentPath.replace(/\/$/, ""));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "w-full border-b border-border/40 bg-background/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						className: "press rounded-2xl text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5 mr-1.5" }), "Dashboard"]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 flex items-center justify-center p-4 sm:p-6 my-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-2xl w-full mx-auto space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "p-6 sm:p-8 space-y-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-7" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl sm:text-2xl font-bold tracking-tight text-foreground",
									children: "Temporary Issue Loading This Page"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm text-muted-foreground max-w-md mx-auto",
									children: "This specific view ran into a snag, but all other pages and your saved logs are completely safe."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-center gap-2.5 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => {
										router.invalidate();
										reset();
									},
									size: "sm",
									className: "press rounded-2xl px-5 text-xs font-semibold gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Try Again"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										window.location.reload();
									},
									className: "press rounded-2xl px-4 text-xs font-semibold",
									children: "Hard Reload"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border/50 text-left space-y-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1",
									children: "Navigate to Another Page:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
									children: navLinks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										className: "flex items-center gap-2 p-2.5 rounded-xl raised hover:bg-accent/50 transition-colors text-xs font-medium text-foreground",
										children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: item.label
										})]
									}, item.to))
								})]
							}),
							null
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "text-center text-[11px] text-muted-foreground py-2",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" docko. Academic Fieldwork & Journaling Integrity."
				]
			})
		]
	});
}
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "docko. — Track your academic journey with daily verified achievements" },
			{
				name: "description",
				content: "docko. helps students track any academic journey, project, or lab work. Log daily milestones with real evidence and get your achievements verified every day by mentors."
			},
			{
				name: "author",
				content: "docko."
			},
			{
				property: "og:title",
				content: "docko. — Track your academic journey with daily verified achievements"
			},
			{
				property: "og:description",
				content: "Capture daily milestones, lab photos, and project progress. Faculty and mentors verify your achievements every day."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&family=Sora:wght@400;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	const router = useRouter();
	const location = router.state.location;
	(0, import_react.useEffect)(() => {
		document.body.style.pointerEvents = "";
		document.body.removeAttribute("data-scroll-locked");
	}, [location.pathname]);
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event === "SIGNED_OUT") {
				queryClient.clear();
				return;
			}
			queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevToolbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })
		]
	});
}
var $$splitComponentImporter$25 = () => import("./routes-BWF0YZP8.mjs");
var Route$25 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "docko. — Track your academic journey with daily verified achievements" },
		{
			name: "description",
			content: "docko. helps students track any academic journey, project, or lab work. Log daily milestones with real evidence and get your achievements verified every day by mentors."
		},
		{
			property: "og:title",
			content: "docko. — Track your academic journey with daily verified achievements"
		},
		{
			property: "og:description",
			content: "Capture daily milestones, lab photos, and project progress. Faculty and mentors verify your achievements every day."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./route-Di7iQBCH.mjs");
var Route$24 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		try {
			const { data, error } = await supabase.auth.getUser();
			if (!error && data?.user) return { user: data.user };
		} catch {}
		if (isDevModeActive()) {
			const devMe = getDevMe();
			return { user: {
				id: devMe.id,
				email: devMe.email,
				user_metadata: { full_name: devMe.fullName }
			} };
		}
		throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin-login-iKnkllt6.mjs");
var Route$23 = createFileRoute("/admin-login")({
	head: () => ({ meta: [{ title: "System Administration — docko." }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./auth-0GUtO5_n.mjs");
var Route$22 = createFileRoute("/auth")({
	validateSearch: (search) => ({ mode: search["mode"] === "signup" ? "signup" : void 0 }),
	head: () => ({ meta: [
		{ title: "Sign in — docko." },
		{
			name: "description",
			content: "Sign in or create your docko. account to track your academic journey and get achievements verified daily."
		},
		{
			property: "og:title",
			content: "Sign in — docko."
		},
		{
			property: "og:description",
			content: "Access your academic journal, daily milestones, and mentor review portal."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./maintenance-DBEyRPQ6.mjs");
var Route$21 = createFileRoute("/maintenance")({
	validateSearch: (search) => {
		const params = {};
		if (typeof search["from"] === "string") params.from = search["from"];
		return params;
	},
	head: () => ({ meta: [
		{ title: "System Maintenance · Docko" },
		{
			name: "description",
			content: "Docko is undergoing scheduled maintenance and upgrades."
		},
		{
			property: "og:title",
			content: "System Maintenance · Docko"
		},
		{
			property: "og:description",
			content: "Docko is undergoing scheduled upgrades."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./onboarding-s_8JcU4Q.mjs");
var Route$20 = createFileRoute("/_authenticated/onboarding")({
	head: () => ({ meta: [{ title: "Welcome to docko." }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./support-Bmwz7lzF.mjs");
var Route$19 = createFileRoute("/_authenticated/support")({
	head: () => ({ meta: [{ title: "Help & Support · Docko" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./waiting-CYIBH8as.mjs");
var Route$18 = createFileRoute("/_authenticated/waiting")({
	head: () => ({ meta: [{ title: "Waiting for approval — docko." }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./p._handle-CJhiKPQ9.mjs");
var Route$17 = createFileRoute("/p/$handle")({
	head: ({ params }) => ({ meta: [
		{ title: `Verified Fieldwork Portfolio (${params.handle}) · Docko` },
		{
			name: "description",
			content: "Cryptographically verified academic fieldwork hours, logs, and supervisor sign-offs."
		},
		{
			property: "og:title",
			content: `Verified Fieldwork Portfolio (${params.handle}) · Docko`
		},
		{
			property: "og:description",
			content: "Cryptographically verified fieldwork hours and logs."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin-DsLQ8jQX.mjs");
var Route$16 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "System Admin · Docko" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./app-BWcAgyiO.mjs");
var Route$15 = createFileRoute("/_authenticated/app/")({
	head: () => ({ meta: [
		{ title: "Today · Docko" },
		{
			name: "description",
			content: "Your field logging streak, hours and pending verifications."
		},
		{
			property: "og:title",
			content: "Today · Docko"
		},
		{
			property: "og:description",
			content: "Your field logging streak, hours and verifications."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./inbox-D7W3zlTI.mjs");
var Route$14 = createFileRoute("/_authenticated/app/inbox")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./log-BqOia984.mjs");
var Route$13 = createFileRoute("/_authenticated/app/log")({
	head: () => ({ meta: [
		{ title: "New log · Docko" },
		{
			name: "description",
			content: "Capture a field log with photo, location, hours and notes."
		},
		{
			property: "og:title",
			content: "New log · Docko"
		},
		{
			property: "og:description",
			content: "Capture a field log with photo, location and hours."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./map-PgfpXEiv.mjs");
var Route$12 = createFileRoute("/_authenticated/app/map")({
	head: () => ({ meta: [
		{ title: "Map · Docko" },
		{
			name: "description",
			content: "See every field log pinned where it was captured."
		},
		{
			property: "og:title",
			content: "Map · Docko"
		},
		{
			property: "og:description",
			content: "See every field log pinned where it was captured."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./portfolio-Cvj_uBbf.mjs");
var Route$11 = createFileRoute("/_authenticated/app/portfolio")({
	head: () => ({ meta: [
		{ title: "Portfolio · Docko" },
		{
			name: "description",
			content: "An audit-ready summary of your verified fieldwork hours, credentials, and supervisor pairings."
		},
		{
			property: "og:title",
			content: "Portfolio · Docko"
		},
		{
			property: "og:description",
			content: "Audit-ready summary of your verified fieldwork."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./timeline-8JOdJJHx.mjs");
var Route$10 = createFileRoute("/_authenticated/app/timeline")({
	head: () => ({ meta: [
		{ title: "Timeline · Docko" },
		{
			name: "description",
			content: "Interactive calendar and field log timeline."
		},
		{
			property: "og:title",
			content: "Timeline · Docko"
		},
		{
			property: "og:description",
			content: "Interactive calendar and field log timeline."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./institution-BtUYaupj.mjs");
var Route$9 = createFileRoute("/_authenticated/institution/")({
	head: () => ({ meta: [
		{ title: "Institution · Docko" },
		{
			name: "description",
			content: "Institution-wide fieldwork hours, verification rate and teams."
		},
		{
			property: "og:title",
			content: "Institution · Docko"
		},
		{
			property: "og:description",
			content: "Institution-wide fieldwork hours and verification rate."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./people-DY9jdfeA.mjs");
var Route$8 = createFileRoute("/_authenticated/institution/people")({
	head: () => ({ meta: [{ title: "People · Institution" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./teams-Dbs3aD77.mjs");
var Route$7 = createFileRoute("/_authenticated/institution/teams")({
	head: () => ({ meta: [
		{ title: "Teams · Institution · Docko" },
		{
			name: "description",
			content: "Every placement team across your institution and its members."
		},
		{
			property: "og:title",
			content: "Teams · Institution · Docko"
		},
		{
			property: "og:description",
			content: "Every placement team across your institution."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./mentor-BSCcE6JJ.mjs");
var Route$6 = createFileRoute("/_authenticated/mentor/")({
	head: () => ({ meta: [
		{ title: "Mentor overview · docko." },
		{
			name: "description",
			content: "Review queue, team progress, and active student journals."
		},
		{
			property: "og:title",
			content: "Mentor overview · docko."
		},
		{
			property: "og:description",
			content: "Team activity and pending verifications."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./inbox-BtLSncJl.mjs");
var Route$5 = createFileRoute("/_authenticated/mentor/inbox")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./pair-C8EnK7tb.mjs");
var Route$4 = createFileRoute("/_authenticated/mentor/pair")({
	validateSearch: (search) => {
		const params = {};
		if (typeof search["studentId"] === "string") params.studentId = search["studentId"];
		if (typeof search["token"] === "string") params.token = search["token"];
		return params;
	},
	head: () => ({ meta: [{ title: "Pair with Student · Mentor Portal · Docko" }, {
		name: "description",
		content: "Link with student to become their authorized fieldwork log approver."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./profile-DfhGtGbc.mjs");
var Route$3 = createFileRoute("/_authenticated/mentor/profile")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./teams-CxN4Ovkf.mjs");
var Route$2 = createFileRoute("/_authenticated/mentor/teams")({
	head: () => ({ meta: [
		{ title: "Teams · docko." },
		{
			name: "description",
			content: "Team rosters, student progress, and verification metrics."
		},
		{
			property: "og:title",
			content: "Mentees & Teams · docko."
		},
		{
			property: "og:description",
			content: "Group students into placement teams."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./verify-DSniywDY.mjs");
var Route$1 = createFileRoute("/_authenticated/mentor/verify")({
	head: () => ({ meta: [
		{ title: "Verify logs · docko." },
		{
			name: "description",
			content: "Approve or request changes on student field logs in one tap."
		},
		{
			property: "og:title",
			content: "Verify logs · docko."
		},
		{
			property: "og:description",
			content: "Approve or request changes on student field logs."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./join-CJMOEpKt.mjs");
var Route = createFileRoute("/_authenticated/teams/join")({
	validateSearch: (search) => {
		const params = {};
		if (typeof search["teamId"] === "string") params.teamId = search["teamId"];
		if (typeof search["token"] === "string") params.token = search["token"];
		if (typeof search["code"] === "string") params.code = search["code"];
		return params;
	},
	head: () => ({ meta: [{ title: "Join Team · Docko" }, {
		name: "description",
		content: "Join a fieldwork team and start logging hours."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var R404Route = Route$27.update({
	id: "/404",
	path: "/404",
	getParentRoute: () => Route$26
});
var AuthenticatedRouteRoute = Route$24.update({
	id: "/_authenticated",
	getParentRoute: () => Route$26
});
var AdminLoginRoute = Route$23.update({
	id: "/admin-login",
	path: "/admin-login",
	getParentRoute: () => Route$26
});
var AuthRoute = Route$22.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$26
});
var MaintenanceRoute = Route$21.update({
	id: "/maintenance",
	path: "/maintenance",
	getParentRoute: () => Route$26
});
var AuthenticatedOnboardingRoute = Route$20.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSupportRoute = Route$19.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedWaitingRoute = Route$18.update({
	id: "/waiting",
	path: "/waiting",
	getParentRoute: () => AuthenticatedRouteRoute
});
var PHandleRoute = Route$17.update({
	id: "/p/$handle",
	path: "/p/$handle",
	getParentRoute: () => Route$26
});
var AuthenticatedAdminIndexRoute = Route$16.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppIndexRoute = Route$15.update({
	id: "/app/",
	path: "/app/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppInboxRoute = Route$14.update({
	id: "/app/inbox",
	path: "/app/inbox",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppLogRoute = Route$13.update({
	id: "/app/log",
	path: "/app/log",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppMapRoute = Route$12.update({
	id: "/app/map",
	path: "/app/map",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppPortfolioRoute = Route$11.update({
	id: "/app/portfolio",
	path: "/app/portfolio",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppTimelineRoute = Route$10.update({
	id: "/app/timeline",
	path: "/app/timeline",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInstitutionIndexRoute = Route$9.update({
	id: "/institution/",
	path: "/institution/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInstitutionPeopleRoute = Route$8.update({
	id: "/institution/people",
	path: "/institution/people",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedInstitutionTeamsRoute = Route$7.update({
	id: "/institution/teams",
	path: "/institution/teams",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMentorIndexRoute = Route$6.update({
	id: "/mentor/",
	path: "/mentor/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedOnboardingRoute,
	AuthenticatedSupportRoute,
	AuthenticatedWaitingRoute,
	AuthenticatedAppInboxRoute,
	AuthenticatedAppLogRoute,
	AuthenticatedAppMapRoute,
	AuthenticatedAppPortfolioRoute,
	AuthenticatedAppTimelineRoute,
	AuthenticatedInstitutionPeopleRoute,
	AuthenticatedInstitutionTeamsRoute,
	AuthenticatedMentorInboxRoute: Route$5.update({
		id: "/mentor/inbox",
		path: "/mentor/inbox",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMentorPairRoute: Route$4.update({
		id: "/mentor/pair",
		path: "/mentor/pair",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMentorProfileRoute: Route$3.update({
		id: "/mentor/profile",
		path: "/mentor/profile",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMentorTeamsRoute: Route$2.update({
		id: "/mentor/teams",
		path: "/mentor/teams",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedMentorVerifyRoute: Route$1.update({
		id: "/mentor/verify",
		path: "/mentor/verify",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedTeamsJoinRoute: Route.update({
		id: "/teams/join",
		path: "/teams/join",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAdminIndexRoute,
	AuthenticatedAppIndexRoute,
	AuthenticatedInstitutionIndexRoute,
	AuthenticatedMentorIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	R404Route,
	AdminLoginRoute,
	AuthRoute,
	MaintenanceRoute,
	PHandleRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { initials as A, reviewQueueQuery as B, buttonVariants as C, dayKey as D, currentStreak as E, myEntriesQuery as F, systemSettingsQuery as H, myNudgesQuery as I, myTeamsQuery as L, institutionTeamsQuery as M, institutionsQuery as N, formatDay as O, meQuery as P, photoUrlsQuery as R, Button as S, commentsQuery as T, teamsQuery as U, sumHours as V, weeklyActivity as W, SectionTitle as _, BentoCard as a, StatusChip as b, DockoMark as c, ProgressRing as d, Route as f, Route$4 as g, Route$22 as h, AvatarImage as i, institutionEntriesQuery as j, formatTime as k, EmptyState as l, Route$21 as m, Avatar as n, BentoGrid as o, Route$17 as p, AvatarFallback as r, DockoLogo as s, AppShell as t, MiniBars as u, SkeletonTile as v, cn as w, router_D_Yy82_a_exports as x, StatTile as y, publicProfileQuery as z };
