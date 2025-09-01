import { AccountStatementPaginationDto } from "../../domain/dto/account-statement/account-statement-pagination.dto";
import { AccountStatement } from "../../domain/entities/account-statement.entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { AccountStatementRepository } from "../../domain/repositories/account-statement.repository";
import { AccountStatementDatasource } from '../../domain/datasource/account-statement.datasource';

export class AccountStatementRepositoryImpl implements AccountStatementRepository {

  constructor(private accountStatementDatasource:AccountStatementDatasource){}

  getAll(asDTO: AccountStatementPaginationDto): Promise<PaginationResult<AccountStatement>> {
   return this.accountStatementDatasource.getAll(asDTO)
  }
  getById(id: string): Promise<AccountStatement> {
    return this.accountStatementDatasource.getById(id)
  }
  getByClientId(clientId: string): Promise<AccountStatement> {
    return this.getByClientId(clientId)
  }
  
}