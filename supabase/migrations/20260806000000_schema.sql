-- =============================================================================
-- DOCKO — Complete Database Schema (Canonical Reference)
-- =============================================================================
-- This file documents the FULL intended schema in the order it was built.
-- Individual migration files in this directory are the authoritative source
-- for Supabase CLI deploys. This file is for documentation and local dev only.
--
-- Migration history (chronological):
--   20260806073030  Base schema: enums, profiles, user_roles, teams, entries
--   20260806073105  Security: revoke anon, storage RLS policies
--   20260806073359  Profile FK constraints on all tables
--   20260806073813  handle_new_user trigger v2 (mentor self-select at signup)
--   20260815104100  Add username to profiles, leave_team RPC
--   20260815131200  Add category column to entries
--   20260815150000  Add has_changed_name, phone, position to profiles
--   20260815152700  become_mentor() dev RPC (RESTRICTED in production)
--   20260815153800  institutions table, institution_requests, pending role
--   20260815181500  Fix institution_requests RLS, make_me_admin() dev RPC
--   20260815191100  Add phone_number, proof_details to institution_requests
--   20260815195501  support_tickets table with RLS
--   20260815200121  institution_verified column, verify_institution_member RPC
--   20260815200601  ticket_messages table with RLS
--   20260816094300  Admin can INSERT support_tickets
--   20260816095800  system_settings table (waiting page config)
--   20260816110000  get_institution_stats() RPC
--   20260816111000  Admin can UPDATE institution_requests
--   20260816112000  approve_institution_request() RPC
--   20260816113000  get_institution_admin_id() RPC
--   20260816200000  SECURITY: Restrict dev RPCs, harden verify_member,
--                             fix anon insert hole, add unverify RPC
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

-- app_role: core roles assigned to users
-- • student     — can log entries, join teams
-- • mentor      — can create teams, verify student entries
-- • admin       — full platform access
-- • institution — institution admin (dashboard, member verification)
-- • pending     — signed up but not yet onboarded/approved
CREATE TYPE public.app_role    AS ENUM ('student', 'mentor', 'admin', 'institution', 'pending');
CREATE TYPE public.entry_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_type   AS ENUM ('name_change', 'bug_report', 'feature_request', 'other');


-- ─────────────────────────────────────────────────────────────────────────────
-- SHARED TRIGGER FUNCTION
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- INSTITUTIONS
-- ─────────────────────────────────────────────────────────────────────────────
-- Approved institutions that can manage mentors and students on the platform.
CREATE TABLE public.institutions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  domain        TEXT,                             -- e.g. "mit.edu"
  contact_email TEXT,
  status        TEXT        NOT NULL DEFAULT 'approved',  -- 'approved' | 'suspended'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
