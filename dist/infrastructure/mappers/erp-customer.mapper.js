"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpCustomerMapper = void 0;
const search_erp_customers_response_dto_1 = require("../../domain/dto/erp-customers/search-erp-customers-response.dto");
const toText = (value) => {
    if (typeof value === 'string')
        return value.trim();
    if (typeof value === 'number')
        return `${value}`;
    if (typeof value === 'boolean')
        return value ? '1' : '0';
    return '';
};
const normalizeDigits = (value) => value.replace(/\D+/g, '');
const normalizeMxPhone = (value) => {
    if (!value)
        return '';
    let digits = normalizeDigits(value);
    if (!digits)
        return '';
    if (/^521\d{10}$/.test(digits))
        digits = digits.slice(3);
    else if (/^52\d{10}$/.test(digits))
        digits = digits.slice(2);
    else if (/^01\d{10}$/.test(digits))
        digits = digits.slice(2);
    else if (/^1\d{10}$/.test(digits))
        digits = digits.slice(1);
    return /^\d{10}$/.test(digits) ? digits : '';
};
const splitName = (fullName) => {
    const normalized = fullName.trim().replace(/\s+/g, ' ');
    if (!normalized)
        return { firstName: '', lastName: '.' };
    const [firstName, ...rest] = normalized.split(' ');
    return {
        firstName: firstName || '',
        lastName: rest.join(' ').trim() || '.',
    };
};
class ErpCustomerMapper {
    static toSearchResponseDto(json) {
        const contactFullName = toText(json.contactFullName);
        const splitContact = splitName(contactFullName);
        const displayName = toText(json.displayName);
        const splitDisplay = splitName(displayName);
        const firstName = splitContact.firstName || splitDisplay.firstName;
        const lastName = splitContact.lastName || splitDisplay.lastName;
        const rawPhone = toText(json.phone);
        const rawWhatsapp = toText(json.whatsapp);
        return new search_erp_customers_response_dto_1.SearchErpCustomersResponseDto({
            externalId: toText(json.externalId),
            code: toText(json.code),
            displayName,
            firstName,
            lastName,
            whatsapp: normalizeMxPhone(rawWhatsapp),
            phone: normalizeMxPhone(rawPhone),
            email: toText(json.email).toLowerCase(),
            taxId: toText(json.taxId).toUpperCase(),
            companyName: toText(json.companyName) || displayName,
            isActive: true,
            source: 'ERP',
            branchCode: toText(json.branchCode),
            salesmanCode: toText(json.salesmanCode),
            billingStreet: toText(json.billingStreet),
            billingColony: toText(json.billingColony),
            billingCity: toText(json.billingCity),
            billingState: toText(json.billingState),
            billingPostalCode: toText(json.billingPostalCode),
            billingCountry: toText(json.billingCountry) || 'MEXICO',
            lastSyncedAt: toText(json.lastSyncedAt),
        });
    }
}
exports.ErpCustomerMapper = ErpCustomerMapper;
