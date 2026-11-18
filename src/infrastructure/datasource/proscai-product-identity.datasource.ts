import type { RowDataPacket } from "mysql2";
import { pool } from "../database/proscai.mysql-connection";

export const productIdentitySql = `
  SELECT TRIM(p.ICOD) AS code, COALESCE(TRIM(p.IEAN), '') AS ean,
    COALESCE(NULLIF(TRIM(p.IDESCR), ''), '') AS description,
    COALESCE(TRIM(p.IUM), '') AS unit
  FROM FINV p
  WHERE p.ICOD = ? AND p.ICTA = ?
  LIMIT 1
`;

export class ProscaiProductIdentityDatasource {
  async find(code: string, primaryAccount: string) {
    const [rows] = await pool.query<RowDataPacket[]>(productIdentitySql, [code, primaryAccount]);
    const row = rows[0];
    return row ? { code: row.code, ean: row.ean, description: row.description, unit: row.unit } : null;
  }
}
