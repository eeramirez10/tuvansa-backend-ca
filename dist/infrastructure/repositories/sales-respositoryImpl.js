"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRepositoryImpl = void 0;
const sales_repository_1 = require("../../domain/repositories/sales.repository");
class SalesRepositoryImpl extends sales_repository_1.SalesRepository {
    constructor(salesDatasource) {
        super();
        this.salesDatasource = salesDatasource;
    }
    getSales(filters) {
        return this.salesDatasource.getSales(filters);
    }
}
exports.SalesRepositoryImpl = SalesRepositoryImpl;
