
-- Fix complaints INSERT policy: ensure user_id matches auth.uid() or is null (anonymous)
DROP POLICY "Authenticated users can create complaints" ON public.complaints;
CREATE POLICY "Authenticated users can create complaints" ON public.complaints FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR (anonymous = true AND user_id IS NULL));

-- Fix login_logs INSERT policy: ensure user_id matches auth.uid()
DROP POLICY "Anyone can insert login logs" ON public.login_logs;
CREATE POLICY "Users can insert own login logs" ON public.login_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
