import { Router } from "express";
import { ProscaiErpSuppliersDatasource } from "../../infrastructure/datasource/proscai-erp-suppliers.datasource";
import { ErpSuppliersRepositoryImpl } from "../../infrastructure/repositories/erp-suppliers.repository-impl";
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware";
import { ErpSuppliersController } from "./controller";

export class ErpSuppliersRoutes {
  static routes(): Router {
    const router = Router();
    const controller = new ErpSuppliersController(
      new ErpSuppliersRepositoryImpl(new ProscaiErpSuppliersDatasource()),
    );
    router.use(InternalApiKeyMiddleware.validateRequired);
    router.get("/search", controller.search);
    router.get("/:code", controller.getByCode);
    return router;
  }
}
