"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const proscai_products_datasource_1 = require("../../infrastructure/datasource/proscai_products.datasource");
const products_repository_impl_1 = require("../../infrastructure/repositories/products.repository-impl");
const internal_api_key_middleware_1 = require("../middlewares/internal-api-key.middleware");
class ProductsRoutes {
}
exports.ProductsRoutes = ProductsRoutes;
ProductsRoutes.routes = () => {
    const app = (0, express_1.Router)();
    const datasource = new proscai_products_datasource_1.ProscaiProductsRepository();
    const repository = new products_repository_impl_1.ProductsRepositoryImpl(datasource);
    const controller = new controller_1.ProductsController(repository);
    app.post('/search/warehouses', internal_api_key_middleware_1.InternalApiKeyMiddleware.validateRequired, controller.searchByWarehouses);
    app.get('/search/mexico', controller.searchMexicoProducts);
    app.get('/by-code/:code/mexico', controller.getMexicoProductByCode);
    app.get('/by-ean/:ean/branch/:branchId', controller.getProductByEanAndBranch);
    app.get('/:ean/availability', internal_api_key_middleware_1.InternalApiKeyMiddleware.validate, controller.getAvailability);
    app.post('/availability/batch', internal_api_key_middleware_1.InternalApiKeyMiddleware.validate, controller.getAvailabilityBatch);
    return app;
};
