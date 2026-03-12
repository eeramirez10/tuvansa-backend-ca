"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpCustomersRequestDto = void 0;
const VALID_BRANCH_CODES = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '13',
    '22',
    '97',
    '99',
];
class SearchErpCustomersRequestDto {
    constructor(options) {
        this.q = options.q;
        this.branchCode = options.branchCode;
        this.limit = options.limit;
    }
    static execute(query) {
        const q = typeof query.q === 'string' ? query.q.trim() : '';
        const branchCode = typeof query.branchCode === 'string' ? query.branchCode.trim() : '';
        const limitRaw = typeof query.limit === 'string' ? Number(query.limit) : 20;
        if (!q)
            return ['q is required'];
        if (q.length < 2)
            return ['q must have at least 2 characters'];
        if (!branchCode)
            return ['branchCode is required'];
        if (!VALID_BRANCH_CODES.includes(branchCode))
            return ['branchCode is invalid'];
        const limit = Number.isFinite(limitRaw)
            ? Math.max(1, Math.min(50, Math.floor(limitRaw)))
            : 20;
        return [, new SearchErpCustomersRequestDto({ q, branchCode, limit })];
    }
}
exports.SearchErpCustomersRequestDto = SearchErpCustomersRequestDto;
