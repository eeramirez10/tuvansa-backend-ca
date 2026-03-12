"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerEntity = void 0;
class CustomerEntity {
    constructor(data) {
        this.id = data.id;
        this.agent = data.agent;
        this.customerId = data.customerId;
        this.name = data.name;
        this.state = data.state;
        this.paymentTermDays = data.paymentTermDays;
        this.creditLimit = data.creditLimit;
        this.currentBalance = data.currentBalance;
        this.contacts = data.contacts;
    }
}
exports.CustomerEntity = CustomerEntity;
