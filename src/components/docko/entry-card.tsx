import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, ImageOff, MapPin, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BentoCard, StatusChip } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addComment } from "@/lib/entries";
import { formatDay, formatTime, initials, type Entry } from "@/lib/docko";
import { commentsQuery } from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function EntryCard({
  entry,
  photoUrl,
  author,
  footer,
  className,
}: {
  entry: Entry;
  photoUrl?: string | undefined;
  author?: { full_name: string; course?: string | null } | null | undefined;
  footer?: React.ReactNode | undefined;
  className?: string | undefined;
}) {
  const [showComments, setShowComments] = useState(false);

  return (
    <BentoCard as="article" className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {author ? (
            <div className="mb-2 flex items-center gap-2">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary-soft text-[11px] text-primary">
                  {initials(author.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium">{author.full_name}</span>
              {author.course ? (
                <span className="truncate text-xs text-muted-foreground">{author.course}</span>
              ) : null}
            </div>
          ) : null}
          <h3 className="truncate font-semibold">{entry.title}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDay(entry.captured_at)} · {formatTime(entry.captured_at)}
          </p>
        </div>
        <StatusChip status={entry.status} />
      </div>

      <div className="sunken overflow-hidden rounded-2xl">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo for ${entry.title}`}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="grid h-28 place-items-center text-muted-foreground">
            <ImageOff className="size-5" />
          </div>
        )}
      </div>

      {entry.note ? <p className="text-sm text-muted-foreground">{entry.note}</p> : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" /> {Number(entry.hours)} h
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {entry.address ??
              (entry.latitude != null && entry.longitude != null
                ? `${entry.latitude.toFixed(4)}, ${entry.longitude.toFixed(4)}`
                : "No location")}
          </span>
        </span>
      </div>

      {entry.review_note ? (
        <p className="rounded-2xl bg-warning-soft px-3 py-2 text-xs text-warning-foreground">
          Mentor note: {entry.review_note}
        </p>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="press rounded-xl"
          onClick={() => setShowComments((v) => !v)}
        >
          <MessageSquare className="size-4" />
          Discussion
        </Button>
        <div className="flex-1" />
        {footer}
      </div>

      {showComments ? <Comments entryId={entry.id} /> : null}
    </BentoCard>
  );
}

function Comments({ entryId }: { entryId: string }) {
  const queryClient = useQueryClient();
  const { data: comments, isLoading } = useQuery(commentsQuery(entryId));
  const [body, setBody] = useState("");

  const post = useMutation({
    mutationFn: () => addComment(entryId, body.trim()),
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["comments", entryId] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="border-t border-border pt-3">
      {isLoading ? (
        <p className="text-xs text-muted-foreground">Loading discussion…</p>
      ) : comments && comments.length > 0 ? (
        <ul className="space-y-2.5">
          {comments.map((comment) => {
            const author = comment.author as { full_name?: string } | null;
            return (
              <li key={comment.id} className="flex gap-2.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-muted text-[11px]">
                    {initials(author?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-medium">{author?.full_name ?? "Member"}</p>
                  <p className="text-sm text-muted-foreground">{comment.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No messages yet.</p>
      )}

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (body.trim()) post.mutate();
        }}
      >
        <Input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add a note or question…"
          className="rounded-2xl"
        />
        <Button
          type="submit"
          size="icon"
          disabled={post.isPending || !body.trim()}
          className="press rounded-2xl"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
