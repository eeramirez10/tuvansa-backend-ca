"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicePaginationDto = void 0;
class InvoicePaginationDto {
    constructor(options) {
        this.page = options.page;
        this.pageSize = options.pageSize;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        this.rfc = options.rfc;
        this.search = options.search;
        this.branchOffice = options.branchOffice;
    }
    static execute(values) {
        const { page = 1, pageSize = 30, startDate, endDate, rfc, search, branchOffice } = values;
        if (page < 0)
            return ['the page cannot be less than zero '];
        if (pageSize < 0)
            return ['Page size cannot be less than zero'];
        return [, new InvoicePaginationDto({ page: Number(page), pageSize: Number(pageSize), startDate, endDate, rfc, search, branchOffice })];
    }
}
exports.InvoicePaginationDto = InvoicePaginationDto;
