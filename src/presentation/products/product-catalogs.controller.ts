import { Request, Response } from "express";
import { ProscaiProductCatalogsDatasource } from "../../infrastructure/datasource/proscai-product-catalogs.datasource";

export class ProductCatalogsController {
  constructor(private readonly datasource: ProscaiProductCatalogsDatasource) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json(await this.datasource.list());
    } catch (error) {
      console.error("list_erp_product_catalogs_failed", error);
      res.status(500).json({ error: "Could not load ERP product catalogs." });
    }
  };
}
