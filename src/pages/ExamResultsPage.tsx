import { useState } from "react";
import { Award, TrendingUp, TrendingDown, Search } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  subjectCode: string;
  subjectName: string;
  examType: "midterm" | "final" | "quiz";
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  date: string;
}

const mockResults: ExamResult[] = [
  { id: "r1", studentId: "s1", studentName: "James Wilson", subjectCode: "CS301-A", subjectName: "Algorithm Design", examType: "midterm", maxMarks: 100, obtainedMarks: 82, grade: "A", date: "2026-02-15" },
  { id: "r2", studentId: "s1", studentName: "James Wilson", subjectCode: "CS301-B", subjectName: "Data Structure Implementation", examType: "midterm", maxMarks: 100, obtainedMarks: 74, grade: "B+", date: "2026-02-16" },
  { id: "r3", studentId: "s1", studentName: "James Wilson", subjectCode: "MA201-A", subjectName: "Matrix Theory", examType: "midterm", maxMarks: 100, obtainedMarks: 68, grade: "B", date: "2026-02-17" },
  { id: "r4", studentId: "s1", studentName: "James Wilson", subjectCode: "CS405-A", subjectName: "Neural Networks", examType: "quiz", maxMarks: 50, obtainedMarks: 42, grade: "A", date: "2026-03-01" },
  { id: "r5", studentId: "s2", studentName: "Maria Garcia", subjectCode: "MA201-A", subjectName: "Matrix Theory", examType: "midterm", maxMarks: 100, obtainedMarks: 95, grade: "A+", date: "2026-02-17" },
  { id: "r6", studentId: "s4", studentName: "Aisha Patel", subjectCode: "CS301-A", subjectName: "Algorithm Design", examType: "midterm", maxMarks: 100, obtainedMarks: 88, grade: "A", date: "2026-02-15" },
  { id: "r7", studentId: "s3", studentName: "Liam O'Brien", subjectCode: "PH101-A", subjectName: "Newtonian Mechanics", examType: "midterm", maxMarks: 100, obtainedMarks: 61, grade: "B-", date: "2026-02-18" },
  { id: "r8", studentId: "s6", studentName: "Sophie Laurent", subjectCode: "BI301-A", subjectName: "Genetics", examType: "midterm", maxMarks: 100, obtainedMarks: 78, grade: "B+", date: "2026-02-19" },
];

const gradeColor: Record<string, string> = {
  "A+": "text-success", "A": "text-success", "B+": "text-secondary", "B": "text-secondary",
  "B-": "text-warning", "C+": "text-warning", "C": "text-destructive", "F": "text-destructive",
};

function StaffEnterMarks() {
  const [entered, setEntered] = useState(false);
  return (
    <div className="bg-card border border-border rounded-lg p-5 mt-6">
      <h3 className="font-semibold text-sm mb-4">Enter Marks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Student ID" defaultValue="s1" />
        <Input placeholder="Subject Code" defaultValue="CS301-A" />
        <Input placeholder="Marks Obtained" type="number" defaultValue="85" />
      </div>
      <Button size="sm" onClick={() => setEntered(true)}>
        {entered ? "✓ Marks Saved" : "Submit Marks"}
      </Button>
      {entered && <p className="text-xs text-success mt-2">Marks submitted successfully (simulated).</p>}
    </div>
  );
}

export default function ExamResultsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const isStudentOrParent = user?.role === "student" || user?.role === "parent";
  const results = isStudentOrParent
    ? mockResults.filter(r => r.studentId === "s1")
    : mockResults.filter(r => r.studentName.toLowerCase().includes(search.toLowerCase()) || r.subjectName.toLowerCase().includes(search.toLowerCase()));

  const avgPercent = results.length > 0
    ? Math.round(results.reduce((s, r) => s + (r.obtainedMarks / r.maxMarks) * 100, 0) / results.length)
    : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Award className="h-6 w-6 text-secondary" /> Exam Results
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudentOrParent ? "Your examination scores and grades." : "Manage and view student results."}
            </p>
          </div>
          {isStudentOrParent && (
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
              {avgPercent >= 70 ? <TrendingUp className="h-5 w-5 text-success" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
              <div>
                <div className="text-lg font-bold">{avgPercent}%</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
            </div>
          )}
        </div>

        {!isStudentOrParent && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search student or subject..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        )}

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {!isStudentOrParent && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>}
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exam</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Marks</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">%</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => {
                const pct = Math.round((r.obtainedMarks / r.maxMarks) * 100);
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    {!isStudentOrParent && <td className="px-4 py-3 font-medium">{r.studentName}</td>}
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.subjectName}</div>
                      <div className="text-xs text-muted-foreground">{r.subjectCode}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{r.examType}</td>
                    <td className="px-4 py-3 font-mono">{r.obtainedMarks}/{r.maxMarks}</td>
                    <td className="px-4 py-3 font-mono">{pct}%</td>
                    <td className={cn("px-4 py-3 font-bold", gradeColor[r.grade] || "")}>{r.grade}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(user?.role === "admin" || user?.role === "staff") && <StaffEnterMarks />}
      </div>
    </AppLayout>
  );
}
