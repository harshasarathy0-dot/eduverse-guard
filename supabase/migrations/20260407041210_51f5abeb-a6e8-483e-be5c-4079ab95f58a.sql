
-- ═══ 1. Fix profiles SELECT policies ═══
DROP POLICY IF EXISTS "Anyone authenticated can read profiles" ON public.profiles;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins and staff can read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- ═══ 2. Fix login_logs: let users read own logs ═══
CREATE POLICY "Users can read own login logs"
  ON public.login_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ═══ 3. Fix login_logs: server-side overwrite of sensitive fields ═══
CREATE OR REPLACE FUNCTION public.sanitize_login_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_name TEXT;
BEGIN
  -- Force user_id to the authenticated user
  NEW.user_id := auth.uid();

  -- Derive user_name from profiles instead of trusting client
  SELECT name INTO profile_name FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
  NEW.user_name := COALESCE(profile_name, 'Unknown');

  -- Reset risk fields to safe defaults (let server-side logic compute real values)
  NEW.risk_score := 0;
  NEW.risk_level := 'low';

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sanitize_login_log
  BEFORE INSERT ON public.login_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_login_log();

-- ═══ 4. Make complaint-images bucket private ═══
UPDATE storage.buckets SET public = false WHERE id = 'complaint-images';

-- Drop the public SELECT policy if it exists
DROP POLICY IF EXISTS "Anyone can view complaint images" ON storage.objects;

-- Admins and staff can view all complaint images
CREATE POLICY "Admins and staff can view complaint images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'complaint-images'
    AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role))
  );

-- Users can view images from their own complaints
CREATE POLICY "Users can view own complaint images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'complaint-images'
    AND EXISTS (
      SELECT 1 FROM public.complaints
      WHERE complaints.user_id = auth.uid()
        AND complaints.image_url LIKE '%' || storage.objects.name
    )
  );
