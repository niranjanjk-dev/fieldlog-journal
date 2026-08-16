-- ─────────────────────────────────────────────────────────────────────────────
-- DIRECT MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.direct_messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated;
GRANT ALL ON public.direct_messages TO service_role;

-- Users can read messages they sent or received
CREATE POLICY "direct_messages_select" ON public.direct_messages
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Users can send messages
CREATE POLICY "direct_messages_insert" ON public.direct_messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Users can update messages they received (to mark as read)
CREATE POLICY "direct_messages_update" ON public.direct_messages
  FOR UPDATE TO authenticated
  USING (receiver_id = auth.uid());

CREATE TRIGGER direct_messages_updated_at BEFORE UPDATE ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get a user's contacts (people they share a team with)
CREATE OR REPLACE FUNCTION public.get_message_contacts()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  -- If user is a mentor, return their students
  SELECT p.id, p.full_name, p.avatar_url, 'student' AS role
  FROM public.profiles p
  JOIN public.team_members tm ON p.id = tm.student_id
  JOIN public.teams t ON tm.team_id = t.id
  WHERE t.mentor_id = auth.uid()
  
  UNION
  
  -- If user is a student, return their mentors
  SELECT p.id, p.full_name, p.avatar_url, 'mentor' AS role
  FROM public.profiles p
  JOIN public.teams t ON p.id = t.mentor_id
  JOIN public.team_members tm ON t.id = tm.team_id
  WHERE tm.student_id = auth.uid()
  
  UNION
  
  -- Return anyone they already have a message history with
  SELECT p.id, p.full_name, p.avatar_url, 'contact' AS role
  FROM public.profiles p
  JOIN public.direct_messages dm ON p.id = dm.sender_id OR p.id = dm.receiver_id
  WHERE (dm.sender_id = auth.uid() OR dm.receiver_id = auth.uid()) 
    AND p.id != auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_message_contacts() TO authenticated;
