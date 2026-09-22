import { ProductsDatasource } from "../../domain/datasource/products.datasource";
import { GetByEanAndBranchRequestDto } from "../../domain/dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import {
  ProductAvailabilityCurrency,
  ProductAvailabilityDto,
} from "../../domain/dto/products/product-availability.dto";

import { pool } from "../database/proscai.mysql-connection";
import { ProductMapper } from "../mappers/product-mapper";


export class ProscaiProductsRepository implements ProductsDatasource {

  private readonly warehouseNames: Record<string, string> = {
    "00": "ALMACEN CENTRAL",
    "01": "SUC. MEXICO",
    "02": "SUC. MONTERREY",
    "03": "SUC. VERACRUZ",
    "04": "SUC. MEXICALI",
    "05": "SUC. QUERETARO",
    "06": "SUC. CANCUN",
    "07": "SUC. CABOS",
    "11": "NO CALIDAD MEX",
    "12": "RESGUARDO MTY",
    "13": "RESGUARDO VER",
    "15": "RESGUARDO QUERETARO",
    "21": "RESGUARDO MEX",
    "22": "NO CALIDAD MTY",
    "23": "RESGUARDO VER",
    "61": "RESGUARDO MEX",
    "62": "RESGUARDO MTY",
    "97": "TRANSITO VER",
    "99": "TRANSITO MEX",
  };

  private readonly branchNames: Record<string, string> = {
    "01": "MEXICO",
    "02": "MONTERREY",
    "03": "VERACRUZ",
    "04": "MEXICALI",
    "05": "QUERETARO",
    "06": "CANCUN",
    "07": "LOS CABOS",
  };


  async findByEanAndBranch(request: GetByEanAndBranchRequestDto): Promise<GetByEanResponseDto[]> {

    const { ean, branchId } = request
    const stockWarehouseId = branchId === "01" ? "15" : branchId

    console.log({ request })

    const productsSql = `
    SELECT
  COALESCE(FALM.almseq, FINV.ISEQ) as id,
  ICOD AS CODIGO,
  IEAN AS CLAVE,
  I2DESCR AS DESCRIPCION,
  FAMB.FAMDESCR AS FAMILIA,
  ALMNUM AS ALMACEN_ID,
    CASE FALM.ALMNUM
    WHEN '01' THEN 'MEXICO'
    WHEN '02' THEN 'MONTERREY'
    WHEN '03' THEN 'VERACRUZ'
    WHEN '04' THEN 'MEXICALI'
    WHEN '05' THEN 'QUERETARO'
    WHEN '06' THEN 'CANCUN'
    WHEN '15' THEN 'RESGUARDO QUERETARO'
    ELSE 'SIN ALMACEN ERP'
    END AS ALMACEN_NOMBRE,
    ALMCANT AS EXISTENCIA,
    IUM AS UNIDAD,
    CASE WHEN IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
    ILISTA4 AS COSTO_PROM,
    ILISTA5 AS COSTO_ULTI
    FROM FINV
    LEFT JOIN FALM
      ON FINV.ISEQ = FALM.ISEQ
      AND FALM.ALMNUM = ?
    LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
    LEFT JOIN FFAM AS FAMB ON FAMB.FAMTNUM = FINV.IFAMB
    WHERE (
      IEAN LIKE ? OR
      ICOD LIKE ? OR
      I2DESCR LIKE ?
    ) AND
    FINV.ITIPO = 1
    limit 10
    
    `

    const likeTerm = `%${ean}%`
    const [rows] = await pool.query<any[]>(productsSql, [stockWarehouseId, likeTerm, likeTerm, likeTerm])


    return rows.map(row => ProductMapper.toGetByEanResponseDto({
      id: row.id,
      code: row.CODIGO,
      ean: row.CLAVE,
      description: row.DESCRIPCION,
      stock: row.EXISTENCIA,
      unit: row.UNIDAD,
      currency: row.MONEDA,
      averageCost: row.COSTO_PROM,
      lastCost: row.COSTO_ULTI,
      warehouseId: row.ALMACEN_ID == null ? "" : String(row.ALMACEN_ID),
      warehouseName: row.ALMACEN_NOMBRE,

    }))
  }

