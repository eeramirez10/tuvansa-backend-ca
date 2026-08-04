"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProscaiProductsRepository = void 0;
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const product_mapper_1 = require("../mappers/product-mapper");
class ProscaiProductsRepository {
    constructor() {
        this.warehouseNames = {
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
        this.branchNames = {
            "01": "MEXICO",
            "02": "MONTERREY",
            "03": "VERACRUZ",
            "04": "MEXICALI",
            "05": "QUERETARO",
            "06": "CANCUN",
            "07": "LOS CABOS",
        };
    }
    findByEanAndBranch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ean, branchId } = request;
            const stockWarehouseId = branchId === "01" ? "15" : branchId;
            console.log({ request });
            const productsSql = `
    SELECT
  almseq as id,
  ICOD AS CODIGO,
  IEAN AS CLAVE,
  I2DESCR AS DESCRIPCION,
  FAMB.FAMDESCR AS FAMILIA,
  ALMNUM AS ALMACEN_ID,
  CASE ALMNUM
    WHEN '01' THEN 'MEXICO'
    WHEN '02' THEN 'MONTERREY'
    WHEN '03' THEN 'VERACRUZ'
    WHEN '04' THEN 'MEXICALI'
    WHEN '05' THEN 'QUERETARO'
    WHEN '06' THEN 'CANCUN'
    WHEN '15' THEN 'RESGUARDO QUERETARO'
    ELSE 'DESCONOCIDO'
    END AS ALMACEN_NOMBRE,
    ALMCANT AS EXISTENCIA,
    IUM AS UNIDAD,
    CASE WHEN IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
    ILISTA4 AS COSTO_PROM,
    ILISTA5 AS COSTO_ULTI
    FROM FALM
    LEFT JOIN FINV ON FINV.ISEQ = FALM.ISEQ
    LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
    LEFT JOIN FFAM AS FAMB ON FAMB.FAMTNUM = FINV.IFAMB
    WHERE (
      IEAN LIKE ? OR
      ICOD LIKE ? OR
      I2DESCR LIKE ?
    ) AND
    ITIPO = 1 AND ALMNUM = ?
    limit 10
    
    `;
            const likeTerm = `%${ean}%`;
            const [rows] = yield proscai_mysql_connection_1.pool.query(productsSql, [likeTerm, likeTerm, likeTerm, stockWarehouseId]);
            return rows.map(row => product_mapper_1.ProductMapper.toGetByEanResponseDto({
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
            }));
        });
    }
    findByTermAndWarehouses(term, warehouseCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (warehouseCodes.length === 0)
                return [];
            const warehousePlaceholders = warehouseCodes.map(() => "?").join(", ");
            const sql = `
      SELECT
        MIN(FALM.almseq) AS id,
        FINV.ICOD AS CODIGO,
        FINV.IEAN AS CLAVE,
        COALESCE(FINV2.I2DESCR, '') AS DESCRIPCION,
        FALM.ALMNUM AS ALMACEN_ID,
        COALESCE(SUM(FALM.ALMCANT), 0) AS EXISTENCIA,
        FINV.IUM AS UNIDAD,
        CASE WHEN FINV.IMONEDA1 = '1' THEN 'MXN' ELSE 'USD' END AS MONEDA,
        COALESCE(FINV.ILISTA4, 0) AS COSTO_PROM,
        COALESCE(FINV.ILISTA5, 0) AS COSTO_ULTI
      FROM FALM
      INNER JOIN FINV ON FINV.ISEQ = FALM.ISEQ
      LEFT JOIN FINV2 ON FINV2.I2KEY = FINV.ISEQ
      WHERE FINV.ITIPO = 1
        AND FALM.ALMNUM IN (${warehousePlaceholders})
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
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, [
                ...warehouseCodes,
                likeTerm,
                likeTerm,
                likeTerm,
            ]);
            return rows.map((row) => {
                var _a;
                return product_mapper_1.ProductMapper.toGetByEanResponseDto({
                    id: String(row.id),
                    code: row.CODIGO,
                    ean: row.CLAVE,
                    description: row.DESCRIPCION,
                    stock: row.EXISTENCIA,
                    unit: row.UNIDAD,
                    currency: row.MONEDA,
                    averageCost: row.COSTO_PROM,
                    lastCost: row.COSTO_ULTI,
                    warehouseId: row.ALMACEN_ID,
                    warehouseName: (_a = this.warehouseNames[String(row.ALMACEN_ID)]) !== null && _a !== void 0 ? _a : `ALMACEN ${row.ALMACEN_ID}`,
                });
            });
        });
    }
    findByCodeInMexico(code) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, [code.trim().toUpperCase()]);
            const row = rows[0];
            if (!row)
                return null;
            return product_mapper_1.ProductMapper.toGetByEanResponseDto({
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
        });
    }
    findAvailabilityByEan(ean) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const products = yield this.findAvailabilityByEans([ean]);
            return (_a = products[0]) !== null && _a !== void 0 ? _a : null;
        });
    }
    findAvailabilityByEans(eans, warehouseCodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (eans.length === 0)
                return [];
            const placeholders = eans.map(() => "?").join(", ");
            const branchCodes = Object.keys(this.branchNames);
            const preserveWarehouseCodes = Boolean(warehouseCodes === null || warehouseCodes === void 0 ? void 0 : warehouseCodes.length);
            const stockWarehouseCodes = preserveWarehouseCodes
                ? Array.from(new Set(warehouseCodes !== null && warehouseCodes !== void 0 ? warehouseCodes : []))
                : Array.from(new Set([...branchCodes, "15"]));
            const availabilityNames = preserveWarehouseCodes
                ? Object.fromEntries(stockWarehouseCodes.map((code) => { var _a; return [code, (_a = this.warehouseNames[code]) !== null && _a !== void 0 ? _a : `ALMACEN ${code}`]; }))
                : this.branchNames;
            const inventoryJoin = preserveWarehouseCodes ? "INNER JOIN" : "LEFT JOIN";
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
      ${inventoryJoin} FALM
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
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, [...stockWarehouseCodes, ...eans]);
            return this.mapAvailabilityRows(rows, eans, preserveWarehouseCodes, availabilityNames);
        });
    }
    mapAvailabilityRows(rows, requestedEans, preserveWarehouseCodes, availabilityNames) {
        var _a, _b, _c, _d, _e, _f, _g;
        const products = new Map();
        for (const row of rows) {
            const ean = String((_a = row.ean) !== null && _a !== void 0 ? _a : "").trim();
            if (!ean)
                continue;
            const current = (_b = products.get(ean)) !== null && _b !== void 0 ? _b : {
                canonical: row,
                sourceProductCodes: new Set(),
                branchStock: new Map(),
                codes: new Map(),
            };
            const productCode = String((_c = row.productCode) !== null && _c !== void 0 ? _c : "").trim();
            const stockWarehouseCode = String((_d = row.branchCode) !== null && _d !== void 0 ? _d : "").trim();
            const branchCode = preserveWarehouseCodes
                ? stockWarehouseCode
                : stockWarehouseCode === "15" ? "01" : stockWarehouseCode;
            if (productCode)
                current.sourceProductCodes.add(productCode);
            const codeAvailability = productCode
                ? (_e = current.codes.get(productCode)) !== null && _e !== void 0 ? _e : { canonical: row, branchStock: new Map() }
                : null;
            if (availabilityNames[branchCode]) {
                const stock = this.toNumber(row.stock);
                current.branchStock.set(branchCode, ((_f = current.branchStock.get(branchCode)) !== null && _f !== void 0 ? _f : 0) + stock);
                if (codeAvailability) {
                    codeAvailability.branchStock.set(branchCode, ((_g = codeAvailability.branchStock.get(branchCode)) !== null && _g !== void 0 ? _g : 0) + stock);
                }
            }
            if (productCode && codeAvailability)
                current.codes.set(productCode, codeAvailability);
            products.set(ean, current);
        }
        return requestedEans.flatMap((ean) => {
            var _a, _b, _c;
            const product = products.get(ean);
            if (!product)
                return [];
            const branches = this.buildBranches(product.branchStock, availabilityNames, !preserveWarehouseCodes);
            const totalStock = this.roundNumber(branches.reduce((total, branch) => total + branch.stock, 0));
            const sourceProductCodes = Array.from(product.sourceProductCodes).sort();
            const canonical = product.canonical;
            const codes = Array.from(product.codes.entries())
                .map(([icod, code]) => {
                var _a, _b;
                const codeBranches = this.buildBranches(code.branchStock, availabilityNames, !preserveWarehouseCodes);
                const codeTotalStock = this.roundNumber(codeBranches.reduce((total, branch) => total + branch.stock, 0));
                return {
                    icod,
                    homeBranchCode: this.resolveHomeBranchCode(icod),
                    homeBranchName: this.resolveHomeBranchName(icod),
                    description: String((_a = code.canonical.description) !== null && _a !== void 0 ? _a : ""),
                    unit: String((_b = code.canonical.unit) !== null && _b !== void 0 ? _b : ""),
                    costs: {
                        average: this.roundNumber(this.toNumber(code.canonical.averageCost)),
                        last: this.roundNumber(this.toNumber(code.canonical.lastCost)),
                        currency: this.toCurrency(code.canonical.currency),
                    },
                    totalStock: codeTotalStock,
                    availableInAnyBranch: codeTotalStock > 0,
                    branches: codeBranches,
                };
            })
                .sort((left, right) => left.icod.localeCompare(right.icod));
            return [{
                    ean,
                    productCode: String((_a = canonical.productCode) !== null && _a !== void 0 ? _a : ""),
                    sourceProductCodes,
                    hasMultipleProductCodes: sourceProductCodes.length > 1,
                    description: String((_b = canonical.description) !== null && _b !== void 0 ? _b : ""),
                    unit: String((_c = canonical.unit) !== null && _c !== void 0 ? _c : ""),
                    costs: {
                        average: this.roundNumber(this.toNumber(canonical.averageCost)),
                        last: this.roundNumber(this.toNumber(canonical.lastCost)),
                        currency: this.toCurrency(canonical.currency),
                    },
                    totalStock,
                    availableInAnyBranch: totalStock > 0,
                    branches,
                    codes,
                }];
        });
    }
    buildBranches(branchStock, availabilityNames, includeMissing) {
        return Object.entries(availabilityNames)
            .filter(([branchCode]) => includeMissing || branchStock.has(branchCode))
            .map(([branchCode, branchName]) => {
            var _a;
            const stock = this.roundNumber((_a = branchStock.get(branchCode)) !== null && _a !== void 0 ? _a : 0);
            return {
                branchCode,
                branchName,
                stock,
                available: stock > 0,
            };
        });
    }
    resolveHomeBranchCode(icod) {
        const branchCode = icod.slice(0, 2);
        return this.branchNames[branchCode] ? branchCode : null;
    }
    resolveHomeBranchName(icod) {
        const branchCode = this.resolveHomeBranchCode(icod);
        return branchCode ? this.branchNames[branchCode] : null;
    }
    toNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : 0;
    }
    roundNumber(value) {
        return Math.round(value * 10000) / 10000;
    }
    toCurrency(value) {
        return String(value).toUpperCase() === "USD" ? "USD" : "MXN";
    }
}
exports.ProscaiProductsRepository = ProscaiProductsRepository;
