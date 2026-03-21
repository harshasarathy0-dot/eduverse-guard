import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Shield,
  ChevronLeft, ChevronRight, LogOut, UserCheck, Calendar,
  FileText, Globe, BookMarked, DollarSign, Activity, Monitor, Lock,
  Clock, Award, TrendingUp, Briefcase, MessageSquareWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type UserRole } from "@/lib/authContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "staff", "student", "parent"] },
  { label: "Students", icon: GraduationCap, path: "/students", roles: ["admin", "staff"], section: "Academic" },
  { label: "Staff", icon: Users, path: "/staff", roles: ["admin"], section: "Academic" },
  { label: "Courses", icon: BookOpen, path: "/courses", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Subjects", icon: BookMarked, path: "/subjects", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Timetable", icon: Clock, path: "/timetable", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Sessions", icon: Calendar, path: "/sessions", roles: ["admin"], section: "Academic" },
  { label: "Attendance", icon: UserCheck, path: "/attendance", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Assignments", icon: FileText, path: "/assignments", roles: ["admin", "staff", "student"], section: "Academic" },
  { label: "Exam Results", icon: Award, path: "/exam-results", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Performance", icon: TrendingUp, path: "/performance", roles: ["admin", "staff", "student", "parent"], section: "Academic" },
  { label: "Placement", icon: Briefcase, path: "/placement", roles: ["admin", "staff", "student"], section: "Career" },
  { label: "Complaints", icon: MessageSquareWarning, path: "/complaints", roles: ["admin", "student"], section: "Career" },
  { label: "Fees", icon: DollarSign, path: "/fees", roles: ["admin", "staff", "student", "parent"], section: "Finance" },
  { label: "AuthGuard", icon: Shield, path: "/security", roles: ["admin", "staff"], section: "Security" },
  { label: "Blocked IPs", icon: Globe, path: "/blocked-ips", roles: ["admin"], section: "Security" },
  { label: "Activity Logs", icon: Activity, path: "/activity-logs", roles: ["admin"], section: "Security" },
  { label: "Sessions Mgmt", icon: Monitor, path: "/session-management", roles: ["admin"], section: "Security" },
  { label: "My Security", icon: Lock, path: "/my-security", roles: ["student"], section: "Security" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));
  let lastSection = "";

  return (
    <aside
      className={cn(
        "flex flex-col sidebar-gradient text-sidebar-foreground border-r border-sidebar-border min-h-screen shrink-0",
        "transition-[width] duration-300 ease-out",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Shield className="h-4.5 w-4.5 text-white" />
        </div>
        <span className={cn(
          "font-bold text-lg tracking-tight text-sidebar-foreground transition-opacity duration-200",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>EDUVERSE</span>
      </div>

      {/* User info */}
      <div className={cn(
        "border-b border-sidebar-border transition-all duration-200 overflow-hidden",
        collapsed ? "h-0 py-0 px-4" : "px-4 py-3"
      )}>
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] text-sidebar-muted capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          let sectionHeader = null;

          if (!collapsed && item.section && item.section !== lastSection) {
            lastSection = item.section;
            sectionHeader = (
              <div key={`section-${item.section}`} className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-muted/50">
                {item.section}
              </div>
            );
          } else if (item.section && item.section !== lastSection) {
            lastSection = item.section;
          }

          return (
            <div key={item.path}>
              {sectionHeader}
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary/15 text-secondary shadow-sm"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive && "text-secondary")} />
                <span className={cn(
                  "transition-opacity duration-200",
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-sidebar-border p-2 space-y-0.5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-colors duration-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>Collapse</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:bg-destructive/10 hover:text-destructive w-full transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