  async findByTermAndWarehouses(term: string, warehouseCodes: string[]): Promise<GetByEanResponseDto[]> {
    if (warehouseCodes.length === 0) return [];

    const warehousePlaceholders = warehouseCodes.map(() => "?").join(", ");
    const sql = `
      SELECT
        COALESCE(MIN(FALM.almseq), FINV.ISEQ) AS id,
        FINV.ICOD AS CODIGO,
        FINV.IEAN AS CLAVE,
        COALESCE(FINV2.I2DESCR, '') AS DESCRIPCION,
        FALM.ALMNUM AS ALMACEN_ID,
        COALESCE(SUM(FALM.ALMCANT), 0) AS EXISTENCIA,
        FINV.IUM AS UNIDAD,
        CASE WHEN FINV.IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
        COALESCE(FINV.ILISTA4, 0) AS COSTO_PROM,
        COALESCE(FINV.ILISTA5, 0) AS COSTO_ULTI
      FROM FINV
      LEFT JOIN FALM
        ON FINV.ISEQ = FALM.ISEQ
        AND FALM.ALMNUM IN (${warehousePlaceholders})
      LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
      WHERE FINV.ITIPO = 1
        AND (
          FINV.IEAN LIKE ? OR
          FINV.ICOD LIKE ? OR
          FINV2.I2DESCR LIKE ?
        )
      GROUP BY
        FINV.ISEQ,
        FINV.ICOD,
        FINV.IEAN,
        FINV2.I2DESCR,
        FALM.ALMNUM,
        FINV.IUM,
        FINV.IMONEDA1,
        FINV.ILISTA4,
        FINV.ILISTA5
      ORDER BY
        CASE WHEN COALESCE(SUM(FALM.ALMCANT), 0) > 0 THEN 0 ELSE 1 END,
        FINV.ICOD,
        FALM.ALMNUM
      LIMIT 200
    `;
    const likeTerm = `%${term}%`;
    const [rows] = await pool.query<any[]>(sql, [
      ...warehouseCodes,
      likeTerm,
      likeTerm,
      likeTerm,
    ]);

    return rows.map((row) => ProductMapper.toGetByEanResponseDto({
      id: String(row.id),
      code: row.CODIGO,
      ean: row.CLAVE,
      description: row.DESCRIPCION,
      stock: row.EXISTENCIA,
      unit: row.UNIDAD,
      currency: row.MONEDA,
      averageCost: row.COSTO_PROM,
      lastCost: row.COSTO_ULTI,
      warehouseId: row.ALMACEN_ID == null ? "" : String(row.ALMACEN_ID),
      warehouseName: row.ALMACEN_ID == null
        ? "SIN ALMACEN ERP"
        : this.warehouseNames[String(row.ALMACEN_ID)] ?? `ALMACEN ${row.ALMACEN_ID}`,
    }));
  }

  async findByCodeInMexico(code: string): Promise<GetByEanResponseDto | null> {
    const sql = `
      SELECT
        almseq AS id,
        ICOD AS CODIGO,
        IEAN AS CLAVE,
        I2DESCR AS DESCRIPCION,
        ALMNUM AS ALMACEN_ID,
        'RESGUARDO QUERETARO' AS ALMACEN_NOMBRE,
        ALMCANT AS EXISTENCIA,
        IUM AS UNIDAD,
        CASE WHEN IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
        ILISTA4 AS COSTO_PROM,
        ILISTA5 AS COSTO_ULTI
      FROM FALM
      LEFT JOIN FINV ON FINV.ISEQ = FALM.ISEQ
      LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
      WHERE ICOD = ?
        AND ITIPO = 1
        AND ALMNUM = '15'
      LIMIT 1
    `;
    const [rows] = await pool.query<any[]>(sql, [code.trim().toUpperCase()]);
    const row = rows[0];
    if (!row) return null;

    return ProductMapper.toGetByEanResponseDto({
      id: row.id,
      code: row.CODIGO,
      ean: row.CLAVE,
      description: row.DESCRIPCION,
      stock: row.EXISTENCIA,
      unit: row.UNIDAD,
      currency: row.MONEDA,
      averageCost: row.COSTO_PROM,
      lastCost: row.COSTO_ULTI,
      warehouseId: row.ALMACEN_ID,
      warehouseName: row.ALMACEN_NOMBRE,
    });
  }

