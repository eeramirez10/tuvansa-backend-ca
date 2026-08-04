"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSuppliersRoutes = void 0;
const express_1 = require("express");
const proscai_erp_suppliers_datasource_1 = require("../../infrastructure/datasource/proscai-erp-suppliers.datasource");
const erp_suppliers_repository_impl_1 = require("../../infrastructure/repositories/erp-suppliers.repository-impl");
const internal_api_key_middleware_1 = require("../middlewares/internal-api-key.middleware");
const controller_1 = require("./controller");
class ErpSuppliersRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const controller = new controller_1.ErpSuppliersController(new erp_suppliers_repository_impl_1.ErpSuppliersRepositoryImpl(new proscai_erp_suppliers_datasource_1.ProscaiErpSuppliersDatasource()));
        router.use(internal_api_key_middleware_1.InternalApiKeyMiddleware.validateRequired);
        router.get("/search", controller.search);
        router.get("/:code", controller.getByCode);
        return router;
    }
}
exports.ErpSuppliersRoutes = ErpSuppliersRoutes;
