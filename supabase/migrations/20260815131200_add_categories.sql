-- Add category column to entries
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS category TEXT;