  async findAvailabilityByEan(ean: string): Promise<ProductAvailabilityDto | null> {
    const products = await this.findAvailabilityByEans([ean]);
    return products[0] ?? null;
  }

  async findAvailabilityByEans(eans: string[], warehouseCodes?: string[]): Promise<ProductAvailabilityDto[]> {
    if (eans.length === 0) return [];

    const placeholders = eans.map(() => "?").join(", ");
    const branchCodes = Object.keys(this.branchNames);
    const preserveWarehouseCodes = Boolean(warehouseCodes?.length);
    const stockWarehouseCodes = preserveWarehouseCodes
      ? Array.from(new Set(warehouseCodes ?? []))
      : Array.from(new Set([...branchCodes, "15"]));
    const availabilityNames = preserveWarehouseCodes
      ? Object.fromEntries(stockWarehouseCodes.map((code) => [code, this.warehouseNames[code] ?? `ALMACEN ${code}`]))
      : this.branchNames;
    const branchPlaceholders = stockWarehouseCodes.map(() => "?").join(", ");
    const sql = `
      SELECT
        FINV.ISEQ AS productId,
        FINV.ICOD AS productCode,
        FINV.IEAN AS ean,
        COALESCE(FINV2.I2DESCR, '') AS description,
        COALESCE(FINV.IUM, '') AS unit,
        CASE WHEN FINV.IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS currency,
        COALESCE(FINV.ILISTA4, 0) AS averageCost,
        COALESCE(FINV.ILISTA5, 0) AS lastCost,
        FINV.IULTCPR AS lastPurchaseDate,
        FINV.IULTVTA AS lastSaleDate,
        FALM.ALMNUM AS branchCode,
        COALESCE(SUM(FALM.ALMCANT), 0) AS stock
      FROM FINV
      LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
      LEFT JOIN FALM
        ON FALM.ISEQ = FINV.ISEQ
        AND FALM.ALMNUM IN (${branchPlaceholders})
      WHERE FINV.IEAN IN (${placeholders})
        AND FINV.ITIPO = 1
      GROUP BY
        FINV.ISEQ,
        FINV.ICOD,
        FINV.IEAN,
        FINV2.I2DESCR,
        FINV.IUM,
        FINV.IMONEDA1,
        FINV.ILISTA4,
        FINV.ILISTA5,
        FINV.IULTCPR,
        FINV.IULTVTA,
        FALM.ALMNUM
      ORDER BY
        FINV.IEAN ASC,
        CASE WHEN FALM.ALMNUM IS NOT NULL THEN 0 ELSE 1 END ASC,
        CASE WHEN FINV.ILISTA4 <> 0 OR FINV.ILISTA5 <> 0 THEN 0 ELSE 1 END ASC,
        GREATEST(FINV.IULTCPR, FINV.IULTVTA) DESC,
        CASE WHEN LEFT(FINV.ICOD, 2) = '01' THEN 0 ELSE 1 END ASC,
        FINV.ICOD ASC,
        FALM.ALMNUM ASC
    `;

    const [rows] = await pool.query<any[]>(sql, [...stockWarehouseCodes, ...eans]);
    return this.mapAvailabilityRows(rows, eans, preserveWarehouseCodes, availabilityNames);
  }

