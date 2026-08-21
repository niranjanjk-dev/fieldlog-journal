import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  LogOut,
  LifeBuoy,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  PenLine,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { isDevModeActive, setDevModeActive } from "@/lib/dev-mode";
import { initials } from "@/lib/docko";
import { meQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";



const studentNav: NavItem[] = [
  { to: "/app", label: "Today", icon: <LayoutDashboard className="size-4" /> },
  { to: "/app/log", label: "New log", icon: <PenLine className="size-4" /> },
  { to: "/app/timeline", label: "Timeline", icon: <CalendarClock className="size-4" /> },
  { to: "/app/inbox", label: "Inbox", icon: <MessageSquare className="size-4" /> },
  { to: "/app/map", label: "Map", icon: <MapPin className="size-4" /> },
  { to: "/app/portfolio", label: "Portfolio", icon: <FolderOpen className="size-4" /> },
];

const mentorNav: NavItem[] = [
  { to: "/mentor", label: "Overview", icon: <Gauge className="size-4" /> },
  { to: "/mentor/verify", label: "Verify", icon: <CheckCircle2 className="size-4" /> },
  { to: "/mentor/teams", label: "Teams", icon: <Users className="size-4" /> },
  { to: "/mentor/inbox", label: "Inbox", icon: <MessageSquare className="size-4" /> },
  { to: "/mentor/profile", label: "Profile", icon: <Settings className="size-4" /> },
];

const institutionNav: NavItem[] = [
  { to: "/institution", label: "Overview", icon: <BadgeCheck className="size-4" /> },
  { to: "/institution/people", label: "People", icon: <Users className="size-4" /> },
  { to: "/institution/teams", label: "Teams", icon: <Settings className="size-4" /> },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "System", icon: <BadgeCheck className="size-4" /> },
];

export function DockoLogo({ className }: { className?: string | undefined }) {
  return (
    <span
      className={cn(
        "font-['Outfit',sans-serif] text-xl sm:text-2xl font-black tracking-[-0.045em] text-foreground select-none leading-none inline-flex items-baseline",
        className,
      )}
    >
      <span>docko</span>
      <span className="text-primary font-black ml-[1px]">.</span>
    </span>
  );
}

export function DockoMark({ className }: { className?: string | undefined }) {
  return <DockoLogo className={className} />;
}

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
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

  return { dark, toggle };
}

function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="press rounded-2xl"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

type NavItem = { to: string; label: string; icon: ReactNode; badge?: number };

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/app" || item.to === "/mentor" || item.to === "/admin" || item.to === "/institution" }}
          className="press flex items-center justify-between gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[var(--inset-top)]"
        >
          <div className="flex items-center gap-2.5">
            {item.icon}
            {item.label}
          </div>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const { data: me } = useQuery(meQuery);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const roles = me?.roles ?? [];
  const [devActive, setDevActive] = useState(isDevModeActive());

  useEffect(() => {
    const handler = (e: any) => setDevActive(e.detail.active);
    window.addEventListener("docko:dev-mode-change", handler);
    return () => window.removeEventListener("docko:dev-mode-change", handler);
  }, []);

  useEffect(() => {
    const isAdmin = roles.includes("admin");
    const isInstitution = roles.includes("institution");
    const isPending = roles.includes("pending") && !isAdmin && !isInstitution;
    // Institution pending = pending role AND has an institutionId OR institution string set
    const isPendingInstitution = isPending && (!!me?.institutionId || !!me?.institution);
    // Standard pending = pending role WITHOUT an institution
    const isPendingStandard = isPending && !me?.institutionId && !me?.institution;

    const isMentor = roles.includes("mentor");

    if (isPendingInstitution && pathname !== "/waiting") {
      navigate({ to: "/waiting", replace: true });
    } else if (isPendingStandard && pathname !== "/onboarding") {
      navigate({ to: "/onboarding", replace: true });
    } else if (pathname === "/app") {
      if (isAdmin && !roles.includes("student")) {
        navigate({ to: "/admin", replace: true });
      } else if (isInstitution && !isAdmin && !roles.includes("student")) {
        navigate({ to: "/institution", replace: true });
      } else if (isMentor && !roles.includes("student")) {
        navigate({ to: "/mentor", replace: true });
      }
    }
  }, [roles, pathname, navigate, me]);


  const { data: totalUnreadCount } = useQuery({
    queryKey: ["direct_messages", "total_unread"],
    queryFn: async () => {
      if (!me) return 0;
      const { count, error } = await supabase
        .from("direct_messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", me.id)
        .is("read_at", null);
      if (error) return 0;
      return count ?? 0;
    },
    enabled: !!me,
    refetchInterval: 10000,
  });

  const studentNavWithBadge = studentNav.map(n => n.to === "/app/inbox" ? { ...n, badge: totalUnreadCount } : n);
  const mentorNavWithBadge = mentorNav.map(n => n.to === "/mentor/inbox" ? { ...n, badge: totalUnreadCount } : n);

  const sections = [
    { label: "Student", items: studentNavWithBadge, show: devActive || roles.length === 0 || roles.includes("student") },
    { label: "Mentor", items: mentorNavWithBadge, show: devActive || roles.includes("mentor") },
    { label: "Institution", items: institutionNav, show: devActive || roles.includes("institution") },
    { label: "Admin", items: adminNav, show: devActive || roles.includes("admin") },
  ].filter((s) => s.show);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/app" className="flex items-center px-1">
        <DockoLogo className="text-2xl" />
      </Link>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              {section.label}
            </p>
            <NavList items={section.items} onNavigate={() => setOpen(false)} />
          </div>
        ))}
      </div>

      {!pathname.startsWith("/admin") && (
        <div className="mt-auto px-2 pb-2">
          <Link
            to="/support"
            onClick={() => setOpen(false)}
            activeOptions={{ exact: true }}
            className="press flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:shadow-[var(--inset-top)]"
          >
            <LifeBuoy className="size-4" />
            Help & Support
          </Link>
        </div>
      )}
      <div className="raised flex items-center gap-3 rounded-2xl p-3">
        <Avatar className="size-9">
          {me?.avatarUrl ? <AvatarImage src={me.avatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-primary-soft text-primary">
            {initials(me?.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{me?.fullName ?? "Loading…"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {roles.includes("admin") ? "System Admin" : roles.includes("institution") ? "Institution" : roles.includes("mentor") ? "Mentor" : roles.includes("student") ? "Student" : roles[0] ? roles[0][0]?.toUpperCase() + roles[0].slice(1) : "Student"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          className="press rounded-xl"
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/25"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <aside className="rise absolute inset-y-0 left-0 w-72 bg-sidebar shadow-[var(--raise-2)]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 rounded-xl"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
          {/* Mobile header — avatar + greeting + action */}
          <div className="flex items-center gap-3 px-4 py-3 sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="press rounded-2xl shrink-0"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
            <div className="flex flex-1 items-center gap-2.5 min-w-0">
              <Avatar className="size-8 shrink-0 ring-2 ring-primary/20">
                {me?.avatarUrl ? <AvatarImage src={me.avatarUrl} alt="" /> : null}
                <AvatarFallback className="bg-primary-soft text-[11px] font-bold text-primary">
                  {initials(me?.fullName)}
                </AvatarFallback>
              </Avatar>
              <h1 className="truncate text-base font-bold tracking-tight text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {actions}
              <ThemeToggle />
            </div>
          </div>

          {/* Desktop/tablet header — standard title + subtitle */}
          <div className="mx-auto hidden max-w-6xl items-center gap-3 px-4 sm:flex sm:py-3 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="press rounded-2xl lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {actions}
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
