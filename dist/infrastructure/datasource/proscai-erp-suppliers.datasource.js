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
exports.ProscaiErpSuppliersDatasource = void 0;
const erp_suppliers_datasource_1 = require("../../domain/datasource/erp-suppliers.datasource");
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
const erp_supplier_mapper_1 = require("../mappers/erp-supplier.mapper");
class ProscaiErpSuppliersDatasource extends erp_suppliers_datasource_1.ErpSuppliersDatasource {
    search(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = `%${request.q}%`;
            const codesSql = `
      SELECT DISTINCT TRIM(FPRV.PRVCOD) AS code
      FROM FPRV
      LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FPRV.PRVCOD
      WHERE MID(FPRV.PRVCOD, 1, 1) = '3'
        AND (
          UPPER(COALESCE(FPRV.PRVCOD, '')) LIKE ?
          OR UPPER(COALESCE(FPRV.PRVNOM, '')) LIKE ?
          OR UPPER(COALESCE(FPRV.PRVRFC, '')) LIKE ?
          OR UPPER(COALESCE(FCONTACTOS.CONTNOMBRE, '')) LIKE ?
          OR UPPER(COALESCE(FCONTACTOS.CONTMAIL, '')) LIKE ?
        )
      ORDER BY code
      LIMIT ?
    `;
            const [codeRows] = yield proscai_mysql_connection_1.pool.query(codesSql, [like, like, like, like, like, request.limit]);
            const codes = codeRows.map((row) => String(row.code || "").trim()).filter(Boolean);
            return codes.length ? this.findManyByCodes(codes) : [];
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const suppliers = yield this.findManyByCodes([code.trim().toUpperCase()]);
            return (_a = suppliers[0]) !== null && _a !== void 0 ? _a : null;
        });
    }
    findManyByCodes(codes) {
        return __awaiter(this, void 0, void 0, function* () {
            const placeholders = codes.map(() => "?").join(", ");
            const sql = `
      SELECT PRVCOD, PRVNOM, PRVRFC, PRVEDO, PRVCREDIT, PRVMONEDA,
        CONTNOMBRE, CONTPUESTO, CONTTEL1, CONTEXT, CONTMAIL, CONTCEL, CONTOBS
      FROM FPRV
      LEFT JOIN FCONTACTOS ON FCONTACTOS.CONTKEY = FPRV.PRVCOD
      WHERE MID(FPRV.PRVCOD, 1, 1) = '3'
        AND TRIM(FPRV.PRVCOD) IN (${placeholders})
      ORDER BY FPRV.PRVCOD, FCONTACTOS.CONTNOMBRE
    `;
            const [rows] = yield proscai_mysql_connection_1.pool.query(sql, codes);
            return erp_supplier_mapper_1.ErpSupplierMapper.toResponse(rows);
        });
    }
}
exports.ProscaiErpSuppliersDatasource = ProscaiErpSuppliersDatasource;
