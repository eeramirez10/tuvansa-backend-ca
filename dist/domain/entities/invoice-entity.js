"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEntity = void 0;
class InvoiceEntity {
    constructor(invoice) {
        this.client = invoice.client;
        this.rfc = invoice.rfc;
        this.invoiceNumber = invoice.invoiceNumber;
        this.reference = invoice.reference;
        this.invoiceDate = invoice.invoiceDate;
        this.dueDate = invoice.dueDate;
        this.orderDate = invoice.orderDate;
        this.grossAmount = invoice.grossAmount;
        this.vatAmount = invoice.vatAmount;
        this.totalAmount = invoice.totalAmount;
        this.balance = invoice.balance;
        this.exchangeRate = invoice.exchangeRate;
        this.statusCfd = invoice.statusCfd;
        this.currency = invoice.currency;
    }
}
exports.InvoiceEntity = InvoiceEntity;
