"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
class PaginationDto {
    constructor(data) {
        this.page = data.page;
        this.pageSize = data.pageSize;
        this.search = data.search;
    }
    static execute(option) {
        const { page, pageSize, search } = option;
        const pageNumber = page ? Number(page) : 1;
        const pageSizeNumber = pageSize ? Number(pageSize) : 10;
        if (pageNumber < 0)
            return ['the page cannot be less than zero '];
        if (pageSizeNumber < 0)
            return ['Page size cannot be less than zero'];
        return [, new PaginationDto({ page: pageNumber, pageSize: pageSizeNumber })];
    }
}
exports.PaginationDto = PaginationDto;
