"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPaginationDto = void 0;
class AuthPaginationDto {
    constructor(option) {
        this.page = option.page;
        this.pageSize = option.pageSize;
        this.startDate = option.startDate;
        this.endDate = option.endDate;
        this.search = option.search;
    }
    static execute(options) {
        const { page = 1, pageSize = 10, search } = options;
        if (page < 0)
            return ['the page cannot be less than zero '];
        if (pageSize < 0)
            return ['Page size cannot be less than zero'];
        return [undefined, new AuthPaginationDto({ page: parseInt(page), pageSize: parseInt(pageSize), search })];
    }
}
exports.AuthPaginationDto = AuthPaginationDto;
