import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  FolderOpen,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LockOpen,
  MapPin,
  PenLine,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  type DevRole,
  getDevMe,
  getDevRole,
  isDevModeActive,
  setDevModeActive,
  setDevRole,
} from "@/lib/dev-mode";
import { cn } from "@/lib/utils";

export function DevToolbar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [enabled, setEnabled] = useState(true);
  const [role, setRoleState] = useState<DevRole>("student");
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isDevModeActive());
    setRoleState(getDevRole());

    const handleRoleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ role: DevRole }>;
      if (customEvent.detail?.role) {
        setRoleState(customEvent.detail.role);
      }
    };

    const handleDevModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      if (typeof customEvent.detail?.active === "boolean") {
        setEnabled(customEvent.detail.active);
      }
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

  function handleSwitchRole(newRole: DevRole, redirectPath?: string) {
    setDevRole(newRole);
    setRoleState(newRole);
    queryClient.invalidateQueries({ queryKey: ["me"] });
    queryClient.invalidateQueries({ queryKey: ["entries"] });

    if (redirectPath) {
      navigate({ to: redirectPath });
    } else {
      if (newRole === "student" && location.pathname.startsWith("/mentor")) {
        navigate({ to: "/app" });
      } else if (newRole === "mentor" && location.pathname.startsWith("/app")) {
        navigate({ to: "/mentor" });
      } else if (newRole === "admin" && !location.pathname.startsWith("/admin")) {
        navigate({ to: "/admin" });
      } else if (newRole === "institution" && !location.pathname.startsWith("/institution")) {
        navigate({ to: "/institution" });
      } else if (newRole === "pending") {
        navigate({ to: "/onboarding" });
      }
    }
  }

  function handleToggleDevMode() {
    const next = !enabled;
    setEnabled(next);
    setDevModeActive(next);
    queryClient.invalidateQueries({ queryKey: ["me"] });
    queryClient.invalidateQueries({ queryKey: ["entries"] });
  }

  return (
    <aside
      aria-label="Developer mode toolbar"
      className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2 font-sans transition-all duration-300 print:hidden"
    >
      {/* Expanded Panel */}
      {expanded && (
        <div className="w-[340px] max-w-[calc(100vw-24px)] rounded-3xl border border-border/80 bg-background/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Code2 className="size-4" />
              </span>
              <div>
                <p className="text-xs font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  Developer Mode
                  <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Active
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">Auth bypass & Role Switcher</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setExpanded(false)}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>

          {/* Auth Bypass Toggle */}
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted/40 p-2.5">
            <div className="flex items-center gap-2">
              {enabled ? (
                <LockOpen className="size-4 text-success" />
              ) : (
                <Lock className="size-4 text-warning" />
              )}
              <span className="text-xs font-medium text-foreground">
                {enabled ? "Sign-in Bypass ON" : "Sign-in Bypass OFF"}
              </span>
            </div>
            <Button
              variant={enabled ? "default" : "outline"}
              size="sm"
              className="h-7 rounded-xl text-xs font-semibold px-2.5"
              onClick={handleToggleDevMode}
            >
              {enabled ? "Bypassing" : "Enforce Auth"}
            </Button>
          </div>

          {/* Role Switcher */}
          <div className="mt-3.5 space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Switch Persona / Mode
            </label>
            <div className="grid grid-cols-5 gap-1 rounded-2xl bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => handleSwitchRole("student", "/app")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all",
                  role === "student"
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <GraduationCap className="size-4" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchRole("mentor", "/mentor")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all",
                  role === "mentor"
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <Gauge className="size-4" />
                <span>Mentor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchRole("admin", "/admin")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all",
                  role === "admin"
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <BadgeCheck className="size-4" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchRole("institution", "/institution")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all",
                  role === "institution"
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <FolderOpen className="size-4" />
                <span>Inst</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchRole("pending", "/onboarding")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition-all",
                  role === "pending"
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <Sparkles className="size-4" />
                <span>Pending</span>
              </button>
            </div>
          </div>

          {/* Active Dev Profile Card */}
          <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/50 p-2.5">
            <Avatar className="size-8 rounded-xl ring-1 ring-border">
              <AvatarImage src={currentProfile.avatarUrl ?? undefined} />
              <AvatarFallback className="rounded-xl text-xs font-bold bg-primary-soft text-primary">
                {currentProfile.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">{currentProfile.fullName}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {currentProfile.headline ?? currentProfile.course}
              </p>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="mt-3.5 space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Quick Jump Pages
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {role === "student" ? (
                <>
                  <Link
                    to="/app"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="size-3.5" />
                    <span>Today (/app)</span>
                  </Link>
                  <Link
                    to="/app/log"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <PenLine className="size-3.5" />
                    <span>New Log</span>
                  </Link>
                  <Link
                    to="/app/timeline"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Timeline</span>
                  </Link>
                  <Link
                    to="/app/portfolio"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <FolderOpen className="size-3.5" />
                    <span>Portfolio</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/mentor"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <Gauge className="size-3.5" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    to="/mentor/verify"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>Verify Queue</span>
                  </Link>
                  <Link
                    to="/mentor/teams"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <Users className="size-3.5" />
                    <span>Teams</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-primary-soft hover:text-primary transition-colors"
                  >
                    <BadgeCheck className="size-3.5" />
                    <span>Admin</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Footer Quick Links */}
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              ← Landing
            </Link>
            <Link to="/auth" className="hover:text-primary transition-colors">
              Auth Page →
            </Link>
          </div>
        </div>
      )}

      {/* Floating Collapsed Pill */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-background/90 p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-md">
        {/* Quick Mode Switcher Pills */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleSwitchRole("student", "/app")}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all",
              role === "student"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            title="Switch to Student Dashboard (/app)"
          >
            <GraduationCap className="size-3.5" />
            <span className="hidden sm:inline">Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchRole("mentor", "/mentor")}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all",
              role === "mentor"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            title="Switch to Mentor Dashboard (/mentor)"
          >
            <Gauge className="size-3.5" />
            <span className="hidden sm:inline">Mentor</span>
          </button>
        </div>

        {/* Expand Toolbar Button */}
        <Button
          variant="ghost"
          size="sm"
          className="size-7 rounded-full p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => setExpanded(!expanded)}
          title="Developer Options"
        >
          {expanded ? <ChevronDown className="size-4" /> : <Code2 className="size-4 text-primary" />}
        </Button>
      </div>
    </aside>
  );
}
