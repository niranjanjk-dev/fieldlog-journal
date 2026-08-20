import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, User as UserIcon, Loader2, MessageSquare, ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/docko/app-shell";
import { BentoCard, BentoGrid } from "@/components/docko/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { initials } from "@/lib/docko";
import { meQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function InboxView({ role }: { role: "student" | "mentor" }) {
  const queryClient = useQueryClient();
  const { data: me } = useQuery(meQuery);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: contacts, isLoading: loadingContacts } = useQuery({
    queryKey: ["message_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_message_contacts");
      if (error) throw error;
      
      // Deduplicate contacts by id
      const uniqueContacts = Array.from(new Map(data?.map((c: any) => [c.id, c])).values());
      return uniqueContacts as { id: string; full_name: string; avatar_url: string; role: string }[];
    },
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["direct_messages", activeContactId],
    queryFn: async () => {
      if (!activeContactId || !me) return [];
      const { data, error } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${me.id},receiver_id.eq.${activeContactId}),and(sender_id.eq.${activeContactId},receiver_id.eq.${me.id})`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!activeContactId && !!me,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!activeContactId || !me) return;
      const { error } = await supabase
        .from("direct_messages")
        .insert({
          sender_id: me.id,
          receiver_id: activeContactId,
          content,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direct_messages", activeContactId] });
      setMessage("");
    },
  });

  const activeContact = contacts?.find((c) => c.id === activeContactId);

  return (
    <AppShell 
      title="Inbox" 
      subtitle={role === "student" ? "Chat with your mentors" : "Chat with your students"}
    >
      <div className="max-w-6xl mx-auto pt-4 pb-12 px-4 h-[calc(100vh-120px)] min-h-[600px]">
        <BentoGrid className="h-full">
          {/* Contacts List */}
          <BentoCard className={cn("col-span-2 lg:col-span-2 p-0 flex flex-col h-full overflow-hidden", activeContactId ? "hidden lg:flex" : "flex")}>
            <div className="p-4 border-b border-border/50">
              <h2 className="text-base font-semibold tracking-tight">Contacts</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingContacts ? (
                <div className="h-full flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin size-5" /></div>
              ) : !contacts || contacts.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <UserIcon className="mx-auto size-8 text-muted-foreground/30 mb-2" />
                  No contacts found
                </div>
              ) : (
                contacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveContactId(c.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                      activeContactId === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={c.avatar_url} />
                      <AvatarFallback>{initials(c.full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{c.full_name}</p>
                      <p className="text-[10px] uppercase tracking-wider opacity-70 truncate">{c.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </BentoCard>

          {/* Chat Pane */}
          <BentoCard className={cn("col-span-2 lg:col-span-4 p-0 flex flex-col h-full overflow-hidden", !activeContactId ? "hidden lg:flex" : "flex")}>
            {!activeContactId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <MessageSquare className="size-12 opacity-20 mb-4" />
                <p className="font-medium text-foreground">Select a contact</p>
                <p className="text-sm">Choose someone from the list to start messaging.</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-muted/5">
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0 -ml-2 press" onClick={() => setActiveContactId(null)}>
                    <ArrowLeft className="size-4" />
                  </Button>
                  <Avatar className="size-10">
                    <AvatarImage src={activeContact?.avatar_url} />
                    <AvatarFallback>{initials(activeContact?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{activeContact?.full_name}</h3>
                    <p className="text-[11px] text-muted-foreground capitalize">{activeContact?.role}</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {loadingMessages ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin size-5 text-muted-foreground" /></div>
                  ) : messages?.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground mt-10">
                      No messages yet. Say hi!
                    </div>
                  ) : (
                    messages?.map((msg) => {
                      const isMe = msg.sender_id === me?.id;
                      return (
                        <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                              isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50 bg-background">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (message.trim() && !sendMessage.isPending) {
                        sendMessage.mutate(message.trim());
                      }
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="rounded-full bg-muted/50 border-transparent focus-visible:bg-background h-11"
                      disabled={sendMessage.isPending}
                    />
                    <Button
                      type="submit"
                      disabled={!message.trim() || sendMessage.isPending}
                      className="shrink-0 rounded-full size-11 p-0 press"
                    >
                      {sendMessage.isPending ? <Loader2 className="animate-spin size-4" /> : <Send className="size-4" />}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </BentoCard>
        </BentoGrid>
      </div>
    </AppShell>
  );
}
