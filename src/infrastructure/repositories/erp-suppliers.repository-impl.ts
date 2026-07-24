import { ErpSuppliersDatasource } from "../../domain/datasource/erp-suppliers.datasource";
import { ErpSupplierResponseDto } from "../../domain/dto/erp-suppliers/erp-supplier-response.dto";
import { SearchErpSuppliersRequestDto } from "../../domain/dto/erp-suppliers/search-erp-suppliers-request.dto";
import { ErpSuppliersRepository } from "../../domain/repositories/erp-suppliers.repository";

export class ErpSuppliersRepositoryImpl extends ErpSuppliersRepository {
  constructor(private readonly datasource: ErpSuppliersDatasource) { super(); }
  search(request: SearchErpSuppliersRequestDto): Promise<ErpSupplierResponseDto[]> { return this.datasource.search(request); }
  findByCode(code: string): Promise<ErpSupplierResponseDto | null> { return this.datasource.findByCode(code); }
}
