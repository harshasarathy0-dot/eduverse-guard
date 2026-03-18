export interface FeeStructure {
  id: string;
  name: string;
  department: string;
  semester: number;
  amount: number;
  dueDate: string;
  category: "tuition" | "lab" | "library" | "exam" | "hostel";
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  feeId: string;
  feeName: string;
  amount: number;
  paidAmount: number;
  status: "paid" | "pending" | "overdue" | "partial";
  paidDate: string | null;
  transactionId: string | null;
}

export const mockFeeStructures: FeeStructure[] = [
  { id: "fee1", name: "Tuition Fee - CS", department: "Computer Science", semester: 5, amount: 45000, dueDate: "2026-04-01", category: "tuition" },
  { id: "fee2", name: "Lab Fee - CS", department: "Computer Science", semester: 5, amount: 8000, dueDate: "2026-04-01", category: "lab" },
  { id: "fee3", name: "Tuition Fee - Math", department: "Mathematics", semester: 3, amount: 38000, dueDate: "2026-04-01", category: "tuition" },
  { id: "fee4", name: "Library Fee", department: "All", semester: 0, amount: 2500, dueDate: "2026-03-25", category: "library" },
  { id: "fee5", name: "Exam Fee - Spring 2026", department: "All", semester: 0, amount: 5000, dueDate: "2026-03-20", category: "exam" },
  { id: "fee6", name: "Hostel Fee", department: "All", semester: 0, amount: 30000, dueDate: "2026-04-15", category: "hostel" },
];

export const mockFeePayments: FeePayment[] = [
  { id: "fp1", studentId: "s1", studentName: "James Wilson", feeId: "fee1", feeName: "Tuition Fee - CS", amount: 45000, paidAmount: 45000, status: "paid", paidDate: "2026-02-15", transactionId: "TXN20260215001" },
  { id: "fp2", studentId: "s1", studentName: "James Wilson", feeId: "fee2", feeName: "Lab Fee - CS", amount: 8000, paidAmount: 8000, status: "paid", paidDate: "2026-02-15", transactionId: "TXN20260215002" },
  { id: "fp3", studentId: "s1", studentName: "James Wilson", feeId: "fee4", feeName: "Library Fee", amount: 2500, paidAmount: 0, status: "overdue", paidDate: null, transactionId: null },
  { id: "fp4", studentId: "s1", studentName: "James Wilson", feeId: "fee5", feeName: "Exam Fee - Spring 2026", amount: 5000, paidAmount: 2500, status: "partial", paidDate: "2026-03-10", transactionId: "TXN20260310001" },
  { id: "fp5", studentId: "s2", studentName: "Maria Garcia", feeId: "fee3", feeName: "Tuition Fee - Math", amount: 38000, paidAmount: 38000, status: "paid", paidDate: "2026-02-20", transactionId: "TXN20260220001" },
  { id: "fp6", studentId: "s2", studentName: "Maria Garcia", feeId: "fee4", feeName: "Library Fee", amount: 2500, paidAmount: 2500, status: "paid", paidDate: "2026-03-01", transactionId: "TXN20260301001" },
  { id: "fp7", studentId: "s2", studentName: "Maria Garcia", feeId: "fee5", feeName: "Exam Fee - Spring 2026", amount: 5000, paidAmount: 0, status: "pending", paidDate: null, transactionId: null },
  { id: "fp8", studentId: "s3", studentName: "Liam O'Brien", feeId: "fee5", feeName: "Exam Fee - Spring 2026", amount: 5000, paidAmount: 5000, status: "paid", paidDate: "2026-03-05", transactionId: "TXN20260305001" },
  { id: "fp9", studentId: "s4", studentName: "Aisha Patel", feeId: "fee1", feeName: "Tuition Fee - CS", amount: 45000, paidAmount: 0, status: "pending", paidDate: null, transactionId: null },
  { id: "fp10", studentId: "s4", studentName: "Aisha Patel", feeId: "fee2", feeName: "Lab Fee - CS", amount: 8000, paidAmount: 0, status: "pending", paidDate: null, transactionId: null },
];
