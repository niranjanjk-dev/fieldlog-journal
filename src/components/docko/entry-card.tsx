import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Send,
  UserCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BentoCard, StatusChip } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addComment } from "@/lib/entries";
import { formatDay, formatTime, initials, type Entry } from "@/lib/docko";
import { commentsQuery } from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const FALLBACK_FIELD_PHOTOS = [
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
];

function getEntryPhoto(entry: Entry, photoUrl?: string): string {
  if (photoUrl) return photoUrl;
  let hash = 0;
  const str = entry.id || entry.title || "field-entry";
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % FALLBACK_FIELD_PHOTOS.length;
  return FALLBACK_FIELD_PHOTOS[idx]!;
}

export function EntryCard({
  entry,
  photoUrl,
  author,
  footer,
  className,
  onDelete,
}: {
  entry: Entry;
  photoUrl?: string | undefined;
  author?: { full_name: string; course?: string | null } | null | undefined;
  footer?: React.ReactNode | undefined;
  className?: string | undefined;
  onDelete?: () => void;
}) {
  const [isPeekOpen, setIsPeekOpen] = useState(false);
  const displayPhoto = getEntryPhoto(entry, photoUrl);

  return (
    <>
      <BentoCard
        as="article"
        className={cn(
          "group/card flex flex-col justify-between h-full min-h-[380px] sm:min-h-[400px] gap-3.5 relative overflow-hidden",
          className,
        )}
      >
        <div className="flex flex-col gap-3 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              {author ? (
                <div className="mb-1.5 flex items-center gap-2">
                  <Avatar className="size-6 sm:size-7 shrink-0">
                    <AvatarFallback className="bg-primary-soft text-[10px] sm:text-[11px] text-primary">
                      {initials(author.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-xs sm:text-sm font-medium">{author.full_name}</span>
                  {author.course ? (
                    <span className="truncate text-xs text-muted-foreground">{author.course}</span>
                  ) : null}
                </div>
              ) : null}
              <h3 className="truncate font-semibold text-sm sm:text-base leading-snug">{entry.title}</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {formatDay(entry.captured_at)} · {formatTime(entry.captured_at)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <StatusChip status={entry.status} className="shrink-0" />
              {onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                     if (window.confirm("Are you sure you want to delete this log? This action cannot be undone.")) {
                         onDelete();
                     }
                  }}
                  className="press size-7 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete log"
                  aria-label="Delete log"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsPeekOpen(true)}
                className="press size-7 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors"
                title="Open full center peek"
                aria-label="Open full center peek"
              >
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Photo Preview Box (Always present across all cards) */}
          <div
            className="sunken overflow-hidden rounded-2xl cursor-pointer group/img relative h-40 sm:h-44 w-full bg-muted/20"
            onClick={() => setIsPeekOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsPeekOpen(true);
              }
            }}
            aria-label="Expand image and entry details"
          >
            <img
              src={displayPhoto}
              alt={`Photo for ${entry.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
              <span className="rounded-full bg-background/90 backdrop-blur-md px-2.5 py-1 text-[11px] sm:text-xs font-semibold shadow-md flex items-center gap-1 text-foreground">
                <ArrowUpRight className="size-3 sm:size-3.5" />
                Peek
              </span>
            </div>
          </div>

          {/* Notes Area (Uniform line-clamped 2-line height) */}
          <div className="h-10 text-xs sm:text-sm text-muted-foreground overflow-hidden">
            {entry.note ? (
              <p className="line-clamp-2 leading-relaxed">{entry.note}</p>
            ) : (
              <p className="italic text-muted-foreground/40 text-xs leading-relaxed">No additional notes</p>
            )}
          </div>
        </div>

        {/* Card Footer (Anchored to bottom) */}
        <div className="mt-auto space-y-2.5 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Clock className="size-3.5 text-primary" /> {Number(entry.hours)} h
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground max-w-[60%]">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">
                {entry.address ??
                  (entry.latitude != null && entry.longitude != null
                    ? `${entry.latitude.toFixed(3)}, ${entry.longitude.toFixed(3)}`
                    : "No location")}
              </span>
            </span>
          </div>

          {/* Assigned Approving Mentors */}
          {entry.assigned_mentors && entry.assigned_mentors.length > 0 ? (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20 truncate">
              <UserCheck className="size-3 shrink-0" />
              <span className="truncate">Approvers: {entry.assigned_mentors.join(", ")}</span>
            </div>
          ) : null}

          {entry.review_note ? (
            <p className="rounded-xl bg-warning-soft px-2.5 py-1 text-[11px] text-warning-foreground truncate">
              Mentor: {entry.review_note}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="press rounded-xl text-xs h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setIsPeekOpen(true)}
            >
              <MessageSquare className="size-3.5" />
              Discussion
            </Button>
            {footer}
          </div>
        </div>
      </BentoCard>

      {/* ── Center Peek Modal (Clean & Responsive on Mobile) ────────────────────────── */}
      <Dialog open={isPeekOpen} onOpenChange={setIsPeekOpen}>
        <DialogContent className="w-[94vw] max-w-lg sm:max-w-xl max-h-[86vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-border/80 bg-card shadow-2xl space-y-3 sm:space-y-4">
          <DialogHeader className="text-left space-y-1.5 pr-6 sm:pr-8">
            <div className="flex items-center justify-between gap-2">
              {author ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 sm:size-7">
                    <AvatarFallback className="bg-primary-soft text-[10px] sm:text-xs text-primary font-semibold">
                      {initials(author.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-foreground block leading-tight truncate">
                      {author.full_name}
                    </span>
                    {author.course ? (
                      <span className="text-[11px] text-muted-foreground truncate block">{author.course}</span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                  Field Journal
                </span>
              )}
              <StatusChip status={entry.status} />
            </div>

            <DialogTitle className="text-base sm:text-xl font-bold text-foreground pt-0.5 leading-snug">
              {entry.title}
            </DialogTitle>
            <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground">
              {formatDay(entry.captured_at)} at {formatTime(entry.captured_at)}
            </DialogDescription>
          </DialogHeader>

          {/* Large Photo Preview */}
          <div className="sunken overflow-hidden rounded-xl sm:rounded-2xl max-h-[220px] sm:max-h-[340px] w-full bg-muted/20">
            <img
              src={displayPhoto}
              alt={`Full photo for ${entry.title}`}
              className="w-full h-full max-h-[220px] sm:max-h-[340px] object-cover"
            />
          </div>

          {/* Key Metric Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <div className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground">
              <Clock className="size-3 sm:size-3.5 text-primary" />
              <span>{Number(entry.hours)} hours logged</span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground max-w-full">
              <MapPin className="size-3 sm:size-3.5 text-primary shrink-0" />
              <span className="truncate">
                {entry.address ??
                  (entry.latitude != null && entry.longitude != null
                    ? `${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}`
                    : "No location attached")}
              </span>
            </div>

            {entry.assigned_mentors && entry.assigned_mentors.length > 0 ? (
              <div className="inline-flex items-center gap-1 rounded-lg sm:rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-primary">
                <UserCheck className="size-3 sm:size-3.5 shrink-0" />
                <span>Approvers: {entry.assigned_mentors.join(", ")}</span>
              </div>
            ) : null}
          </div>

          {/* Notes */}
          {entry.note ? (
            <div className="rounded-xl sm:rounded-2xl bg-muted/30 p-3 sm:p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed border border-border/50">
              <span className="font-semibold text-xs text-muted-foreground block mb-1 uppercase tracking-wider">
                Fieldwork Notes
              </span>
              {entry.note}
            </div>
          ) : null}

          {/* Mentor Feedback / Rejection Note */}
          {entry.review_note ? (
            <div className="rounded-xl sm:rounded-2xl bg-warning-soft/70 border border-warning/30 p-3 sm:p-4 text-xs sm:text-sm text-warning-foreground leading-relaxed">
              <span className="font-semibold text-xs block mb-1 uppercase tracking-wider">
                Mentor Sign-off Feedback
              </span>
              {entry.review_note}
            </div>
          ) : null}

          {/* Comments / Discussion Thread */}
          <PeekComments entryId={entry.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function PeekComments({ entryId }: { entryId: string }) {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery(commentsQuery(entryId));
  const [body, setBody] = useState("");

  const add = useMutation({
    mutationFn: async (text: string) => {
      return addComment(entryId, text);
    },
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
      toast.success("Comment added");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-3 pt-2 sm:pt-3 border-t border-border/50">
      <div className="flex items-center justify-between">
        <h4 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
          <MessageSquare className="size-3.5 sm:size-4 text-primary" />
          Field Discussion ({comments?.length ?? 0})
        </h4>
      </div>

      <div className="space-y-2 max-h-36 sm:max-h-44 overflow-y-auto pr-1">
        {isLoading ? (
          <p className="text-xs text-muted-foreground italic">Loading comments…</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="sunken rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-xs bg-muted/20 border border-border/40 space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {comment.author?.full_name ?? "Participant"}
                </span>
                <span>{formatTime(comment.created_at)}</span>
              </div>
              <p className="text-foreground/90 leading-relaxed text-xs">{comment.body}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground/70 italic py-1">
            No notes or feedback yet. Leave a comment below.
          </p>
        )}
      </div>

      {/* Add comment input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          add.mutate(body.trim());
        }}
        className="flex items-center gap-2 pt-1"
      >
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Leave a note or question…"
          className="text-xs rounded-xl h-8 sm:h-9"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!body.trim() || add.isPending}
          className="press rounded-xl h-8 sm:h-9 px-3 gap-1 shrink-0 font-semibold text-xs"
        >
          <Send className="size-3" />
          <span>Post</span>
        </Button>
      </form>
    </div>
  );
}
