import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  HardHat,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { meQuery } from "@/lib/queries";

interface TeamJoinSearchParams {
  studentId?: string;
  token?: string;
  code?: string;
}

export const Route = createFileRoute("/_authenticated/teams/join")({
  validateSearch: (search: Record<string, unknown>): TeamJoinSearchParams => ({
    studentId: typeof search.studentId === "string" ? search.studentId : undefined,
    token: typeof search.token === "string" ? search.token : undefined,
    code: typeof search.code === "string" ? search.code : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Enroll in Field Squad · Docko" },
      { name: "description", content: "Join field squad, project team, or lab cohort." },
    ],
  }),
  component: TeamJoinPage,
});

function TeamJoinPage() {
  const { studentId, token, code } = Route.useSearch();
  const navigate = useNavigate();
  const { data: me } = useQuery(meQuery);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const teamCode = code || "GEO-8942";
  const teamName = "Squad Alpha · Geotechnical Survey";
  const workspace = "North Campus Metro Lab Zone";

  async function handleConfirmJoin() {
    setJoining(true);
    setTimeout(() => {
      setJoining(false);
      setJoined(true);
      toast.success(`Enrolled into ${teamName}!`);
    }, 600);
  }

  return (
    <AppShell
      title="Field Squad Enrollment"
      subtitle="Join project cohorts, research squads, and shared geofenced workspaces"
    >
      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        <BentoCard className="p-6 sm:p-8 space-y-6 text-center">
          {/* Header Icon */}
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <Users className="size-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {teamCode}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {joined ? "Enrollment Complete!" : `Join ${teamName}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {joined
                ? "You are now an active member of this fieldwork squad. You can now log hours within the shared authorized workspace."
                : `You've been invited to join ${teamName}. You will share real-time fieldwork radar, geofenced lab zones, and cohort milestones.`}
            </p>
          </div>

          {/* Squad Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                <MapPin className="size-4.5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Authorized Zone</span>
                <p className="text-xs font-bold text-foreground mt-0.5">{workspace}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                <HardHat className="size-4.5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Squad Lead</span>
                <p className="text-xs font-bold text-foreground mt-0.5">Prof. H. Williams</p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!joined ? (
              <>
                <Button
                  onClick={handleConfirmJoin}
                  disabled={joining}
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <ShieldCheck className="size-4" />
                  <span>{joining ? "Enrolling..." : "Confirm & Join Squad"}</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/app/portfolio">Cancel</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <Link to="/app/portfolio">
                    <span>Go to Portfolio</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/app">Dashboard</Link>
                </Button>
              </>
            )}
          </div>
        </BentoCard>
      </div>
    </AppShell>
  );
}
