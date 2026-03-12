"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const customer_repository_impl_1 = require("../../infrastructure/repositories/customer.repository-impl");
const proscai_customer_datasource_1 = require("../../infrastructure/datasource/proscai-customer.datasource");
class CustomerRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const datasource = new proscai_customer_datasource_1.ProscaiCustomerDatasource();
        const repository = new customer_repository_impl_1.CustomerRepositoryImpl(datasource);
        const controller = new controller_1.CustomerController(repository);
        router.get('/', 
        // AuthMiddleware.validateJWT,
        controller.getCustomers);
        router.get('/:customerId', 
        // AuthMiddleware.validateJWT,
        controller.getById);
        return router;
    }
}
exports.CustomerRoutes = CustomerRoutes;
