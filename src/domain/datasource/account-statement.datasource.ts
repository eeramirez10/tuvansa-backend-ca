import { AccountStatement } from "../entities/account-statement.entity";
import { PaginationResult } from "../entities/pagination-result";
import { AccountStatementPaginationDto } from '../dto/account-statement/account-statement-pagination.dto';

export abstract class AccountStatementDatasource {

  abstract getAll(asDTO: AccountStatementPaginationDto): Promise<PaginationResult<AccountStatement>>
  abstract getById(id: string): Promise<AccountStatement>
  abstract getByClientId(clientId: string): Promise<AccountStatement>

}