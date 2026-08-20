import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { M as institutionTeamsQuery, P as meQuery, S as Button, V as sumHours, W as weeklyActivity, _ as SectionTitle, a as BentoCard, j as institutionEntriesQuery, o as BentoGrid, t as AppShell, u as MiniBars, y as StatTile } from "./router-D-Yy82-a.mjs";
import { Ct as BadgeCheck, E as MessageSquare, g as Send, i as Users, p as ShieldCheck, rt as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/institution-BtUYaupj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstitutionOverview() {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const { data: entries } = useQuery(institutionEntriesQuery(me?.institutionId ?? null));
	const { data: teams } = useQuery(institutionTeamsQuery(me?.institutionId ?? null));
	const { data: memberCount } = useQuery({
		queryKey: [
			"institution",
			"member_count",
			me?.institutionId
		],
		enabled: !!me?.institutionId,
		queryFn: async () => {
			const { count, error } = await supabase.from("profiles").select("id", {
				count: "exact",
				head: true
			}).eq("institution_id", me.institutionId).eq("institution_verified", true);
			if (error) throw error;
			return count ?? 0;
		}
	});
	const { data: adminTicket } = useQuery({
		queryKey: [
			"institution",
			"ticket",
			me?.id
		],
		enabled: !!me?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("support_tickets").select("*").eq("user_id", me.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
			if (error && error.code !== "PGRST116") throw error;
			return data;
		}
	});
	const { data: messages } = useQuery({
		queryKey: [
			"institution",
			"messages",
			adminTicket?.id
		],
		enabled: !!adminTicket?.id,
		refetchInterval: 5e3,
		queryFn: async () => {
			const { data, error } = await supabase.from("ticket_messages").select("*, profiles!ticket_messages_user_id_fkey(full_name)").eq("ticket_id", adminTicket?.id ?? "").order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
	const [message, setMessage] = (0, import_react.useState)("");
	const sendMessage = useMutation({
		mutationFn: async (e) => {
			e.preventDefault();
			if (!message.trim() || !adminTicket || !me) return;
			const { error } = await supabase.from("ticket_messages").insert({
				ticket_id: adminTicket.id,
				user_id: me.id,
				message
			});
			if (error) throw error;
			setMessage("");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [
				"institution",
				"messages",
				adminTicket?.id
			] });
		},
		onError: (err) => toast.error(err.message || "Failed to send message")
	});
	const all = entries ?? [];
	const verified = all.filter((entry) => entry.status === "verified");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Institution",
		subtitle: "Everything happening across your teams and students",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
				className: "lg:col-span-2",
				label: "Verified Members",
				value: memberCount ?? 0,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
				className: "lg:col-span-2",
				label: "Hours logged",
				value: sumHours(all),
				unit: "h",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
				className: "lg:col-span-2",
				label: "Verification rate",
				value: all.length ? Math.round(verified.length / all.length * 100) : 0,
				unit: "%",
				hint: `${teams?.length ?? 0} teams`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Institution activity",
					hint: "Logs captured per day by verified members"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniBars, { data: weeklyActivity(all) })]
			}),
			adminTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6 flex flex-col p-0 overflow-hidden h-[400px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-border/50 bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold flex items-center gap-2 text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), "Messages from Admin"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: adminTicket.subject
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto p-4 space-y-4 bg-background",
						children: messages?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-8 mb-4 opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "No messages yet. Reply below."
							})]
						}) : messages?.map((msg) => {
							const isMe = msg.user_id === me?.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider",
									children: isMe ? "You" : "System Admin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`,
									children: msg.message
								})]
							}, msg.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-t border-border/50 bg-muted/10",
						children: adminTicket.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted-foreground py-2 font-medium",
							children: "This conversation is closed."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: sendMessage.mutate,
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: "Type a reply...",
								className: "h-10 rounded-xl",
								disabled: sendMessage.isPending
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !message.trim() || sendMessage.isPending,
								className: "press h-10 w-10 shrink-0 rounded-xl p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
							})]
						})
					})
				]
			})
		] })
	});
}
//#endregion
export { InstitutionOverview as component };
