import AppLayout from "@/components/AppLayout";
import { mockAttendance } from "@/lib/mockData";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const filtered = mockAttendance.filter(
    (a) => a.studentName.toLowerCase().includes(search.toLowerCase()) || a.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockAttendance.length} records</p>
        </div>
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
      </div>
    </AppLayout>
  );
}
