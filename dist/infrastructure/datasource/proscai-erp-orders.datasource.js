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
exports.ProscaiErpOrdersDatasource = void 0;
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
class ProscaiErpOrdersDatasource {
    findByNumber(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield proscai_mysql_connection_1.pool.query(`
      SELECT CAST(p.PENUM AS CHAR) AS orderNumber, c.CLICOD AS customerCode
      FROM fpenc p
      LEFT JOIN fcli c ON c.CLISEQ = p.CLISEQ
      WHERE p.PENUM = ? AND p.PESPEDIDO = 1
      LIMIT 1
    `, [number]);
            const row = rows[0];
            return row ? {
                orderNumber: String(row.orderNumber).trim().toUpperCase(),
                customerCode: row.customerCode ? String(row.customerCode).trim().toUpperCase() : null,
            } : null;
        });
    }
}
exports.ProscaiErpOrdersDatasource = ProscaiErpOrdersDatasource;
