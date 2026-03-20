import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import SecurityHeader from "./SecurityHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <SecurityHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
