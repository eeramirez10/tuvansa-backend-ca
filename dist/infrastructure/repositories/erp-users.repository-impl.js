"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpUsersRepositoryImpl = void 0;
class ErpUsersRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }
    search(query, params) {
        return this.datasource.search(query, params);
    }
    findByCode(code) {
        return this.datasource.findByCode(code);
    }
}
exports.ErpUsersRepositoryImpl = ErpUsersRepositoryImpl;
