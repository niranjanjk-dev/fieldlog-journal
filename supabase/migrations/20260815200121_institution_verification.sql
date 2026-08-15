-- Add institution_verified column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution_verified BOOLEAN NOT NULL DEFAULT false;

-- RPC for an institution to verify a user
CREATE OR REPLACE FUNCTION public.verify_institution_member(_target_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  caller_inst_id UUID;
  target_inst_id UUID;
BEGIN
  -- Verify caller is authenticated and has institution role
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'institution') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get caller's institution ID
  SELECT institution_id INTO caller_inst_id FROM public.profiles WHERE id = auth.uid();
  IF caller_inst_id IS NULL THEN
    RAISE EXCEPTION 'Caller is not linked to an institution';
  END IF;

  -- Get target's institution ID
  SELECT institution_id INTO target_inst_id FROM public.profiles WHERE id = _target_user_id;
  IF target_inst_id IS NULL OR target_inst_id != caller_inst_id THEN
    RAISE EXCEPTION 'User does not belong to your institution';
  END IF;

  -- Verify user
  UPDATE public.profiles SET institution_verified = true WHERE id = _target_user_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.verify_institution_member(UUID) TO authenticated;

-- Update complete_onboarding to automatically create "My Mentees" team for mentors
CREATE OR REPLACE FUNCTION public.complete_onboarding(_role public.app_role, _institution_id UUID, _full_name TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- 1. Remove pending role
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';
  
  -- 2. Insert requested role
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- 3. Update profile with institution and name
  UPDATE public.profiles 
  SET institution_id = _institution_id,
      full_name = _full_name
  WHERE id = auth.uid();

  -- 4. If the role is mentor, automatically create a default "My Mentees" team
  IF _role = 'mentor' THEN
    INSERT INTO public.teams (name, description, mentor_id, accent)
    VALUES ('My Mentees', 'Default team for all your individual mentees.', auth.uid(), 'blue')
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;
