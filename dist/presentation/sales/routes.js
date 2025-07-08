"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const sales_respositoryImpl_1 = require("../../infrastructure/repositories/sales-respositoryImpl");
const proscai_sales_datasource_1 = require("../../infrastructure/datasource/proscai-sales.datasource");
class SalesRoutes {
}
exports.SalesRoutes = SalesRoutes;
SalesRoutes.routes = () => {
    const app = (0, express_1.Router)();
    const datasource = new proscai_sales_datasource_1.ProscaiSalesDatasource();
    const repository = new sales_respositoryImpl_1.SalesRepositoryImpl(datasource);
    const controller = new controller_1.SalesController(repository);
    app.get('/', controller.getSales);
    return app;
};
