import { GetMonthlySalesSummaryRequestDto } from "../dto/erp-customers/get-monthly-sales-summary-request.dto";
import { GetMonthlySalesSummaryResponseDto } from "../dto/erp-customers/get-monthly-sales-summary-response.dto";
import { SearchErpCustomersRequestDto } from "../dto/erp-customers/search-erp-customers-request.dto";
import { SearchErpCustomersResponseDto } from "../dto/erp-customers/search-erp-customers-response.dto";

export abstract class ErpCustomersDatasource {
  abstract searchByTerm(
    request: SearchErpCustomersRequestDto
  ): Promise<SearchErpCustomersResponseDto[]>

  abstract getMonthlySalesSummary(
    request: GetMonthlySalesSummaryRequestDto
  ): Promise<GetMonthlySalesSummaryResponseDto[]>
}
