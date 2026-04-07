"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMonthlySalesSummaryRequestDto = void 0;
const readQueryValue = (value) => {
    if (typeof value === 'string')
        return value.trim();
    if (Array.isArray(value) && typeof value[0] === 'string')
        return value[0].trim();
    return '';
};
const isIsoDate = (value) => {
    if (!value)
        return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};
class GetMonthlySalesSummaryRequestDto {
    constructor(options) {
        this.taxId = options.taxId;
        this.customerName = options.customerName;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
    }
    static execute(query) {
        const taxId = readQueryValue(query.taxId).toUpperCase();
        const customerName = readQueryValue(query.customerName).toUpperCase();
        const startDate = readQueryValue(query.startDate);
        const endDate = readQueryValue(query.endDate);
        if (!taxId && !customerName) {
            return ['At least one filter is required: taxId or customerName'];
        }
        if (customerName && customerName.length < 2) {
            return ['customerName must have at least 2 characters'];
        }
        if (!startDate || !endDate) {
            return ['startDate and endDate are required'];
        }
        if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
            return ['startDate and endDate must use YYYY-MM-DD format'];
        }
        if (new Date(startDate) > new Date(endDate)) {
            return ['startDate must be on or before endDate'];
        }
        return [
            ,
            new GetMonthlySalesSummaryRequestDto({
                taxId: taxId || undefined,
                customerName: customerName || undefined,
                startDate,
                endDate,
            }),
        ];
    }
}
exports.GetMonthlySalesSummaryRequestDto = GetMonthlySalesSummaryRequestDto;
