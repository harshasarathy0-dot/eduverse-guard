
CREATE TABLE public.faculty (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  department text NOT NULL,
  designation text NOT NULL DEFAULT 'Lecturer',
  courses integer NOT NULL DEFAULT 0,
  join_date date NOT NULL DEFAULT CURRENT_DATE,
  user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read faculty" ON public.faculty FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert faculty" ON public.faculty FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update faculty" ON public.faculty FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete faculty" ON public.faculty FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
