import { ErpSupplierResponseDto, type ErpSupplierContactDto } from "../../domain/dto/erp-suppliers/erp-supplier-response.dto";

const text = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

export class ErpSupplierMapper {
  static toResponse(rows: Array<Record<string, unknown>>): ErpSupplierResponseDto[] {
    const grouped = new Map<string, { first: Record<string, unknown>; contacts: ErpSupplierContactDto[]; keys: Set<string> }>();
    for (const row of rows) {
      const code = text(row.PRVCOD).toUpperCase();
      if (!code) continue;
      const current = grouped.get(code) ?? { first: row, contacts: [], keys: new Set<string>() };
      const contact: ErpSupplierContactDto = {
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
    return Array.from(grouped.entries()).map(([code, value]) => new ErpSupplierResponseDto({
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
