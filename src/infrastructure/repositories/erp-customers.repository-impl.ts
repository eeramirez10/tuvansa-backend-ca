import { ErpCustomersDatasource } from "../../domain/datasource/erp-customers.datasource";
import { SearchErpCustomersRequestDto } from "../../domain/dto/erp-customers/search-erp-customers-request.dto";
import { SearchErpCustomersResponseDto } from "../../domain/dto/erp-customers/search-erp-customers-response.dto";
import { ErpCustomersRepository } from "../../domain/repositories/erp-customers.repository";

export class ErpCustomersRepositoryImpl implements ErpCustomersRepository {
  constructor(private readonly datasource: ErpCustomersDatasource) {}

  searchByTerm(
    request: SearchErpCustomersRequestDto
  ): Promise<SearchErpCustomersResponseDto[]> {
    return this.datasource.searchByTerm(request)
  }
}
