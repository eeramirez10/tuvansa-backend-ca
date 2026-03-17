import { ErpUserSummary } from "../../domain/entities/erp-user-summary";
import { ErpUserRepository } from "../../domain/repositories/erp-user.repository";
import { ErpUserDatasource } from '../../domain/datasource/erp-user.datasource';

export class ErpUsersRepositoryImpl implements ErpUserRepository {

  constructor(private readonly datasource:ErpUserDatasource){}

  search(query: string, params?: { by?: "code" | "description" | "both"; limit?: number; }): Promise<ErpUserSummary[]> {
    return this.datasource.search(query, params)
  }
  findByCode(code: string): Promise<ErpUserSummary | null> {
    return this.datasource.findByCode(code)
  }
  
}