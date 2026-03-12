import { SearchErpCustomersRequestDto } from "../../domain/dto/erp-customers/search-erp-customers-request.dto";
import { SearchErpCustomersResponseDto } from "../../domain/dto/erp-customers/search-erp-customers-response.dto";
import { ErpCustomersRepository } from "../../domain/repositories/erp-customers.repository";

export class SearchErpCustomersUseCase {
  constructor(private readonly repository: ErpCustomersRepository) {}

  async execute(
    request: SearchErpCustomersRequestDto
  ): Promise<SearchErpCustomersResponseDto[]> {
    return this.repository.searchByTerm(request)
  }
}
