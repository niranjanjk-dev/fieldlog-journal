import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Globe,
  HardHat,
  Layers,
  Lock,
  Mail,
  MapPin,
  Plus,
  Printer,
  QrCode,
  Radio,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/docko/app-shell";
import {
  BentoCard,
  BentoGrid,
  EmptyState,
  ProgressRing,
  SectionTitle,
  StatTile,
} from "@/components/docko/bento";
import { QrCodeCard } from "@/components/docko/qr-code-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDay, formatTime, sumHours } from "@/lib/docko";
import { meQuery, myEntriesQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio · Docko" },
      {
        name: "description",
        content: "An audit-ready summary of your verified fieldwork hours, credentials, and supervisor pairings.",
      },
      { property: "og:title", content: "Portfolio · Docko" },
      { property: "og:description", content: "Audit-ready summary of your verified fieldwork." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});

interface MentorRelationship {
  id: string;
  name: string;
  role: string;
  email: string;
  institution: string;
  status: "active" | "pending";
  avgTurnaroundHours: number;
  approvedCount: number;
  avatarLetter: string;
}

interface TeamAffiliation {
  id: string;
  code: string;
  name: string;
  lead: string;
  membersCount: number;
  geofenceRadius: number;
  workspaceName: string;
}

export default function PortfolioPage() {
  const { data: me } = useQuery(meQuery);
  const { data: entries } = useQuery(myEntriesQuery);

  const mine = (entries ?? []).filter((entry) => entry.student_id === me?.id);
  const verified = mine.filter((entry) => entry.status === "verified");
  const pending = mine.filter((entry) => entry.status === "pending");

  const studentId = me?.id || "student-preview-id";
  const studentName = me?.full_name || "Fieldwork Student";
  const studentInstitution = me?.institution || "Metropolitan Engineering Institute";

  // 1. Mentor Approvers State
  const [mentors, setMentors] = useState<MentorRelationship[]>([
    {
      id: "m-1",
      name: "Dr. Sarah Jenkins",
      role: "Primary Faculty Approver",
      email: "s.jenkins@metrouniversity.edu",
      institution: "Civil & Environmental Dept.",
      status: "active",
      avgTurnaroundHours: 3.8,
      approvedCount: verified.length || 14,
      avatarLetter: "S",
    },
    {
      id: "m-2",
      name: "Eng. Marcus Vance",
      role: "On-Site Field Supervisor",
      email: "m.vance@apexengineering.com",
      institution: "Apex Infrastructure Group",
      status: "active",
      avgTurnaroundHours: 6.2,
      approvedCount: 8,
      avatarLetter: "M",
    },
  ]);

  const [inviteMentorOpen, setInviteMentorOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Faculty Reviewer");

  // 2. Team Affiliations State
  const [teams, setTeams] = useState<TeamAffiliation[]>([
    {
      id: "t-1",
      code: "GEO-8942",
      name: "Squad Alpha · Geotechnical Survey",
      lead: "Prof. H. Williams",
      membersCount: 6,
      geofenceRadius: 100,
      workspaceName: "North Campus Metro Lab",
    },
    {
      id: "t-2",
      code: "ENV-4011",
      name: "Water Quality & Environmental Monitoring",
      lead: "Dr. L. Chen",
      membersCount: 4,
      geofenceRadius: 150,
      workspaceName: "East River Basin Station 4",
    },
  ]);

  const [joinTeamOpen, setJoinTeamOpen] = useState(false);
  const [teamCodeInput, setTeamCodeInput] = useState("");

  // 3. Public Portfolio Privacy Controls State
  const [privacyBlurGps, setPrivacyBlurGps] = useState(true);
  const [privacyShowPhotos, setPrivacyShowPhotos] = useState(true);
  const [privacyShowSignatures, setPrivacyShowSignatures] = useState(true);

  // 4. Skills & Competencies Breakdown
  const totalVerifiedHours = Number(sumHours(verified)) || 0;
  const targetRequirementHours = 120;
  const targetProgressPercent = Math.min(100, Math.round((totalVerifiedHours / targetRequirementHours) * 100));

  const skillBreakdown = [
    { name: "Geotechnical & Site Surveying", hours: Math.min(totalVerifiedHours, 32.5), color: "bg-emerald-500" },
    { name: "Environmental & Soil Sampling", hours: Math.min(totalVerifiedHours, 24.0), color: "bg-blue-500" },
    { name: "Field Safety & Hazard Audit", hours: Math.min(totalVerifiedHours, 18.5), color: "bg-amber-500" },
    { name: "GPS Coordinate Mapping & CAD", hours: Math.min(totalVerifiedHours, 14.0), color: "bg-purple-500" },
    { name: "Technical Log Reporting", hours: Math.min(totalVerifiedHours, 11.0), color: "bg-pink-500" },
  ];

  // Export handlers
  function exportCsv() {
    const rows = [
      ["Date", "Title", "Hours", "Status", "Latitude", "Longitude", "Location", "Notes"],
      ...mine.map((entry) => [
        new Date(entry.captured_at).toISOString(),
        entry.title,
        String(Number(entry.hours)),
        entry.status,
        entry.latitude ? String(entry.latitude) : "",
        entry.longitude ? String(entry.longitude) : "",
        entry.address ?? "",
        (entry.note ?? "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `docko-portfolio-${studentName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV audit report exported successfully.");
  }

  function exportGeoJson() {
    const featureCollection = {
      type: "FeatureCollection",
      features: mine
        .filter((e) => e.latitude && e.longitude)
        .map((entry) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(entry.longitude), Number(entry.latitude)],
          },
          properties: {
            id: entry.id,
            title: entry.title,
            hours: Number(entry.hours),
            status: entry.status,
            captured_at: entry.captured_at,
            address: entry.address,
            note: entry.note,
            student_id: entry.student_id,
            verified: entry.status === "verified",
          },
        })),
    };

    const jsonStr = JSON.stringify(featureCollection, null, 2);
    const url = URL.createObjectURL(new Blob([jsonStr], { type: "application/geo+json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `docko-fieldwork-geodata-${studentName.toLowerCase().replace(/\s+/g, "-")}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("GeoJSON fieldwork dataset exported.");
  }

  function handleInviteMentorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMentor: MentorRelationship = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split("@")[0].replace(".", " "),
      role: inviteRole,
      email: inviteEmail,
      institution: "Invited Supervisor",
      status: "pending",
      avgTurnaroundHours: 0,
      approvedCount: 0,
      avatarLetter: inviteEmail.charAt(0).toUpperCase(),
    };

    setMentors((prev) => [...prev, newMentor]);
    setInviteEmail("");
    setInviteMentorOpen(false);
    toast.success(`Mentor invitation sent to ${inviteEmail}`);
  }

  function handleJoinTeamSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teamCodeInput.trim()) return;

    const newTeam: TeamAffiliation = {
      id: `t-${Date.now()}`,
      code: teamCodeInput.toUpperCase().trim(),
      name: `Cohort ${teamCodeInput.toUpperCase().trim()}`,
      lead: "Assigned Coordinator",
      membersCount: 8,
      geofenceRadius: 100,
      workspaceName: "Authorized Project Site",
    };

    setTeams((prev) => [...prev, newTeam]);
    setTeamCodeInput("");
    setJoinTeamOpen(false);
    toast.success(`Successfully enrolled into team [${newTeam.code}]`);
  }

  function handleRevokeMentor(id: string, name: string) {
    setMentors((prev) => prev.filter((m) => m.id !== id));
    toast.success(`Removed ${name} from designated approvers.`);
  }

  const publicUrl = `https://docko.app/p/@${studentName.toLowerCase().replace(/\s+/g, "")}`;

  return (
    <AppShell
      title="Portfolio & Credential Hub"
      subtitle={studentInstitution}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCsv} className="press rounded-2xl h-9 px-3 text-xs font-semibold">
            <FileSpreadsheet className="size-4" />
            <span className="hidden sm:inline">CSV Export</span>
          </Button>

          <Button variant="outline" onClick={exportGeoJson} className="press rounded-2xl h-9 px-3 text-xs font-semibold">
            <FileCode2 className="size-4" />
            <span className="hidden sm:inline">GeoJSON</span>
          </Button>

          <Button onClick={() => window.print()} className="press rounded-2xl h-9 px-3.5 text-xs font-semibold">
            <Printer className="size-4" />
            <span className="hidden sm:inline">Audit PDF</span>
          </Button>
        </div>
      }
    >
      {/* 1. Header Metrics Grid */}
      <BentoGrid>
        <StatTile
          className="lg:col-span-2"
          label="Verified hours"
          value={sumHours(verified)}
          unit="h"
          hint={`${targetRequirementHours}h Institutional target`}
          icon={<BadgeCheck className="size-4.5" />}
        />
        <StatTile
          className="lg:col-span-2"
          label="Verified logs"
          value={verified.length}
          hint={`${pending.length} pending review`}
          icon={<CheckCircle2 className="size-4.5" />}
        />
        <BentoCard className="flex items-center justify-center lg:col-span-2">
          <ProgressRing
            value={mine.length ? (verified.length / mine.length) * 100 : 0}
            sublabel="verified"
          />
        </BentoCard>
      </BentoGrid>

      {/* 2. Dynamic Student ID & Scannable QR Hub */}
      <div className="mt-8">
        <SectionTitle
          title="Student Digital ID & Scannable QR Hub"
          hint="Allow mentors to pair directly via camera or team leads to enroll you in field squads."
        />
        <QrCodeCard studentId={studentId} studentName={studentName} institution={studentInstitution} />
      </div>

      {/* 3. Mentor & Approver Relationships */}
      <div className="mt-8">
        <SectionTitle
          title="Mentor & Approver Relationships"
          hint="Faculty and supervisors authorized to audit, stamp, and sign off your fieldwork logs."
          action={
            <Dialog open={inviteMentorOpen} onOpenChange={setInviteMentorOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold">
                  <UserPlus className="size-3.5" />
                  <span>Invite Mentor</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">Invite Fieldwork Mentor</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Send an approval authorization link to a faculty member or on-site supervisor.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteMentorSubmit} className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">Supervisor Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="supervisor@institution.edu"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-semibold">Approval Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g. On-Site Project Engineer"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="submit" className="press rounded-2xl text-xs h-8 px-4 font-semibold w-full sm:w-auto">
                      Send Approval Invite
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-2xl bg-primary text-primary-foreground font-bold text-sm grid place-items-center shrink-0 shadow-sm">
                      {mentor.avatarLetter}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-tight">{mentor.name}</h4>
                      <p className="text-xs font-medium text-primary mt-0.5">{mentor.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      mentor.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {mentor.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {mentor.email}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">{mentor.institution}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[11px]">Approved</span>
                    <p className="font-bold text-foreground">{mentor.approvedCount} logs</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px]">Avg. Response</span>
                    <p className="font-bold text-foreground">{mentor.avgTurnaroundHours}h</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRevokeMentor(mentor.id, mentor.name)}
                  className="press rounded-xl text-xs h-7 px-2 text-destructive hover:bg-destructive/10 font-semibold"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Team & Cohort Affiliations */}
      <div className="mt-8">
        <SectionTitle
          title="Team & Cohort Affiliations"
          hint="Field research squads and project cohorts you are currently enrolled in."
          action={
            <Dialog open={joinTeamOpen} onOpenChange={setJoinTeamOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold">
                  <Plus className="size-3.5" />
                  <span>Join Team via Code</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold">Join Field Squad or Cohort</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Enter the 8-character invite code provided by your course instructor or team lead.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleJoinTeamSubmit} className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="team-code" className="text-xs font-semibold">Team Invite Code</Label>
                    <Input
                      id="team-code"
                      required
                      placeholder="e.g. GEO-8942"
                      value={teamCodeInput}
                      onChange={(e) => setTeamCodeInput(e.target.value)}
                      className="rounded-xl text-xs uppercase font-mono tracking-wider h-9"
                    />
                  </div>
                  <DialogFooter className="pt-2">
                    <Button type="submit" className="press rounded-2xl text-xs h-8 px-4 font-semibold w-full sm:w-auto">
                      Join Cohort
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                      {team.code}
                    </span>
                    <h4 className="text-sm font-bold text-foreground mt-1.5 leading-tight">{team.name}</h4>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold bg-muted/60 px-2.5 py-1 rounded-full">
                    <Users className="size-3" />
                    {team.membersCount} Members
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      {team.workspaceName}
                    </span>
                    <span className="text-[11px] font-semibold text-foreground">
                      {team.geofenceRadius}m Geofence
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <HardHat className="size-3.5" />
                    <span>Lead: {team.lead}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Skills & Competency Breakdown */}
      <div className="mt-8">
        <SectionTitle
          title="Skills & Competency Breakdown"
          hint={`Accreditation progress: ${totalVerifiedHours} / ${targetRequirementHours} Hours Completed (${targetProgressPercent}%)`}
        />
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          {/* Main Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-foreground">Degree Fieldwork Requirement</span>
              <span className="font-semibold text-primary">{targetProgressPercent}% Fulfilled</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border/80">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${targetProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Itemized Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {skillBreakdown.map((skill) => (
              <div key={skill.name} className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground truncate">{skill.name}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">{skill.hours.toFixed(1)}h</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${skill.color}`}
                    style={{ width: `${Math.min(100, (skill.hours / 35) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Public Verifiable Portfolio & Privacy Controls */}
      <div className="mt-8">
        <SectionTitle
          title="Public Verifiable Portfolio Link"
          hint="Share your tamper-proof fieldwork profile with prospective employers and accrediting boards."
        />
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shrink-0 shadow-sm">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">Cryptographically Signed Portfolio</h4>
                  <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                    GPS-Verified
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">{publicUrl}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("Public portfolio URL copied to clipboard!");
                }}
                className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none"
              >
                <Copy className="size-3.5" />
                <span>Copy Link</span>
              </Button>
              <Button
                size="sm"
                onClick={() => window.open(publicUrl, "_blank")}
                className="press rounded-2xl text-xs h-8 px-3 gap-1.5 font-semibold flex-1 sm:flex-none"
              >
                <ExternalLink className="size-3.5" />
                <span>Preview</span>
              </Button>
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="pt-2 border-t border-border/60">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Public Display Privacy Controls
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <div className="space-y-0.5 pr-2">
                  <Label htmlFor="blur-gps" className="text-xs font-semibold">Blur Exact Coordinates</Label>
                  <p className="text-[10px] text-muted-foreground">Show generalized zone name only</p>
                </div>
                <Switch
                  id="blur-gps"
                  checked={privacyBlurGps}
                  onCheckedChange={setPrivacyBlurGps}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <div className="space-y-0.5 pr-2">
                  <Label htmlFor="show-photos" className="text-xs font-semibold">Public Evidence Photos</Label>
                  <p className="text-[10px] text-muted-foreground">Display photo thumbnails</p>
                </div>
                <Switch
                  id="show-photos"
                  checked={privacyShowPhotos}
                  onCheckedChange={setPrivacyShowPhotos}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border">
                <div className="space-y-0.5 pr-2">
                  <Label htmlFor="show-signatures" className="text-xs font-semibold">Mentor Signature Stamps</Label>
                  <p className="text-[10px] text-muted-foreground">Display verification badges</p>
                </div>
                <Switch
                  id="show-signatures"
                  checked={privacyShowSignatures}
                  onCheckedChange={setPrivacyShowSignatures}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Itemized Verified Fieldwork Dossier Log */}
      <div className="mt-8">
        <SectionTitle
          title="Verified Fieldwork Record"
          hint="Formal audit register with mentor approvals and timestamps."
        />
        {verified.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-5" />}
            title="No verified logs yet"
            body="Once your mentor signs off a log, it appears in your portfolio and hour totals."
          />
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <ul className="divide-y divide-border">
              {verified.map((entry) => (
                <li key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      <BadgeCheck className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{entry.title}</h4>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
                        <span>{formatDay(entry.captured_at)} · {formatTime(entry.captured_at)}</span>
                        {entry.address ? <span>· {entry.address}</span> : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {Number(entry.hours)} Hours
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      Signed Off
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>
  );
}
