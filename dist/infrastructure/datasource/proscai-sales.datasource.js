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
exports.ProscaiSalesDatasource = void 0;
const sales_datasourece_1 = require("../../domain/datasource/sales.datasourece");
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const sales_mapper_1 = require("../mappers/sales-mapper");
class ProscaiSalesDatasource extends sales_datasourece_1.SalesDatasource {
    getSales(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const dto = filters;
            // 2. Build WHERE clauses & parameters
            const whereClauses = [
                'DSTATUSCFD = 3',
                'DESFACT = 1',
                'DCANCELADA = 0',
                'ITIPO <> 4',
            ];
            const params = [];
            if (dto.branch) {
                whereClauses.push('DMULTICIA = ?');
                params.push(dto.branch);
            }
            if (dto.agent) {
                whereClauses.push('FAG.AGCIANAME = ?');
                params.push(dto.agent);
            }
            if (dto.date) {
                whereClauses.push('DFECHA = ?');
                params.push(dto.date.toISOString().slice(0, 10));
            }
            else if (dto.startDate && dto.endDate) {
                whereClauses.push('DFECHA BETWEEN ? AND ?');
                params.push(dto.startDate.toISOString().slice(0, 10), dto.endDate.toISOString().slice(0, 10));
            }
            // 3. Assemble full SQL
            const sql = `
      SELECT
        CASE DMULTICIA
          WHEN '1' THEN '01 MEXICO'
          WHEN '2' THEN '02 MONTERREY'
          WHEN '3' THEN '03 VERACRUZ'
          WHEN '4' THEN '04 MEXICALI'
          WHEN '5' THEN '05 QUERETARO'
          WHEN '6' THEN '06 CANCUN'
          WHEN '7' THEN '07 CABOS'
        END AS branch,

        CASE DATE_FORMAT(DFECHA, '%m')
          WHEN '01' THEN '01 ENERO'
          WHEN '02' THEN '02 FEBRERO'
          WHEN '03' THEN '03 MARZO'
          WHEN '04' THEN '04 ABRIL'
          WHEN '05' THEN '05 MAYO'
          WHEN '06' THEN '06 JUNIO'
          WHEN '07' THEN '07 JULIO'
          WHEN '08' THEN '08 AGOSTO'
          WHEN '09' THEN '09 SEPTIEMBRE'
          WHEN '10' THEN '10 OCTUBRE'
          WHEN '11' THEN '11 NOVIEMBRE'
          WHEN '12' THEN '12 DICIEMBRE'
        END AS month,

        MID(DNUM,1,2)               AS type,
        CLINOM                      AS client,
        DATE_FORMAT(DFECHA,'%m')    AS monthNumber,
        DATE_FORMAT(DFECHA,'%Y')    AS year,
        DFECHA                      AS date,
        DNUM                        AS document,
        ICOD                        AS code,
        IEAN                        AS ean,
        I2DESCR                     AS description,
        FAMB.FAMDESCR               AS family,
        FAG.AGCIANAME               AS agent,

        SUM(AICANTF)                          AS quantity,
        SUM(AICANTF * AIPRECIO)               AS salesAmount,
        SUM(AICANTF * AICOSTO)                AS costAmount,
        SUM(AICANTF * AIPRECIO)
          - SUM(AICANTF * AICOSTO)             AS profit,
        (SUM(AICANTF * AIPRECIO)
          - SUM(AICANTF * AICOSTO))
          / SUM(AICANTF * AIPRECIO) * 100      AS percentage

      FROM FAXINV
      LEFT JOIN FDOC  ON FDOC.DSEQ   = FAXINV.DSEQ
      LEFT JOIN FCLI  ON FCLI.CLISEQ = FDOC.CLISEQ
      LEFT JOIN FINV  ON FINV.ISEQ   = FAXINV.ISEQ
      LEFT JOIN FINV2 ON FINV2.I2KEY = FAXINV.ISEQ
      LEFT JOIN FFAM AS FAMB ON FAMB.FAMTNUM = FINV.IFAMB
      LEFT JOIN FAG  ON FAG.AGTNUM  = FDOC.DPAR1

      ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}

      GROUP BY
        DMULTICIA,
        DATE_FORMAT(DFECHA,'%Y'),
        DATE_FORMAT(DFECHA,'%m'),
        FAG.AGCIANAME,
        FAMB.FAMDESCR,
        DNUM
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.execute(sql, params);
            return rows.map((r) => sales_mapper_1.SalesMapper.jsonToEntity(r));
        });
    }
}
exports.ProscaiSalesDatasource = ProscaiSalesDatasource;
