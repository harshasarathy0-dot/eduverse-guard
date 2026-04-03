import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

// ─── Students ───
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => api.get<any[]>("/users?role=student"),
  });
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (student: { name: string; email: string; department: string; semester: number; enrollment_no: string }) =>
      api.post("/users/create", { ...student, role: "student", password: "student123" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["students"] }); toast.success("Student added"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Attendance ───
export function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: () => api.get<any[]>("/attendance"),
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (record: { student_id: number; date: string; status: string; marked_by: number }) =>
      api.post("/attendance/mark", record),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Attendance marked"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Fees ───
export function useFees() {
  return useQuery({
    queryKey: ["fees"],
    queryFn: () => api.get<any[]>("/fees"),
  });
}

// ─── Complaints ───
export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: () => api.get<any[]>("/complaints"),
  });
}

export function useAddComplaint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (complaint: { description: string; image?: string }) =>
      api.post("/complaints", complaint),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["complaints"] }); toast.success("Complaint submitted"); },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─── Login Logs ───
export function useLoginLogs() {
  return useQuery({
    queryKey: ["login_logs"],
    queryFn: () => api.get<any[]>("/auth/logs"),
  });
}

// ─── Courses ───
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get<any[]>("/courses"),
  });
}

// ─── Announcements (mock fallback since backend may not have this) ───
export function useAnnouncements() {
  return useQuery({ queryKey: ["announcements"], queryFn: () => Promise.resolve([]) });
}

// ─── Incident Reports (mock fallback) ───
export function useIncidentReports() {
  return useQuery({ queryKey: ["incident_reports"], queryFn: () => Promise.resolve([]) });
}

// ─── Image Upload (no-op for local) ───
export function useUploadComplaintImage() {
  return useMutation({
    mutationFn: async (_file: File) => "",
    onError: (err: Error) => toast.error(`Upload failed: ${err.message}`),
  });
}
