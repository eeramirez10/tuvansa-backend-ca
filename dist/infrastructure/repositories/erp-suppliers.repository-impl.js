"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSuppliersRepositoryImpl = void 0;
const erp_suppliers_repository_1 = require("../../domain/repositories/erp-suppliers.repository");
class ErpSuppliersRepositoryImpl extends erp_suppliers_repository_1.ErpSuppliersRepository {
    constructor(datasource) {
        super();
        this.datasource = datasource;
    }
    search(request) { return this.datasource.search(request); }
    findByCode(code) { return this.datasource.findByCode(code); }
}
exports.ErpSuppliersRepositoryImpl = ErpSuppliersRepositoryImpl;
