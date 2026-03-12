"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpCustomersResponseDto = void 0;
class SearchErpCustomersResponseDto {
    constructor(options) {
        this.externalId = options.externalId;
        this.code = options.code;
        this.displayName = options.displayName;
        this.firstName = options.firstName;
        this.lastName = options.lastName;
        this.whatsapp = options.whatsapp;
        this.phone = options.phone;
        this.email = options.email;
        this.taxId = options.taxId;
        this.companyName = options.companyName;
        this.isActive = options.isActive;
        this.source = options.source;
        this.branchCode = options.branchCode;
        this.salesmanCode = options.salesmanCode;
        this.billingStreet = options.billingStreet;
        this.billingColony = options.billingColony;
        this.billingCity = options.billingCity;
        this.billingState = options.billingState;
        this.billingPostalCode = options.billingPostalCode;
        this.billingCountry = options.billingCountry;
        this.lastSyncedAt = options.lastSyncedAt;
    }
}
exports.SearchErpCustomersResponseDto = SearchErpCustomersResponseDto;
