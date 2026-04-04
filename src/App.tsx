import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { ThemeProvider } from "@/lib/themeContext";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import FacultyPage from "./pages/FacultyPage";
import CoursesPage from "./pages/CoursesPage";
import SecurityPage from "./pages/SecurityPage";
import BlockedIpsPage from "./pages/BlockedIpsPage";
import SubjectsPage from "./pages/SubjectsPage";
import SessionsPage from "./pages/SessionsPage";
import AttendancePage from "./pages/AttendancePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import FeesPage from "./pages/FeesPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import SessionManagementPage from "./pages/SessionManagementPage";
import MySecurityPage from "./pages/MySecurityPage";
import TimetablePage from "./pages/TimetablePage";
import ExamResultsPage from "./pages/ExamResultsPage";
import PlacementPage from "./pages/PlacementPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import PerformancePage from "./pages/PerformancePage";
import TrustScorePage from "./pages/TrustScorePage";
import RiskTimelinePage from "./pages/RiskTimelinePage";
import SmartAlertsPage from "./pages/SmartAlertsPage";
import StudentHealthPage from "./pages/StudentHealthPage";
import IncidentReportsPage from "./pages/IncidentReportsPage";
import ComplaintAnalyticsPage from "./pages/ComplaintAnalyticsPage";
import AdminControlPage from "./pages/AdminControlPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";
import type { UserRole } from "@/lib/authContext";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute roles={["admin", "staff"]}><StudentsPage /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute roles={["admin"]}><FacultyPage /></ProtectedRoute>} />
              <Route path="/courses" element={<ProtectedRoute roles={["admin", "staff", "student", "parent"]}><CoursesPage /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute roles={["admin", "staff", "student", "parent"]}><SubjectsPage /></ProtectedRoute>} />
              <Route path="/sessions" element={<ProtectedRoute roles={["admin"]}><SessionsPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute roles={["admin", "staff", "student"]}><AssignmentsPage /></ProtectedRoute>} />
              <Route path="/timetable" element={<ProtectedRoute roles={["admin", "staff", "student", "parent"]}><TimetablePage /></ProtectedRoute>} />
              <Route path="/exam-results" element={<ProtectedRoute roles={["admin", "staff", "student", "parent"]}><ExamResultsPage /></ProtectedRoute>} />
              <Route path="/performance" element={<ProtectedRoute roles={["admin", "staff", "student", "parent"]}><PerformancePage /></ProtectedRoute>} />
              <Route path="/placement" element={<ProtectedRoute roles={["admin", "staff", "student"]}><PlacementPage /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute roles={["admin", "student"]}><ComplaintsPage /></ProtectedRoute>} />
              <Route path="/fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
              <Route path="/trust-score" element={<ProtectedRoute roles={["admin", "student"]}><TrustScorePage /></ProtectedRoute>} />
              <Route path="/student-health" element={<ProtectedRoute roles={["admin", "staff", "student"]}><StudentHealthPage /></ProtectedRoute>} />
              <Route path="/smart-alerts" element={<ProtectedRoute roles={["admin"]}><SmartAlertsPage /></ProtectedRoute>} />
              <Route path="/risk-timeline" element={<ProtectedRoute roles={["admin"]}><RiskTimelinePage /></ProtectedRoute>} />
              <Route path="/incident-reports" element={<ProtectedRoute roles={["admin"]}><IncidentReportsPage /></ProtectedRoute>} />
              <Route path="/complaint-analytics" element={<ProtectedRoute roles={["admin"]}><ComplaintAnalyticsPage /></ProtectedRoute>} />
              <Route path="/admin-control" element={<ProtectedRoute roles={["admin"]}><AdminControlPage /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute roles={["admin", "staff"]}><SecurityPage /></ProtectedRoute>} />
              <Route path="/blocked-ips" element={<ProtectedRoute roles={["admin"]}><BlockedIpsPage /></ProtectedRoute>} />
              <Route path="/activity-logs" element={<ProtectedRoute roles={["admin"]}><ActivityLogsPage /></ProtectedRoute>} />
              <Route path="/session-management" element={<ProtectedRoute roles={["admin"]}><SessionManagementPage /></ProtectedRoute>} />
              <Route path="/my-security" element={<ProtectedRoute roles={["student"]}><MySecurityPage /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
