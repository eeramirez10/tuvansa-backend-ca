"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpCustomersRequestDto = void 0;
class SearchErpCustomersRequestDto {
    constructor(options) {
        this.q = options.q;
        this.limit = options.limit;
    }
    static execute(query) {
        const q = typeof query.q === 'string' ? query.q.trim() : '';
        const limitRaw = typeof query.limit === 'string' ? Number(query.limit) : 20;
        if (!q)
            return ['q is required'];
        if (q.length < 2)
            return ['q must have at least 2 characters'];
        const limit = Number.isFinite(limitRaw)
            ? Math.max(1, Math.min(50, Math.floor(limitRaw)))
            : 20;
        return [, new SearchErpCustomersRequestDto({ q, limit })];
    }
}
exports.SearchErpCustomersRequestDto = SearchErpCustomersRequestDto;