  private mapAvailabilityRows(
    rows: any[],
    requestedEans: string[],
    preserveWarehouseCodes: boolean,
    availabilityNames: Record<string, string>,
  ): ProductAvailabilityDto[] {
    const products = new Map<string, {
      canonical: any;
      sourceProductCodes: Set<string>;
      branchStock: Map<string, number>;
      codes: Map<string, { canonical: any; branchStock: Map<string, number> }>;
    }>();

    for (const row of rows) {
      const ean = String(row.ean ?? "").trim();
      if (!ean) continue;

      const current = products.get(ean) ?? {
        canonical: row,
        sourceProductCodes: new Set<string>(),
        branchStock: new Map<string, number>(),
        codes: new Map<string, { canonical: any; branchStock: Map<string, number> }>(),
      };
      const productCode = String(row.productCode ?? "").trim();
      const stockWarehouseCode = String(row.branchCode ?? "").trim();
      const branchCode = preserveWarehouseCodes
        ? stockWarehouseCode
        : stockWarehouseCode === "15" ? "01" : stockWarehouseCode;

      if (productCode) current.sourceProductCodes.add(productCode);
      const codeAvailability = productCode
        ? current.codes.get(productCode) ?? { canonical: row, branchStock: new Map<string, number>() }
        : null;

      if (availabilityNames[branchCode]) {
        const stock = this.toNumber(row.stock);
        current.branchStock.set(branchCode, (current.branchStock.get(branchCode) ?? 0) + stock);
        if (codeAvailability) {
          codeAvailability.branchStock.set(
            branchCode,
            (codeAvailability.branchStock.get(branchCode) ?? 0) + stock,
          );
        }
      }

      if (productCode && codeAvailability) current.codes.set(productCode, codeAvailability);

      products.set(ean, current);
    }

    return requestedEans.flatMap((ean) => {
      const product = products.get(ean);
      if (!product) return [];

      const branches = this.buildBranches(product.branchStock, availabilityNames, !preserveWarehouseCodes);
      const totalStock = this.roundNumber(branches.reduce((total, branch) => total + branch.stock, 0));
      const sourceProductCodes = Array.from(product.sourceProductCodes).sort();
      const canonical = product.canonical;
      const codes = Array.from(product.codes.entries())
        .map(([icod, code]) => {
          const codeBranches = this.buildBranches(code.branchStock, availabilityNames, !preserveWarehouseCodes);
          const codeTotalStock = this.roundNumber(
            codeBranches.reduce((total, branch) => total + branch.stock, 0),
          );

          return {
            icod,
            homeBranchCode: this.resolveHomeBranchCode(icod),
            homeBranchName: this.resolveHomeBranchName(icod),
            description: String(code.canonical.description ?? ""),
            unit: String(code.canonical.unit ?? ""),
            costs: {
              average: this.roundNumber(this.toNumber(code.canonical.averageCost)),
              last: this.roundNumber(this.toNumber(code.canonical.lastCost)),
              currency: "MXN" as const,
              saleCurrency: this.toCurrency(code.canonical.currency),
              hasUsableCost: this.hasUsableCost(code.canonical),
            },
            totalStock: codeTotalStock,
            availableInAnyBranch: codeTotalStock > 0,
            branches: codeBranches,
          };
        })
        .sort((left, right) => left.icod.localeCompare(right.icod));

      return [{
        ean,
        productCode: String(canonical.productCode ?? ""),
        sourceProductCodes,
        hasMultipleProductCodes: sourceProductCodes.length > 1,
        description: String(canonical.description ?? ""),
        unit: String(canonical.unit ?? ""),
        costs: {
          average: this.roundNumber(this.toNumber(canonical.averageCost)),
          last: this.roundNumber(this.toNumber(canonical.lastCost)),
          currency: "MXN" as const,
          saleCurrency: this.toCurrency(canonical.currency),
          hasUsableCost: this.hasUsableCost(canonical),
        },
        totalStock,
        availableInAnyBranch: totalStock > 0,
        branches,
        codes,
      }];
    });
  }

  private buildBranches(
    branchStock: Map<string, number>,
    availabilityNames: Record<string, string>,
    includeMissing: boolean,
  ) {
    return Object.entries(availabilityNames)
      .filter(([branchCode]) => includeMissing || branchStock.has(branchCode))
      .map(([branchCode, branchName]) => {
      const stock = this.roundNumber(branchStock.get(branchCode) ?? 0);
      return {
        branchCode,
        branchName,
        stock,
        available: stock > 0,
        };
      });
  }

  private resolveHomeBranchCode(icod: string): string | null {
    const branchCode = icod.slice(0, 2);
    return this.branchNames[branchCode] ? branchCode : null;
  }

  private resolveHomeBranchName(icod: string): string | null {
    const branchCode = this.resolveHomeBranchCode(icod);
    return branchCode ? this.branchNames[branchCode] : null;
  }

  private toNumber(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  private hasUsableCost(row: { averageCost?: unknown; lastCost?: unknown }): boolean {
    return Math.max(this.toNumber(row.averageCost), this.toNumber(row.lastCost)) > 0;
  }

  private roundNumber(value: number): number {
    return Math.round(value * 10_000) / 10_000;
  }

  private toCurrency(value: unknown): ProductAvailabilityCurrency {
    return String(value).toUpperCase() === "USD" ? "USD" : "MXN";
  }






}
