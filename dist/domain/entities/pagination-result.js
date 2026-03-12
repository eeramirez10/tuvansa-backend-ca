"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationResult = void 0;
class PaginationResult {
    constructor(options) {
        this.items = options.items;
        this.total = options.total;
        this.page = options.page;
        this.pageSize = options.pageSize;
        this.totalPages = options.totalPages;
    }
}
exports.PaginationResult = PaginationResult;
