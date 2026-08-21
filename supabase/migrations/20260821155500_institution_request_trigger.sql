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

  -- Auto-create institution request if role is pending and institution details exist
  IF wanted = 'pending'::public.app_role 
     AND NEW.raw_user_meta_data->>'institution' IS NOT NULL THEN
    
    INSERT INTO public.institution_requests (
      user_id,
      institution_name,
      email,
      phone_number,
      proof_details,
      status
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'institution',
      NEW.email,
      NEW.raw_user_meta_data->>'phone_number',
      NEW.raw_user_meta_data->>'proof_details',
      'pending'
    );
  END IF;

  RETURN NEW;
END;
$$;
