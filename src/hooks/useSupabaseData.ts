import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { mockStudents, mockAttendance, mockCourses, mockLoginLogs } from "@/lib/mockData";
import { mockFeePayments } from "@/lib/mockFees";
import { mockAnnouncements } from "@/lib/announcements";

// Helper: try API, fall back to mock
async function fetchWithFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    return await api.get<T>(path);
  } catch {
    return fallback;
  }
}

// ─── Students ───
export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => fetchWithFallback("/users?role=student", mockStudents.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      enrollment_no: s.enrollmentNo,
      department: s.department,
      semester: s.semester,
      gpa: s.gpa,
      status: s.status,
    }))),
    retry: false,
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
    queryFn: () => fetchWithFallback("/attendance", mockAttendance.map(a => ({
      id: a.id,
      student_id: a.studentId,
      student_name: a.studentName,
      subject_name: a.subjectName,
      date: a.date,
      status: a.status,
      marked_by: a.markedBy,
    }))),
    retry: false,
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
    queryFn: () => fetchWithFallback("/fees", mockFeePayments.map(f => ({
      id: f.id,
      student_id: f.studentId,
      student_name: f.studentName,
      total: f.amount,
      paid: f.paidAmount,
      pending: f.amount - f.paidAmount,
      status: f.status,
      semester: null,
      due_date: null,
    }))),
    retry: false,
  });
}

// ─── Complaints ───
export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: () => fetchWithFallback("/complaints", []),
    retry: false,
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
    queryFn: () => fetchWithFallback("/auth/logs", mockLoginLogs.map(l => ({
      id: l.id,
      user_id: l.userId,
      user_name: l.userName,
      ip: l.ip,
      device: l.device,
      created_at: l.timestamp,
      risk_score: l.riskScore,
      risk_level: l.riskLevel,
      success: l.success,
    }))),
    retry: false,
  });
}

// ─── Courses ───
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => fetchWithFallback("/courses", mockCourses.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      department: c.department,
      credits: c.credits,
      faculty: c.faculty,
      enrolled: c.enrolled,
      capacity: c.capacity,
      semester: c.semester,
    }))),
    retry: false,
  });
}

// ─── Announcements ───
export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => Promise.resolve(mockAnnouncements),
    retry: false,
  });
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
