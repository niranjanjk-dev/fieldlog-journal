-- Drop the old policy that restricted to authenticated
DROP POLICY IF EXISTS "institution_requests_insert_own" ON public.institution_requests;

-- Create a new policy that allows anyone (even unauthenticated) to submit a request
-- This is necessary because if email confirmation is turned on, the user is not authenticated yet when they sign up!
CREATE POLICY "institution_requests_insert_all" ON public.institution_requests FOR INSERT 
  WITH CHECK (true);

-- Create a helper function so you can easily make yourself a System Admin
CREATE OR REPLACE FUNCTION public.make_me_admin()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete pending role if it exists
  DELETE FROM public.user_roles WHERE user_id = auth.uid() AND role = 'pending';

  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
GRANT EXECUTE ON FUNCTION public.make_me_admin() TO authenticated;
