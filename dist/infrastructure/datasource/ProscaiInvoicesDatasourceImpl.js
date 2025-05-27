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
exports.ProscaiInvoicesDatasourceImpl = void 0;
const invoices_datasource_1 = require("../../domain/datasource/invoices-datasource");
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const invoice_mapper_1 = require("../mappers/invoice-mapper");
class ProscaiInvoicesDatasourceImpl extends invoices_datasource_1.InvoicesDatasource {
    getInvoices(invoicePaginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page, pageSize, startDate, endDate, rfc, search, branchOffice } = invoicePaginationDto;
            const branchOfficeValues = {
                'MEXICO': 1,
                'MONTERREY': 2,
                'VERACRUZ': 3,
                'MEXICALI': 4,
                'QUERETARO': 5,
                'CANCUN': 6,
                'CABOS': 7,
            };
            const startDateValueDefault = startDate !== null && startDate !== void 0 ? startDate : '2025-01-01';
            const endDateValueDefault = endDate !== null && endDate !== void 0 ? endDate : '2025-12-31';
            const selectedBranchOffice = (_a = branchOfficeValues[branchOffice]) !== null && _a !== void 0 ? _a : branchOfficeValues['MEXICO'];
            const offset = search ? 0 : (page - 1) * pageSize;
            const whereClauses = [
                'f.DESFACT = ?',
                'f.DSTATUSCFD = ?',
                'f.DMULTICIA = ?',
                "(MID(DNUM,1,1)= 'F' OR MID(DNUM,1,1)= 'D')"
            ];
            let likeClauses = [];
            const values = [1, 3, selectedBranchOffice];
            if (startDateValueDefault) {
                whereClauses.push('f.DFECHA >= ?');
                values.push(startDateValueDefault);
            }
            if (endDateValueDefault) {
                whereClauses.push('f.DFECHA <= ?');
                values.push(endDateValueDefault);
            }
            if (rfc) {
                whereClauses.push('clirfc = ?');
                values.push(rfc);
            }
            if (search) {
                likeClauses.push('f.DNUM  like ? ');
                values.push(`%${search}`);
            }
            const whereSQL = 'WHERE ' + whereClauses.join(' AND ');
            const likeSQL = `${likeClauses.length > 0 ? 'AND ' : ''}` + likeClauses.join(' AND ');
            // 2) Contar total
            const countSQL = `
      SELECT COUNT(*) AS total
      FROM FDOC f
      LEFT JOIN FCLI c ON c.CLISEQ = f.CLISEQ
      ${whereSQL}
    `;
            const [countRows] = yield proscai_mysql_connection_1.pool.query(countSQL, values);
            const total = Number((_c = (_b = countRows[0]) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0);
            // 3) Paginación
            const pageSQL = `
      SELECT
        c.CLINOM                          AS client,
        clirfc                           As rfc,
        f.DNUM                            AS invoiceNumber,
        f.DREFERELLOS                     AS reference,
        f.DFECHA                          AS invoiceDate,
        f.DVENCE                          AS dueDate,
        f.DFECHAPEDIDO                    AS orderDate,
        f.DBRUTO                          AS grossAmount,
        f.DIVA                            AS vatAmount,
        f.DCANTF                          AS totalAmount,
        f.DCANT                           AS balance,
        f.DTIPOC2                         AS exchangeRate,
        f.DSTATUSCFD                      AS statusCfd,
        IF(f.DMONEDA=1,'PESOS','DOLARES') AS currency
      FROM FDOC f
      LEFT JOIN FCLI c ON c.CLISEQ = f.CLISEQ
      ${whereSQL}
      ${likeSQL}
      ORDER BY f.DFECHA DESC
      LIMIT ? OFFSET ?
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.query(pageSQL, [...values, pageSize, offset]);
            const items = rows.map((v) => invoice_mapper_1.InvoiceMapper.jsonToEntity(v));
            const totalPages = Math.ceil(total / pageSize);
            return { items, total, page, pageSize, totalPages };
        });
    }
}
exports.ProscaiInvoicesDatasourceImpl = ProscaiInvoicesDatasourceImpl;
