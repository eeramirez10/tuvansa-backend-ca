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
exports.ProscaiErpCustomersDatasource = void 0;
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const erp_customer_mapper_1 = require("../mappers/erp-customer.mapper");
class ProscaiErpCustomersDatasource {
    searchByTerm(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q, limit } = request;
            const like = `%${q.toUpperCase()}%`;
            const sql = `
      SELECT
        t.externalId,
        t.code,
        t.displayName,
        t.contactFullName,
        t.whatsapp,
        t.phone,
        t.email,
        t.taxId,
        t.companyName,
        t.branchCode,
        t.salesmanCode,
        t.billingStreet,
        t.billingColony,
        t.billingCity,
        t.billingState,
        t.billingPostalCode,
        t.billingCountry,
        t.lastSyncedAt
      FROM (
        SELECT
          CAST(FCLI.CLISEQ AS CHAR) AS externalId,
          FCLI.CLICOD AS code,
          TRIM(FCLI.CLINOM) AS displayName,
          TRIM(FCLI.CLINOM) AS companyName,

          COALESCE(
            NULLIF(TRIM(FCLI.CLICONT), ''),
            NULLIF(TRIM(CT.contactName), ''),
            ''
          ) AS contactFullName,

          COALESCE(
            NULLIF(TRIM(CT.whatsapp), ''),
            NULLIF(TRIM(CT.altPhone), ''),
            ''
          ) AS whatsapp,

          COALESCE(NULLIF(TRIM(FCLI.CLITEL), ''), '') AS phone,

          COALESCE(
            NULLIF(TRIM(CT.email), ''),
            NULLIF(TRIM(FCLI.CLITEL3), ''),
            ''
          ) AS email,

          COALESCE(NULLIF(TRIM(FCLI.CLIRFC), ''), '') AS taxId,

          CASE UPPER(
            TRIM(
              REPLACE(
                REPLACE(COALESCE(AG3.AGDESCR, ''), 'SUC.', ''),
                'SUC',
                ''
              )
            )
          )
            WHEN 'MEXICO' THEN '01'
            WHEN 'MONTERREY' THEN '02'
            WHEN 'VERACRUZ' THEN '03'
            WHEN 'MEXICALI' THEN '04'
            WHEN 'QUERETARO' THEN '05'
            WHEN 'CANCUN' THEN '06'
            WHEN 'CABOS' THEN '07'
            ELSE ''
          END AS branchCode,

          CAST(FCLI.CLIPAR1 AS CHAR) AS salesmanCode,

          NULLIF(
            TRIM(
              CONCAT_WS(
                ' ',
                NULLIF(TRIM(FCLI.CLIDIR), ''),
                CASE
                  WHEN NULLIF(TRIM(FCLI.CLINUMEXT), '') IS NOT NULL
                    THEN CONCAT('EXT ', TRIM(FCLI.CLINUMEXT))
                  ELSE NULL
                END,
                CASE
                  WHEN NULLIF(TRIM(FCLI.CLINUMINT), '') IS NOT NULL
                    THEN CONCAT('INT ', TRIM(FCLI.CLINUMINT))
                  ELSE NULL
                END
              )
            ),
            ''
          ) AS billingStreet,

          NULLIF(TRIM(FCLI.CLICOLONIA), '') AS billingColony,
          NULLIF(TRIM(FCLI.CLICD), '') AS billingCity,
          NULLIF(TRIM(FCLI.CLIEDO), '') AS billingState,
          NULLIF(TRIM(FCLI.CLICP), '') AS billingPostalCode,
          'MEXICO' AS billingCountry,
          DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') AS lastSyncedAt

        FROM FCLI
        LEFT JOIN FAG AG3 ON AG3.AGTNUM = FCLI.CLIPAR3
        LEFT JOIN (
          SELECT
            FC.CONTKEY,
            MAX(NULLIF(TRIM(FC.CONTNOMBRE), '')) AS contactName,
            MAX(NULLIF(TRIM(FC.CONTCEL), '')) AS whatsapp,
            MAX(NULLIF(TRIM(FC.CONTTEL1), '')) AS altPhone,
            MAX(NULLIF(TRIM(FC.CONTMAIL), '')) AS email
          FROM FCONTACTOS FC
          GROUP BY FC.CONTKEY
        ) CT ON CT.CONTKEY = FCLI.CLICOD

        WHERE (
          UPPER(COALESCE(FCLI.CLICOD, '')) LIKE ?
          OR UPPER(COALESCE(FCLI.CLINOM, '')) LIKE ?
          OR UPPER(COALESCE(FCLI.CLIRFC, '')) LIKE ?
          OR UPPER(COALESCE(FCLI.CLITEL, '')) LIKE ?
          OR UPPER(COALESCE(FCLI.CLICONT, '')) LIKE ?
          OR UPPER(COALESCE(CT.contactName, '')) LIKE ?
          OR UPPER(COALESCE(CT.whatsapp, '')) LIKE ?
          OR UPPER(COALESCE(CT.altPhone, '')) LIKE ?
          OR UPPER(COALESCE(CT.email, '')) LIKE ?
        )
      ) t
      ORDER BY t.code
      LIMIT ?
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, [like, like, like, like, like, like, like, like, like, limit]);
            return rows
                .map((row) => erp_customer_mapper_1.ErpCustomerMapper.toSearchResponseDto(row))
                .filter((row) => Boolean(row.externalId && row.code && row.displayName));
        });
    }
    getMonthlySalesSummary(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taxId, customerName, startDate, endDate } = request;
            const whereClauses = [
                "ITIPO <> 4",
                "DFECHA >= ?",
                "DFECHA <= ?",
                "DCANCELADA = 0",
                "DESFACT = 1",
                "DSTATUSCFD = 3",
            ];
            const values = [startDate, endDate];
            if (taxId) {
                whereClauses.push("UPPER(COALESCE(FCLI.CLIRFC, '')) = ?");
                values.push(taxId.toUpperCase());
            }
            if (customerName) {
                whereClauses.push("UPPER(COALESCE(FCLI.CLINOM, '')) LIKE ?");
                values.push(`%${customerName.toUpperCase()}%`);
            }
            const sql = `
      SELECT
        CAST(DATE_FORMAT(DFECHA, '%Y') AS UNSIGNED) AS year,
        CAST(DATE_FORMAT(DFECHA, '%m') AS UNSIGNED) AS month,
        TRIM(FCLI.CLICOD) AS customerCode,
        TRIM(FCLI.CLINOM) AS customerName,
        TRIM(FCLI.CLIRFC) AS taxId,
        ROUND(SUM(AICANTF * AIPRECIO), 2) AS subtotalAmount,
        ROUND(SUM(AICANTF * (AIPRECIO * (1 + (DPORCIVA / 100)))), 2) AS totalAmount
      FROM FAXINV
      LEFT JOIN FDOC ON FDOC.DSEQ = FAXINV.DSEQ
      LEFT JOIN FINV ON FINV.ISEQ = FAXINV.ISEQ
      LEFT JOIN FCLI ON FCLI.CLISEQ = FDOC.CLISEQ
      WHERE ${whereClauses.join(" AND ")}
      GROUP BY
        DATE_FORMAT(DFECHA, '%Y'),
        DATE_FORMAT(DFECHA, '%m'),
        FCLI.CLICOD,
        FCLI.CLINOM,
        FCLI.CLIRFC
      ORDER BY
        DATE_FORMAT(DFECHA, '%Y'),
        DATE_FORMAT(DFECHA, '%m'),
        FCLI.CLICOD
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, values);
            return rows
                .map((row) => erp_customer_mapper_1.ErpCustomerMapper.toMonthlySalesSummaryResponseDto(row))
                .filter((row) => Boolean(row.customerCode && row.customerName));
        });
    }
}
exports.ProscaiErpCustomersDatasource = ProscaiErpCustomersDatasource;
