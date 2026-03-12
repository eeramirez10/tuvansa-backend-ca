"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatementMapper = void 0;
class AccountStatementMapper {
    static jsonToEntity(json) {
        return {
            id: String(json.id),
            branchOffice: String(json.branchOffice),
            customerId: String(json.clientId),
            client: json.client,
            document: json.document,
            createdAt: json.createdAt,
            dueDate: json.dueDate,
            dueStatus: json.dueStatus,
            daysOverdue: json.daysOverdue,
            amount: Number(json.amount),
            charges: Number(json.charges),
            payments: Number(json.payments),
            balance: Number(json.balance),
            upcomingAmount: Number(json.upcomingAmount),
            overdueAmount: Number(json.overdueAmount),
            overdueTo30: Number(json.overdueTo30),
            overdueTo60: Number(json.overdueTo60),
            overdueTo90: Number(json.overdueTo90),
            overdue90Plus: Number(json.overdue90Plus)
        };
    }
}
exports.AccountStatementMapper = AccountStatementMapper;
