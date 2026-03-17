import { ErpUserDatasource } from "../../domain/datasource/erp-user.datasource";
import { ErpUserSummary } from "../../domain/entities/erp-user-summary";
import { pool } from "../database/proscai.mysql-connection";

export class ProscaiErpUsersDatasource implements ErpUserDatasource {

  async search(query: string, params?: { by?: "code" | "description" | "both"; limit?: number; }): Promise<ErpUserSummary[]> {



    const q = query.trim().toUpperCase();
    const by = params?.by ?? "both";
    const limit = params?.limit ?? 20;

    let whereSearch = "";
    const values: Array<string | number> = [];

    if (q) {
      if (by === "code") {
        whereSearch = ` AND AGTNUM LIKE ? `;
        values.push(`${q}%`);
      } else if (by === "description") {
        whereSearch = ` AND AGDESCR LIKE ? `;
        values.push(`%${q}%`);
      } else {
        whereSearch = ` AND (AGTNUM LIKE ? OR AGDESCR LIKE ?) `;
        values.push(`${q}%`, `%${q}%`);
      }
    }

    const sql = `
    SELECT AGTNUM, AGDESCR
    FROM FAG
    WHERE AGT = 1
      AND AGTIPO = 0
      ${whereSearch}
    ORDER BY AGTNUM
    LIMIT ?
  `;

    values.push(limit);

    const [rows] = await pool.execute<any[]>(sql, values)



    return rows.map((row: any) => new ErpUserSummary({
      code: String(row.AGTNUM).trim(),
      description: String(row.AGDESCR ?? "").trim(),
    }));

  }
  async findByCode(code: string): Promise<ErpUserSummary | null> {
    const sql = `
    SELECT AGTNUM, AGDESCR
    FROM FAG
    WHERE AGT = 1
      AND AGTIPO = 0
      AND AGTNUM = ?
    ORDER BY AGTNUM
  `;

    const [[row]] = await pool.execute<any[]>(sql, [code.trim()])

 
    if (!row) return null;

    return new ErpUserSummary({
      code: String(row.AGTNUM).trim(),
      description: String(row.AGDESCR ?? "").trim(),
    })
  }

}