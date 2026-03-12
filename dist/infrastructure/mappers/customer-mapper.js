"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerMapper = void 0;
const customer_entity_1 = require("../../domain/entities/customer.entity");
class CustomerMapper {
    static jsonToEntity(json) {
        return new customer_entity_1.CustomerEntity({
            id: json.id.toString(),
            agent: json.agent,
            customerId: json.customerId,
            name: json.name,
            state: json.state,
            paymentTermDays: json.paymentTermDays,
            creditLimit: json.creditLimit,
            currentBalance: json.currentBalance,
            contacts: json.contacts,
        });
    }
}
exports.CustomerMapper = CustomerMapper;
