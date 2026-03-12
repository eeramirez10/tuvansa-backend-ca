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
exports.ProscaiBranchOfficeDatasource = void 0;
const proscai_mysql_connection_1 = require("../database/proscai.mysql-connection");
class ProscaiBranchOfficeDatasource {
    getByEan(ean) {
        return __awaiter(this, void 0, void 0, function* () {
            const almnumName = {
                '01': 'MEXICO',
                '02': 'MONTERREY',
                '03': 'VERACRUZ',
                '04': 'MEXICALI',
                '05': 'QUERETARO',
                '06': 'CANCUN',
                '07': 'CABOS',
                '13': 'Resguardo Mex - Ver',
                '22': 'Resguardo Mty',
                '97': 'Transito VERACRUZ',
                '99': 'Transito Mexico'
            };
            const params = [ean];
            const whereClauses = [
                'IEAN = ?',
                'ALMNUM IS NOT NULL'
            ];
            // 3. Assemble full SQL
            const sql = `

    SELECT finv.iseq as id, ALMNUM as name,
		
          SUM(ALMCANT) AS stock,
          ILISTA4 AS cost
          FROM FINV
          LEFT JOIN FALM ON FALM.ISEQ=FINV.ISEQ
          LEFT JOIN FUNIDAD ON FUNIDAD.UCOD=FINV.IUM
          LEFT JOIN FINV2 ON FINV2.I2KEY=FINV.ISEQ
			    ${whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : ''}
          GROUP BY ICOD
          order by ICOD;
          
        `;
            const [rows] = yield proscai_mysql_connection_1.pool.execute(sql, params);
            console.log({ rows });
            return rows.map((r) => {
                var _a;
                return (Object.assign(Object.assign({}, r), { id: `${r.id}`, name: (_a = almnumName[r.name]) !== null && _a !== void 0 ? _a : `Almacen ${r.name}` }));
            });
        });
    }
}
exports.ProscaiBranchOfficeDatasource = ProscaiBranchOfficeDatasource;
