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
exports.ProscaiErpUsersDatasource = void 0;
const erp_user_summary_1 = require("../../domain/entities/erp-user-summary");
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
class ProscaiErpUsersDatasource {
    search(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const q = query.trim().toUpperCase();
            const by = (_a = params === null || params === void 0 ? void 0 : params.by) !== null && _a !== void 0 ? _a : "both";
            const limit = (_b = params === null || params === void 0 ? void 0 : params.limit) !== null && _b !== void 0 ? _b : 20;
            let whereSearch = "";
            const values = [];
            if (q) {
                if (by === "code") {
                    whereSearch = ` AND AGTNUM LIKE ? `;
                    values.push(`${q}%`);
                }
                else if (by === "description") {
                    whereSearch = ` AND AGDESCR LIKE ? `;
                    values.push(`%${q}%`);
                }
                else {
                    whereSearch = ` AND (AGTNUM LIKE ? OR AGDESCR LIKE ?) `;
                    values.push(`${q}%`, `%${q}%`);
                }
            }
            const sql = `
    SELECT AGTNUM, AGDESCR
    FROM FAG
    WHERE AGT = 1
      AND AGTIPO = 0
      ${whereSearch}
    ORDER BY AGTNUM
    LIMIT ?
  `;
            values.push(limit);
            const [rows] = yield proscai_mysql_connection_1.pool.execute(sql, values);
            return rows.map((row) => {
                var _a;
                return new erp_user_summary_1.ErpUserSummary({
                    code: String(row.AGTNUM).trim(),
                    description: String((_a = row.AGDESCR) !== null && _a !== void 0 ? _a : "").trim(),
                });
            });
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sql = `
    SELECT AGTNUM, AGDESCR
    FROM FAG
    WHERE AGT = 1
      AND AGTIPO = 0
      AND AGTNUM = ?
    ORDER BY AGTNUM
  `;
            const [[row]] = yield proscai_mysql_connection_1.pool.execute(sql, [code.trim()]);
            if (!row)
                return null;
            return new erp_user_summary_1.ErpUserSummary({
                code: String(row.AGTNUM).trim(),
                description: String((_a = row.AGDESCR) !== null && _a !== void 0 ? _a : "").trim(),
            });
        });
    }
}
exports.ProscaiErpUsersDatasource = ProscaiErpUsersDatasource;
