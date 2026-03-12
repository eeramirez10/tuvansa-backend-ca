"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatementPaginationDto = void 0;
const statusAccountStatement = ["OVERDUE", "DUESOON", "CURRENT"];
class AccountStatementPaginationDto {
    constructor(options) {
        this.page = options.page;
        this.pageSize = options.pageSize;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        this.id = options.id;
        this.customerId = options.customerId;
        this.search = options.search;
        this.branchOffice = options.branchOffice;
        this.status = options.status;
        this.accesibleBranches = options.accesibleBranches;
        this.hasDebt = options.hasDebt;
        this.view = options.view;
    }
    static execute(values) {
        const { page = 1, pageSize = 30, startDate, endDate, id, customerId, search, branchOffice, accesibleBranches, status, hasDebt, view } = values;
        let tieneDeuda = false;
        if (page < 0)
            return ['The page cannot be less than zero'];
        if (pageSize < 0)
            return ['Page size cannot be less than zero'];
        if (status != undefined || status) {
            if (!statusAccountStatement.includes(status.toUpperCase()))
                return ['Invalid Status'];
        }
        if (hasDebt) {
            tieneDeuda = /^true|1|yes$/i.test(hasDebt);
        }
        return [, new AccountStatementPaginationDto({
                page: Number(page),
                pageSize: Number(pageSize),
                startDate,
                endDate,
                id,
                customerId,
                search,
                branchOffice,
                status,
                accesibleBranches,
                hasDebt: tieneDeuda,
                view,
            })];
    }
}
exports.AccountStatementPaginationDto = AccountStatementPaginationDto;
