import { RowDataPacket } from "mysql2";
import { pool } from "../database/proscai.mysql-connection";

interface EanRow extends RowDataPacket {
  ICOD: string;
  IEAN: string;
  IDESCR: string;
  ITIPO: number;
}

interface ReferenceRow extends EanRow {
  EXTENDED_DESCRIPTION: string | null;
  FAMILY: string | null;
}

export const parseEanReferencePrefixes = (value: unknown): string[] | null => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 8) return null;
  const prefixes: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !/^[A-Z]{2,8}[0-9A-Z/.+-]{0,32}$/.test(entry)) return null;
    if (!prefixes.includes(entry)) prefixes.push(entry);
  }
  return prefixes;
};

export class ProscaiEanLookupDatasource {
  async findMexicoReferences(prefixes: string[]) {
    const safePrefixes = parseEanReferencePrefixes(prefixes);
    if (!safePrefixes) throw new Error("Invalid EAN reference prefixes");
    const [rows] = await pool.execute<ReferenceRow[]>(`
      SELECT p.ICOD, p.IEAN, p.IDESCR, p.ITIPO,
             d.I2DESCR AS EXTENDED_DESCRIPTION, p.IFAMB AS FAMILY
      FROM FINV p
      LEFT JOIN FINV2 d ON d.I2KEY = p.ISEQ
      WHERE p.ICOD LIKE '01%' AND p.ITIPO = 1
        AND (${safePrefixes.map(() => "p.IEAN LIKE ?").join(" OR ")})
        AND CONCAT_WS(' ', p.IDESCR, d.I2DESCR, d.I2DESCR2, d.I2DESCR3, d.I2DESCR4)
            NOT REGEXP 'NO USAR|NO UTILIZAR|OBSOLETO|DUPLICAD'
      ORDER BY CASE WHEN p.IEAN LIKE ? THEN 0 ELSE 1 END, LENGTH(p.IEAN), p.ICOD
      LIMIT 101
    `, [...safePrefixes.map((prefix) => `${prefix}%`), `${safePrefixes[0]}%`]);
    return {
      references: rows.slice(0, 100).map((row) => ({
        code: String(row.ICOD).trim(),
        ean: String(row.IEAN).trim(),
        description: String(row.EXTENDED_DESCRIPTION || "").trim() || String(row.IDESCR).trim(),
        family: String(row.FAMILY || "").trim(),
        productType: Number(row.ITIPO),
        branchCode: "01" as const,
      })),
      hasMore: rows.length > 100,
    };
  }

  async findExact(ean: string) {
    const [rows] = await pool.execute<EanRow[]>(`
      SELECT ICOD, IEAN, IDESCR, ITIPO
      FROM FINV
      WHERE IEAN = ?
      ORDER BY ICOD
      LIMIT 21
    `, [ean]);
    return {
      matches: rows.slice(0, 20).map((row) => ({
        code: String(row.ICOD).trim(),
        ean: String(row.IEAN).trim(),
        description: String(row.IDESCR).trim(),
        productType: Number(row.ITIPO),
      })),
      hasMore: rows.length > 20,
    };
  }
}
