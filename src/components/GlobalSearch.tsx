import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { cn } from "@/lib/utils";

interface SearchItem {
  label: string;
  path: string;
  category: string;
  roles: string[];
}

const searchItems: SearchItem[] = [
  { label: "Dashboard", path: "/dashboard", category: "Navigation", roles: ["admin", "staff", "student", "parent"] },
  { label: "Students", path: "/students", category: "Academic", roles: ["admin", "staff"] },
  { label: "Staff / Faculty", path: "/staff", category: "Academic", roles: ["admin"] },
  { label: "Courses", path: "/courses", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Subjects", path: "/subjects", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Timetable", path: "/timetable", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Attendance", path: "/attendance", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Assignments", path: "/assignments", category: "Academic", roles: ["admin", "staff", "student"] },
  { label: "Exam Results", path: "/exam-results", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Performance", path: "/performance", category: "Academic", roles: ["admin", "staff", "student", "parent"] },
  { label: "Fees", path: "/fees", category: "Finance", roles: ["admin", "staff", "student", "parent"] },
  { label: "Placement Center", path: "/placement", category: "Career", roles: ["admin", "staff", "student"] },
  { label: "Complaints", path: "/complaints", category: "Career", roles: ["admin", "student"] },
  { label: "Trust Score", path: "/trust-score", category: "Intelligence", roles: ["admin", "student"] },
  { label: "Student Health", path: "/student-health", category: "Intelligence", roles: ["admin", "staff", "student"] },
  { label: "Smart Alerts", path: "/smart-alerts", category: "Intelligence", roles: ["admin"] },
  { label: "Incident Reports", path: "/incident-reports", category: "Intelligence", roles: ["admin"] },
  { label: "AuthGuard Security", path: "/security", category: "Security", roles: ["admin", "staff"] },
  { label: "Risk Timeline", path: "/risk-timeline", category: "Security", roles: ["admin"] },
  { label: "Blocked IPs", path: "/blocked-ips", category: "Security", roles: ["admin"] },
  { label: "Activity Logs", path: "/activity-logs", category: "Security", roles: ["admin"] },
  { label: "Session Management", path: "/session-management", category: "Security", roles: ["admin"] },
  { label: "Admin Control Panel", path: "/admin-control", category: "Security", roles: ["admin"] },
  { label: "My Security", path: "/my-security", category: "Security", roles: ["student"] },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(prev => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filtered = searchItems
    .filter(item => user && item.roles.includes(user.role))
    .filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:bg-muted transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl animate-fade-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, modules..."
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[300px] overflow-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            filtered.map(item => (
              <button
                key={item.path}
                onClick={() => handleSelect(item.path)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
