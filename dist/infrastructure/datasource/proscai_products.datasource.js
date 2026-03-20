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
    findByEanAndBranch(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ean, branchId } = request;
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
            const [rows] = yield proscai_mysql_connection_1.pool.query(productsSql, [likeTerm, likeTerm, likeTerm, branchId]);
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
}
exports.ProscaiProductsRepository = ProscaiProductsRepository;
