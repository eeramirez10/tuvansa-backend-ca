import { SearchErpCustomersRequestDto } from "../dto/erp-customers/search-erp-customers-request.dto";
import { SearchErpCustomersResponseDto } from "../dto/erp-customers/search-erp-customers-response.dto";

export abstract class ErpCustomersRepository {
  abstract searchByTerm(
    request: SearchErpCustomersRequestDto
  ): Promise<SearchErpCustomersResponseDto[]>
}
