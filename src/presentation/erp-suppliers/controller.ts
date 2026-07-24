import type { Request, Response } from "express";
import { SearchErpSuppliersRequestDto } from "../../domain/dto/erp-suppliers/search-erp-suppliers-request.dto";
import { ErpSuppliersRepository } from "../../domain/repositories/erp-suppliers.repository";
import { GetErpSupplierByCodeUseCase } from "../../use-cases/erp-suppliers/get-erp-supplier-by-code.use-case";
import { SearchErpSuppliersUseCase } from "../../use-cases/erp-suppliers/search-erp-suppliers.use-case";

export class ErpSuppliersController {
  constructor(private readonly repository: ErpSuppliersRepository) {}

  search = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = SearchErpSuppliersRequestDto.execute(req.query as Record<string, unknown>);
    if (error) return void res.status(400).json({ error });
    try {
      res.status(200).json(await new SearchErpSuppliersUseCase(this.repository).execute(dto!));
    } catch (cause) {
      console.error("search_erp_suppliers_failed", cause);
      res.status(500).json({ error: "Internal error" });
    }
  };

  getByCode = async (req: Request, res: Response): Promise<void> => {
    const code = typeof req.params.code === "string" ? req.params.code.trim().toUpperCase() : "";
    if (!code) return void res.status(400).json({ error: "Supplier code is required" });
    try {
      const supplier = await new GetErpSupplierByCodeUseCase(this.repository).execute(code);
      if (!supplier) return void res.status(404).json({ error: "Supplier not found" });
      res.status(200).json(supplier);
    } catch (cause) {
      console.error("get_erp_supplier_failed", cause);
      res.status(500).json({ error: "Internal error" });
    }
  };
}
