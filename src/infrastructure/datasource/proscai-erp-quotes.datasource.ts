import { RowDataPacket } from "mysql2";
import { pool } from "../database/proscai.mysql-connection";

interface ErpQuoteRow extends RowDataPacket {
  quoteNumber: string;
  customerCode: string | null;
}

export class ProscaiErpQuotesDatasource {
  async findByNumber(number: string): Promise<{ quoteNumber: string; customerCode: string | null } | null> {
    const [rows] = await pool.query<ErpQuoteRow[]>(`
      SELECT CAST(p.PENUM AS CHAR) AS quoteNumber, c.CLICOD AS customerCode
      FROM fpenc p
      LEFT JOIN fcli c ON c.CLISEQ = p.CLISEQ
      WHERE p.PENUM = ? AND p.PESPEDIDO = 4
      LIMIT 1
    `, [number]);

    const row = rows[0];
    return row ? {
      quoteNumber: String(row.quoteNumber).trim().toUpperCase(),
      customerCode: row.customerCode ? String(row.customerCode).trim().toUpperCase() : null,
    } : null;
  }
}
