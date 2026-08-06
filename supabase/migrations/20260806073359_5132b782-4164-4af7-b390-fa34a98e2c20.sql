
ALTER TABLE public.entries
  ADD CONSTRAINT entries_student_profile_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.entry_comments
  ADD CONSTRAINT entry_comments_author_profile_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.entry_collaborators
  ADD CONSTRAINT entry_collab_student_profile_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.nudges
  ADD CONSTRAINT nudges_student_profile_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.nudges
  ADD CONSTRAINT nudges_sender_profile_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.team_members
  ADD CONSTRAINT team_members_student_profile_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.teams
  ADD CONSTRAINT teams_mentor_profile_fkey FOREIGN KEY (mentor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
