import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Users, Building, ShieldCheck, Mail, Phone, Link2, LifeBuoy, CheckCircle2, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoGrid, StatTile, BentoCard, SectionTitle } from "@/components/docko/bento";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "System Admin · Docko" }] }),
  component: SystemAdminPage,
});

function SystemAdminPage() {
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [message, setMessage] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [profiles, institutions] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("institutions").select("id", { count: "exact" })
      ]);
      return {
        users: profiles.count ?? 0,
        institutions: institutions.count ?? 0
      };
    }
  });

  const { data: requests } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institution_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: tickets } = useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`*, profiles(full_name, email:auth.users(email))`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: messages } = useQuery({
    queryKey: ["admin", "messages", activeTicket?.id],
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

  const approveRequest = useMutation({
    mutationFn: async (req: any) => {
      // Create institution
      const { data: inst, error: instErr } = await supabase
        .from("institutions")
        .insert({ name: req.institution_name, contact_email: req.email })
        .select("id").single();
      if (instErr) throw instErr;

      // Update request status
      await supabase.from("institution_requests").update({ status: "approved" }).eq("id", req.id);

      // Grant institution role to the user who requested it
      await supabase.from("user_roles").insert({ user_id: req.user_id, role: "institution" }).select();
      
      // Link user profile to institution
      await supabase.from("profiles").update({ institution_id: inst.id }).eq("id", req.user_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Institution approved and access granted");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const resolveTicket = useMutation({
    mutationFn: async (ticketId: string) => {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", ticketId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      toast.success("Ticket resolved");
      if (activeTicket) setActiveTicket((prev: any) => ({ ...prev, status: "resolved" }));
    },
    onError: (err: any) => toast.error(err.message)
  });

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
      queryClient.invalidateQueries({ queryKey: ["admin", "messages", activeTicket?.id] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to send message")
  });

  if (activeTicket) {
    return (
      <AppShell title="Support Ticket" subtitle={`User: ${activeTicket.profiles?.full_name}`}>
        <div className="max-w-3xl mx-auto w-full h-[calc(100vh-140px)] flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setActiveTicket(null)} className="press -ml-3 text-muted-foreground">
              <ArrowLeft className="mr-2 size-4" /> Back to tickets
            </Button>
            {activeTicket.status !== "resolved" && (
              <Button 
                size="sm" 
                variant="outline"
                className="press rounded-xl"
                disabled={resolveTicket.isPending}
                onClick={() => resolveTicket.mutate(activeTicket.id)}
              >
                Mark as Resolved
              </Button>
            )}
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
                  <p className="text-sm">No messages yet. Reply below to start a chat with the user.</p>
                </div>
              ) : (
                messages?.map((msg: any) => {
                  const isUser = msg.user_id === activeTicket.user_id;

                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${!isUser ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                        {!isUser ? "You (Admin)" : msg.profiles?.full_name}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${!isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-border/50 bg-muted/10">
              {activeTicket.status === 'resolved' ? (
                <p className="text-center text-sm text-muted-foreground py-2 font-medium">This ticket is closed. You can no longer reply.</p>
              ) : (
                <form onSubmit={sendMessage.mutate} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a reply to the user..."
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
    <AppShell title="System Admin" subtitle="Manage the Docko platform">
      <BentoGrid>
        <StatTile className="lg:col-span-3" label="Total Users" value={stats?.users ?? 0} icon={<Users className="size-4" />} />
        <StatTile className="lg:col-span-3" label="Institutions" value={stats?.institutions ?? 0} icon={<Building className="size-4" />} />
        
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Institution Requests" hint="Approve access requests" />
          
          <div className="space-y-4">
            {(!requests || requests.length === 0) ? (
              <p className="text-sm text-muted-foreground py-4">No pending requests.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-bold">{req.institution_name}</p>
                    <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-2">
                      <p className="flex items-center gap-1.5"><Mail className="size-3" /> {req.email}</p>
                      {req.phone_number && <p className="flex items-center gap-1.5"><Phone className="size-3" /> {req.phone_number}</p>}
                      {req.proof_details && <p className="flex items-center gap-1.5"><Link2 className="size-3" /> {req.proof_details}</p>}
                    </div>
                  </div>
                  {req.status === "pending" ? (
                    <Button 
                      size="sm" 
                      className="press rounded-xl"
                      disabled={approveRequest.isPending}
                      onClick={() => approveRequest.mutate(req)}
                    >
                      <ShieldCheck className="size-4 mr-2" />
                      Approve
                    </Button>
                  ) : (
                    <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Approved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Support Tickets" hint="Manage user requests and issues" />
          
          <div className="space-y-4">
            {(!tickets || tickets.length === 0) ? (
              <p className="text-sm text-muted-foreground py-4">No active support tickets.</p>
            ) : (
              tickets.map((ticket: any) => (
                <button 
                  key={ticket.id} 
                  onClick={() => setActiveTicket(ticket)}
                  className="w-full text-left flex items-start justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-full ${ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {ticket.status === 'resolved' ? <CheckCircle2 className="size-5" /> : <LifeBuoy className="size-5" />}
                    </div>
                    <div>
                      <p className="font-bold flex items-center gap-2">
                        {ticket.subject}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {ticket.type.replace('_', ' ')}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{ticket.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1">
                        By {ticket.profiles?.full_name} • {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4">
                    View chat →
                  </span>
                </button>
              ))
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </AppShell>
  );
}
