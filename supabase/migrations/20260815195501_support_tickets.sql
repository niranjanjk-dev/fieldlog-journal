CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_type AS ENUM ('name_change', 'bug_report', 'feature_request', 'other');

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.ticket_type NOT NULL DEFAULT 'other',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update updated_at
CREATE TRIGGER support_tickets_updated_at 
  BEFORE UPDATE ON public.support_tickets 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can see their own tickets
CREATE POLICY "support_tickets_select_own" ON public.support_tickets 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

-- Users can create their own tickets
CREATE POLICY "support_tickets_insert_own" ON public.support_tickets 
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- Admin can select all tickets
CREATE POLICY "support_tickets_select_admin" ON public.support_tickets 
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update all tickets
CREATE POLICY "support_tickets_update_admin" ON public.support_tickets 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow authenticated users to update their own tickets (e.g. close them) but only specific fields?
-- Actually, let's keep it simple. Users shouldn't update after creating unless they close it. 
-- For now, we won't add user-update to keep it simple, they just submit and wait for admin.

-- Grant permissions
GRANT SELECT, INSERT ON public.support_tickets TO authenticated;
GRANT UPDATE ON public.support_tickets TO authenticated;
