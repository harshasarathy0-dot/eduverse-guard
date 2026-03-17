import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockCourses, type Course } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, BookOpen } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCourse: Course = {
      id: `c${Date.now()}`,
      code: fd.get("code") as string,
      name: fd.get("name") as string,
      department: fd.get("department") as string,
      credits: Number(fd.get("credits")),
      faculty: fd.get("faculty") as string,
      enrolled: 0,
      capacity: Number(fd.get("capacity")),
      semester: "Fall 2026",
    };
    setCourses((prev) => [newCourse, ...prev]);
    setDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
            <p className="text-sm text-muted-foreground mt-1">{courses.length} active courses</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Course</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="code">Code</Label><Input id="code" name="code" placeholder="CS301" required /></div>
                  <div><Label htmlFor="credits">Credits</Label><Input id="credits" name="credits" type="number" min={1} max={6} required /></div>
                </div>
                <div><Label htmlFor="name">Course Name</Label><Input id="name" name="name" required /></div>
                <div><Label htmlFor="department">Department</Label><Input id="department" name="department" required /></div>
                <div><Label htmlFor="faculty">Faculty</Label><Input id="faculty" name="faculty" required /></div>
                <div><Label htmlFor="capacity">Capacity</Label><Input id="capacity" name="capacity" type="number" min={1} required /></div>
                <Button type="submit" className="w-full">Create Course</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Course</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Faculty</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Credits</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Enrollment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors duration-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-md bg-secondary/10 flex items-center justify-center"><BookOpen className="h-3.5 w-3.5 text-secondary" /></div>
                      <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground font-mono">{c.code}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.department}</td>
                  <td className="px-4 py-3">{c.faculty}</td>
                  <td className="px-4 py-3 text-center">{c.credits}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={(c.enrolled / c.capacity) * 100} className="h-2 flex-1" />
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{c.enrolled}/{c.capacity}</span>
                    </div>
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
