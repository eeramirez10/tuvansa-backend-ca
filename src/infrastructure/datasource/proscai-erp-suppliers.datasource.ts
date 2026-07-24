import type { RowDataPacket } from "mysql2";
import { ErpSuppliersDatasource } from "../../domain/datasource/erp-suppliers.datasource";
import { ErpSupplierResponseDto } from "../../domain/dto/erp-suppliers/erp-supplier-response.dto";
import { SearchErpSuppliersRequestDto } from "../../domain/dto/erp-suppliers/search-erp-suppliers-request.dto";
import { pool } from "../database/proscai.mysql-connection";
import { ErpSupplierMapper } from "../mappers/erp-supplier.mapper";

export class ProscaiErpSuppliersDatasource extends ErpSuppliersDatasource {
  async search(request: SearchErpSuppliersRequestDto): Promise<ErpSupplierResponseDto[]> {
    const like = `%${request.q}%`;
    const codesSql = `
      SELECT DISTINCT TRIM(FPRV.PRVCOD) AS code
      FROM FPRV
      LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FPRV.PRVCOD
      WHERE MID(FPRV.PRVCOD, 1, 1) = '3'
        AND (
          UPPER(COALESCE(FPRV.PRVCOD, '')) LIKE ?
          OR UPPER(COALESCE(FPRV.PRVNOM, '')) LIKE ?
          OR UPPER(COALESCE(FPRV.PRVRFC, '')) LIKE ?
          OR UPPER(COALESCE(FCONTACTOS.CONTNOMBRE, '')) LIKE ?
          OR UPPER(COALESCE(FCONTACTOS.CONTMAIL, '')) LIKE ?
        )
      ORDER BY code
      LIMIT ?
    `;
    const [codeRows] = await pool.query<RowDataPacket[]>(codesSql, [like, like, like, like, like, request.limit]);
    const codes = codeRows.map((row) => String(row.code || "").trim()).filter(Boolean);
    return codes.length ? this.findManyByCodes(codes) : [];
  }

  async findByCode(code: string): Promise<ErpSupplierResponseDto | null> {
    const suppliers = await this.findManyByCodes([code.trim().toUpperCase()]);
    return suppliers[0] ?? null;
  }

  private async findManyByCodes(codes: string[]): Promise<ErpSupplierResponseDto[]> {
    const placeholders = codes.map(() => "?").join(", ");
    const sql = `
      SELECT PRVCOD, PRVNOM, PRVRFC, PRVEDO, PRVCREDIT, PRVMONEDA,
        CONTNOMBRE, CONTPUESTO, CONTTEL1, CONTEXT, CONTMAIL, CONTCEL, CONTOBS
      FROM FPRV
      LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FPRV.PRVCOD
      WHERE MID(FPRV.PRVCOD, 1, 1) = '3'
        AND TRIM(FPRV.PRVCOD) IN (${placeholders})
      ORDER BY FPRV.PRVCOD, FCONTACTOS.CONTNOMBRE
    `;
    const [rows] = await pool.query<RowDataPacket[]>(sql, codes);
    return ErpSupplierMapper.toResponse(rows as Array<Record<string, unknown>>);
  }
}
