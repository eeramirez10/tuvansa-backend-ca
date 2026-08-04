"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpSuppliersRequestDto = void 0;
class SearchErpSuppliersRequestDto {
    constructor(q, limit) {
        this.q = q;
        this.limit = limit;
    }
    static execute(query) {
        const q = typeof query.q === "string" ? query.q.trim().toUpperCase() : "";
        const rawLimit = Number(query.limit);
        const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.trunc(rawLimit))) : 20;
        if (!q)
            return ["q is required"];
        return [, new SearchErpSuppliersRequestDto(q, limit)];
    }
}
exports.SearchErpSuppliersRequestDto = SearchErpSuppliersRequestDto;
