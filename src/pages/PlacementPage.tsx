import { useState } from "react";
import { Briefcase, Upload, CheckCircle, Plus, Search, TrendingUp, Award, BarChart2 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
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
  package: string;
}

const mockDrives: PlacementDrive[] = [
  { id: "pd1", company: "Google", role: "SDE Intern", date: "2026-04-10", eligibility: "CS, GPA ≥ 3.5", status: "upcoming", selected: 0, applied: 22, package: "₹45 LPA" },
  { id: "pd2", company: "Microsoft", role: "Software Engineer", date: "2026-04-15", eligibility: "CS/IT, GPA ≥ 3.0", status: "upcoming", selected: 0, applied: 35, package: "₹38 LPA" },
  { id: "pd3", company: "Infosys", role: "Systems Engineer", date: "2026-03-05", eligibility: "All branches", status: "completed", selected: 12, applied: 68, package: "₹6.5 LPA" },
  { id: "pd4", company: "TCS", role: "Developer", date: "2026-03-10", eligibility: "All branches, GPA ≥ 2.5", status: "completed", selected: 28, applied: 95, package: "₹7 LPA" },
  { id: "pd5", company: "Amazon", role: "SDE-1", date: "2026-04-20", eligibility: "CS/IT, GPA ≥ 3.2", status: "upcoming", selected: 0, applied: 18, package: "₹42 LPA" },
];

const mockStudentPlacement = {
  aptitudeScore: 72,
  codingScore: 85,
  resumeUploaded: false,
  appliedDrives: ["pd1"],
};

// Placement stats
const totalPlaced = mockDrives.filter(d => d.status === "completed").reduce((s, d) => s + d.selected, 0);
const totalApplied = mockDrives.reduce((s, d) => s + d.applied, 0);
const placementRate = Math.round((totalPlaced / 120) * 100); // assuming 120 eligible students

const placementByStatus = [
  { name: "Placed", value: totalPlaced, fill: "hsl(152, 76%, 42%)" },
  { name: "Unplaced", value: 120 - totalPlaced, fill: "hsl(220, 12%, 46%)" },
];

const statusColors: Record<string, string> = {
  upcoming: "bg-secondary/10 text-secondary",
  ongoing: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
};

// Interview feedback mock
const mockFeedback = [
  { student: "James Wilson", company: "Infosys", round: "Technical", result: "Selected", feedback: "Strong DSA fundamentals, good communication" },
  { student: "Aisha Patel", company: "TCS", round: "HR", result: "Selected", feedback: "Confident, clear career goals" },
  { student: "Liam O'Brien", company: "Infosys", round: "Technical", result: "Rejected", feedback: "Needs improvement in DBMS concepts" },
];

export default function PlacementPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(mockStudentPlacement.resumeUploaded);
  const [showAddDrive, setShowAddDrive] = useState(false);
  const [tab, setTab] = useState<"drives" | "stats" | "feedback">("drives");

  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin" || user?.role === "staff";
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
              {isStudent ? "Track your preparation and apply for drives." : "Manage placement drives and track stats."}
            </p>
          </div>
          {isAdmin && (
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
                <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${mockStudentPlacement.aptitudeScore}%` }} />
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-xs text-muted-foreground mb-1">Coding Score</div>
              <div className="text-2xl font-bold">{mockStudentPlacement.codingScore}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full transition-all" style={{ width: `${mockStudentPlacement.codingScore}%` }} />
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

        {/* Tabs for Admin */}
        {isAdmin && (
          <div className="flex gap-2">
            {(["drives", "stats", "feedback"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
                tab === t ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}>{t}</button>
            ))}
          </div>
        )}

        {/* Placement Stats */}
        {isAdmin && tab === "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Placement Overview</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center"><div className="text-2xl font-bold text-success">{totalPlaced}</div><div className="text-xs text-muted-foreground">Students Placed</div></div>
                <div className="text-center"><div className="text-2xl font-bold">{totalApplied}</div><div className="text-xs text-muted-foreground">Total Applications</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-secondary">{placementRate}%</div><div className="text-xs text-muted-foreground">Placement Rate</div></div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={placementByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {placementByStatus.map((_, i) => <Cell key={i} fill={placementByStatus[i].fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Award className="h-4 w-4" /> Top Packages</h3>
              <div className="space-y-3">
                {[...mockDrives].sort((a, b) => parseInt(b.package) - parseInt(a.package)).slice(0, 4).map(d => (
                  <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-semibold">{d.company}</div>
                      <div className="text-xs text-muted-foreground">{d.role}</div>
                    </div>
                    <span className="text-sm font-bold text-success">{d.package}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interview Feedback */}
        {isAdmin && tab === "feedback" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-sm mb-4">Interview Feedback</h3>
            <div className="space-y-3">
              {mockFeedback.map((f, i) => (
                <div key={i} className="border-b border-border last:border-0 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{f.student}</div>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                      f.result === "Selected" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>{f.result}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{f.company} · {f.round} Round</div>
                  <div className="text-xs mt-1 bg-muted/50 rounded px-2 py-1">{f.feedback}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAddDrive && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-3">New Placement Drive</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <Input placeholder="Company" /><Input placeholder="Role" /><Input type="date" /><Input placeholder="Package (e.g. ₹10 LPA)" />
            </div>
            <Input placeholder="Eligibility criteria" className="mb-3" />
            <Button size="sm" onClick={() => setShowAddDrive(false)}>Save Drive</Button>
          </div>
        )}

        {(isStudent || (isAdmin && tab === "drives")) && (
          <>
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Package</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applied</th>
                    {!isStudent && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Selected</th>}
                    {isStudent && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold">{d.company}</td>
                      <td className="px-4 py-3">{d.role}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-success">{d.package}</td>
                      <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
