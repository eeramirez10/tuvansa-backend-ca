import { GetMonthlySalesSummaryRequestDto } from "../../domain/dto/erp-customers/get-monthly-sales-summary-request.dto";
import { GetMonthlySalesSummaryResponseDto } from "../../domain/dto/erp-customers/get-monthly-sales-summary-response.dto";
import { ErpCustomersRepository } from "../../domain/repositories/erp-customers.repository";

export class GetMonthlySalesSummaryUseCase {
  constructor(private readonly repository: ErpCustomersRepository) {}

  async execute(
    request: GetMonthlySalesSummaryRequestDto
  ): Promise<GetMonthlySalesSummaryResponseDto[]> {
    return this.repository.getMonthlySalesSummary(request)
  }
}
