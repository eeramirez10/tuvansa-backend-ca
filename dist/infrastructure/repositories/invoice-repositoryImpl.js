"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepositoryImpl = void 0;
class InvoiceRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }
    getInvoices(invoicePaginationDto) {
        return this.datasource.getInvoices(invoicePaginationDto);
    }
}
exports.InvoiceRepositoryImpl = InvoiceRepositoryImpl;
