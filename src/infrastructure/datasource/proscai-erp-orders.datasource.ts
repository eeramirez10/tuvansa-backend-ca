import { RowDataPacket } from "mysql2";
import { pool } from "../database/proscai.mysql-connection";

interface ErpOrderRow extends RowDataPacket {
  orderNumber: string;
  customerCode: string | null;
}

export class ProscaiErpOrdersDatasource {
  async findByNumber(number: string): Promise<{ orderNumber: string; customerCode: string | null } | null> {
    const [rows] = await pool.query<ErpOrderRow[]>(`
      SELECT CAST(p.PENUM AS CHAR) AS orderNumber, c.CLICOD AS customerCode
      FROM fpenc p
      LEFT JOIN fcli c ON c.CLISEQ = p.CLISEQ
      WHERE p.PENUM = ? AND p.PESPEDIDO = 1
      LIMIT 1
    `, [number]);

    const row = rows[0];
    return row ? {
      orderNumber: String(row.orderNumber).trim().toUpperCase(),
      customerCode: row.customerCode ? String(row.customerCode).trim().toUpperCase() : null,
    } : null;
  }
}
