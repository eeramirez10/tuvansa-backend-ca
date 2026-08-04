"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepositoryImpl = void 0;
class ProductsRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }
    findByEanAndBranch(request) {
        return this.datasource.findByEanAndBranch(request);
    }
    findByTermAndWarehouses(term, warehouseCodes) {
        return this.datasource.findByTermAndWarehouses(term, warehouseCodes);
    }
    findByCodeInMexico(code) {
        return this.datasource.findByCodeInMexico(code);
    }
    findAvailabilityByEan(ean) {
        return this.datasource.findAvailabilityByEan(ean);
    }
    findAvailabilityByEans(eans, warehouseCodes) {
        return this.datasource.findAvailabilityByEans(eans, warehouseCodes);
    }
}
exports.ProductsRepositoryImpl = ProductsRepositoryImpl;
