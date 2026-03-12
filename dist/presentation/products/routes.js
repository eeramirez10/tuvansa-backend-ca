"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const proscai_products_datasource_1 = require("../../infrastructure/datasource/proscai_products.datasource");
const products_repository_impl_1 = require("../../infrastructure/repositories/products.repository-impl");
class ProductsRoutes {
}
exports.ProductsRoutes = ProductsRoutes;
ProductsRoutes.routes = () => {
    const app = (0, express_1.Router)();
    const datasource = new proscai_products_datasource_1.ProscaiProductsRepository();
    const repository = new products_repository_impl_1.ProductsRepositoryImpl(datasource);
    const controller = new controller_1.ProductsController(repository);
    app.get('/by-ean/:ean/branch/:branchId', controller.getProductByEanAndBranch);
    return app;
};
