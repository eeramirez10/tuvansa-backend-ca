"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpSupplierMapper = void 0;
const erp_supplier_response_dto_1 = require("../../domain/dto/erp-suppliers/erp-supplier-response.dto");
const text = (value) => {
    if (typeof value === "string")
        return value.trim();
    if (typeof value === "number" && Number.isFinite(value))
        return String(value);
    return "";
};
class ErpSupplierMapper {
    static toResponse(rows) {
        var _a;
        const grouped = new Map();
        for (const row of rows) {
            const code = text(row.PRVCOD).toUpperCase();
            if (!code)
                continue;
            const current = (_a = grouped.get(code)) !== null && _a !== void 0 ? _a : { first: row, contacts: [], keys: new Set() };
            const contact = {
                name: text(row.CONTNOMBRE),
                position: text(row.CONTPUESTO),
                phone: text(row.CONTTEL1),
                extension: text(row.CONTEXT),
                email: text(row.CONTMAIL).toLowerCase(),
                mobile: text(row.CONTCEL),
                notes: text(row.CONTOBS),
            };
            const key = Object.values(contact).join("|").toUpperCase();
            if (key.replace(/\|/g, "") && !current.keys.has(key)) {
                current.keys.add(key);
                current.contacts.push(contact);
            }
            grouped.set(code, current);
        }
        return Array.from(grouped.entries()).map(([code, value]) => new erp_supplier_response_dto_1.ErpSupplierResponseDto({
            code,
            name: text(value.first.PRVNOM),
            taxId: text(value.first.PRVRFC).toUpperCase(),
            state: text(value.first.PRVEDO).toUpperCase(),
            creditTerms: text(value.first.PRVCREDIT),
            currency: text(value.first.PRVMONEDA) === "1" ? "MXN" : "USD",
            contacts: value.contacts,
        }));
    }
}
exports.ErpSupplierMapper = ErpSupplierMapper;
