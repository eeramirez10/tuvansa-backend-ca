"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepositoryImpl = void 0;
class CustomerRepositoryImpl {
    constructor(customerDatasource) {
        this.customerDatasource = customerDatasource;
    }
    getList(customerPaginationDto) {
        return this.customerDatasource.getList(customerPaginationDto);
    }
    getById(customerId) {
        return this.customerDatasource.getById(customerId);
    }
}
exports.CustomerRepositoryImpl = CustomerRepositoryImpl;
