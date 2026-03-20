"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./billing/routes");
const routes_2 = require("./auth/routes");
const routes_3 = require("./sales/routes");
const routes_4 = require("./branch-office/routes");
const routes_5 = require("./warehouse/routes");
const routes_6 = require("./account-statements/routes");
const routes_7 = require("./customers/routes");
const routes_8 = require("./products/routes");
const routes_9 = require("./erp-customers/routes");
const routes_10 = require("./erp-users/routes");
class AppRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        router.use('/api/billing', routes_1.BillingRoutes.routes());
        router.use('/api/auth', routes_2.AuthRoutes.routes());
        router.use('/api/sales', routes_3.SalesRoutes.routes());
        router.use('/api/branch-office', routes_4.BranchOfficeRoutes.routes());
        router.use('/api/warehouse', routes_5.WarehouseRoutes.routes());
        router.use('/api/account-statements', routes_6.AccountStetementsRoutes.routes());
        router.use('/api/customers', routes_7.CustomerRoutes.routes());
        router.use('/api/erp/products', routes_8.ProductsRoutes.routes());
        router.use('/api/erp/customers', routes_9.ErpCustomersRoutes.routes());
        router.use("/api/erp-users", routes_10.ErpUsersRoutes.routes());
        return router;
    }
}
exports.AppRoutes = AppRoutes;
