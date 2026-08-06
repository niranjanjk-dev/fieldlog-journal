
-- ============ enums ============
CREATE TYPE public.app_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE public.entry_status AS ENUM ('pending', 'verified', 'rejected');

-- ============ shared updated_at ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'New member',
  avatar_url TEXT,
  headline TEXT,
  course TEXT,
  department TEXT,
  institution TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "user_roles_select_authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- ============ auto profile + default role on signup ============
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
    WHEN NEW.raw_user_meta_data->>'role' IN ('student','mentor','admin')
      THEN (NEW.raw_user_meta_data->>'role')::public.app_role
    ELSE 'student'::public.app_role
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, wanted)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ teams ============
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accent TEXT NOT NULL DEFAULT 'blue',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teams_select_authenticated" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "teams_write_mentor" ON public.teams FOR INSERT TO authenticated
  WITH CHECK (mentor_id = auth.uid() AND (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "teams_update_mentor" ON public.teams FOR UPDATE TO authenticated
  USING (mentor_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "teams_delete_mentor" ON public.teams FOR DELETE TO authenticated
  USING (mentor_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ team_members ============
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- mentor-of-student helper
CREATE OR REPLACE FUNCTION public.is_mentor_of(_mentor UUID, _student UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    JOIN public.teams t ON t.id = tm.team_id
    WHERE tm.student_id = _student AND t.mentor_id = _mentor
  );
$$;

-- ============ entries ============
CREATE TABLE public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Daily log',
  note TEXT,
  photo_path TEXT,
  hours NUMERIC(4,1) NOT NULL DEFAULT 0,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.entry_status NOT NULL DEFAULT 'pending',
  review_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX entries_student_captured_idx ON public.entries (student_id, captured_at DESC);
CREATE INDEX entries_status_idx ON public.entries (status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entries TO authenticated;
GRANT ALL ON public.entries TO service_role;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.entry_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entry_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.entry_collaborators TO authenticated;
GRANT ALL ON public.entry_collaborators TO service_role;
ALTER TABLE public.entry_collaborators ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_collaborator(_entry UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.entry_collaborators WHERE entry_id = _entry AND student_id = _user);
$$;

CREATE POLICY "entries_select_visible" ON public.entries FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    OR public.is_collaborator(id, auth.uid())
    OR public.is_mentor_of(auth.uid(), student_id)
    OR public.has_role(auth.uid(),'admin')
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
CREATE TRIGGER entries_updated_at BEFORE UPDATE ON public.entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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

CREATE POLICY "entry_collab_select" ON public.entry_collaborators FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_collab_insert_owner" ON public.entry_collaborators FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.entries e WHERE e.id = entry_id AND e.student_id = auth.uid()));
CREATE POLICY "entry_collab_delete_owner" ON public.entry_collaborators FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.entries e WHERE e.id = entry_id AND e.student_id = auth.uid()));

-- ============ entry_comments ============
CREATE TABLE public.entry_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.entry_comments TO authenticated;
GRANT ALL ON public.entry_comments TO service_role;
ALTER TABLE public.entry_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entry_comments_select" ON public.entry_comments FOR SELECT TO authenticated
  USING (public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_comments_insert" ON public.entry_comments FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND public.can_view_entry(entry_id, auth.uid()));
CREATE POLICY "entry_comments_delete_own" ON public.entry_comments FOR DELETE TO authenticated
  USING (author_id = auth.uid());

-- ============ nudges ============
CREATE TABLE public.nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.nudges TO authenticated;
GRANT ALL ON public.nudges TO service_role;
ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nudges_select" ON public.nudges FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR sender_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "nudges_insert_mentor" ON public.nudges FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND (public.has_role(auth.uid(),'mentor') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "nudges_update_recipient" ON public.nudges FOR UPDATE TO authenticated
  USING (student_id = auth.uid());
