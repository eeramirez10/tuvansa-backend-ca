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
exports.ProscaiCustomerDatasource = void 0;
const customer_datasource_1 = require("../../domain/datasource/customer.datasource");
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const customer_mapper_1 = require("../mappers/customer-mapper");
const contact_mapper_1 = require("../mappers/contact-mapper");
class ProscaiCustomerDatasource extends customer_datasource_1.CustomerDatasource {
    getById(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ customerId });
            const whereSQL = 'WHERE CLICOD = ?';
            const querySql = this.customersSql(whereSQL);
            console.log(`${querySql}`);
            const [rows] = yield proscai_mysql_connection_1.pool.query(querySql, [customerId, 1, 0]);
            const customer = rows[0];
            const contacts = yield this.getContacts(customerId);
            return customer_mapper_1.CustomerMapper.jsonToEntity(Object.assign(Object.assign({}, customer), { contacts }));
        });
    }
    getList(customerPaginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, pageSize, search,
            // opcional si lo usas en tu DTO; no se usa en esta consulta
             } = customerPaginationDto;
            const { rows, total } = yield this.querySql(customerPaginationDto);
            const items = yield Promise.all(rows.map((row) => __awaiter(this, void 0, void 0, function* () {
                const contacts = yield this.getContacts(row.customerId);
                return customer_mapper_1.CustomerMapper.jsonToEntity(Object.assign(Object.assign({}, row), { contacts }));
            })));
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
    getContacts(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const querySQL = `
      SELECT CONTKEY, CONTNOMBRE, CONTPUESTO,CONTTEL1,CONTCEL, CONTMAIL, CONTCEL FROM FCONTACTOS
      WHERE CONTKEY = ?
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.query(querySQL, [customerId]);
            return rows.map((r) => contact_mapper_1.ContactMapper.jsonToEntity({
                id: r.CONTKEY,
                name: r.CONTNOMBRE,
                jobTitle: r.CONTPUESTO,
                phone: r.CONTTEL1,
                email: r.CONTMAIL,
                mobile: r.CONTCEL
            }));
        });
    }
    querySql(customerPaginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page, pageSize, search,
            // opcional si lo usas en tu DTO; no se usa en esta consulta
             } = customerPaginationDto;
            const offset = (page - 1) * pageSize;
            // WHERE dinámico
            const whereClauses = ['1=1'];
            const values = [];
            // Búsqueda libre: código, nombre, teléfono cliente, nombre/email contacto
            if (search) {
                whereClauses.push(`
        (
          FCLI.CLICOD LIKE ? OR
          FCLI.CLINOM LIKE ? OR
          FCLI.CLITEL LIKE ? OR
          FCONTACTOS.CONTNOMBRE LIKE ? OR
          FCONTACTOS.CONTMAIL LIKE ?
        )
      `.trim());
                const like = `%${search}%`;
                values.push(like, like, like, like, like);
            }
            const whereSQL = `WHERE ${whereClauses.join(' AND ')}`;
            // Total (sin LIMIT) — contamos clientes únicos (CLISEQ) para evitar duplicados por JOIN con contactos
            const countSQL = `
      SELECT COUNT(*) AS total
      FROM (
        SELECT FCLI.CLISEQ
        FROM FCLI
        LEFT JOIN FAG AS AG1 ON AG1.AGTNUM = FCLI.CLIPAR1
        LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FCLI.CLICOD
        ${whereSQL}
        GROUP BY FCLI.CLISEQ
      ) AS sub
    `;
            const [countRows] = yield proscai_mysql_connection_1.pool.query(countSQL, values);
            const total = Number((_b = (_a = countRows[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0);
            // Datos paginados
            const querySQL = this.customersSql(whereSQL);
            const [rows] = yield proscai_mysql_connection_1.pool.query(querySQL, [...values, pageSize, offset]);
            return {
                rows,
                total
            };
        });
    }
    customersSql(whereSQL) {
        const querySQL = `
      SELECT
        FCLI.CLISEQ                        AS id,
        AG1.AGDESCR                        AS agent,
        FCLI.CLICOD                        AS customerId,
        FCLI.CLINOM                        AS name,
        FCLI.CLITEL                        AS mainPhone,
        FCLI.CLICONT                       AS mainContact,
        FCLI.CLIEDO                        AS state,
        FCLI.CLIPLAZO0                     AS paymentTermDays,
        FCLI.CLICREDIT                     AS creditLimit,
        FCLI.CLISACT                       AS currentBalance,



        -- Un contacto de muestra (opcional)
        FCONTACTOS.CONTNOMBRE         AS mainContactName,
        FCONTACTOS.CONTPUESTO         AS mainContactJobTitle,
        FCONTACTOS.CONTTEL1           AS mainContactPhone,
        FCONTACTOS.CONTMAIL           AS mainContactEmail,
        FCONTACTOS.CONTCEL            AS mainContactMobile

      FROM FCLI
      LEFT JOIN FAG AS AG1        ON AG1.AGTNUM  = FCLI.CLIPAR1
      LEFT JOIN FCONTACTOS        ON FCONTACTOS.CONTKEY = FCLI.CLICOD
      ${whereSQL}
      GROUP BY FCLI.CLISEQ
      ORDER BY FCLI.CLINOM
      LIMIT ? OFFSET ?
    `;
        return querySQL;
    }
}
exports.ProscaiCustomerDatasource = ProscaiCustomerDatasource;
