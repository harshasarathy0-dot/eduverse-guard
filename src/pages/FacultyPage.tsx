import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { mockFaculty, type Faculty } from "@/lib/mockData";
import { useFaculty, useAddFaculty } from "@/hooks/useSupabaseData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacultyPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: dbFaculty, isLoading, isError } = useFaculty();
  const addFaculty = useAddFaculty();

  // Use Supabase data if available, fallback to mock
  const faculty = dbFaculty && dbFaculty.length > 0
    ? dbFaculty.map(f => ({
        id: f.id,
        name: f.name,
        email: f.email,
        department: f.department,
        designation: f.designation,
        courses: f.courses,
        joinDate: f.join_date,
      }))
    : mockFaculty;

  const filtered = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addFaculty.mutate({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      department: fd.get("department") as string,
      designation: fd.get("designation") as string,
    });
    setDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Faculty</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${faculty.length} members`}
              {isError && " (showing cached data)"}
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> Add Faculty</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Faculty Member</DialogTitle></DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
                <div><Label htmlFor="department">Department</Label><Input id="department" name="department" required /></div>
                <div><Label htmlFor="designation">Designation</Label><Input id="designation" name="designation" required /></div>
                <Button type="submit" className="w-full" disabled={addFaculty.isPending}>
                  {addFaculty.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Adding...</> : "Add Member"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search faculty..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((f) => (
              <div key={f.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm">{f.name}</h3>
                    <p className="text-xs text-muted-foreground">{f.designation}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{f.department}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Courses</span><span className="font-medium">{f.courses}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span className="font-mono text-xs">{f.joinDate}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
