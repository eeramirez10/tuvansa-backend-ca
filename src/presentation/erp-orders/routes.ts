import { Router } from "express";
import { ProscaiErpOrdersDatasource } from "../../infrastructure/datasource/proscai-erp-orders.datasource";
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware";

export class ErpOrdersRoutes {
  static routes(): Router {
    const router = Router();
    const datasource = new ProscaiErpOrdersDatasource();

    router.get("/:number", InternalApiKeyMiddleware.validateRequired, async (req, res) => {
      const number = String(req.params.number ?? "").trim().toUpperCase();
      if (!number || number.length > 80 || /[\r\n\t]/.test(number)) {
        res.status(400).json({ error: "Invalid ERP order number." });
        return;
      }

      try {
        const order = await datasource.findByNumber(number);
        if (!order) {
          res.status(404).json({ error: "ERP order not found." });
          return;
        }
        res.json(order);
      } catch (error) {
        console.error("ERP order lookup failed", error);
        res.status(503).json({ error: "ERP order lookup unavailable." });
      }
    });

    return router;
  }
}
