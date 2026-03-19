import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockAttendance, mockSubjects, mockStudents, type AttendanceRecord } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle, XCircle, Lock, AlertTriangle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Types ───
interface AttendanceMark {
  studentId: string;
  studentName: string;
  status: "present" | "absent";
}

interface CorrectionRequest {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedAt: string;
}

// ─── Staff: Mark Attendance ───
function StaffMarkAttendance({ onSave }: { onSave: (records: AttendanceRecord[]) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const staffSubjects = mockSubjects.filter(s => s.faculty === "Dr. Sarah Chen");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [marks, setMarks] = useState<AttendanceMark[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const csStudents = mockStudents.filter(s => s.department === "Computer Science" && s.status === "active");

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSubmitted(false);
    setMarks(csStudents.map(s => ({ studentId: s.id, studentName: s.name, status: "present" })));
  };

  const toggleStatus = (studentId: string) => {
    if (submitted) return;
    setMarks(prev => prev.map(m => m.studentId === studentId ? { ...m, status: m.status === "present" ? "absent" : "present" } : m));
  };

  const handleSubmit = () => {
    const subject = staffSubjects.find(s => s.id === selectedSubject);
    if (!subject) return;
    const newRecords: AttendanceRecord[] = marks.map((m, i) => ({
      id: `att_new_${Date.now()}_${i}`,
      studentId: m.studentId,
      studentName: m.studentName,
      subjectId: subject.id,
      subjectName: subject.name,
      date,
      status: m.status,
      markedBy: user?.name || "Staff",
    }));
    onSave(newRecords);
    setSubmitted(true);
    toast({ title: "Attendance Saved & Locked", description: `${marks.length} records saved for ${subject.name}. Attendance is now locked.` });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Mark Attendance</h3>
        {submitted && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <Lock className="h-3 w-3" /> Locked
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Subject</Label>
          <Select value={selectedSubject} onValueChange={handleSubjectChange} disabled={submitted}>
            <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
            <SelectContent>
              {staffSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Date</Label>
          <Input value={date} disabled className="font-mono text-xs" />
        </div>
      </div>

      {selectedSubject && marks.length > 0 && (
        <>
          <div className="border border-border rounded-md overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Student</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Enrollment</th>
                  <th className="px-4 py-2 text-center font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(m => {
                  const student = csStudents.find(s => s.id === m.studentId);
                  return (
                    <tr key={m.studentId} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-medium">{m.studentName}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{student?.enrollmentNo}</td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          onClick={() => toggleStatus(m.studentId)}
                          disabled={submitted}
                          className={cn(
                            "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-colors",
                            m.status === "present"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-destructive/10 text-destructive hover:bg-destructive/20",
                            submitted && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          {m.status === "present" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {m.status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Present: {marks.filter(m => m.status === "present").length} · Absent: {marks.filter(m => m.status === "absent").length}
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={submitted}>
              {submitted ? "✓ Submitted & Locked" : "Save Attendance"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Staff: Correction Request ───
function StaffCorrectionRequest({ corrections, onRequest }: { corrections: CorrectionRequest[]; onRequest: (c: CorrectionRequest) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const student = mockStudents.find(s => s.enrollmentNo === fd.get("enrollment"));
    if (!student) {
      toast({ title: "Student not found", variant: "destructive" });
      return;
    }
    const req: CorrectionRequest = {
      id: `cr_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      subjectName: fd.get("subject") as string,
      date: fd.get("date") as string,
      reason: fd.get("reason") as string,
      status: "pending",
      requestedBy: user?.name || "Staff",
      requestedAt: new Date().toISOString(),
    };
    onRequest(req);
    setDialogOpen(false);
    toast({ title: "Correction Request Sent", description: "Sent to admin for approval." });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" /> Attendance Corrections
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline"><Send className="h-3 w-3 mr-1" /> Request Correction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Request Attendance Correction</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Staff cannot edit past attendance directly. Submit a correction request for admin approval.</p>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <div><Label htmlFor="enrollment">Student Enrollment No.</Label><Input id="enrollment" name="enrollment" placeholder="EDU2024001" required /></div>
              <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" placeholder="Algorithm Design" required /></div>
              <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" required /></div>
              <div><Label htmlFor="reason">Reason for Correction</Label><Textarea id="reason" name="reason" placeholder="Medical certificate provided..." required /></div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {corrections.length === 0 ? (
        <p className="text-xs text-muted-foreground">No correction requests yet.</p>
      ) : (
        <div className="space-y-2">
          {corrections.map(c => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
              <div>
                <span className="font-medium">{c.studentName}</span>
                <span className="text-xs text-muted-foreground ml-2">{c.subjectName} · {c.date}</span>
                <div className="text-xs text-muted-foreground mt-0.5">Reason: {c.reason}</div>
              </div>
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded capitalize",
                c.status === "pending" ? "bg-warning/10 text-warning" :
                c.status === "approved" ? "bg-success/10 text-success" :
                "bg-destructive/10 text-destructive"
              )}>{c.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── View-only attendance table ───
function AttendanceTable({ records }: { records: AttendanceRecord[] }) {
  const [search, setSearch] = useState("");
  const filtered = records.filter(
    (a) => a.studentName.toLowerCase().includes(search.toLowerCase()) || a.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by student or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Subject</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Marked By</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                <td className="px-4 py-3 font-medium">{a.studentName}</td>
                <td className="px-4 py-3">{a.subjectName}</td>
                <td className="px-4 py-3 font-mono text-xs">{a.date}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded",
                    a.status === "present" ? "bg-success/10 text-success" : a.status === "late" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                  )}>{a.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.markedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Main Page ───
export default function AttendancePage() {
  const { user } = useAuth();
  const [extraRecords, setExtraRecords] = useState<AttendanceRecord[]>([]);
  const [corrections, setCorrections] = useState<CorrectionRequest[]>([]);
  const isStaff = user?.role === "staff";
  const allRecords = [...mockAttendance, ...extraRecords];

  // Students see only their own
  const visibleRecords = user?.role === "student"
    ? allRecords.filter(a => a.studentId === "s1")
    : user?.role === "parent"
      ? allRecords.filter(a => a.studentId === "s1")
      : allRecords;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isStaff ? "Mark and manage attendance for your classes." : `${visibleRecords.length} records`}
          </p>
        </div>

        {isStaff && (
          <>
            <StaffMarkAttendance onSave={(records) => setExtraRecords(prev => [...prev, ...records])} />
            <StaffCorrectionRequest corrections={corrections} onRequest={(c) => setCorrections(prev => [c, ...prev])} />
          </>
        )}

        <AttendanceTable records={visibleRecords} />
      </div>
    </AppLayout>
  );
}
