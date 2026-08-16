import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Users, Building, ShieldCheck, Mail, Phone, Link2, LifeBuoy, CheckCircle2, ArrowLeft, MessageSquare, Send, XCircle, MessageCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoGrid, StatTile, BentoCard, SectionTitle } from "@/components/docko/bento";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { systemSettingsQuery } from "@/lib/queries";

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

  const { data: settings } = useQuery(systemSettingsQuery);
  const [adminEmail, setAdminEmail] = useState("");
  const [showEmail, setShowEmail] = useState(true);

  useEffect(() => {
    if (settings) {
      setAdminEmail(settings.admin_contact_email || "");
      setShowEmail(settings.show_admin_email_on_waiting);
    }
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("system_settings")
        .update({
          show_admin_email_on_waiting: showEmail,
          admin_contact_email: adminEmail,
        })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system_settings"] });
      toast.success("Settings updated");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const { data: requests } = useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institution_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: approvedInstitutions } = useQuery({
    queryKey: ["admin", "approved_institutions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_institution_stats");
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

  const declineRequest = useMutation({
    mutationFn: async (reqId: string) => {
      const { error } = await supabase
        .from("institution_requests")
        .update({ status: "declined" })
        .eq("id", reqId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
      toast.success("Institution request declined");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const createTicket = useMutation({
    mutationFn: async (institution: any) => {
      // Find the admin user for this institution
      const { data: adminId, error: pError } = await supabase.rpc("get_institution_admin_id", { _institution_id: institution.id });
        
      if (pError) throw pError;
      if (!adminId) throw new Error("This institution has no registered admin account to message.");
      
      // Create a ticket directed to this user
      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: adminId,
          type: "other",
          subject: `Admin Message: ${institution.name}`,
          description: "Message initiated by system administrator",
          status: "open"
        })
        .select("*, profiles(full_name, email:auth.users(email))")
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tickets"] });
      toast.success("Chat opened");
      setActiveTicket(data);
    },
    onError: (err: any) => toast.error(err.message)
  });

  const approveRequest = useMutation({
    mutationFn: async (req: any) => {
      const { error } = await supabase.rpc("approve_institution_request", { req_id: req.id });
      if (error) throw error;
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
                  {(activeTicket.type ?? "other").replace(/_/g, " ")}
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
          <SectionTitle title="System Settings" hint="Global app configurations" />
          <div className="space-y-6 mt-2">
            <div className="flex items-center justify-between rounded-2xl bg-card border border-border/50 p-4 shadow-sm">
              <div>
                <p className="font-bold text-sm">Show Admin Email</p>
                <p className="text-xs text-muted-foreground mt-0.5">Display contact email on institution waiting page</p>
              </div>
              <Switch 
                checked={showEmail} 
                onCheckedChange={(checked) => setShowEmail(checked)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Admin Contact Email</label>
              <div className="flex gap-2">
                <Input 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@docko.edu"
                  className="rounded-xl flex-1"
                />
                <Button 
                  className="press rounded-xl"
                  disabled={updateSettings.isPending}
                  onClick={() => updateSettings.mutate()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </BentoCard>

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
                      {(req as any).phone_number && <p className="flex items-center gap-1.5"><Phone className="size-3" /> {(req as any).phone_number}</p>}
                      {(req as any).proof_details && <p className="flex items-center gap-1.5"><Link2 className="size-3" /> {(req as any).proof_details}</p>}
                    </div>
                  </div>
                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="press rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                        disabled={declineRequest.isPending}
                        onClick={() => declineRequest.mutate(req.id)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Decline
                      </Button>
                      <Button 
                        size="sm" 
                        className="press rounded-xl"
                        disabled={approveRequest.isPending}
                        onClick={() => approveRequest.mutate(req)}
                      >
                        <ShieldCheck className="size-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">Approved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </BentoCard>

        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Approved Institutions" hint="Manage and chat with active institutions" />
          
          <div className="space-y-4">
            {(!approvedInstitutions || approvedInstitutions.length === 0) ? (
              <p className="text-sm text-muted-foreground py-4">No approved institutions yet.</p>
            ) : (
              approvedInstitutions.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
                  <div>
                    <p className="font-bold flex items-center gap-2">
                      {inst.name}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-500/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </p>
                    <div className="text-sm text-muted-foreground flex flex-col gap-1 mt-2">
                      <p className="flex items-center gap-1.5"><Mail className="size-3" /> {inst.contact_email}</p>
                      <p className="flex items-center gap-4 font-medium mt-1 text-xs">
                        <span className="flex items-center gap-1.5"><Users className="size-3.5 text-primary" /> {inst.student_count || 0} Students</span>
                        <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" /> {inst.total_hours || 0}h Total Activity</span>
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="press rounded-xl"
                    disabled={createTicket.isPending}
                    onClick={() => createTicket.mutate(inst)}
                  >
                    <MessageCircle className="size-4 mr-2" />
                    Message
                  </Button>
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
                          {(ticket.type ?? "other").replace(/_/g, " ")}
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
