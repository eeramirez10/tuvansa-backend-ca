export type AccountStatement = {
  id: string
  branchOffice: string,
  customerId: string,
  client: string,
  document: string
  createdAt: string
  dueDate: string
  dueStatus: string,
  daysOverdue: number
  amount: number;
  charges: number;
  payments: number;
  balance: number;
  upcomingAmount: number;   // por vencer
  overdueAmount: number;    // vencido
  overdueTo30: number;
  overdueTo60: number;
  overdueTo90: number;
  overdue90Plus: number;
};