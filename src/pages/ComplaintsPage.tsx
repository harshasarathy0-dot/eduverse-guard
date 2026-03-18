import { useState } from "react";
import { MessageSquareWarning, Plus, Search, Eye } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  category: "college" | "hostel" | "staff";
  subject: string;
  description: string;
  anonymous: boolean;
  status: "pending" | "in-progress" | "resolved" | "dismissed";
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockComplaints: Complaint[] = [
  { id: "cmp1", userId: "s1", userName: "James Wilson", category: "hostel", subject: "Water supply issue in Block A", description: "No water supply since 2 days in hostel block A, room 304.", anonymous: false, status: "in-progress", hasImage: true, createdAt: "2026-03-15", updatedAt: "2026-03-16" },
  { id: "cmp2", userId: "s2", userName: "Anonymous", category: "staff", subject: "Unprofessional behavior in lab", description: "Lab assistant was rude and uncooperative during practical session.", anonymous: true, status: "pending", hasImage: false, createdAt: "2026-03-16", updatedAt: "2026-03-16" },
  { id: "cmp3", userId: "s4", userName: "Aisha Patel", category: "college", subject: "Library hours too short", description: "Library closes at 6 PM which is too early for exam preparation.", anonymous: false, status: "resolved", hasImage: false, createdAt: "2026-03-10", updatedAt: "2026-03-14" },
  { id: "cmp4", userId: "s3", userName: "Anonymous", category: "hostel", subject: "Mess food quality", description: "Food quality in mess has degraded significantly this month.", anonymous: true, status: "pending", hasImage: true, createdAt: "2026-03-17", updatedAt: "2026-03-17" },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  "in-progress": "bg-secondary/10 text-secondary",
  resolved: "bg-success/10 text-success",
  dismissed: "bg-muted text-muted-foreground",
};

const categoryColors: Record<string, string> = {
  college: "bg-primary/10 text-primary",
  hostel: "bg-warning/10 text-warning",
  staff: "bg-destructive/10 text-destructive",
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isAdmin = user?.role === "admin";
  const complaints = isAdmin
    ? mockComplaints.filter(c => c.subject.toLowerCase().includes(search.toLowerCase()))
    : mockComplaints.filter(c => c.userId === "s1");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquareWarning className="h-6 w-6 text-secondary" /> Complaints
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin ? "Review and manage all complaints." : "Submit and track your complaints."}
            </p>
          </div>
          {!isAdmin && (
            <Button size="sm" onClick={() => { setShowNew(!showNew); setSubmitted(false); }}>
              <Plus className="h-4 w-4 mr-1" /> New Complaint
            </Button>
          )}
        </div>

        {showNew && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-sm mb-3">File a Complaint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>college</option>
                  <option>hostel</option>
                  <option>staff</option>
                </select>
              </div>
              <Input placeholder="Subject" />
            </div>
            <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3 min-h-[80px]" placeholder="Describe the issue..." />
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" /> Submit anonymously
              </label>
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-1" /> Attach Image
              </Button>
            </div>
            <Button size="sm" onClick={() => { setSubmitted(true); setShowNew(false); }}>Submit Complaint</Button>
            {submitted && <p className="text-xs text-success mt-2">Complaint submitted successfully!</p>}
          </div>
        )}
        {submitted && !showNew && <p className="text-sm text-success bg-success/5 border border-success/20 rounded-lg p-3">✓ Complaint submitted successfully!</p>}

        {isAdmin && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        )}

        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", categoryColors[c.category])}>{c.category}</span>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded capitalize", statusColors[c.status])}>{c.status}</span>
                    {c.hasImage && <span className="text-xs text-muted-foreground">📎 Image</span>}
                  </div>
                  <h3 className="font-semibold text-sm">{c.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>By: {c.anonymous ? "Anonymous" : c.userName}</span>
                    <span>Filed: {c.createdAt}</span>
                    {c.updatedAt !== c.createdAt && <span>Updated: {c.updatedAt}</span>}
                  </div>
                </div>
                {isAdmin && c.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs">In Progress</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">Dismiss</Button>
                  </div>
                )}
                {isAdmin && c.status === "in-progress" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs text-success shrink-0">Resolve</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function Upload(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
