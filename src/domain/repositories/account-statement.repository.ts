import { AccountStatementPaginationDto } from "../dto/account-statement/account-statement-pagination.dto";
import { AccountStatement } from "../entities/account-statement.entity";
import { PaginationResult } from "../entities/pagination-result";

export abstract class AccountStatementRepository {

  abstract getAll(asDTO: AccountStatementPaginationDto): Promise<PaginationResult<AccountStatement>>
  abstract getById(id: string): Promise<AccountStatement>
  abstract getByClientId(clientId: string): Promise<AccountStatement>

}