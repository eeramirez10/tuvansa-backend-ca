import { RowDataPacket } from "mysql2";
import { AccountStatementDatasource } from "../../domain/datasource/account-statement.datasource";
import { AccountStatementPaginationDto } from "../../domain/dto/account-statement/account-statement-pagination.dto";
import { AccountStatement } from "../../domain/entities/account-statement.entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { pool } from "../database/proscai.mysql-connection";
import { AccountStatementMapper } from "../mappers/account-statement-mapper";

export class ProscaiAccountStatementDatasourceImpl implements AccountStatementDatasource {

  async getAll(dto: AccountStatementPaginationDto): Promise<PaginationResult<AccountStatement>> {
    const {
      page,
      pageSize,
      id,
      customerId,
      search,
      startDate,
      endDate,
      branchOffice,
      accesibleBranches,
      status
    } = dto;




    console.log({ accountStatement: dto })

    const { rows, total } = await this.querySqlAccountStatements(dto);

    const items = rows.map(row => AccountStatementMapper.jsonToEntity({ ...row, branchOffice }));
    const totalPages = Math.ceil(total / pageSize);



    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
  getById(id: string): Promise<AccountStatement> {
    throw new Error("Method not implemented.");
  }
  async getByClientId(clientId: string): Promise<AccountStatement> {


    throw new Error("Method not implemented.");


  }


  private querySqlAccountStatements = async (dto: AccountStatementPaginationDto) => {

    const {
      page,
      pageSize,
      id,
      customerId,
      search,
      startDate,
      endDate,
      branchOffice,
      accesibleBranches,
      status,
      hasDebt,
      view
    } = dto;

    const offset = (page - 1) * pageSize;

    const branchOfficeMap = {
      'MEXICO': '01',
      'MONTERREY': '02',
      'VERACRUZ': '03',
      'MEXICALI': '04',
      'QUERETARO': '05',
      'CANCUN': '06',
      'CABOS': '07',
    } as any;

    const selectedBranch = branchOfficeMap[branchOffice];

    let groupByClauses: string[] = []

    if (view) {
 
      if (view === 'summary') {
        groupByClauses.push('GROUP BY CLICOD')
      } else {
        groupByClauses.push('GROUP BY DNUM')
      }


    }

    let whereClauses: string[] = [
      "DESCXC = 1",

      "(MID(DNUM,1,1)='F' OR MID(DNUM,1,1)='C' OR MID(DNUM,1,1)='D' OR MID(DNUM,1,2) ='AF')",
      "(DATEDIFF(DVENCE, NOW()) - 1) <> 0"
    ];
    const values: any[] = [];

    // Sucursales
    if (accesibleBranches?.length) {
      const branches = [branchOffice, ...accesibleBranches].map((b: string) => `'${branchOfficeMap[b.toUpperCase()]}'`);
     
      whereClauses.push(`DMULTICIA IN (${branches.join(",")})`);
    } else {
      whereClauses.push(`DMULTICIA = ?`);
      values.push(selectedBranch);
    }

    // Filtros
    if (id) {
      whereClauses.push("fcli.CLISEQ = ?");
      values.push(id);
    }

    if (hasDebt) {

      whereClauses.push(hasDebt === true ? "DESFACT = 1" : 'DESFACT = 0')
    }

    if (customerId) {
      whereClauses.push("CLICOD = ?");
      values.push(customerId);
    }

    if (search) {
      whereClauses.push("CLINOM LIKE ?");
      values.push(`%${search.toUpperCase()}%`);
    }

    if (startDate) {
      whereClauses.push("DFECHA >= ?");
      values.push(startDate);
    }

    if (endDate) {
      whereClauses.push("DFECHA <= ?");
      values.push(endDate);
    }

    if (status) {

      const statusOptions = {
        CURRENT: "(DATEDIFF(DVENCE,NOW())-1) >= 30",
        DUESOON: " ((DATEDIFF(DVENCE,NOW())-1) > 0 and (DATEDIFF(DVENCE,NOW())-1) < 30)",
        OVERDUE: "(DATEDIFF(DVENCE,NOW())-1) <= 0"
      } as const;

      type statusType = keyof typeof statusOptions;

      const statusSQL = statusOptions[status.toUpperCase() as statusType] ?? null

      if (statusSQL) {

        whereClauses.push(statusSQL);
      }
      // values.push(endDate);
    }

    const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;
    const groupBySQL = groupByClauses.join(",")

    // Total sin LIMIT
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT DNUM
        FROM FAX
        LEFT JOIN FDOC ON FDOC.DSEQ = FAX.DSEQ
        LEFT JOIN FCLI ON FCLI.CLISEQ = FAX.CLISEQ
        ${whereSQL}
        ${groupBySQL}
      ) AS subquery
    `;

    const [countRows] = await pool.query<RowDataPacket[]>(countSQL, values);
    const total = Number(countRows[0]?.total ?? 0);

    // Datos paginados
    const querySQL = `

      SELECT
      fcli.cliseq AS id,
      DMULTICIA AS branchOffice,
      CLICOD AS clientId,
      CLINOM AS client,
      DNUM AS document, 
      DFECHA AS createdAt, 
      DVENCE AS dueDate,
      (DATEDIFF(DVENCE,NOW())-1) AS daysOverdue,
    CASE 
      WHEN (DATEDIFF(DVENCE,NOW())-1) >= 30 THEN 'CORRIENTE'
      WHEN ((DATEDIFF(DVENCE,NOW())-1) < 15 and (DATEDIFF(DVENCE,NOW())-1) > 0) THEN 'POR VENCER'
	    WHEN (DATEDIFF(DVENCE,NOW())-1) <= 0 THEN 'VENCIDO'
    ELSE 'VENCIDO'
  END AS dueStatus,
      ATIPMV,
      SUM(DCANTF) AS amount,
      SUM(IF((ACANT)>0,(ACANT),0)) AS charges,
      SUM(IF((ACANT)<0,(ACANT),0)) AS payments,
      (SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))) AS balance,
      IF((DATEDIFF(DVENCE,NOW())-1)>0,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS upcomingAmount,
      IF((DATEDIFF(DVENCE,NOW())-1)<=0,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS overdueAmount,
      IF((DATEDIFF(DVENCE,NOW())-1)-1 BETWEEN  0 AND 30,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS overdueTo30,
      IF((DATEDIFF(DVENCE,NOW())-1)-1 BETWEEN 30 AND 60,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS overdueTo60,
      IF((DATEDIFF(DVENCE,NOW())-1)-1 BETWEEN 60 AND 90,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS overdueTo90,
      IF((DATEDIFF(DVENCE,NOW())-1)*-1 BETWEEN 90 AND 999,(SUM(IF((ACANT)>0,(ACANT),0))+SUM(IF((ACANT)<0,(ACANT),0))),0) AS overdue90Plus
      FROM FAX
      LEFT JOIN FDOC ON FDOC.DSEQ=FAX.DSEQ
      LEFT JOIN FCLI ON FCLI.CLISEQ=FAX.CLISEQ
      ${whereSQL}
      ${groupBySQL}
      ORDER BY DNUM
      LIMIT ? OFFSET ?

    `;

    // console.log(querySQL)

   

    const [rows] = await pool.query<RowDataPacket[]>(querySQL, [...values, pageSize, offset]);
     
    return {
      rows,
      total
    }


  }

}