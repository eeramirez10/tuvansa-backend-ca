"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEntity = void 0;
class ClientEntity {
    constructor(options) {
        this.name = options.name;
        this.id = options.id;
        this.email = options.email;
        this.rfc = options.rfc;
        this.businessName = options.businessName;
        this.taxRegime = options.taxRegime;
        this.password = options.password;
        this.isActive = options.isActive;
        this.createdAt = options.createdAt;
        this.updatedAt = options.updatedAt;
    }
}
exports.ClientEntity = ClientEntity;
