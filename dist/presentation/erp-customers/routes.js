"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpCustomersRoutes = void 0;
const express_1 = require("express");
const proscai_erp_customers_datasource_1 = require("../../infrastructure/datasource/proscai-erp-customers.datasource");
const erp_customers_repository_impl_1 = require("../../infrastructure/repositories/erp-customers.repository-impl");
const controller_1 = require("./controller");
class ErpCustomersRoutes {
}
exports.ErpCustomersRoutes = ErpCustomersRoutes;
ErpCustomersRoutes.routes = () => {
    const app = (0, express_1.Router)();
    const datasource = new proscai_erp_customers_datasource_1.ProscaiErpCustomersDatasource();
    const repository = new erp_customers_repository_impl_1.ErpCustomersRepositoryImpl(datasource);
    const controller = new controller_1.ErpCustomersController(repository);
    app.get('/search', controller.search);
    return app;
};
