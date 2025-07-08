"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesDto = void 0;
const get_current_month_range_1 = require("../../../config/utils/get-current-month-range");
const branchOfficeValues = [
    'MEXICO',
    'MONTERREY',
    'VERACRUZ',
    'MEXICALI',
    'QUERETARO',
    'CANCUN',
    'CABOS',
];
class SalesDto {
    constructor(options) {
        Object.assign(this, options);
    }
    static execute(input) {
        let object = {};
        // branch
        if (input.branch !== undefined) {
            if (!branchOfficeValues.includes(input.branch.trim().toUpperCase())) {
                return [`Invalid branch: ${input.branch}`];
            }
            object.branch = input.branch.trim();
        }
        else {
            object.branch = '1';
        }
        // agent
        if (input.agent !== undefined) {
            if (typeof input.agent !== 'string' || !input.agent.trim()) {
                return [`Invalid agent: ${input.agent}`];
            }
            object.agent = input.agent.trim();
        }
        // date exacta
        if (input.date !== undefined) {
            if (input.startDate !== undefined || input.endDate !== undefined) {
                return [`Cannot mix 'date' with 'startDate'/'endDate'`];
            }
            if (typeof input.date !== 'string') {
                return [`date must be a string YYYY-MM-DD`];
            }
            const d = new Date(input.date);
            if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== input.date) {
                return [`Invalid date format: ${input.date}`];
            }
            object.date = d;
        }
        // rango BETWEEN
        if (input.startDate !== undefined || input.endDate !== undefined) {
            if (input.startDate === undefined || input.endDate === undefined) {
                return [`Both 'startDate' and 'endDate' are required for range filtering`];
            }
            if (typeof input.startDate !== 'string' || typeof input.endDate !== 'string') {
                return [`startDate and endDate must be strings YYYY-MM-DD`];
            }
            const s = new Date(input.startDate);
            const e = new Date(input.endDate);
            if (isNaN(s.getTime()) ||
                isNaN(e.getTime()) ||
                s.toISOString().slice(0, 10) !== input.startDate ||
                e.toISOString().slice(0, 10) !== input.endDate) {
                return [`Invalid date range format: ${input.startDate}–${input.endDate}`];
            }
            if (s > e) {
                return [`startDate must be on or before endDate`];
            }
            object.startDate = s;
            object.endDate = e;
        }
        else {
            const { startDate, endDate } = (0, get_current_month_range_1.getCurrentMonthRange)();
            object.startDate = startDate;
            object.endDate = endDate;
        }
        return [, new SalesDto(Object.assign({}, object))];
    }
}
exports.SalesDto = SalesDto;
