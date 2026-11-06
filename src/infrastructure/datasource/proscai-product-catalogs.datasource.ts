import { RowDataPacket } from "mysql2";
import { pool } from "../database/proscai.mysql-connection";

interface UnitRow extends RowDataPacket {
  USEQ: number;
  UCOD: string;
  UDESCR: string;
  UCODSAT: string | null;
  UINACTIVO: number;
}

interface FamilyRow extends RowDataPacket {
  FAMT: string;
  FAMTNUM: string;
  FAMDESCR: string;
  FAMPADRE: string | null;
  FAMICODSAT: string | null;
}

export class ProscaiProductCatalogsDatasource {
  async list() {
    const [units] = await pool.query<UnitRow[]>(`
      SELECT USEQ, UCOD, UDESCR, UCODSAT, UINACTIVO
      FROM funidad ORDER BY UCOD, USEQ
    `);
    const [families] = await pool.query<FamilyRow[]>(`
      SELECT FAMT, FAMTNUM, FAMDESCR, FAMPADRE, FAMICODSAT
      FROM ffam ORDER BY FAMT, FAMTNUM
    `);
    const [labels] = await pool.query<RowDataPacket[]>(`
      SELECT CIAFAMPAR1, CIAFAMPAR2, CIAFAMPAR3, CIAFAMPAR4, CIAFAMPAR5,
             CIAFAMPAR6, CIAFAMPAR7, CIAFAMPAR8, CIAFAMPAR9
      FROM fcia WHERE CIAKEY = 0 ORDER BY CIASEQ LIMIT 1
    `);

    const groups = new Map<string, {
      code: string;
      label: string;
      options: Array<{ code: string; description: string; parentCode: string | null; satCode: string | null }>;
    }>();
    for (const row of families) {
      const groupCode = String(row.FAMT).trim().toUpperCase();
      const code = String(row.FAMTNUM).trim();
      if (!/^[1-9A-R]$/.test(groupCode) || !code.startsWith(groupCode)) continue;
      if (!groups.has(groupCode)) {
        const configuredLabel = /^[1-9]$/.test(groupCode)
          ? String(labels[0]?.[`CIAFAMPAR${groupCode}`] ?? "").trim()
          : "";
        groups.set(groupCode, {
          code: groupCode,
          label: configuredLabel || `Clasificación ${groupCode}`,
          options: [],
        });
      }
      groups.get(groupCode)!.options.push({
        code,
        description: String(row.FAMDESCR).trim(),
        parentCode: String(row.FAMPADRE ?? "").trim() || null,
        satCode: String(row.FAMICODSAT ?? "").trim() || null,
      });
    }

    return {
      units: units.map((row) => ({
        id: row.USEQ,
        code: String(row.UCOD).trim(),
        description: String(row.UDESCR).trim(),
        satCode: String(row.UCODSAT ?? "").trim() || null,
        inactive: Number(row.UINACTIVO) !== 0,
      })),
      groups: [...groups.values()],
    };
  }
}
