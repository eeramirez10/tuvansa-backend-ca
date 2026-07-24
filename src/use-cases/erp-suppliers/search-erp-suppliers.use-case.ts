import { SearchErpSuppliersRequestDto } from "../../domain/dto/erp-suppliers/search-erp-suppliers-request.dto";
import { ErpSuppliersRepository } from "../../domain/repositories/erp-suppliers.repository";

export class SearchErpSuppliersUseCase {
  constructor(private readonly repository: ErpSuppliersRepository) {}
  execute(request: SearchErpSuppliersRequestDto) { return this.repository.search(request); }
}
