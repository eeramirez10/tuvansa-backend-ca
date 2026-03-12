"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpCustomersRepositoryImpl = void 0;
class ErpCustomersRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }
    searchByTerm(request) {
        return this.datasource.searchByTerm(request);
    }
}
exports.ErpCustomersRepositoryImpl = ErpCustomersRepositoryImpl;
