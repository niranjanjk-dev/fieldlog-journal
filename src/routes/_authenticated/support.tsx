import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy, Loader2, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, SectionTitle } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({ meta: [{ title: "Help & Support · Docko" }] }),
  component: SupportPage,
});

function SupportPage() {
  const [type, setType] = useState<string>("other");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.user.id,
        type: type as any,
        subject,
        description
      });
      if (error) throw error;
      
      toast.success("Support ticket submitted! We'll look into it soon.");
      setSubject("");
      setDescription("");
      setType("other");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell title="Help & Support" subtitle="Get help or report issues">
      <div className="max-w-2xl mx-auto w-full">
        <BentoCard className="p-6">
          <SectionTitle 
            title="Submit a Ticket" 
            hint="Need a name change, found a bug, or need help?" 
          />
          
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-semibold">
                What do you need help with?
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="h-10 rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="name_change">Name Change Request</SelectItem>
                  <SelectItem value="bug_report">Report a Bug</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="other">Other / General Help</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs font-semibold">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Details
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide as much detail as possible..."
                required
                className="min-h-32 rounded-xl resize-y"
              />
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="press mt-2 h-10 w-full rounded-xl font-bold sm:w-auto"
            >
              {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
              Submit Ticket
            </Button>
          </form>
        </BentoCard>
      </div>
    </AppShell>
  );
}
