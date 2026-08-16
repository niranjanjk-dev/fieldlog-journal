import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  HardHat,
  Loader2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { meQuery } from "@/lib/queries";

interface TeamJoinSearchParams {
  teamId?: string;
  token?: string;
  code?: string;
}

export const Route = createFileRoute("/_authenticated/teams/join")({
  validateSearch: (search: Record<string, unknown>): TeamJoinSearchParams => {
    const params: TeamJoinSearchParams = {};
    if (typeof search["teamId"] === "string") params.teamId = search["teamId"];
    if (typeof search["token"] === "string") params.token = search["token"];
    if (typeof search["code"] === "string") params.code = search["code"];
    return params;
  },
  head: () => ({
    meta: [
      { title: "Join Team · Docko" },
      { name: "description", content: "Join a fieldwork team and start logging hours." },
    ],
  }),
  component: TeamJoinPage,
});

function TeamJoinPage() {
  const { teamId } = Route.useSearch();
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const [joined, setJoined] = useState(false);

  // Fetch the real team data
  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ["team_detail", teamId],
    enabled: !!teamId,
    queryFn: async () => {
      if (!teamId) return null;
      const { data, error } = await supabase
        .from("teams")
        .select("*, mentor:profiles!teams_mentor_profile_fkey(full_name, institution)")
        .eq("id", teamId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const joinTeam = useMutation({
    mutationFn: async () => {
      if (!teamId) throw new Error("No team ID provided.");
      if (!me?.id) throw new Error("You must be signed in to join a team.");

      const { error } = await supabase
        .from("team_members")
        .insert({ team_id: teamId, student_id: me.id });

      if (error && !error.message.includes("duplicate")) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", "mine"] });
      setJoined(true);
      toast.success(`You have joined ${team?.name ?? "the team"}!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!teamId) {
    return (
      <AppShell title="Join Team" subtitle="No team ID provided">
        <BentoCard className="p-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            This page requires a team invite link with a valid team ID. Ask your mentor to share the invite link from their Teams page.
          </p>
          <Button asChild variant="outline" className="press rounded-2xl">
            <Link to="/app">Go to Dashboard</Link>
          </Button>
        </BentoCard>
      </AppShell>
    );
  }

  const mentorName = (team?.mentor as any)?.full_name ?? "Your Mentor";

  return (
    <AppShell
      title="Team Enrollment"
      subtitle="Join a fieldwork team and start logging hours"
    >
      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        <BentoCard className="p-6 sm:p-8 space-y-6 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <Users className="size-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {joined
                ? "Enrollment Complete!"
                : loadingTeam
                ? "Loading team…"
                : `Join ${team?.name ?? "Team"}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {joined
                ? `You are now a member of ${team?.name ?? "this team"}. Your mentor can now review and sign off your fieldwork logs.`
                : `You have been invited to join ${team?.name ?? "a fieldwork team"}. Once enrolled, your mentor will be able to review and verify your field logs.`}
            </p>
          </div>

          {/* Team details */}
          {team && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <HardHat className="size-4" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Mentor</span>
                  <p className="text-xs font-bold text-foreground mt-0.5">{mentorName}</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Team</span>
                  <p className="text-xs font-bold text-foreground mt-0.5">{team.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!joined ? (
              <>
                <Button
                  onClick={() => joinTeam.mutate()}
                  disabled={joinTeam.isPending || loadingTeam || !team}
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  {joinTeam.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  <span>{joinTeam.isPending ? "Enrolling…" : "Confirm & Join Team"}</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/app">Cancel</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <Link to="/app/log">
                    <span>Log Field Hours</span>
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
