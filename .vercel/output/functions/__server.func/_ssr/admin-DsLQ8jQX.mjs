import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { H as systemSettingsQuery, S as Button, _ as SectionTitle, a as BentoCard, o as BentoGrid, t as AppShell, w as cn, y as StatTile } from "./router-D-Yy82-a.mjs";
import { A as Mail, D as MessageCircle, E as MessageSquare, Et as ArrowLeft, I as Link2, L as LifeBuoy, S as Phone, bt as Building, c as Trash2, g as Send, i as Users, it as CircleX, ot as CircleCheck, p as ShieldCheck, rt as Clock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DeHExzg4.mjs";
import { t as Input } from "./input-QF8W2qjo.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DsLQ8jQX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SystemAdminPage() {
	const queryClient = useQueryClient();
	const [activeTicket, setActiveTicket] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [institutionToDelete, setInstitutionToDelete] = (0, import_react.useState)(null);
	const [deleteConfirmText, setDeleteConfirmText] = (0, import_react.useState)("");
	const { data: stats } = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: async () => {
			const [profiles, institutions] = await Promise.all([supabase.from("profiles").select("id", { count: "exact" }), supabase.from("institutions").select("id", { count: "exact" })]);
			return {
				users: profiles.count ?? 0,
				institutions: institutions.count ?? 0
			};
		}
	});
	const { data: settings } = useQuery(systemSettingsQuery);
	const [adminEmail, setAdminEmail] = (0, import_react.useState)("");
	const [showEmail, setShowEmail] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (settings) {
			setAdminEmail(settings.admin_contact_email || "");
			setShowEmail(settings.show_admin_email_on_waiting);
		}
	}, [settings]);
	const updateSettings = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("system_settings").update({
				show_admin_email_on_waiting: showEmail,
				admin_contact_email: adminEmail
			}).eq("id", 1);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["system_settings"] });
			toast.success("Settings updated");
		},
		onError: (err) => toast.error(err.message)
	});
	const { data: requests } = useQuery({
		queryKey: ["admin", "requests"],
		queryFn: async () => {
			const { data, error } = await supabase.from("institution_requests").select("*").eq("status", "pending").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: approvedInstitutions } = useQuery({
		queryKey: ["admin", "approved_institutions"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_institution_stats");
			if (error) throw error;
			return data;
		}
	});
	const { data: tickets } = useQuery({
		queryKey: ["admin", "tickets"],
		queryFn: async () => {
			const { data, error } = await supabase.from("support_tickets").select(`*, profiles(full_name, email:auth.users(email))`).order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: messages } = useQuery({
		queryKey: [
			"admin",
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
	const declineRequest = useMutation({
		mutationFn: async (reqId) => {
			const { error } = await supabase.from("institution_requests").update({ status: "declined" }).eq("id", reqId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
			toast.success("Institution request declined");
		},
		onError: (err) => toast.error(err.message)
	});
	const createTicket = useMutation({
		mutationFn: async (institution) => {
			const { data: adminId, error: pError } = await supabase.rpc("get_institution_admin_id", { _institution_id: institution.id });
			if (pError) throw pError;
			if (!adminId) throw new Error("This institution has no registered admin account to message.");
			const { data, error } = await supabase.from("support_tickets").insert({
				user_id: adminId,
				type: "other",
				subject: `Admin Message: ${institution.name}`,
				description: "Message initiated by system administrator",
				status: "open"
			}).select("*, profiles(full_name, email:auth.users(email))").single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
			toast.success("Chat opened");
			setActiveTicket(data);
		},
		onError: (err) => toast.error(err.message)
	});
	const approveRequest = useMutation({
		mutationFn: async (req) => {
			const { error } = await supabase.rpc("approve_institution_request", { req_id: req.id });
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin"] });
			toast.success("Institution approved and access granted");
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteInstitution = useMutation({
		mutationFn: async (id) => {
			const { data, error } = await supabase.from("institutions").delete().eq("id", id).select();
			if (error) throw error;
			if (!data || data.length === 0) throw new Error("Could not delete. It may be restricted by database permissions.");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "approved_institutions"] });
			toast.success("Institution deleted permanently");
			setInstitutionToDelete(null);
			setDeleteConfirmText("");
		},
		onError: (err) => toast.error(err.message)
	});
	const resolveTicket = useMutation({
		mutationFn: async (ticketId) => {
			const { error } = await supabase.from("support_tickets").update({
				status: "resolved",
				resolved_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", ticketId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
			toast.success("Ticket resolved");
			if (activeTicket) setActiveTicket((prev) => ({
				...prev,
				status: "resolved"
			}));
		},
		onError: (err) => toast.error(err.message)
	});
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
				"admin",
				"messages",
				activeTicket?.id
			] });
		},
		onError: (err) => toast.error(err.message || "Failed to send message")
	});
	if (activeTicket) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Support Ticket",
		subtitle: `User: ${activeTicket.profiles?.full_name}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setActiveTicket(null),
					className: "press -ml-3 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), " Back to tickets"]
				}), activeTicket.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					className: "press rounded-xl",
					disabled: resolveTicket.isPending,
					onClick: () => resolveTicket.mutate(activeTicket.id),
					children: "Mark as Resolved"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "flex-1 flex flex-col overflow-hidden p-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 border-b border-border/50 bg-muted/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-bold flex items-center gap-2",
							children: [activeTicket.subject, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded",
								children: (activeTicket.type ?? "other").replace(/_/g, " ")
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
								children: "No messages yet. Reply below to start a chat with the user."
							})]
						}) : messages?.map((msg) => {
							const isUser = msg.user_id === activeTicket.user_id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col max-w-[85%] ${!isUser ? "ml-auto items-end" : "mr-auto items-start"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider",
									children: !isUser ? "You (Admin)" : msg.profiles?.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `px-4 py-2.5 rounded-2xl text-sm ${!isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`,
									children: msg.message
								})]
							}, msg.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-t border-border/50 bg-muted/10",
						children: activeTicket.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm text-muted-foreground py-2 font-medium",
							children: "This ticket is closed. You can no longer reply."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: sendMessage.mutate,
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: message,
								onChange: (e) => setMessage(e.target.value),
								placeholder: "Type a reply to the user...",
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "System Admin",
		subtitle: "Manage the Docko platform",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoGrid, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
				className: "lg:col-span-3",
				label: "Total Users",
				value: stats?.users ?? 0,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatTile, {
				className: "lg:col-span-3",
				label: "Institutions",
				value: stats?.institutions ?? 0,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "System Settings",
					hint: "Global app configurations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-2xl bg-card border border-border/50 p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-sm",
							children: "Show Admin Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Display contact email on institution waiting page"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: showEmail,
							onCheckedChange: (checked) => setShowEmail(checked)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-bold ml-1",
							children: "Admin Contact Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: adminEmail,
								onChange: (e) => setAdminEmail(e.target.value),
								placeholder: "admin@docko.edu",
								className: "rounded-xl flex-1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "press rounded-xl",
								disabled: updateSettings.isPending,
								onClick: () => updateSettings.mutate(),
								children: "Save Changes"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Institution Requests",
					hint: "Approve access requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: !requests || requests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground py-4",
						children: "No pending requests."
					}) : requests.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold",
							children: req.institution_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground flex flex-col gap-1 mt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3" }),
										" ",
										req.email
									]
								}),
								req.phone_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3" }),
										" ",
										req.phone_number
									]
								}),
								req.proof_details && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3" }),
										" ",
										req.proof_details
									]
								})
							]
						})] }), req.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "press rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50",
								disabled: declineRequest.isPending,
								onClick: () => declineRequest.mutate(req.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4 mr-2" }), "Decline"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "press rounded-xl",
								disabled: approveRequest.isPending,
								onClick: () => approveRequest.mutate(req),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 mr-2" }), "Approve"]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full",
							children: "Approved"
						})]
					}, req.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Approved Institutions",
					hint: "Manage and chat with active institutions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: !approvedInstitutions || approvedInstitutions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground py-4",
						children: "No approved institutions yet."
					}) : approvedInstitutions.map((inst) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold flex items-center gap-2",
							children: [inst.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 rounded",
								children: "Active"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground flex flex-col gap-1 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3" }),
									" ",
									inst.contact_email
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-4 font-medium mt-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5 text-primary" }),
										" ",
										inst.student_count || 0,
										" Students"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-primary" }),
										" ",
										inst.total_hours || 0,
										"h Total Activity"
									]
								})]
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "secondary",
								className: "press rounded-xl",
								disabled: createTicket.isPending,
								onClick: () => createTicket.mutate(inst),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 mr-2" }), "Message"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "press rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50",
								onClick: () => {
									setInstitutionToDelete(inst);
									setDeleteConfirmText("");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})]
					}, inst.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
				className: "lg:col-span-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					title: "Support Tickets",
					hint: "Manage user requests and issues"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: !tickets || tickets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground py-4",
						children: "No active support tickets."
					}) : tickets.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTicket(ticket),
						className: "w-full text-left flex items-start justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mt-1 flex size-10 shrink-0 items-center justify-center rounded-full ${ticket.status === "resolved" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`,
								children: ticket.status === "resolved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-bold flex items-center gap-2",
									children: [ticket.subject, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded",
										children: (ticket.type ?? "other").replace(/_/g, " ")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1 line-clamp-1",
									children: ticket.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground/70 mt-2 flex items-center gap-1",
									children: [
										"By ",
										ticket.profiles?.full_name,
										" • ",
										new Date(ticket.created_at).toLocaleDateString()
									]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-primary font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4",
							children: "View chat →"
						})]
					}, ticket.id))
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!institutionToDelete,
			onOpenChange: (open) => !open && setInstitutionToDelete(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-red-600",
					children: "Delete Institution"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"This action cannot be undone. This will permanently delete the institution",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						" ",
						institutionToDelete?.name,
						" "
					] }),
					" and all associated data, including student and mentor assignments."
				] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							"Please type ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono bg-muted px-1 py-0.5 rounded text-foreground",
								children: institutionToDelete?.name
							}),
							" to confirm."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: deleteConfirmText,
						onChange: (e) => setDeleteConfirmText(e.target.value),
						placeholder: "Type institution name..."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setInstitutionToDelete(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "destructive",
					disabled: deleteConfirmText !== institutionToDelete?.name || deleteInstitution.isPending,
					onClick: () => deleteInstitution.mutate(institutionToDelete.id),
					children: deleteInstitution.isPending ? "Deleting..." : "Delete Permanently"
				})] })
			] })
		})]
	});
}
//#endregion
export { SystemAdminPage as component };
