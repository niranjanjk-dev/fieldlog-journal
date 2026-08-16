import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy, Loader2, Send, MessageSquare, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/docko/app-shell";
import { BentoGrid, BentoCard, SectionTitle } from "@/components/docko/bento";
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
  
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["support", "tickets"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];
      
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: messages } = useQuery({
    queryKey: ["support", "messages", activeTicket?.id],
    enabled: !!activeTicket?.id,
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*, profiles!ticket_messages_user_id_fkey(full_name)")
        .eq("ticket_id", activeTicket.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase.from("support_tickets").insert({
        user_id: user.user.id,
        type: type as any,
        subject,
        description
      }).select().single();
      if (error) throw error;
      
      toast.success("Support ticket submitted! We'll look into it soon.");
      setSubject("");
      setDescription("");
      setType("other");
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      setActiveTicket(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit ticket");
    } finally {
      setBusy(false);
    }
  }

  const sendMessage = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("ticket_messages").insert({
        ticket_id: activeTicket.id,
        user_id: user.user.id,
        message
      });
      if (error) throw error;
      setMessage("");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "messages", activeTicket?.id] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to send message")
  });

  if (activeTicket) {
    return (
      <AppShell title="Support Chat" subtitle={activeTicket.subject}>
        <div className="max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col">
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => setActiveTicket(null)} className="press -ml-3 text-muted-foreground">
              <ArrowLeft className="mr-2 size-4" /> Back to tickets
            </Button>
          </div>

          <BentoCard className="flex-1 flex flex-col overflow-hidden p-0">
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <h3 className="font-bold flex items-center gap-2">
                {activeTicket.subject}
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {activeTicket.type.replace('_', ' ')}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{activeTicket.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <MessageSquare className="size-8 mb-4 opacity-20" />
                  <p className="text-sm">No messages yet. Our support team will reply here soon.</p>
                </div>
              ) : (
                messages?.map((msg: any) => {
                  const isAdmin = msg.profiles?.full_name?.toLowerCase().includes("admin") || !msg.profiles;
                  // For now, assume if the user sent it, it's user, otherwise admin
                  // Since we only query their own tickets, the other messages must be admin
                  const isMe = msg.user_id === activeTicket.user_id;

                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                        {isMe ? "You" : "Support"}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-border/50 bg-muted/10">
              {activeTicket.status === 'resolved' ? (
                <p className="text-center text-sm text-muted-foreground py-2 font-medium">This ticket has been resolved and closed.</p>
              ) : (
                <form onSubmit={sendMessage.mutate} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="h-10 rounded-xl"
                    disabled={sendMessage.isPending}
                  />
                  <Button type="submit" disabled={!message.trim() || sendMessage.isPending} className="press h-10 w-10 shrink-0 rounded-xl p-0">
                    <Send className="size-4" />
                  </Button>
                </form>
              )}
            </div>
          </BentoCard>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Help & Support" subtitle="Get help or report issues">
      <div className="max-w-6xl mx-auto pt-4 pb-12 px-4">
        <BentoGrid>
          <BentoCard className="lg:col-span-3 p-6 self-start">
            <SectionTitle 
              title="Submit a Ticket" 
              hint="Have an idea? Tell us about a feature that would be nice to implement! Or report a bug." 
            />
            
            <form onSubmit={submitTicket} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-semibold">What do you need help with?</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="h-10 rounded-xl">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="feature_request">💡 Feature Request</SelectItem>
                    <SelectItem value="name_change">👤 Name Change Request</SelectItem>
                    <SelectItem value="bug_report">🐛 Report a Bug</SelectItem>
                    <SelectItem value="other">💬 Other / General Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs font-semibold">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary..."
                  required
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">Details</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible..."
                  required
                  className="min-h-32 rounded-xl resize-y"
                />
              </div>

              <Button type="submit" disabled={busy} className="press mt-2 h-10 w-full rounded-xl font-bold">
                {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                Submit Ticket
              </Button>
            </form>
          </BentoCard>

          <BentoCard className="lg:col-span-3 p-6 self-start">
            <SectionTitle title="Your Active Tickets" hint="Chat with support about your requests" />
            
            <div className="mt-6 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (!tickets || tickets.length === 0) ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/50">
                  <LifeBuoy className="mx-auto size-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm font-medium text-foreground">No active tickets</p>
                  <p className="text-xs text-muted-foreground mt-1">When you submit a ticket, you can track it here.</p>
                </div>
              ) : (
                tickets.map((ticket: any) => (
                  <button 
                    key={ticket.id} 
                    onClick={() => setActiveTicket(ticket)}
                    className="w-full text-left flex flex-col gap-1.5 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start w-full">
                      <p className="font-bold flex items-center gap-2">
                        {ticket.subject}
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                    <p className="text-xs text-primary font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view chat →
                    </p>
                  </button>
                ))
              )}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </AppShell>
  );
}
