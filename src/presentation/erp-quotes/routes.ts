import { Router } from "express";
import { ProscaiErpQuotesDatasource } from "../../infrastructure/datasource/proscai-erp-quotes.datasource";
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware";

export class ErpQuotesRoutes {
  static routes(): Router {
    const router = Router();
    const datasource = new ProscaiErpQuotesDatasource();

    router.get("/:number", InternalApiKeyMiddleware.validateRequired, async (req, res) => {
      const number = String(req.params.number ?? "").trim().toUpperCase();
      if (!number || number.length > 80 || /[\r\n\t]/.test(number)) {
        res.status(400).json({ error: "Invalid ERP quote number." });
        return;
      }

      try {
        const quote = await datasource.findByNumber(number);
        if (!quote) {
          res.status(404).json({ error: "ERP quote not found." });
          return;
        }
        res.json(quote);
      } catch (error) {
        console.error("ERP quote lookup failed", error);
        res.status(503).json({ error: "ERP quote lookup unavailable." });
      }
    });

    return router;
  }
}
