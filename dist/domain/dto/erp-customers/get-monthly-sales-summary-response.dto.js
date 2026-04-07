"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMonthlySalesSummaryResponseDto = void 0;
class GetMonthlySalesSummaryResponseDto {
    constructor(options) {
        this.year = options.year;
        this.month = options.month;
        this.customerCode = options.customerCode;
        this.customerName = options.customerName;
        this.taxId = options.taxId;
        this.subtotalAmount = options.subtotalAmount;
        this.totalAmount = options.totalAmount;
    }
}
exports.GetMonthlySalesSummaryResponseDto = GetMonthlySalesSummaryResponseDto;
