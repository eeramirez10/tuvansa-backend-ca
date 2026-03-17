import { ErpUserSummary } from "../entities/erp-user-summary";

export abstract class ErpUserRepository {

  abstract search(query: string, params?: { by?: "code" | "description" | "both"; limit?: number }):Promise<ErpUserSummary[]>
  abstract findByCode(code: string): Promise<ErpUserSummary | null>;

}