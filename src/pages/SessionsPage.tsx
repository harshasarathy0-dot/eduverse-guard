import AppLayout from "@/components/AppLayout";
import { mockSessions } from "@/lib/mockData";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage academic year sessions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSessions.map((s) => (
            <div key={s.id} className={cn("bg-card border rounded-lg p-5", s.status === "active" && "border-secondary/40")}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded",
                    s.status === "active" ? "bg-success/10 text-success" : s.status === "upcoming" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  )}>{s.status}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Start</span><span className="font-mono text-xs">{s.startDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">End</span><span className="font-mono text-xs">{s.endDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span className="font-medium">{s.totalStudents}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
