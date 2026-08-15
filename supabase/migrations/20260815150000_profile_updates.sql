-- Add has_changed_name, phone, and position to profiles table

ALTER TABLE public.profiles
ADD COLUMN has_changed_name BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN phone TEXT,
ADD COLUMN position TEXT;
