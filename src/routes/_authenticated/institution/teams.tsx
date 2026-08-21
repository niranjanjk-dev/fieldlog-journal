import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users, ArrowUpRight } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, EmptyState, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { meQuery, institutionTeamsQuery, institutionEntriesQuery } from "@/lib/queries";
import { sumHours, initials } from "@/lib/docko";

export const Route = createFileRoute("/_authenticated/institution/teams")({
  head: () => ({
    meta: [
      { title: "Teams · Institution · Docko" },
      { name: "description", content: "Every placement team across your institution and its members." },
      { property: "og:title", content: "Teams · Institution · Docko" },
      { property: "og:description", content: "Every placement team across your institution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionTeamsPage,
});

function InstitutionTeamsPage() {
  const { data: me } = useQuery(meQuery);
  const { data: teams } = useQuery(institutionTeamsQuery(me?.institutionId ?? null));
  const { data: entries } = useQuery(institutionEntriesQuery(me?.institutionId ?? null));
  
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  return (
    <AppShell title="Teams" subtitle={`${teams?.length ?? 0} teams at your institution`}>
      {!teams || teams.length === 0 ? (
        <EmptyState
          icon={<Users className="size-5" />}
          title="No teams yet"
          body="Verified mentors from your institution create teams and add their students."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => {
            const members = team.team_members ?? [];
            const teamEntries = entries?.filter((e) => e.team_id === team.id) ?? [];
            const logsCount = teamEntries.length;
            const hoursCount = sumHours(teamEntries);
            const mentorName = (team.mentor as any)?.full_name ?? "Unknown Mentor";

            return (
              <BentoCard key={team.id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Mentor: {mentorName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                    className="press rounded-xl text-xs h-8 text-primary hover:text-primary hover:bg-primary-soft gap-1"
                  >
                    Peek <ArrowUpRight className="size-3.5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-muted/40 p-3 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Students</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{members.length}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Logs</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{logsCount}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Hours</p>
                    <p className="text-lg font-bold text-foreground tabular-nums">{hoursCount}</p>
                  </div>
                </div>
              </BentoCard>
            );
          })}
        </div>
      )}

      {/* PEEK MODAL */}
      <Dialog open={!!selectedTeam} onOpenChange={(open) => !open && setSelectedTeam(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader className="text-left pb-2 border-b border-border/40">
            <DialogTitle className="text-lg font-bold text-foreground">{selectedTeam?.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Mentor: {(selectedTeam?.mentor as any)?.full_name ?? "Unknown Mentor"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <div className="flex items-center justify-between mb-1">
               <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Team Members</h4>
               <span className="text-xs font-semibold bg-muted/60 px-2 py-0.5 rounded-full">
                  {selectedTeam?.team_members?.length ?? 0}
               </span>
            </div>
            
            <div className="space-y-2">
              {selectedTeam?.team_members?.map((m: any) => {
                const studentEntries = entries?.filter((e) => e.student_id === m.student_id && e.team_id === selectedTeam.id) ?? [];
                const sLogs = studentEntries.length;
                const sHours = sumHours(studentEntries);
                const sName = m.profile?.full_name ?? "Unknown Student";
                
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={m.profile?.avatar_url ?? undefined} />
                        <AvatarFallback className="bg-primary-soft text-xs text-primary font-semibold">
                          {initials(sName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{sName}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right ml-3">
                       <p className="text-[11px] font-bold text-foreground tabular-nums">{sHours}h</p>
                       <p className="text-[10px] text-muted-foreground">{sLogs} logs</p>
                    </div>
                  </div>
                );
              })}
              
              {(!selectedTeam?.team_members || selectedTeam.team_members.length === 0) && (
                <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-2xl border border-dashed border-border/60">
                  <Users className="size-5 text-muted-foreground/60 mb-2" />
                  <p className="text-xs text-muted-foreground font-medium">No students in this team yet.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
