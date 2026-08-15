-- 1. Alter public.app_role to add 'institution' and 'pending' roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'institution';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'pending';

-- 2. Create public.institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'approved', -- For this prototype, default to approved
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on institutions
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institutions_select_all" ON public.institutions FOR SELECT USING (true);
-- Only admin can write to institutions
CREATE POLICY "institutions_write_admin" ON public.institutions FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Add institution_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL;

-- 4. Create public.institution_requests table
CREATE TABLE IF NOT EXISTS public.institution_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.institution_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "institution_requests_select_admin" ON public.institution_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "institution_requests_insert_own" ON public.institution_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 5. Update handle_new_user to NOT assign a default role, or assign 'pending'
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
    WHEN NEW.raw_user_meta_data->>'role' IN ('student','mentor','admin', 'institution')
      THEN (NEW.raw_user_meta_data->>'role')::public.app_role
    ELSE 'pending'::public.app_role
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, wanted)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 6. Create complete_onboarding RPC
CREATE OR REPLACE FUNCTION public.complete_onboarding(_role public.app_role, _institution_id UUID, _full_name TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF _role NOT IN ('student', 'mentor') THEN
    RAISE EXCEPTION 'Invalid role selection';
  END IF;

  -- Remove 'pending' role if exists
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';

  -- Insert the new role
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Update profile with name and institution
  UPDATE public.profiles
  SET 
    full_name = _full_name,
    institution_id = _institution_id
  WHERE id = auth.uid();
END;
$$;
GRANT EXECUTE ON FUNCTION public.complete_onboarding(public.app_role, UUID, TEXT) TO authenticated;
