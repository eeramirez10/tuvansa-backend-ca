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
            const { page, pageSize, startDate, endDate, rfc, search, branchOffice, accesibleBranches } = invoicePaginationDto;
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
            const selectedBranchOffice = branchOfficeValues[branchOffice];
            const offset = search ? 0 : (page - 1) * pageSize;
            let branchsOffice = `f.DMULTICIA=${selectedBranchOffice}`;
            if (accesibleBranches && (accesibleBranches === null || accesibleBranches === void 0 ? void 0 : accesibleBranches.length) > 0) {
                const branchsOfficeQuery = accesibleBranches.map((ab) => `f.DMULTICIA=${branchOfficeValues[ab.toUpperCase()]}`);
                let originalBranchOffice = `f.DMULTICIA=${selectedBranchOffice}`;
                branchsOffice = `(${originalBranchOffice} OR  ${branchsOfficeQuery.join(' OR ')})`;
            }
            let whereClauses = [
                '(f.DESFACT = ? OR f.DESFACT = 8)',
                'f.DSTATUSCFD = ?',
                "( MID(DNUM,1,1)= 'F' OR MID(DNUM,1,1)= 'D' OR MID(DNUM,1,1)= 'A'  OR MID(DNUM,1,1)= 'I' )"
            ];
            let likeClauses = [];
            let values = [1, 3];
            if (branchsOffice) {
                whereClauses.push(branchsOffice);
            }
            // if (branchOffice === 'CANCUN') {
            //   whereClauses[2] = '(f.DMULTICIA = 6 OR f.DMULTICIA = 7)'
            //   values = [1, 3]
            // }
            // if (branchOffice === 'MEXICO') {
            //   whereClauses[2] = '(f.DMULTICIA = 1 OR f.DMULTICIA = 6)'
            //   values = [1, 3]
            // }
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
            // const [countRows] = await pool.query<RowDataPacket[]>(countSQL, values);
            // const total = Number(countRows[0]?.total ?? 0);
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
            const totalPages = Math.ceil(100 / pageSize);
            return { items, total: 100, page, pageSize, totalPages };
        });
    }
}
exports.ProscaiInvoicesDatasourceImpl = ProscaiInvoicesDatasourceImpl;
