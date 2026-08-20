import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-D9Cas0bA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { S as Button, a as BentoCard, h as Route$22, s as DockoLogo, w as cn } from "./router-Bxv_pBoA.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as Flame, M as LoaderCircle, k as MapPin, nt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Dg9UVl2Y.mjs";
import { t as Label } from "./label-Bje0GZFn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BqW2omjW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const { mode: initialMode } = Route$22.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)(initialMode === "signup" ? "signup" : "signin");
	const [institution, setInstitution] = (0, import_react.useState)("");
	const [phoneNumber, setPhoneNumber] = (0, import_react.useState)("");
	const [proofDetails, setProofDetails] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [sentTo, setSentTo] = (0, import_react.useState)(null);
	const [otp, setOtp] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getSession().then(({ data }) => {
			if (active && data.session) navigate({ to: "/app" });
		});
		return () => {
			active = false;
		};
	}, [navigate]);
	async function submit(event) {
		event.preventDefault();
		if ((mode === "signup" || mode === "request") && password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { role: "pending" }
					}
				});
				if (error) throw error;
				if (!data.session) {
					setSentTo(email);
					return;
				}
				navigate({ to: "/onboarding" });
			} else if (mode === "request") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: { data: {
						full_name: institution,
						institution,
						role: "pending"
					} }
				});
				if (error) throw error;
				if (!data.session) {
					setSentTo(email);
					return;
				}
				const { error: reqError } = await supabase.from("institution_requests").insert({
					user_id: data.user?.id,
					institution_name: institution,
					email,
					phone_number: phoneNumber,
					proof_details: proofDetails
				});
				if (reqError) throw reqError;
				await supabase.auth.signOut();
				setSentTo("request");
				return;
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				navigate({ to: "/app" });
			}
		} catch (error) {
			toast.error(error?.message || "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function verifyOtp(e) {
		e.preventDefault();
		if (!sentTo) return;
		setBusy(true);
		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email: sentTo,
				token: otp,
				type: "signup"
			});
			if (error) throw error;
			if (mode === "request" && data.user) {
				const { error: reqError } = await supabase.from("institution_requests").insert({
					user_id: data.user?.id,
					institution_name: institution,
					email: sentTo,
					phone_number: phoneNumber,
					proof_details: proofDetails
				});
				if (reqError) throw reqError;
				await supabase.auth.signOut();
				setSentTo("request");
			} else navigate({ to: "/onboarding" });
		} catch (error) {
			toast.error(error?.message || "Invalid or expired code");
		} finally {
			setBusy(false);
		}
	}
	async function google() {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: `${window.location.origin}/app` }
			});
			if (error) throw error;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Google sign-in failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen w-full lg:h-screen lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_1fr] lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between overflow-hidden border-r border-border bg-sidebar p-6 lg:flex lg:p-8 xl:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "group flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-2xl sm:text-3xl" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative my-auto max-w-md space-y-5 py-4 xl:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl xl:text-4xl",
							children: "Every achievement carries verified proof."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted-foreground sm:text-base",
							children: "Photo evidence, campus coordinates, and exact timestamps — verified by your mentors in real time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur-sm sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-7 place-items-center rounded-lg bg-primary-soft text-primary sm:size-8",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-bold sm:text-sm",
											children: "Robotics Lab Milestone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Alex Rivera · Engineering"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-primary-soft px-2.5 py-0.5 text-[10px] font-bold text-primary sm:text-xs",
										children: "Verified"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 font-medium text-foreground/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), " Engineering Lab 4"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Today · 10:15 AM" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3 text-orange-500" }), " 14-Day streak"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-lg bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/80",
										children: "94% verified same day"
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative text-xs text-muted-foreground",
					children: "Built for research labs, project teams, coursework, and capstones."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:p-6 xl:p-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center px-5 pt-5 pb-2 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockoLogo, { className: "text-2xl" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-center p-3 sm:p-6 md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-sm sm:max-w-md",
					children: sentTo && sentTo !== "request" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "p-5 sm:p-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-xl font-bold tracking-tight",
								children: "Verify your email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm",
								children: [
									"We sent a 6-digit code to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: sentTo
									}),
									". Enter it below to activate your docko. account."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: verifyOtp,
								className: "mt-6 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "otp",
										className: "text-xs font-semibold",
										children: "Verification Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "otp",
										type: "text",
										inputMode: "numeric",
										maxLength: 6,
										value: otp,
										onChange: (e) => setOtp(e.target.value),
										required: true,
										placeholder: "123456",
										className: "h-10 rounded-xl text-center text-lg font-bold tracking-widest sm:h-12 sm:text-xl"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: busy || otp.length !== 6,
									className: "press h-10 w-full rounded-xl text-xs font-bold shadow-[var(--shadow-lift)] sm:h-12 sm:text-sm",
									children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }) : "Verify Code"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "press mt-4 w-full rounded-xl text-xs font-semibold sm:text-sm",
								onClick: () => {
									setSentTo(null);
									setMode("signin");
									setOtp("");
								},
								children: "Cancel"
							})
						]
					}) : sentTo === "request" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "p-5 sm:p-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto mb-3 grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-xl font-bold tracking-tight",
								children: "Request Sent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm",
								children: [
									"Your institution request has been sent to our team. We'll be in touch soon at ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: email
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "press mt-5 h-10 w-full rounded-xl text-xs font-semibold sm:text-sm",
								onClick: () => {
									setSentTo(null);
									setMode("signin");
								},
								children: "Back to sign in"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BentoCard, {
						className: "p-4 sm:p-6 shadow-[var(--shadow-lift)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-lg font-extrabold tracking-tight sm:text-2xl",
								children: mode === "signup" ? "Create your account" : "Welcome back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground sm:text-sm",
								children: mode === "signup" ? "Start tracking your academic journey." : mode === "request" ? "Request to onboard your university or lab." : "Sign in to access your journal."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 rounded-2xl bg-secondary/80 p-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("signin"),
									className: cn("press flex h-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all", mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
									children: "Sign in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMode("signup"),
									className: cn("press flex h-10 items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all", mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"),
									children: "Create account"
								})]
							}),
							mode !== "request" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 space-y-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									className: "press h-9.5 w-full rounded-xl bg-card text-xs font-semibold shadow-xs sm:h-10 sm:text-sm",
									onClick: google,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										viewBox: "0 0 24 24",
										className: "mr-2 size-4 sm:size-5",
										"aria-hidden": "true",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
												fill: "#4285F4"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z",
												fill: "#34A853"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.15-1.66.15-1.18z",
												fill: "#FBBC05"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
												fill: "#EA4335"
											})
										]
									}), "Continue with Google"]
								})
							}),
							mode !== "request" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative my-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative flex justify-center text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-card px-2 text-muted-foreground",
										children: "Or continue with email"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submit,
								className: "space-y-2.5 sm:space-y-3",
								children: [
									mode === "request" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "institutionName",
												className: "text-[11px] font-semibold sm:text-xs",
												children: "Institution name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "institutionName",
												value: institution,
												onChange: (e) => setInstitution(e.target.value),
												required: true,
												placeholder: "University of Science",
												className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "phoneNumber",
													className: "text-[11px] font-semibold sm:text-xs",
													children: "Phone number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "phoneNumber",
													value: phoneNumber,
													onChange: (e) => setPhoneNumber(e.target.value),
													required: true,
													placeholder: "+1 (555) 000-0000",
													className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email",
													className: "text-[11px] font-semibold sm:text-xs",
													children: "Contact email"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email",
													type: "email",
													value: email,
													onChange: (e) => setEmail(e.target.value),
													required: true,
													autoComplete: "email",
													placeholder: "name@university.edu",
													className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "proofDetails",
												className: "text-[11px] font-semibold sm:text-xs",
												children: "Proof of affiliation"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "proofDetails",
												value: proofDetails,
												onChange: (e) => setProofDetails(e.target.value),
												required: true,
												placeholder: "LinkedIn profile URL or university staff directory link",
												className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
											})]
										})
									] }),
									mode !== "request" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "email",
											className: "text-[11px] font-semibold sm:text-xs",
											children: "Email address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "email",
											type: "email",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											required: true,
											autoComplete: "email",
											placeholder: "name@university.edu",
											className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "password",
											className: "text-[11px] font-semibold sm:text-xs",
											children: "Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "password",
											type: "password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											required: true,
											minLength: 8,
											autoComplete: mode === "signup" || mode === "request" ? "new-password" : "current-password",
											placeholder: "••••••••",
											className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
										})]
									}),
									(mode === "signup" || mode === "request") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "confirmPassword",
											className: "text-[11px] font-semibold sm:text-xs",
											children: "Confirm password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "confirmPassword",
											type: "password",
											value: confirmPassword,
											onChange: (e) => setConfirmPassword(e.target.value),
											required: true,
											minLength: 8,
											autoComplete: "new-password",
											placeholder: "••••••••",
											className: "h-9 rounded-xl px-3 text-xs sm:h-9.5 sm:text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										disabled: busy,
										className: "press mt-1 h-9.5 w-full rounded-xl text-xs font-bold shadow-[var(--shadow-lift)] sm:h-10 sm:text-sm",
										children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-3.5 animate-spin" }) : null, mode === "signup" ? "Create account" : mode === "request" ? "Request access" : "Sign in"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3.5 text-center text-xs text-muted-foreground",
								children: [
									mode === "signup" ? "Already have an account?" : "New to docko.?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "font-bold text-primary underline-offset-4 hover:underline",
										onClick: () => setMode(mode === "signup" ? "signin" : "signup"),
										children: mode === "signup" ? "Sign in" : "Create one"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									mode !== "request" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "font-semibold text-primary/70 mt-2 hover:text-primary transition-colors underline-offset-4 hover:underline",
										onClick: () => setMode("request"),
										children: "Are you an institution? Request access"
									})
								]
							})
						]
					})
				})
			})]
		})]
	});
}
//#endregion
export { AuthPage as component };
