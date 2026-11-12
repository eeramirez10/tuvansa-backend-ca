import { Router } from "express";
import { parseErpInventoryQuery, parseInventoryWarehouseScope } from "../../domain/dto/products/erp-inventory-query.dto";
import { ProscaiInventoryDatasource } from "../../infrastructure/datasource/proscai-inventory.datasource";
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware";

export function inventoryRoutes(): Router {
  const router = Router();
  const inventory = new ProscaiInventoryDatasource();
  router.use(InternalApiKeyMiddleware.validateRequired);
  router.get("/warehouses", async (_req, res) => {
    try { res.json(await inventory.warehouses()); }
    catch (error) {
      console.error("erp_inventory_warehouses_failed", error);
      res.status(500).json({ error: "No se pudieron consultar los almacenes del ERP." });
    }
  });
  router.get("/", async (req, res) => {
    let query;
    let warehouseCodes;
    try {
      query = parseErpInventoryQuery(req.query);
      warehouseCodes = parseInventoryWarehouseScope(req.query.warehouseCodes);
    }
    catch (error) { res.status(400).json({ error: (error as Error).message }); return; }
    try { res.json(await inventory.list(query, warehouseCodes)); }
    catch (error) {
      console.error("erp_inventory_failed", error);
      res.status(500).json({ error: "No se pudo consultar el inventario del ERP." });
    }
  });
  return router;
}
