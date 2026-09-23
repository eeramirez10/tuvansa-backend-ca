"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpOrdersRoutes = void 0;
const express_1 = require("express");
const proscai_erp_orders_datasource_1 = require("../../infrastructure/datasource/proscai-erp-orders.datasource");
const internal_api_key_middleware_1 = require("../middlewares/internal-api-key.middleware");
class ErpOrdersRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const datasource = new proscai_erp_orders_datasource_1.ProscaiErpOrdersDatasource();
        router.get("/:number", internal_api_key_middleware_1.InternalApiKeyMiddleware.validateRequired, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const number = String((_a = req.params.number) !== null && _a !== void 0 ? _a : "").trim().toUpperCase();
            if (!number || number.length > 80 || /[\r\n\t]/.test(number)) {
                res.status(400).json({ error: "Invalid ERP order number." });
                return;
            }
            try {
                const order = yield datasource.findByNumber(number);
                if (!order) {
                    res.status(404).json({ error: "ERP order not found." });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                console.error("ERP order lookup failed", error);
                res.status(503).json({ error: "ERP order lookup unavailable." });
            }
        }));
        return router;
    }
}
exports.ErpOrdersRoutes = ErpOrdersRoutes;
