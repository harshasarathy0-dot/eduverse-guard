import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockStudents, type Student } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      enrollmentNo: `EDU${Date.now().toString().slice(-7)}`,
      department: fd.get("department") as string,
      semester: Number(fd.get("semester")),
      gpa: 0,
      status: "active",
    };
    setStudents((prev) => [newStudent, ...prev]);
    setDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Students</h1>
            <p className="text-sm text-muted-foreground mt-1">{students.length} total students</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
                <div><Label htmlFor="department">Department</Label><Input id="department" name="department" required /></div>
                <div><Label htmlFor="semester">Semester</Label><Input id="semester" name="semester" type="number" min={1} max={8} required /></div>
                <Button type="submit" className="w-full">Create Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Enrollment</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Semester</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">GPA</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-secondary/10 flex items-center justify-center"><GraduationCap className="h-3.5 w-3.5 text-secondary" /></div>
                      <div><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.email}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{s.enrollmentNo}</td>
                  <td className="px-4 py-3">{s.department}</td>
                  <td className="px-4 py-3">{s.semester}</td>
                  <td className="px-4 py-3 font-mono">{s.gpa.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", s.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
