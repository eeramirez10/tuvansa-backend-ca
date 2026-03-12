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
}
exports.ProductsRepositoryImpl = ProductsRepositoryImpl;
