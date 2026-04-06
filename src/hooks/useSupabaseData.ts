import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ─── Students ───
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: { name: string; email: string; department: string; semester: number; enrollment_no: string }) => {
      const { data, error } = await supabase.from("students").insert({
        name: student.name,
        email: student.email,
        department: student.department,
        semester: student.semester,
        enrollment_no: student.enrollment_no,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["students"] }); toast.success("Student added"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Attendance ───
export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data, error } = await supabase.from("attendance").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: { student_id: string; student_name: string; subject_name: string; date: string; status: "present" | "absent" | "late"; marked_by: string }) => {
      const { data, error } = await supabase.from("attendance").insert(record).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Attendance marked"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Fees ───
export function useFees() {
  return useQuery({
    queryKey: ["fees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees").select("*");
      if (error) throw error;
      return data;
    },
  });
}

// ─── Complaints ───
export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: async () => {
      const { data, error } = await supabase.from("complaints").select("*");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (complaint: { title: string; description: string; tracking_id: string; category?: string; anonymous?: boolean; image_url?: string; user_id?: string }) => {
      const { data, error } = await supabase.from("complaints").insert(complaint).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["complaints"] }); toast.success("Complaint submitted"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Login Logs ───
export function useLoginLogs() {
  return useQuery({
    queryKey: ["login_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("login_logs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Courses (no table yet, return empty) ───
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => Promise.resolve([]),
  });
}

// ─── Faculty ───
export function useFaculty() {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faculty").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: { name: string; email: string; department: string; designation: string }) => {
      const { data, error } = await supabase.from("faculty").insert(faculty).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faculty"] }); toast.success("Faculty added"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Announcements ───
export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Incident Reports ───
export function useIncidentReports() {
  return useQuery({
    queryKey: ["incident_reports"],
    queryFn: async () => {
      const { data, error } = await supabase.from("incident_reports").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Image Upload ───
export function useUploadComplaintImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("complaint-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("complaint-images").getPublicUrl(path);
      return data.publicUrl;
    },
    onError: (err: Error) => toast.error(`Upload failed: ${err.message}`),
  });
}
