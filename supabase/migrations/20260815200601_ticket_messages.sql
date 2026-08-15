CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Select policy: users can see messages for their own tickets. Admins can see all.
CREATE POLICY "ticket_messages_select_own_or_admin" ON public.ticket_messages
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.support_tickets st 
      WHERE st.id = ticket_messages.ticket_id AND st.user_id = auth.uid()
    )
  );

-- Insert policy: users can insert messages into their own tickets. Admins can insert into any.
CREATE POLICY "ticket_messages_insert_own_or_admin" ON public.ticket_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (
        SELECT 1 FROM public.support_tickets st 
        WHERE st.id = ticket_messages.ticket_id AND st.user_id = auth.uid()
      )
    )
  );

GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
