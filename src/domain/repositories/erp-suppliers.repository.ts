import { ErpSupplierResponseDto } from "../dto/erp-suppliers/erp-supplier-response.dto";
import { SearchErpSuppliersRequestDto } from "../dto/erp-suppliers/search-erp-suppliers-request.dto";

export abstract class ErpSuppliersRepository {
  abstract search(request: SearchErpSuppliersRequestDto): Promise<ErpSupplierResponseDto[]>;
  abstract findByCode(code: string): Promise<ErpSupplierResponseDto | null>;
}
