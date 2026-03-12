"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesEntity = void 0;
class SalesEntity {
    constructor(options) {
        this.branch = options.branch;
        this.month = options.month;
        this.type = options.type;
        this.client = options.client;
        this.monthNumber = options.monthNumber;
        this.year = options.year;
        this.date = options.date;
        this.document = options.document;
        this.code = options.code;
        this.ean = options.ean;
        this.description = options.description;
        this.family = options.family;
        this.agent = options.agent;
        this.quantity = options.quantity;
        this.salesAmount = options.salesAmount;
        this.costAmount = options.costAmount;
        this.profit = options.profit;
        this.percentage = options.percentage;
    }
}
exports.SalesEntity = SalesEntity;
