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
exports.ProscaiAccountStatementDatasourceImpl = void 0;
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const account_statement_mapper_1 = require("../mappers/account-statement-mapper");
class ProscaiAccountStatementDatasourceImpl {
    constructor() {
        this.querySqlAccountStatements = (dto) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page, pageSize, id, customerId, search, startDate, endDate, branchOffice, accesibleBranches, status, hasDebt, view } = dto;
            const offset = (page - 1) * pageSize;
            const branchOfficeMap = {
                'MEXICO': '01',
                'MONTERREY': '02',
                'VERACRUZ': '03',
                'MEXICALI': '04',
                'QUERETARO': '05',
                'CANCUN': '06',
                'CABOS': '07',
            };
            const selectedBranch = branchOfficeMap[branchOffice];
            let groupByClauses = [];
            if (view) {
                if (view === 'summary') {
                    groupByClauses.push('GROUP BY CLICOD');
                }
                else {
                    groupByClauses.push('GROUP BY DNUM');
                }
            }
            let whereClauses = [
                "DESCXC = 1",
                "(MID(DNUM,1,1)='F' OR MID(DNUM,1,1)='C' OR MID(DNUM,1,1)='D' OR MID(DNUM,1,2) ='AF')",
                "(DATEDIFF(DVENCE, NOW()) - 1) <> 0"
            ];
            const values = [];
            // Sucursales
            if (accesibleBranches === null || accesibleBranches === void 0 ? void 0 : accesibleBranches.length) {
                const branches = [branchOffice, ...accesibleBranches].map((b) => `'${branchOfficeMap[b.toUpperCase()]}'`);
                whereClauses.push(`DMULTICIA IN (${branches.join(",")})`);
            }
            else {
                whereClauses.push(`DMULTICIA = ?`);
                values.push(selectedBranch);
            }
            // Filtros
            if (id) {
                whereClauses.push("fcli.CLISEQ = ?");
                values.push(id);
            }
            if (hasDebt) {
                whereClauses.push(hasDebt === true ? "DESFACT = 1" : 'DESFACT = 0');
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
                };
                const statusSQL = (_a = statusOptions[status.toUpperCase()]) !== null && _a !== void 0 ? _a : null;
                if (statusSQL) {
                    whereClauses.push(statusSQL);
                }
                // values.push(endDate);
            }
            const whereSQL = `WHERE ${whereClauses.join(" AND ")}`;
            const groupBySQL = groupByClauses.join(",");
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
            const [countRows] = yield proscai_mysql_connection_1.pool.query(countSQL, values);
            const total = Number((_c = (_b = countRows[0]) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0);
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
            const [rows] = yield proscai_mysql_connection_1.pool.query(querySQL, [...values, pageSize, offset]);
            return {
                rows,
                total
            };
        });
    }
    getAll(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, id, customerId, search, startDate, endDate, branchOffice, accesibleBranches, status } = dto;
            const { rows, total } = yield this.querySqlAccountStatements(dto);
            const items = rows.map(row => account_statement_mapper_1.AccountStatementMapper.jsonToEntity(Object.assign(Object.assign({}, row), { branchOffice })));
            const totalPages = Math.ceil(total / pageSize);
            return {
                items,
                total,
                page,
                pageSize,
                totalPages,
            };
        });
    }
    getById(id) {
        throw new Error("Method not implemented.");
    }
    getByClientId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
}
exports.ProscaiAccountStatementDatasourceImpl = ProscaiAccountStatementDatasourceImpl;
