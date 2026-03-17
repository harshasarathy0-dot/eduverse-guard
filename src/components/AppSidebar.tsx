import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Shield,
  ChevronLeft, ChevronRight, LogOut, UserCheck, Calendar,
  ClipboardList, FileText, Globe, BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type UserRole } from "@/lib/authContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "staff", "student", "parent"] },
  { label: "Students", icon: GraduationCap, path: "/students", roles: ["admin", "staff"] },
  { label: "Staff", icon: Users, path: "/staff", roles: ["admin"] },
  { label: "Courses", icon: BookOpen, path: "/courses", roles: ["admin", "staff", "student"] },
  { label: "Subjects", icon: BookMarked, path: "/subjects", roles: ["admin", "staff", "student"] },
  { label: "Sessions", icon: Calendar, path: "/sessions", roles: ["admin"] },
  { label: "Attendance", icon: UserCheck, path: "/attendance", roles: ["admin", "staff", "student", "parent"] },
  { label: "Assignments", icon: FileText, path: "/assignments", roles: ["admin", "staff", "student"] },
  { label: "AuthGuard", icon: Shield, path: "/security", roles: ["admin", "staff"] },
  { label: "Blocked IPs", icon: Globe, path: "/blocked-ips", roles: ["admin"] },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-150 ease-out border-r border-sidebar-border min-h-screen shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <Shield className="h-6 w-6 text-sidebar-primary shrink-0" />
        {!collapsed && (
          <span className="font-bold text-base tracking-tight text-sidebar-foreground">EDUVERSE</span>
        )}
      </div>

      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-sidebar-muted capitalize">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-colors duration-150"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full transition-colors duration-150"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
