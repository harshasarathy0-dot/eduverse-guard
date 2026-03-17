import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/authContext";
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
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { ReactNode } from "react";
import type { UserRole } from "@/lib/authContext";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute roles={["admin", "staff"]}><StudentsPage /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute roles={["admin"]}><FacultyPage /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute roles={["admin", "staff", "student"]}><CoursesPage /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute roles={["admin", "staff", "student"]}><SubjectsPage /></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute roles={["admin"]}><SessionsPage /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
            <Route path="/assignments" element={<ProtectedRoute roles={["admin", "staff", "student"]}><AssignmentsPage /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute roles={["admin", "staff"]}><SecurityPage /></ProtectedRoute>} />
            <Route path="/blocked-ips" element={<ProtectedRoute roles={["admin"]}><BlockedIpsPage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
