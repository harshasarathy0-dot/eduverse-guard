import { useState } from "react";
import { MessageSquareWarning, Plus, Search, Hash, Clock, ArrowUpCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Complaint {
  id: string;
  trackingId: string;
  userId: string;
  userName: string;
  category: "college" | "hostel" | "staff";
  subject: string;
  description: string;
  anonymous: boolean;
  status: "pending" | "in-progress" | "resolved" | "dismissed" | "escalated";
  priority: "low" | "medium" | "high";
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
  resolutionDays: number | null;
}

const mockComplaints: Complaint[] = [
  { id: "cmp1", trackingId: "CMP-2026-0001", userId: "s1", userName: "James Wilson", category: "hostel", subject: "Water supply issue in Block A", description: "No water supply since 2 days in hostel block A, room 304.", anonymous: false, status: "in-progress", priority: "high", hasImage: true, createdAt: "2026-03-15", updatedAt: "2026-03-16", resolutionDays: null },
  { id: "cmp2", trackingId: "CMP-2026-0002", userId: "s2", userName: "Anonymous", category: "staff", subject: "Unprofessional behavior in lab", description: "Lab assistant was rude and uncooperative during practical session.", anonymous: true, status: "pending", priority: "medium", hasImage: false, createdAt: "2026-03-16", updatedAt: "2026-03-16", resolutionDays: null },
  { id: "cmp3", trackingId: "CMP-2026-0003", userId: "s4", userName: "Aisha Patel", category: "college", subject: "Library hours too short", description: "Library closes at 6 PM which is too early for exam preparation.", anonymous: false, status: "resolved", priority: "low", hasImage: false, createdAt: "2026-03-10", updatedAt: "2026-03-14", resolutionDays: 4 },
  { id: "cmp4", trackingId: "CMP-2026-0004", userId: "s3", userName: "Anonymous", category: "hostel", subject: "Mess food quality", description: "Food quality in mess has degraded significantly this month.", anonymous: true, status: "escalated", priority: "high", hasImage: true, createdAt: "2026-03-17", updatedAt: "2026-03-20", resolutionDays: null },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  "in-progress": "bg-secondary/10 text-secondary",
  resolved: "bg-success/10 text-success",
  dismissed: "bg-muted text-muted-foreground",
  escalated: "bg-destructive/10 text-destructive",
};
const categoryColors: Record<string, string> = {
  college: "bg-primary/10 text-primary",
  hostel: "bg-warning/10 text-warning",
  staff: "bg-destructive/10 text-destructive",
};
const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newTrackingId, setNewTrackingId] = useState("");

  const isAdmin = user?.role === "admin";
  const complaints = isAdmin
    ? mockComplaints.filter(c => c.subject.toLowerCase().includes(search.toLowerCase()) || c.trackingId.toLowerCase().includes(search.toLowerCase()))
    : mockComplaints.filter(c => c.userId === "s1");

  const handleSubmit = () => {
    const id = `CMP-2026-${String(mockComplaints.length + 1).padStart(4, "0")}`;
    setNewTrackingId(id);
    setSubmitted(true);
    setShowNew(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquareWarning className="h-6 w-6 text-secondary" /> Complaints
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin ? "Review, track, and manage all complaints." : "Submit and track your complaints."}
            </p>
          </div>
          {!isAdmin && (
            <Button size="sm" onClick={() => { setShowNew(!showNew); setSubmitted(false); }}>
              <Plus className="h-4 w-4 mr-1" /> New Complaint
            </Button>
          )}
        </div>

        {/* Admin summary */}
        {isAdmin && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-lg font-bold">{mockComplaints.length}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-warning">{mockComplaints.filter(c => c.status === "pending").length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-secondary">{mockComplaints.filter(c => c.status === "in-progress").length}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-destructive">{mockComplaints.filter(c => c.status === "escalated").length}</div>
              <div className="text-xs text-muted-foreground">Escalated</div>
            </div>
            <div className="bg-card border rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-success">{mockComplaints.filter(c => c.status === "resolved").length}</div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
          </div>
        )}

        {showNew && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-3">File a Complaint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>college</option><option>hostel</option><option>staff</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>low</option><option>medium</option><option>high</option>
                </select>
              </div>
              <Input placeholder="Subject" />
            </div>
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3 min-h-[80px]" placeholder="Describe the issue..." />
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" /> Submit anonymously
              </label>
            </div>
            <Button size="sm" onClick={handleSubmit}>Submit Complaint</Button>
          </div>
        )}

        {submitted && !showNew && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4 flex items-center gap-3">
            <Hash className="h-5 w-5 text-success" />
            <div>
              <div className="text-sm font-semibold text-success">Complaint submitted successfully!</div>
              <div className="text-xs text-muted-foreground">Tracking ID: <span className="font-mono font-bold text-foreground">{newTrackingId}</span> — Use this to track status.</div>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by subject or tracking ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        )}

        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      <Hash className="h-3 w-3" />{c.trackingId}
                    </span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", categoryColors[c.category])}>{c.category}</span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", statusColors[c.status])}>{c.status}</span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", priorityColors[c.priority])}>{c.priority}</span>
                    {c.hasImage && <span className="text-xs text-muted-foreground">📎</span>}
                  </div>
                  <h3 className="font-semibold text-sm">{c.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>By: {c.anonymous ? "Anonymous" : c.userName}</span>
                    <span>Filed: {c.createdAt}</span>
                    {c.resolutionDays !== null && (
                      <span className="flex items-center gap-1 text-success"><Clock className="h-3 w-3" />Resolved in {c.resolutionDays}d</span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 shrink-0">
                    {c.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Start</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Dismiss</Button>
                      </>
                    )}
                    {c.status === "in-progress" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-success">Resolve</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive flex items-center gap-1">
                          <ArrowUpCircle className="h-3 w-3" />Escalate
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
