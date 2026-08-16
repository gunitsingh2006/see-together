DROP POLICY IF EXISTS "Anyone can create rooms" ON public.rooms;
DROP POLICY IF EXISTS "Anyone can read rooms" ON public.rooms;
DROP POLICY IF EXISTS "Anyone can update rooms" ON public.rooms;

REVOKE ALL ON public.rooms FROM anon;
REVOKE ALL ON public.rooms FROM authenticated;
GRANT ALL ON public.rooms TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;