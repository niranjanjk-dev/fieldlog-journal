
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  -- Only student/mentor may be self-selected at signup. Admin must be granted
  -- by an existing admin through the privileged role-management path.
  wanted := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'mentor' THEN 'mentor'::public.app_role
    ELSE 'student'::public.app_role
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, wanted)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END; $function$;
