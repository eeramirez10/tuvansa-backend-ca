"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./billing/routes");
const routes_2 = require("./auth/routes");
class AppRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        router.use('/api/billing', routes_1.BillingRoutes.routes());
        router.use('/api/auth', routes_2.AuthRoutes.routes());
        return router;
    }
}
exports.AppRoutes = AppRoutes;
