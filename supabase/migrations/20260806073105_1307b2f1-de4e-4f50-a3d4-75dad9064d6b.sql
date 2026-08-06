
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_mentor_of(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_collaborator(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_view_entry(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

CREATE POLICY "entry_photos_insert_own_folder" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'entry-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "entry_photos_delete_own_folder" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'entry-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "entry_photos_select_visible" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'entry-photos'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.entries e
        WHERE e.photo_path = storage.objects.name
          AND public.can_view_entry(e.id, auth.uid())
      )
    )
  );
