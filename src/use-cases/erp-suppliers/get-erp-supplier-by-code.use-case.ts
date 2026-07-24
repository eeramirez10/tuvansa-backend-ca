import { ErpSuppliersRepository } from "../../domain/repositories/erp-suppliers.repository";

export class GetErpSupplierByCodeUseCase {
  constructor(private readonly repository: ErpSuppliersRepository) {}
  execute(code: string) { return this.repository.findByCode(code); }
}
