-- Add username to profiles for public routing
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
CREATE INDEX profiles_username_idx ON public.profiles (username);

-- Secure RPC to allow a student to leave a team and automatically notify the mentor
CREATE OR REPLACE FUNCTION public.leave_team(_team_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _mentor_id UUID;
  _team_name TEXT;
  _student_name TEXT;
BEGIN
  -- Validate that the student is actually in this team
  IF NOT EXISTS (SELECT 1 FROM public.team_members WHERE team_id = _team_id AND student_id = auth.uid()) THEN
    RAISE EXCEPTION 'You are not a member of this team';
  END IF;

  -- Get team and mentor details
  SELECT mentor_id, name INTO _mentor_id, _team_name 
  FROM public.teams 
  WHERE id = _team_id;

  -- Get student details
  SELECT full_name INTO _student_name 
  FROM public.profiles 
  WHERE id = auth.uid();

  -- Delete the student from the team
  DELETE FROM public.team_members 
  WHERE team_id = _team_id AND student_id = auth.uid();

  -- Send a nudge (notification) to the mentor
  -- The student_id in the nudges table is the recipient, so we use _mentor_id here.
  -- The sender_id is the student.
  INSERT INTO public.nudges (student_id, sender_id, message)
  VALUES (
    _mentor_id, 
    auth.uid(), 
    COALESCE(_student_name, 'A student') || ' has left your team: ' || _team_name
  );
END;
$$;