-- Anyone can read approved institutions (for dropdowns)
CREATE POLICY "institutions_select_all" ON public.institutions FOR SELECT USING (true);
-- Only admins can write to institutions
CREATE POLICY "institutions_write_admin" ON public.institutions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.institutions TO authenticated, anon;
GRANT ALL    ON public.institutions TO service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per auth user. Extended by ALTER TABLE in later migrations.
CREATE TABLE public.profiles (
  id                   UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT        NOT NULL DEFAULT 'New member',
  avatar_url           TEXT,
  headline             TEXT,
  -- Bio / social
  bio                  TEXT,
  username             TEXT        UNIQUE,        -- for /p/:handle public profile
  -- Academic
  course               TEXT,
  department           TEXT,
  institution          TEXT,                      -- legacy text field (kept for display)
  -- Mentor-specific
  phone                TEXT,
  position             TEXT,
  has_changed_name     BOOLEAN     NOT NULL DEFAULT false,
  -- Institution membership
  institution_id       UUID        REFERENCES public.institutions(id) ON DELETE SET NULL,
  institution_verified BOOLEAN     NOT NULL DEFAULT false,
  -- Timestamps
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX profiles_username_idx       ON public.profiles (username);
CREATE INDEX profiles_institution_id_idx ON public.profiles (institution_id);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own"           ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"           ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ─────────────────────────────────────────────────────────────────────────────
-- USER ROLES
-- ─────────────────────────────────────────────────────────────────────────────
-- Many-to-many: users can hold multiple roles (e.g. mentor + student).
CREATE TABLE public.user_roles (
  id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL    ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- Helper: check if a user has a specific role (SECURITY DEFINER avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
GRANT  EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon;


-- ─────────────────────────────────────────────────────────────────────────────
-- AUTO PROFILE + ROLE ON SIGNUP
-- ─────────────────────────────────────────────────────────────────────────────
-- Runs after every INSERT on auth.users.
-- • student and mentor may self-select at signup via raw_user_meta_data.role
-- • All other signups (institution requests) get 'pending'
-- • admin must be granted by an existing admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  wanted public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, institution)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'institution'
  )
  ON CONFLICT (id) DO NOTHING;

  wanted := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'mentor' THEN 'mentor'::public.app_role
    WHEN NEW.raw_user_meta_data->>'role' = 'student' THEN 'student'::public.app_role
    ELSE 'pending'::public.app_role  -- institution requests and unknown start as pending
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, wanted)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- INSTITUTION REQUESTS
-- ─────────────────────────────────────────────────────────────────────────────
-- Submitted by institutions requesting platform access. Reviewed by admins.
CREATE TABLE public.institution_requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_name TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  phone_number     TEXT,
  proof_details    TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'declined'
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.institution_requests ENABLE ROW LEVEL SECURITY;
-- Admins can read and update all requests
CREATE POLICY "institution_requests_select_admin" ON public.institution_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "institution_requests_update_admin" ON public.institution_requests
  FOR UPDATE TO authenticated
  USING    (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
-- Authenticated users insert their own (after OTP verification session exists)
CREATE POLICY "institution_requests_insert_authenticated" ON public.institution_requests
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
GRANT SELECT, INSERT, UPDATE ON public.institution_requests TO authenticated;
GRANT ALL ON public.institution_requests TO service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- TEAMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.teams (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  mentor_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  accent      TEXT        NOT NULL DEFAULT 'blue',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teams_select_authenticated" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "teams_write_mentor"  ON public.teams FOR INSERT TO authenticated
  WITH CHECK (mentor_id = auth.uid() AND (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "teams_update_mentor" ON public.teams FOR UPDATE TO authenticated
  USING (mentor_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "teams_delete_mentor" ON public.teams FOR DELETE TO authenticated
  USING (mentor_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ─────────────────────────────────────────────────────────────────────────────
-- TEAM MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.team_members (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID        NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team_members_select_authenticated" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "team_members_insert_mentor" ON public.team_members FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "team_members_delete_mentor" ON public.team_members FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin'));

-- Helper: is this user a mentor of the given student?
CREATE OR REPLACE FUNCTION public.is_mentor_of(_mentor UUID, _student UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    JOIN public.teams t ON t.id = tm.team_id
    WHERE tm.student_id = _student AND t.mentor_id = _mentor
  );
$$;
GRANT  EXECUTE ON FUNCTION public.is_mentor_of(UUID, UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.is_mentor_of(UUID, UUID) FROM anon;


-- ─────────────────────────────────────────────────────────────────────────────
-- ENTRIES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.entries (
  id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID                NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id     UUID                REFERENCES public.teams(id) ON DELETE SET NULL,
  title       TEXT                NOT NULL DEFAULT 'Daily log',
  category    TEXT,
  note        TEXT,
  photo_path  TEXT,
  hours       NUMERIC(4,1)        NOT NULL DEFAULT 0,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  address     TEXT,
  captured_at TIMESTAMPTZ         NOT NULL DEFAULT now(),
  status      public.entry_status NOT NULL DEFAULT 'pending',
  review_note TEXT,
  reviewed_by UUID                REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ         NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ         NOT NULL DEFAULT now()
);
CREATE INDEX entries_student_captured_idx ON public.entries (student_id, captured_at DESC);
CREATE INDEX entries_status_idx           ON public.entries (status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entries TO authenticated;
GRANT ALL ON public.entries TO service_role;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER entries_updated_at BEFORE UPDATE ON public.entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helper: can this user view this entry?
CREATE OR REPLACE FUNCTION public.is_collaborator(_entry UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.entry_collaborators WHERE entry_id = _entry AND student_id = _user);
$$;

CREATE OR REPLACE FUNCTION public.can_view_entry(_entry UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.entries e
    WHERE e.id = _entry
      AND (
        e.student_id = _user
        OR public.is_collaborator(e.id, _user)
        OR public.is_mentor_of(_user, e.student_id)
        OR public.has_role(_user, 'admin')
      )
  );
$$;
GRANT  EXECUTE ON FUNCTION public.can_view_entry(UUID, UUID) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.is_collaborator(UUID, UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.can_view_entry(UUID, UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_collaborator(UUID, UUID) FROM anon;

-- RLS: who can see an entry?
CREATE POLICY "entries_select_visible" ON public.entries FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_collaborator(id, auth.uid())
    OR public.is_mentor_of(auth.uid(), student_id)
    OR public.has_role(auth.uid(),'admin')
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = entries.student_id
        AND p.institution_id IS NOT NULL
        AND p.institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
        AND public.has_role(auth.uid(), 'institution')
    )
  );
CREATE POLICY "entries_insert_own" ON public.entries FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "entries_update_own_or_reviewer" ON public.entries FOR UPDATE TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_mentor_of(auth.uid(), student_id)
    OR public.has_role(auth.uid(),'admin')
  );
CREATE POLICY "entries_delete_own" ON public.entries FOR DELETE TO authenticated
  USING (student_id = auth.uid() OR public.has_role(auth.uid(),'admin'));


-- ─────────────────────────────────────────────────────────────────────────────
-- ENTRY COLLABORATORS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.entry_collaborators (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id   UUID        NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  student_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entry_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.entry_collaborators TO authenticated;
GRANT ALL ON public.entry_collaborators TO service_role;
ALTER TABLE public.entry_collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entry_collab_select"        ON public.entry_collaborators FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_collab_insert_owner"  ON public.entry_collaborators FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.entries e WHERE e.id = entry_id AND e.student_id = auth.uid()));
CREATE POLICY "entry_collab_delete_owner"  ON public.entry_collaborators FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.entries e WHERE e.id = entry_id AND e.student_id = auth.uid()));


-- ─────────────────────────────────────────────────────────────────────────────
-- ENTRY COMMENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.entry_comments (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id  UUID        NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  author_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.entry_comments TO authenticated;
GRANT ALL ON public.entry_comments TO service_role;
ALTER TABLE public.entry_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entry_comments_select"     ON public.entry_comments FOR SELECT TO authenticated
  USING (public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_comments_insert"     ON public.entry_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_comments_delete_own" ON public.entry_comments FOR DELETE TO authenticated
  USING (author_id = auth.uid());


-- ─────────────────────────────────────────────────────────────────────────────
-- NUDGES (notifications)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.nudges (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message    TEXT        NOT NULL,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.nudges TO authenticated;
GRANT ALL ON public.nudges TO service_role;
ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nudges_select"           ON public.nudges FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR sender_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "nudges_insert_mentor"    ON public.nudges FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'institution')));
CREATE POLICY "nudges_update_recipient" ON public.nudges FOR UPDATE TO authenticated
  USING (student_id = auth.uid());


-- ─────────────────────────────────────────────────────────────────────────────
-- SUPPORT TICKETS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.support_tickets (
  id          UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID                 NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        public.ticket_type   NOT NULL DEFAULT 'other',
  subject     TEXT                 NOT NULL,
  description TEXT                 NOT NULL,
  status      public.ticket_status NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ          NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ          NOT NULL DEFAULT now()
);
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_tickets_select_own"    ON public.support_tickets FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "support_tickets_select_admin"  ON public.support_tickets FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_tickets_insert_own"    ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "support_tickets_insert_admin"  ON public.support_tickets FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_tickets_update_admin"  ON public.support_tickets FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- TICKET MESSAGES (support chat)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.ticket_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID        NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ticket_messages_select_own_or_admin" ON public.ticket_messages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM public.support_tickets st WHERE st.id = ticket_messages.ticket_id AND st.user_id = auth.uid())
  );
CREATE POLICY "ticket_messages_insert_own_or_admin" ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND (
      public.has_role(auth.uid(), 'admin') OR
      EXISTS (SELECT 1 FROM public.support_tickets st WHERE st.id = ticket_messages.ticket_id AND st.user_id = auth.uid())
    )
  );
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;
GRANT ALL ON public.ticket_messages TO service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- SYSTEM SETTINGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.system_settings (
  id                         INT     PRIMARY KEY,
  show_admin_email_on_waiting BOOLEAN NOT NULL DEFAULT true,
  admin_contact_email         TEXT
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_settings_select_all"    ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "system_settings_update_admin"  ON public.system_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "system_settings_insert_admin"  ON public.system_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.system_settings (id, show_admin_email_on_waiting, admin_contact_email)
VALUES (1, true, 'support@docko.edu')
ON CONFLICT (id) DO NOTHING;
GRANT SELECT ON public.system_settings TO authenticated, anon;
GRANT ALL ON public.system_settings TO service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE POLICIES (entry-photos bucket)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE POLICY "entry_photos_insert_own_folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'entry-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "entry_photos_delete_own_folder" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'entry-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "entry_photos_select_visible"    ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'entry-photos' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.entries e
        WHERE e.photo_path = storage.objects.name AND public.can_view_entry(e.id, auth.uid())
      )
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- RPCS & FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- complete_onboarding: student/mentor sets their role and institution after signup
CREATE OR REPLACE FUNCTION public.complete_onboarding(_role public.app_role, _institution_id UUID, _full_name TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _role NOT IN ('student', 'mentor') THEN RAISE EXCEPTION 'Invalid role selection'; END IF;

  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  UPDATE public.profiles SET full_name = _full_name, institution_id = _institution_id WHERE id = auth.uid();

  -- Auto-create default team for new mentors
  IF _role = 'mentor' THEN
    INSERT INTO public.teams (name, description, mentor_id, accent)
    VALUES (
      _full_name || '''s Mentees', 
      'Default team for all your individual mentees.', 
      auth.uid(), 
      'blue'
    )
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;
GRANT  EXECUTE ON FUNCTION public.complete_onboarding(public.app_role, UUID, TEXT) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.complete_onboarding(public.app_role, UUID, TEXT) FROM anon;


-- approve_institution_request: admin approves a pending institution request
CREATE OR REPLACE FUNCTION public.approve_institution_request(req_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_req    public.institution_requests%ROWTYPE;
  v_inst_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve institution requests';
  END IF;

  SELECT * INTO v_req FROM public.institution_requests WHERE id = req_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF v_req.status != 'pending' THEN RAISE EXCEPTION 'Request is not pending'; END IF;

  UPDATE public.institution_requests SET status = 'approved' WHERE id = req_id;

  INSERT INTO public.institutions (name, contact_email, status)
  VALUES (v_req.institution_name, v_req.email, 'approved')
  RETURNING id INTO v_inst_id;

  UPDATE public.profiles SET institution_id = v_inst_id WHERE id = v_req.user_id;

  DELETE FROM public.user_roles WHERE user_id = v_req.user_id AND role = 'pending';
  INSERT INTO public.user_roles (user_id, role) VALUES (v_req.user_id, 'institution')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
GRANT  EXECUTE ON FUNCTION public.approve_institution_request(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.approve_institution_request(UUID) FROM anon;


-- verify_institution_member: institution admin verifies a member's membership
CREATE OR REPLACE FUNCTION public.verify_institution_member(_target_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  caller_inst_id  UUID;
  target_inst_id  UUID;
  target_verified BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(), 'institution') THEN
    RAISE EXCEPTION 'Only institution admins can verify members';
  END IF;

  SELECT institution_id INTO caller_inst_id FROM public.profiles WHERE id = auth.uid();
  IF caller_inst_id IS NULL THEN RAISE EXCEPTION 'Your account is not linked to an institution'; END IF;

  SELECT institution_id, institution_verified INTO target_inst_id, target_verified
  FROM public.profiles WHERE id = _target_user_id;

  IF target_inst_id IS NULL OR target_inst_id != caller_inst_id THEN
    RAISE EXCEPTION 'This user does not belong to your institution';
  END IF;

  IF target_verified THEN RETURN; END IF;  -- Already verified, no-op

  UPDATE public.profiles SET institution_verified = true WHERE id = _target_user_id;

  -- Notify the user
  INSERT INTO public.nudges (student_id, sender_id, message)
  VALUES (_target_user_id, auth.uid(),
    'Your membership has been verified by your institution. You can now access all features.');
END;
$$;
GRANT  EXECUTE ON FUNCTION public.verify_institution_member(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_institution_member(UUID) FROM anon;


-- unverify_institution_member: institution admin removes a member's verification
CREATE OR REPLACE FUNCTION public.unverify_institution_member(_target_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  caller_inst_id UUID;
  target_inst_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_role(auth.uid(), 'institution') THEN
    RAISE EXCEPTION 'Only institution admins can manage member verification';
  END IF;

  SELECT institution_id INTO caller_inst_id FROM public.profiles WHERE id = auth.uid();
  IF caller_inst_id IS NULL THEN RAISE EXCEPTION 'Your account is not linked to an institution'; END IF;

  SELECT institution_id INTO target_inst_id FROM public.profiles WHERE id = _target_user_id;
  IF target_inst_id IS NULL OR target_inst_id != caller_inst_id THEN
    RAISE EXCEPTION 'This user does not belong to your institution';
  END IF;

  UPDATE public.profiles SET institution_verified = false WHERE id = _target_user_id;
END;
$$;
GRANT  EXECUTE ON FUNCTION public.unverify_institution_member(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.unverify_institution_member(UUID) FROM anon;


-- leave_team: student leaves a team (sends a nudge to mentor)
CREATE OR REPLACE FUNCTION public.leave_team(_team_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _mentor_id   UUID;
  _team_name   TEXT;
  _student_name TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = _team_id AND student_id = auth.uid()) THEN
    RAISE EXCEPTION 'You are not a member of this team';
  END IF;

  SELECT mentor_id, name INTO _mentor_id, _team_name FROM public.teams WHERE id = _team_id;
  SELECT full_name INTO _student_name FROM public.profiles WHERE id = auth.uid();

  DELETE FROM public.team_members WHERE team_id = _team_id AND student_id = auth.uid();

  INSERT INTO public.nudges (student_id, sender_id, message)
  VALUES (_mentor_id, auth.uid(),
    COALESCE(_student_name, 'A student') || ' has left your team: ' || _team_name);
END;
$$;
GRANT  EXECUTE ON FUNCTION public.leave_team(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.leave_team(UUID) FROM anon;


-- get_institution_stats: admin overview of all approved institutions
CREATE OR REPLACE FUNCTION public.get_institution_stats()
RETURNS TABLE (id UUID, name TEXT, contact_email TEXT, student_count BIGINT, total_hours NUMERIC)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT
    i.id, i.name, i.contact_email,
    COUNT(DISTINCT p.id)       AS student_count,
    COALESCE(SUM(e.hours), 0)  AS total_hours
  FROM public.institutions i
  LEFT JOIN public.profiles p ON p.institution_id = i.id AND p.institution_verified = true
  LEFT JOIN public.entries  e ON e.student_id = p.id
  WHERE i.status = 'approved'
  GROUP BY i.id, i.name, i.contact_email
  ORDER BY i.name ASC;
$$;
GRANT  EXECUTE ON FUNCTION public.get_institution_stats() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_institution_stats() FROM anon;


-- get_institution_admin_id: look up who the institution admin user is
CREATE OR REPLACE FUNCTION public.get_institution_admin_id(_institution_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT p.id INTO v_user_id
  FROM public.profiles p
  JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE p.institution_id = _institution_id AND ur.role = 'institution'
  LIMIT 1;
  RETURN v_user_id;
END;
$$;
GRANT  EXECUTE ON FUNCTION public.get_institution_admin_id(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_institution_admin_id(UUID) FROM anon;


-- make_me_admin: DEV ONLY — REVOKED FROM ALL CLIENT ROLES IN PRODUCTION
CREATE OR REPLACE FUNCTION public.make_me_admin()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
-- DO NOT GRANT to authenticated in production (see 20260816200000_security_hardening.sql)
REVOKE EXECUTE ON FUNCTION public.make_me_admin() FROM authenticated, anon;
