import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockAssignments, type Assignment } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Plus, Clock, CheckCircle, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isStaff = user?.role === "staff";
  const isAdmin = user?.role === "admin";

  const filtered = assignments.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  // Staff sees only their own assignments
  const visible = isStaff
    ? filtered.filter(a => a.faculty === "Dr. Sarah Chen")
    : filtered;

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAssignment: Assignment = {
      id: `asg_${Date.now()}`,
      title: fd.get("title") as string,
      subjectId: "sub1",
      subjectName: fd.get("subject") as string,
      faculty: user?.name || "Staff",
      dueDate: fd.get("dueDate") as string,
      status: "open",
      totalSubmissions: 0,
      totalStudents: 45,
      description: fd.get("description") as string,
    };
    setAssignments(prev => [newAssignment, ...prev]);
    setDialogOpen(false);
    toast({ title: "Assignment Created", description: `"${newAssignment.title}" created with deadline ${newAssignment.dueDate}.` });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
            <p className="text-sm text-muted-foreground mt-1">{visible.length} assignments</p>
          </div>
          {(isStaff || isAdmin) && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Assignment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Assignment</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-3 mt-2">
                  <div><Label htmlFor="title">Title</Label><Input id="title" name="title" placeholder="Binary Tree Implementation" required /></div>
                  <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" placeholder="Data Structure Implementation" required /></div>
                  <div><Label htmlFor="dueDate">Deadline</Label><Input id="dueDate" name="dueDate" type="date" required /></div>
                  <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="Describe the assignment..." required /></div>
                  <Button type="submit" className="w-full">Create</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((a) => {
            const isOverdue = a.status === "open" && a.dueDate < today;
            const submissionPct = Math.round((a.totalSubmissions / a.totalStudents) * 100);
            return (
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
                      {isOverdue && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-destructive/10 text-destructive">overdue</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.subjectName} · {a.faculty}</p>
                    <p className="text-xs text-muted-foreground mt-2">{a.description}</p>

                    {/* Submission tracking */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1">
                        <Progress value={submissionPct} className="h-2" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> {a.totalSubmissions}/{a.totalStudents}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-warning">
                        <Clock className="h-3 w-3" /> Due: {a.dueDate}
                      </span>
                      {submissionPct === 100 && (
                        <span className="flex items-center gap-1 text-success font-semibold">
                          <CheckCircle className="h-3 w-3" /> All submitted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
