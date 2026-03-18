import { useState } from "react";
import { Briefcase, Upload, CheckCircle, Plus, Search } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  date: string;
  eligibility: string;
  status: "upcoming" | "ongoing" | "completed";
  selected: number;
  applied: number;
}

interface StudentPlacement {
  aptitudeScore: number;
  codingScore: number;
  resumeUploaded: boolean;
  appliedDrives: string[];
}

const mockDrives: PlacementDrive[] = [
  { id: "pd1", company: "Google", role: "SDE Intern", date: "2026-04-10", eligibility: "CS, GPA ≥ 3.5", status: "upcoming", selected: 0, applied: 22 },
  { id: "pd2", company: "Microsoft", role: "Software Engineer", date: "2026-04-15", eligibility: "CS/IT, GPA ≥ 3.0", status: "upcoming", selected: 0, applied: 35 },
  { id: "pd3", company: "Infosys", role: "Systems Engineer", date: "2026-03-05", eligibility: "All branches", status: "completed", selected: 12, applied: 68 },
  { id: "pd4", company: "TCS", role: "Developer", date: "2026-03-10", eligibility: "All branches, GPA ≥ 2.5", status: "completed", selected: 28, applied: 95 },
];

const mockStudentPlacement: StudentPlacement = {
  aptitudeScore: 72,
  codingScore: 85,
  resumeUploaded: false,
  appliedDrives: ["pd1"],
};

const statusColors: Record<string, string> = {
  upcoming: "bg-secondary/10 text-secondary",
  ongoing: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
};

export default function PlacementPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(mockStudentPlacement.resumeUploaded);
  const [showAddDrive, setShowAddDrive] = useState(false);

  const isStudent = user?.role === "student";
  const filtered = mockDrives.filter(d => d.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-secondary" /> Placement Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isStudent ? "Track your preparation and apply for drives." : "Manage placement drives and track students."}
            </p>
          </div>
          {(user?.role === "admin" || user?.role === "staff") && (
            <Button size="sm" onClick={() => setShowAddDrive(!showAddDrive)}>
              <Plus className="h-4 w-4 mr-1" /> Add Drive
            </Button>
          )}
        </div>

        {isStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Aptitude Score</div>
              <div className="text-2xl font-bold">{mockStudentPlacement.aptitudeScore}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${mockStudentPlacement.aptitudeScore}%` }} />
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Coding Score</div>
              <div className="text-2xl font-bold">{mockStudentPlacement.codingScore}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${mockStudentPlacement.codingScore}%` }} />
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Resume</div>
              {resumeUploaded ? (
                <div className="flex items-center gap-2 text-success"><CheckCircle className="h-5 w-5" /> Uploaded</div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setResumeUploaded(true)}>
                  <Upload className="h-4 w-4 mr-1" /> Upload Resume
                </Button>
              )}
            </div>
          </div>
        )}

        {showAddDrive && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-3">New Placement Drive</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <Input placeholder="Company" />
              <Input placeholder="Role" />
              <Input type="date" />
              <Input placeholder="Eligibility" />
            </div>
            <Button size="sm" onClick={() => setShowAddDrive(false)}>Save Drive</Button>
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Eligibility</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applied</th>
                {!isStudent && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Selected</th>}
                {isStudent && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold">{d.company}</td>
                  <td className="px-4 py-3">{d.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3 text-xs">{d.eligibility}</td>
                  <td className="px-4 py-3"><span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", statusColors[d.status])}>{d.status}</span></td>
                  <td className="px-4 py-3 font-mono">{d.applied}</td>
                  {!isStudent && <td className="px-4 py-3 font-mono">{d.selected}</td>}
                  {isStudent && (
                    <td className="px-4 py-3">
                      {mockStudentPlacement.appliedDrives.includes(d.id)
                        ? <span className="text-xs text-success font-semibold">Applied ✓</span>
                        : d.status === "completed"
                          ? <span className="text-xs text-muted-foreground">Closed</span>
                          : <Button size="sm" variant="outline" className="h-7 text-xs">Apply</Button>
                      }
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
