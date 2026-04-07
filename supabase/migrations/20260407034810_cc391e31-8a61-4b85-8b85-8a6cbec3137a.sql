
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  faculty TEXT NOT NULL DEFAULT '',
  enrolled INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 60,
  semester TEXT NOT NULL DEFAULT 'Fall 2026',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
