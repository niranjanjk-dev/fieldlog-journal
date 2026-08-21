CREATE OR REPLACE FUNCTION public.complete_onboarding(_role public.app_role, _institution_id UUID, _full_name TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _role NOT IN ('student', 'mentor') THEN RAISE EXCEPTION 'Invalid role selection'; END IF;

  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), _role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
  -- Auto-verify students so they don't require institution approval
  UPDATE public.profiles 
  SET full_name = _full_name, 
      institution_id = _institution_id,
      institution_verified = (_role = 'student')
  WHERE id = auth.uid();

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
