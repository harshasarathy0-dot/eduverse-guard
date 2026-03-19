import AppLayout from "@/components/AppLayout";
import { mockFeeStructures, mockFeePayments } from "@/lib/mockFees";
import { mockStudents } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, AlertTriangle, CheckCircle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

function StaffFeesView() {
  const [search, setSearch] = useState("");
  const csStudentIds = mockStudents.filter(s => s.department === "Computer Science").map(s => s.id);
  const payments = mockFeePayments.filter(p => csStudentIds.includes(p.studentId));
  const filtered = payments.filter(
    p => p.studentName.toLowerCase().includes(search.toLowerCase()) || p.feeName.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments.reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = payments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const overdueCount = payments.filter(p => p.status === "overdue").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          Fees Overview
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground">
            <Lock className="h-3 w-3" /> Read-Only
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">View fee status for your assigned students. Contact admin for changes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
          <div><div className="text-xs text-muted-foreground">Collected</div><div className="text-lg font-bold">₹{totalCollected.toLocaleString()}</div></div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-warning/10 flex items-center justify-center"><Clock className="h-5 w-5 text-warning" /></div>
          <div><div className="text-xs text-muted-foreground">Pending</div><div className="text-lg font-bold">₹{totalPending.toLocaleString()}</div></div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
          <div><div className="text-xs text-muted-foreground">Overdue</div><div className="text-lg font-bold">{overdueCount}</div></div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search student or fee..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Paid</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pending</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{p.studentName}</td>
                <td className="px-4 py-3">{p.feeName}</td>
                <td className="px-4 py-3 font-mono text-xs">₹{p.amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs">₹{p.paidAmount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs">₹{(p.amount - p.paidAmount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                    p.status === "paid" ? "bg-success/10 text-success" :
                    p.status === "partial" ? "bg-warning/10 text-warning" :
                    p.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  )}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFeesView() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"structure" | "payments">("payments");
  const filteredPayments = mockFeePayments.filter(
    p => p.studentName.toLowerCase().includes(search.toLowerCase()) || p.feeName.toLowerCase().includes(search.toLowerCase())
  );
  const totalCollected = mockFeePayments.reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = mockFeePayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const overdueCount = mockFeePayments.filter(p => p.status === "overdue").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage fee structures and track payments</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-success/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-success" /></div>
          <div><div className="text-xs text-muted-foreground">Collected</div><div className="text-lg font-bold">₹{totalCollected.toLocaleString()}</div></div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-warning/10 flex items-center justify-center"><Clock className="h-5 w-5 text-warning" /></div>
          <div><div className="text-xs text-muted-foreground">Pending</div><div className="text-lg font-bold">₹{totalPending.toLocaleString()}</div></div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-destructive/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
          <div><div className="text-xs text-muted-foreground">Overdue</div><div className="text-lg font-bold">{overdueCount}</div></div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setTab("payments")} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", tab === "payments" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Payments</button>
        <button onClick={() => setTab("structure")} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", tab === "structure" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Fee Structure</button>
      </div>
      {tab === "payments" && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Transaction</th>
              </tr></thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.studentName}</td>
                    <td className="px-4 py-3">{p.feeName}</td>
                    <td className="px-4 py-3 font-mono text-xs">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">₹{p.paidAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                        p.status === "paid" ? "bg-success/10 text-success" :
                        p.status === "partial" ? "bg-warning/10 text-warning" :
                        p.status === "overdue" ? "bg-destructive/10 text-destructive" :
                        "bg-muted text-muted-foreground"
                      )}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.transactionId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "structure" && (
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee Name</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Department</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Due Date</th>
            </tr></thead>
            <tbody>
              {mockFeeStructures.map(f => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary capitalize">{f.category}</span></td>
                  <td className="px-4 py-3">{f.department}</td>
                  <td className="px-4 py-3 font-mono text-xs">₹{f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs">{f.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StudentFeesView() {
  const myPayments = mockFeePayments.filter(p => p.studentId === "s1");
  const totalDue = myPayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Fees</h1>
        <p className="text-sm text-muted-foreground mt-1">View your fee details and payment history</p>
      </div>
      {totalDue > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div><span className="font-semibold text-sm">Outstanding Balance: </span><span className="font-mono font-bold text-destructive">₹{totalDue.toLocaleString()}</span></div>
        </div>
      )}
      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Paid</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
          </tr></thead>
          <tbody>
            {myPayments.map(p => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{p.feeName}</td>
                <td className="px-4 py-3 font-mono text-xs">₹{p.amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs">₹{p.paidAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                    p.status === "paid" ? "bg-success/10 text-success" :
                    p.status === "partial" ? "bg-warning/10 text-warning" :
                    p.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  )}>{p.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.paidDate || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FeesPage() {
  const { user } = useAuth();
  return (
    <AppLayout>
      {user?.role === "admin" ? <AdminFeesView /> : user?.role === "staff" ? <StaffFeesView /> : <StudentFeesView />}
    </AppLayout>
  );
}
