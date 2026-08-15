-- 1. Grant INSERT to anon role so unconfirmed users can submit requests
GRANT INSERT ON public.institution_requests TO anon;

-- 2. Add phone_number and proof_details to the table
ALTER TABLE public.institution_requests
ADD COLUMN phone_number TEXT,
ADD COLUMN proof_details TEXT;
