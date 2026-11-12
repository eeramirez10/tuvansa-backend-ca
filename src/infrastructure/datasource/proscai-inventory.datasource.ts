import type { RowDataPacket } from "mysql2";
import type { ErpInventoryQuery } from "../../domain/dto/products/erp-inventory-query.dto";
import { pool } from "../database/proscai.mysql-connection";

interface InventoryRow extends RowDataPacket {
  productId: string | number;
  code: string | null;
  ean: string | null;
  description: string | null;
  unit: string | null;
  warehouseCode: string | null;
  stock: string | number | null;
}

const rawWarehouse = "TRIM(CONVERT(ALMNUM USING utf8mb4))";
const warehouseExpression = `(CASE WHEN ${rawWarehouse} REGEXP '^[0-9]+$'
  THEN LPAD(${rawWarehouse}, GREATEST(2, CHAR_LENGTH(${rawWarehouse})), '0')
  ELSE ${rawWarehouse} END) COLLATE utf8mb4_bin`;
// Aggregate stock independently: multiple FINV2 descriptions must never multiply ALMCANT.
const inventorySource = `
  FROM (
    SELECT p.ISEQ AS productId, p.ICOD AS code, p.IEAN AS ean, p.IUM AS unit,
      COALESCE((
        SELECT TRIM(d.I2DESCR) FROM FINV2 d
        WHERE d.I2KEY = p.ISEQ AND NULLIF(TRIM(d.I2DESCR), '') IS NOT NULL
        ORDER BY d.I2SEQ LIMIT 1
      ), TRIM(p.IDESCR), '') AS description,
      a.warehouseCode, a.stock
    FROM FINV p
    LEFT JOIN (
      SELECT ISEQ, ${warehouseExpression} AS warehouseCode, SUM(ALMCANT) AS stock
      FROM FALM WHERE ALMNUM IS NOT NULL AND ${rawWarehouse} <> ''
      GROUP BY ISEQ, ${warehouseExpression}
    ) a ON a.ISEQ = p.ISEQ
  ) inventory
`;

export function buildInventoryQueries(query: ErpInventoryQuery, warehouseCodes?: readonly string[]) {
  const conditions: string[] = [];
  const params: Array<string | number> = [];
  if (query.query) {
    // Proscai uses macroman_bin: normalize both operands explicitly, not via connection collation.
    conditions.push(`(${["ean", "code", "description"].map(column =>
      `UPPER(CONVERT(${column} USING utf8mb4)) LIKE UPPER(CONVERT(? USING utf8mb4)) ESCAPE '!'`).join(" OR ")})`);
    const term = `%${query.query.replace(/[!%_]/g, "!$&")}%`;
    params.push(term, term, term);
  }
  if (query.warehouseCode) { conditions.push("warehouseCode = ?"); params.push(query.warehouseCode); }
  if (warehouseCodes !== undefined) {
    conditions.push(warehouseCodes.length ? `warehouseCode IN (${warehouseCodes.map(() => "?").join(", ")})` : "1 = 0");
    params.push(...warehouseCodes);
  }
  const stockFilters = { all: "", positive: "stock > 0", zero: "stock = 0", negative: "stock < 0" };
  if (stockFilters[query.stock]) conditions.push(stockFilters[query.stock]);
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const columns = { code: "code", ean: "ean", description: "description", unit: "unit", warehouseCode: "warehouseCode", stock: "stock" };
  const order = `${columns[query.sortBy]} ${query.sortDirection === "desc" ? "DESC" : "ASC"}, code ASC, warehouseCode ASC, productId ASC`;
  return {
    countSql: `SELECT COUNT(*) AS total ${inventorySource} ${where}`,
    rowsSql: `SELECT productId, code, ean, description, unit, warehouseCode, stock ${inventorySource} ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
    params,
    rowsParams: [...params, query.pageSize, (query.page - 1) * query.pageSize],
  };
}

export class ProscaiInventoryDatasource {
  async list(query: ErpInventoryQuery, warehouseCodes?: readonly string[]) {
    const sql = buildInventoryQueries(query, warehouseCodes);
    const [counts] = await pool.query<RowDataPacket[]>(sql.countSql, sql.params);
    const total = Number(counts[0]?.total ?? 0);
    const [rows] = await pool.query<InventoryRow[]>(sql.rowsSql, sql.rowsParams);
    return {
      items: rows.map((row) => ({
        id: `${row.productId}::${row.warehouseCode ?? "none"}`,
        code: String(row.code ?? "").trim(), ean: String(row.ean ?? "").trim(),
        description: String(row.description ?? "").trim(), unit: String(row.unit ?? "").trim(),
        warehouseCode: row.warehouseCode == null ? null : String(row.warehouseCode),
        stock: row.stock == null ? null : Number(row.stock),
      })),
      page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize),
      ...(warehouseCodes !== undefined && { warehouseCodes }),
    };
  }

  async warehouses(): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT DISTINCT ${warehouseExpression} AS code FROM FALM
      WHERE ALMNUM IS NOT NULL AND ${rawWarehouse} <> '' ORDER BY code
    `);
    return rows.map((row) => String(row.code));
  }
}
