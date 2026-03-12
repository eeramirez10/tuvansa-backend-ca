"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerPaginationDto = void 0;
const pagination_dto_1 = require("./pagination.dto");
class CustomerPaginationDto extends pagination_dto_1.PaginationDto {
    constructor(data) {
        super(data);
    }
    static execute(options) {
        const [err, paginationDto] = pagination_dto_1.PaginationDto.execute(options);
        if (err)
            return [err];
        return [, new CustomerPaginationDto(Object.assign({}, paginationDto))];
    }
}
exports.CustomerPaginationDto = CustomerPaginationDto;
