import AppLayout from "@/components/AppLayout";
import { mockAssignments } from "@/lib/mockData";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockAssignments.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockAssignments.length} assignments</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <div key={a.id} className={cn("bg-card border rounded-lg p-5", a.status === "open" && "border-secondary/30")}>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                      a.status === "open" ? "bg-success/10 text-success" : a.status === "closed" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                    )}>{a.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.subjectName} · {a.faculty}</p>
                  <p className="text-xs text-muted-foreground mt-2">{a.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={(a.totalSubmissions / a.totalStudents) * 100} className="h-2" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{a.totalSubmissions}/{a.totalStudents}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-warning">Due: {a.dueDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
