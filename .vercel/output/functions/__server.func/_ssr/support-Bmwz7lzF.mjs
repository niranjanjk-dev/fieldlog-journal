import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { S as Button, _ as SectionTitle, a as BentoCard, o as BentoGrid, t as AppShell } from "./router-D-Yy82-a.mjs";
import { E as MessageSquare, Et as ArrowLeft, L as LifeBuoy, P as LoaderCircle, g as Send } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { t as Label } from "./label-4t7PierD.mjs";
import { t as Textarea } from "./textarea-BCWJOMO7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DQxZPlgx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-Bmwz7lzF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SupportPage() {
	const [type, setType] = (0, import_react.useState)("other");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [activeTicket, setActiveTicket] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const { data: tickets, isLoading } = useQuery({
		queryKey: ["support", "tickets"],
		queryFn: async () => {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) return [];
			const { data, error } = await supabase.from("support_tickets").select("*").eq("user_id", user.user.id).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: messages } = useQuery({
		queryKey: [
			"support",
			"messages",
			activeTicket?.id
		],
		enabled: !!activeTicket?.id,
		refetchInterval: 5e3,
		queryFn: async () => {
			const { data, error } = await supabase.from("ticket_messages").select("*, profiles!ticket_messages_user_id_fkey(full_name)").eq("ticket_id", activeTicket.id).order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
	async function submitTicket(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Not authenticated");
			const { data, error } = await supabase.from("support_tickets").insert({
				user_id: user.user.id,
				type,
				subject,
				description
			}).select().single();
			if (error) throw error;
			toast.success("Support ticket submitted! We'll look into it soon.");
			setSubject("");
			setDescription("");
			setType("other");
			queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
			setActiveTicket(data);
		} catch (err) {
			toast.error(err.message || "Failed to submit ticket");
		} finally {
			setBusy(false);
		}
	}
	const sendMessage = useMutation({
		mutationFn: async (e) => {
			e.preventDefault();
			if (!message.trim()) return;
			const { data: user } = await supabase.auth.getUser();
			if (!user.user) throw new Error("Not authenticated");
			const { error } = await supabase.from("ticket_messages").insert({
				ticket_id: activeTicket.id,
				user_id: user.user.id,
				message
			});
			if (error) throw error;
			setMessage("");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [
				"support",
				"messages",
				activeTicket?.id
			] });
		},
		onError: (err) => toast.error(err.message || "Failed to send message")
	});
	if (activeTicket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Support Chat",
		subtitle: activeTicket.subject,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setActiveTicket(null),
					className: "press -ml-3 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), " Back to tickets"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "flex-1 flex flex-col overflow-hidden p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-border/50 bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold flex items-center gap-2",
							children: [activeTicket.subject, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded",
								children: activeTicket.type.replace("_", " ")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: activeTicket.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto p-4 space-y-4",
						children: messages?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-8 mb-4 opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "No messages yet. Our support team will reply here soon."
							})]
						}) : messages?.map((msg) => {
							msg.profiles?.full_name?.toLowerCase().includes("admin") || msg.profiles;
							const isMe = msg.user_id === activeTicket.user_id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider",
									children: isMe ? "You" : "Support"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`,
									children: msg.message
								})]
							}, msg.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-t border-border/50 bg-muted/10",
						children: activeTicket.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm text-muted-foreground py-2 font-medium",
							children: "This ticket has been resolved and closed."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: sendMessage.mutate,
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: "Type a message...",
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
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Help & Support",
		subtitle: "Get help or report issues",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-6xl mx-auto pt-4 pb-12 px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-3 p-6 self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Submit a Ticket",
					hint: "Have an idea? Tell us about a feature that would be nice to implement! Or report a bug."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submitTicket,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "type",
								className: "text-xs font-semibold",
								children: "What do you need help with?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: type,
								onValueChange: setType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "type",
									className: "h-10 rounded-xl",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select type" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "rounded-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "feature_request",
											children: "💡 Feature Request"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "name_change",
											children: "👤 Name Change Request"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "bug_report",
											children: "🐛 Report a Bug"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "💬 Other / General Help"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "subject",
								className: "text-xs font-semibold",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "subject",
								value: subject,
								onChange: (e) => setSubject(e.target.value),
								placeholder: "Brief summary...",
								required: true,
								className: "h-10 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "description",
								className: "text-xs font-semibold",
								children: "Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "description",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Please provide as much detail as possible...",
								required: true,
								className: "min-h-32 rounded-xl resize-y"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: busy,
							className: "press mt-2 h-10 w-full rounded-xl font-bold",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 size-4" }), "Submit Ticket"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-3 p-6 self-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Your Active Tickets",
					hint: "Chat with support about your requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-3",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading..."
					}) : !tickets || tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-12 px-4 rounded-2xl border border-dashed border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "mx-auto size-8 text-muted-foreground/30 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: "No active tickets"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "When you submit a ticket, you can track it here."
							})
						]
					}) : tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTicket(ticket),
						className: "w-full text-left flex flex-col gap-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-start w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold flex items-center gap-2",
									children: ticket.subject
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ticket.status === "resolved" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`,
									children: ticket.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground line-clamp-1",
								children: ticket.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-primary font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
								children: "Click to view chat →"
							})
						]
					}, ticket.id))
				})]
			})] })
		})
	});
}
//#endregion
export { SupportPage as component };
