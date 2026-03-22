import AppLayout from "@/components/AppLayout";
import { mockFeeStructures, mockFeePayments } from "@/lib/mockFees";
import { mockStudents } from "@/lib/mockData";
import { useAuth } from "@/lib/authContext";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, DollarSign, AlertTriangle, CheckCircle, Clock, Lock, CreditCard, Download, Calendar } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

// Payment timeline mock data
const paymentTimeline = [
  { month: "Oct", collected: 45000, pending: 30000 },
  { month: "Nov", collected: 52000, pending: 25000 },
  { month: "Dec", collected: 60000, pending: 20000 },
  { month: "Jan", collected: 48000, pending: 28000 },
  { month: "Feb", collected: 55000, pending: 22000 },
  { month: "Mar", collected: 62000, pending: 18000 },
];

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
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-muted text-muted-foreground"><Lock className="h-3 w-3" /> Read-Only</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">View fee status for your assigned students.</p>
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
        <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Total</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Paid</th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
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
  const [tab, setTab] = useState<"payments" | "structure" | "analytics">("payments");
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
        <p className="text-sm text-muted-foreground mt-1">Manage fee structures, track payments, and view analytics.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-secondary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-secondary" /></div>
          <div><div className="text-xs text-muted-foreground">Late Fee Revenue</div><div className="text-lg font-bold">₹{(overdueCount * 500).toLocaleString()}</div></div>
        </div>
      </div>
      <div className="flex gap-2">
        {(["payments", "structure", "analytics"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
            tab === t ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}>{t}</button>
        ))}
      </div>

      {tab === "analytics" && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Calendar className="h-4 w-4" /> Payment Timeline</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={paymentTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: 12 }} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "payments" && (
        <>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Late Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.studentName}</td>
                    <td className="px-4 py-3">{p.feeName}</td>
                    <td className="px-4 py-3 font-mono text-xs">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs">₹{p.paidAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-destructive">{p.status === "overdue" ? "₹500" : "—"}</td>
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
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Installments</th>
            </tr></thead>
            <tbody>
              {mockFeeStructures.map(f => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary capitalize">{f.category}</span></td>
                  <td className="px-4 py-3">{f.department}</td>
                  <td className="px-4 py-3 font-mono text-xs">₹{f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs">{f.dueDate}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="text-secondary font-semibold">2 installments</span>
                    <span className="text-muted-foreground ml-1">(₹{Math.round(f.amount / 2).toLocaleString()} × 2)</span>
                  </td>
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
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paid, setPaid] = useState<Set<string>>(new Set());
  const myPayments = mockFeePayments.filter(p => p.studentId === "s1");
  const totalDue = myPayments.reduce((s, p) => s + (p.amount - p.paidAmount), 0);

  const handlePay = (id: string) => {
    setPayingId(id);
    setTimeout(() => {
      setPaid(prev => new Set([...prev, id]));
      setPayingId(null);
    }, 1500);
  };

  const downloadReceipt = (p: typeof myPayments[0]) => {
    const receipt = `
═══════════════════════════════════
       EDUVERSE FEE RECEIPT
═══════════════════════════════════

Student: James Wilson (EDU2024001)
Fee: ${p.feeName}
Amount: ₹${p.amount.toLocaleString()}
Paid: ₹${p.paidAmount.toLocaleString()}
Status: ${paid.has(p.id) ? "PAID" : p.status.toUpperCase()}
Transaction: ${p.transactionId || "N/A"}
Date: ${new Date().toLocaleDateString()}

═══════════════════════════════════
     Thank you for your payment
═══════════════════════════════════`;
    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${p.feeName.replace(/\s/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Fees</h1>
        <p className="text-sm text-muted-foreground mt-1">View details, pay fees, and download receipts.</p>
      </div>
      {totalDue > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div><span className="font-semibold text-sm">Outstanding Balance: </span><span className="font-mono font-bold text-destructive">₹{totalDue.toLocaleString()}</span></div>
        </div>
      )}
      <div className="space-y-3">
        {myPayments.map(p => {
          const isPaid = paid.has(p.id) || p.status === "paid";
          const isPaying = payingId === p.id;
          const lateFee = p.status === "overdue" ? 500 : 0;
          return (
            <div key={p.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm">{p.feeName}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Amount: <span className="font-mono">₹{p.amount.toLocaleString()}</span>
                    {lateFee > 0 && <span className="text-destructive ml-2">+ ₹{lateFee} late fee</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">Paid: <span className="font-mono">₹{p.paidAmount.toLocaleString()}</span></div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Installment option: <span className="text-secondary font-semibold">₹{Math.round((p.amount - p.paidAmount) / 2).toLocaleString()} × 2</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded",
                    isPaid ? "bg-success/10 text-success" :
                    p.status === "overdue" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  )}>{isPaid ? "paid" : p.status}</span>
                  <div className="flex gap-2">
                    {!isPaid && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handlePay(p.id)} disabled={isPaying}>
                        {isPaying ? <span className="animate-spin">⏳</span> : <><CreditCard className="h-3 w-3 mr-1" /> Pay Now</>}
                      </Button>
                    )}
                    {(isPaid || p.paidAmount > 0) && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => downloadReceipt(p)}>
                        <Download className="h-3 w-3 mr-1" /> Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
