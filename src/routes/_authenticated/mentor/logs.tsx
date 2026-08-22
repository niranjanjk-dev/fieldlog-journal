import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen, Search, Filter } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { EmptyState, SkeletonTile } from "@/components/docko/bento";
import { EntryCard } from "@/components/docko/entry-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { photoUrlsQuery, reviewQueueQuery, teamsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/mentor/logs")({
  head: () => ({
    meta: [
      { title: "Student Logs · docko." },
      { name: "description", content: "View all student logs across your teams." },
    ],
  }),
  component: MentorLogsPage,
});

function MentorLogsPage() {
  const { data: queue, isLoading: loadingQueue } = useQuery(reviewQueueQuery);
  const { data: teams, isLoading: loadingTeams } = useQuery(teamsQuery);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");

  const allLogs = queue ?? [];
  const myTeams = teams ?? [];

  // Get all unique students from the logs for the filter
  const studentsMap = new Map();
  allLogs.forEach(log => {
    if (log.student && !studentsMap.has(log.student_id)) {
      studentsMap.set(log.student_id, { id: log.student_id, ...log.student });
    }
  });
  const students = Array.from(studentsMap.values());

  const filteredLogs = allLogs.filter(log => {
    // Team filter
    if (selectedTeamId !== "all") {
      // Find if this student is in the selected team
      const team = myTeams.find(t => t.id === selectedTeamId);
      if (!team) return false;
      const isStudentInTeam = (team.team_members as any[])?.some(m => m.student_id === log.student_id);
      if (!isStudentInTeam) return false;
    }
    
    // Student filter
    if (selectedStudentId !== "all" && log.student_id !== selectedStudentId) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = log.title?.toLowerCase().includes(query);
      const studentMatch = log.student?.full_name?.toLowerCase().includes(query);
      if (!titleMatch && !studentMatch) return false;
    }

    return true;
  });

  const { data: photos } = useQuery(
    photoUrlsQuery(
      filteredLogs.slice(0, 30).map((entry) => entry.photo_path).filter((p): p is string => Boolean(p)),
    ),
  );

  return (
    <AppShell title="Student Logs" subtitle="View and search all logs from your mentees">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search logs or students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-2xl"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger className="w-[140px] rounded-2xl h-10">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="rounded-xl">All Teams</SelectItem>
                {myTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id} className="rounded-xl">
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-[140px] rounded-2xl h-10">
                <SelectValue placeholder="All Students" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="rounded-xl">All Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id} className="rounded-xl">
                    {student.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loadingQueue || loadingTeams ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonTile className="h-64" />
          <SkeletonTile className="h-64" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-5" />}
          title="No logs found"
          body="Try adjusting your filters or search query."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredLogs.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              author={entry.student}
              photoUrl={entry.photo_path ? photos?.[entry.photo_path] : undefined}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
