import { RowDataPacket } from "mysql2";
import { InvoicesDatasource } from "../../domain/datasource/invoices-datasource";
import { InvoicePaginationDto } from "../../domain/dto/invoice-pagination.dto";
import { InvoiceEntity } from "../../domain/entities/invoice-entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { pool } from "../database/proscai.mysql-connection";
import { InvoiceMapper } from "../mappers/invoice-mapper";

export class ProscaiInvoicesDatasourceImpl extends InvoicesDatasource {


  async getInvoices(invoicePaginationDto: InvoicePaginationDto): Promise<PaginationResult<InvoiceEntity>> {
    const { page, pageSize, startDate, endDate, rfc, search, branchOffice } = invoicePaginationDto


    const branchOfficeValues = {
      'MEXICO': 1,
      'MONTERREY': 2,
      'VERACRUZ': 3,
      'MEXICALI': 4,
      'QUERETARO': 5,
      'CANCUN': 6,
      'CABOS': 7,
    }

    const startDateValueDefault = startDate ?? '2025-01-01'

    const endDateValueDefault = endDate ?? '2025-12-31'


    const selectedBranchOffice = branchOfficeValues[branchOffice] ?? branchOfficeValues['MEXICO']

    const offset = search ? 0 : (page - 1) * pageSize;

    const whereClauses = [
      'f.DESFACT = ?',
      'f.DSTATUSCFD = ?',
      'f.DMULTICIA = ?',
      "(MID(DNUM,1,1)= 'F' OR MID(DNUM,1,1)= 'D')"
    ];

    let likeClauses = [

    ]

    const values: any[] = [1, 3, selectedBranchOffice];

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
      likeClauses.push('f.DNUM  like ? ')
      values.push(`%${search}`)
    }


    const whereSQL = 'WHERE ' + whereClauses.join(' AND ');

    const likeSQL = `${likeClauses.length > 0 ? 'AND ' : ''}` + likeClauses.join(' AND ')

    // 2) Contar total
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM FDOC f
      LEFT JOIN FCLI c ON c.CLISEQ = f.CLISEQ
      ${whereSQL}
    `;
    const [countRows] = await pool.query<RowDataPacket[]>(countSQL, values);
    const total = Number(countRows[0]?.total ?? 0);

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
    const [rows] = await pool.query<RowDataPacket[]>(
      pageSQL,
      [...values, pageSize, offset]
    );

  
    const items = rows.map((v) => InvoiceMapper.jsonToEntity(v));


    const totalPages = Math.ceil(total / pageSize);


    return { items, total, page, pageSize, totalPages };

  }

}