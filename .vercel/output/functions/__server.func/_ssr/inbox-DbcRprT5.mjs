import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as initials, P as meQuery, S as Button, a as BentoCard, i as AvatarImage, n as Avatar, o as BentoGrid, r as AvatarFallback, t as AppShell, w as cn } from "./router-D-Yy82-a.mjs";
import { E as MessageSquare, P as LoaderCircle, a as User, g as Send } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inbox-DbcRprT5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InboxView({ role }) {
	const queryClient = useQueryClient();
	const { data: me } = useQuery(meQuery);
	const [activeContactId, setActiveContactId] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const scrollRef = (0, import_react.useRef)(null);
	const { data: contacts, isLoading: loadingContacts } = useQuery({
		queryKey: ["message_contacts"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_message_contacts");
			if (error) throw error;
			return Array.from(new Map(data?.map((c) => [c.id, c])).values());
		}
	});
	const { data: messages, isLoading: loadingMessages } = useQuery({
		queryKey: ["direct_messages", activeContactId],
		queryFn: async () => {
			if (!activeContactId || !me) return [];
			const { data, error } = await supabase.from("direct_messages").select("*").or(`and(sender_id.eq.${me.id},receiver_id.eq.${activeContactId}),and(sender_id.eq.${activeContactId},receiver_id.eq.${me.id})`).order("created_at", { ascending: true });
			if (error) throw error;
			return data;
		},
		enabled: !!activeContactId && !!me
	});
	(0, import_react.useEffect)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages]);
	const sendMessage = useMutation({
		mutationFn: async (content) => {
			if (!activeContactId || !me) return;
			const { error } = await supabase.from("direct_messages").insert({
				sender_id: me.id,
				receiver_id: activeContactId,
				content
			});
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["direct_messages", activeContactId] });
			setMessage("");
		}
	});
	const activeContact = contacts?.find((c) => c.id === activeContactId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Inbox",
		subtitle: role === "student" ? "Chat with your mentors" : "Chat with your students",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-6xl mx-auto pt-4 pb-12 px-4 h-[calc(100vh-120px)] min-h-[600px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, {
				className: "h-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
					className: "lg:col-span-2 p-0 flex flex-col h-full overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-b border-border/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold tracking-tight",
							children: "Contacts"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto p-2 space-y-1",
						children: loadingContacts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full flex items-center justify-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-5" })
						}) : !contacts || contacts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 text-center text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mx-auto size-8 text-muted-foreground/30 mb-2" }), "No contacts found"]
						}) : contacts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveContactId(c.id),
							className: cn("w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left", activeContactId === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "size-10 shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: c.avatar_url }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(c.full_name) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold truncate",
									children: c.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-wider opacity-70 truncate",
									children: c.role
								})]
							})]
						}, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoCard, {
					className: "lg:col-span-4 p-0 flex flex-col h-full overflow-hidden",
					children: !activeContactId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-12 opacity-20 mb-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-foreground",
								children: "Select a contact"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: "Choose someone from the list to start messaging."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-b border-border/50 flex items-center gap-3 bg-muted/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
								className: "size-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: activeContact?.avatar_url }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials(activeContact?.full_name) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: activeContact?.full_name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground capitalize",
								children: activeContact?.role
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-4 space-y-4",
							ref: scrollRef,
							children: loadingMessages ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-5 text-muted-foreground" })
							}) : messages?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center text-sm text-muted-foreground mt-10",
								children: "No messages yet. Say hi!"
							}) : messages?.map((msg) => {
								const isMe = msg.sender_id === me?.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex", isMe ? "justify-end" : "justify-start"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm", isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"),
										children: msg.content
									})
								}, msg.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4 border-t border-border/50 bg-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => {
									e.preventDefault();
									if (message.trim() && !sendMessage.isPending) sendMessage.mutate(message.trim());
								},
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: message,
									onChange: (e) => setMessage(e.target.value),
									placeholder: "Type a message...",
									className: "rounded-full bg-muted/50 border-transparent focus-visible:bg-background h-11",
									disabled: sendMessage.isPending
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: !message.trim() || sendMessage.isPending,
									className: "shrink-0 rounded-full size-11 p-0 press",
									children: sendMessage.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
								})]
							})
						})
					] })
				})]
			})
		})
	});
}
//#endregion
export { InboxView as t };
