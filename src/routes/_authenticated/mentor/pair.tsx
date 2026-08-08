import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  HardHat,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid, StatTile } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { formatDay, sumHours } from "@/lib/docko";
import { meQuery, reviewQueueQuery } from "@/lib/queries";

interface PairSearchParams {
  studentId?: string;
  token?: string;
}

export const Route = createFileRoute("/_authenticated/mentor/pair")({
  validateSearch: (search: Record<string, unknown>): PairSearchParams => ({
    studentId: typeof search.studentId === "string" ? search.studentId : undefined,
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pair with Student · Mentor Portal · Docko" },
      { name: "description", content: "Link with student to become their authorized fieldwork log approver." },
    ],
  }),
  component: MentorPairPage,
});

function MentorPairPage() {
  const { studentId, token } = Route.useSearch();
  const navigate = useNavigate();
  const { data: me } = useQuery(meQuery);
  const { data: queue } = useQuery(reviewQueueQuery);
  const [linking, setLinking] = useState(false);
  const [paired, setPaired] = useState(false);

  // Student mock / live details
  const studentLogs = (queue ?? []).filter((q) => !studentId || q.student_id === studentId);
  const studentName = studentLogs[0]?.student?.full_name || "Fieldwork Student";
  const institution = me?.institution || "Metropolitan Engineering Institute";

  async function handleConfirmPairing() {
    setLinking(true);
    setTimeout(() => {
      setLinking(false);
      setPaired(true);
      toast.success(`Successfully linked as ${studentName}'s supervisor & approver!`);
    }, 600);
  }

  return (
    <AppShell
      title="Mentor Link & Authorization"
      subtitle="Pair with student to audit and sign off their fieldwork logs"
    >
      <div className="max-w-2xl mx-auto space-y-6 pt-4">
        <BentoCard className="p-6 sm:p-8 space-y-6 text-center">
          {/* Header Icon */}
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <UserCheck className="size-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Scanned QR Pairing Token Valid
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {paired ? "Pairing Confirmed!" : `Pair with ${studentName}`}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {paired
                ? `You are now the authorized field mentor for ${studentName}. Their logs and milestone submissions will route directly to your approval queue.`
                : `You are authorizing a direct supervisor link for ${studentName} (${institution}). You will be able to review GPS locations, photo evidence, and sign off credit hours.`}
            </p>
          </div>

          {/* Student Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <span className="text-[11px] text-muted-foreground font-medium">Pending Review</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{studentLogs.length || 3} Logs</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
              <span className="text-[11px] text-muted-foreground font-medium">Fieldwork Program</span>
              <p className="text-xs font-bold text-foreground mt-1 truncate">Civil & Environmental</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-muted/40 border border-border">
              <span className="text-[11px] text-muted-foreground font-medium">Pairing Token</span>
              <p className="text-xs font-mono font-bold text-primary mt-1 truncate">
                {token ? token.substring(0, 8) : "VALID-ACTIVE"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!paired ? (
              <>
                <Button
                  onClick={handleConfirmPairing}
                  disabled={linking}
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <ShieldCheck className="size-4" />
                  <span>{linking ? "Authorizing Link..." : "Confirm & Link as Approver"}</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/mentor">Decline / Cancel</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className="press rounded-2xl px-6 text-xs h-10 font-bold gap-2 w-full sm:w-auto"
                >
                  <Link to="/mentor/verify">
                    <span>Review Pending Logs ({studentLogs.length})</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="press rounded-2xl px-5 text-xs h-10 font-semibold w-full sm:w-auto"
                >
                  <Link to="/mentor">Mentor Dashboard</Link>
                </Button>
              </>
            )}
          </div>
        </BentoCard>
      </div>
    </AppShell>
  );
}
