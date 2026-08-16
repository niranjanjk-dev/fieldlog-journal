import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Clock, Users } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid, MiniBars, SectionTitle, StatTile } from "@/components/docko/bento";
import { sumHours, weeklyActivity } from "@/lib/docko";
import { meQuery, institutionEntriesQuery, institutionTeamsQuery } from "@/lib/queries";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/institution/")({
  head: () => ({
    meta: [
      { title: "Institution · Docko" },
      { name: "description", content: "Institution-wide fieldwork hours, verification rate and teams." },
      { property: "og:title", content: "Institution · Docko" },
      { property: "og:description", content: "Institution-wide fieldwork hours and verification rate." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionOverview,
});

function InstitutionOverview() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);

  // Use institution-scoped queries instead of platform-wide queries
  const { data: entries } = useQuery(institutionEntriesQuery(me?.institutionId ?? null));
  const { data: teams } = useQuery(institutionTeamsQuery(me?.institutionId ?? null));

  // Count verified members in this institution
  const { data: memberCount } = useQuery({
    queryKey: ["institution", "member_count", me?.institutionId],
    enabled: !!me?.institutionId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("institution_id", me!.institutionId!)
        .eq("institution_verified", true);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: adminTicket } = useQuery({
    queryKey: ["institution", "ticket", me?.id],
    enabled: !!me?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", me!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const { data: messages } = useQuery({
    queryKey: ["institution", "messages", adminTicket?.id],
    enabled: !!adminTicket?.id,
    refetchInterval: 5000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*, profiles!ticket_messages_user_id_fkey(full_name)")
        .eq("ticket_id", adminTicket?.id ?? "")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const [message, setMessage] = useState("");

  const sendMessage = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || !adminTicket || !me) return;

      const { error } = await supabase.from("ticket_messages").insert({
        ticket_id: adminTicket.id,
        user_id: me.id,
        message
      });
      if (error) throw error;
      setMessage("");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution", "messages", adminTicket?.id] });
    },
    onError: (err: any) => toast.error(err.message || "Failed to send message")
  });

  const all = entries ?? [];
  const verified = all.filter((entry) => entry.status === "verified");

  return (
    <AppShell title="Institution" subtitle="Everything happening across your teams and students">
      <BentoGrid>
        <StatTile className="lg:col-span-2" label="Verified Members" value={memberCount ?? 0} icon={<Users className="size-4" />} />
        <StatTile className="lg:col-span-2" label="Hours logged" value={sumHours(all)} unit="h" icon={<Clock className="size-4" />} />
        <StatTile
          className="lg:col-span-2"
          label="Verification rate"
          value={all.length ? Math.round((verified.length / all.length) * 100) : 0}
          unit="%"
          hint={`${teams?.length ?? 0} teams`}
          icon={<BadgeCheck className="size-4" />}
        />
        <BentoCard className="lg:col-span-6">
          <SectionTitle title="Institution activity" hint="Logs captured per day by verified members" />
          <MiniBars data={weeklyActivity(all)} />
        </BentoCard>

        {adminTicket && (
          <BentoCard className="lg:col-span-6 flex flex-col p-0 overflow-hidden h-[400px]">
            <div className="p-4 border-b border-border/50 bg-muted/20">
              <h3 className="font-bold flex items-center gap-2 text-primary">
                <ShieldCheck className="size-4" />
                Messages from Admin
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{adminTicket.subject}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                  <MessageSquare className="size-8 mb-4 opacity-20" />
                  <p className="text-sm">No messages yet. Reply below.</p>
                </div>
              ) : (
                messages?.map((msg: any) => {
                  const isMe = msg.user_id === me?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <span className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                        {isMe ? "You" : "System Admin"}
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
              {adminTicket.status === 'resolved' ? (
                <p className="text-center text-xs text-muted-foreground py-2 font-medium">This conversation is closed.</p>
              ) : (
                <form onSubmit={sendMessage.mutate} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a reply..."
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
        )}
      </BentoGrid>
    </AppShell>
  );
}
