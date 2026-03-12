"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceMapper = void 0;
const invoice_entity_1 = require("../../domain/entities/invoice-entity");
class InvoiceMapper {
    static jsonToEntity(json) {
        return new invoice_entity_1.InvoiceEntity({
            client: json['client'],
            rfc: json['rfc'],
            invoiceNumber: json['invoiceNumber'],
            reference: json['reference'],
            invoiceDate: json['invoiceDate'],
            dueDate: json['dueDate'],
            orderDate: json['orderDate'],
            grossAmount: json['grossAmount'],
            vatAmount: json['vatAmount'],
            totalAmount: json['totalAmount'],
            balance: json['balance'],
            exchangeRate: json['exchangeRate'],
            statusCfd: json['statusCfd'],
            currency: json['currency'],
        });
    }
}
exports.InvoiceMapper = InvoiceMapper;
