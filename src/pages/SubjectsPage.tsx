import AppLayout from "@/components/AppLayout";
import { mockSubjects } from "@/lib/mockData";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, BookMarked } from "lucide-react";

export default function SubjectsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockSubjects.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-1">{mockSubjects.length} subjects across all courses</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center">
                  <BookMarked className="h-5 w-5 text-secondary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{s.code}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="font-medium text-xs">{s.courseName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Faculty</span><span className="font-medium text-xs">{s.faculty}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Credits</span><span className="font-mono">{s.credits}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
