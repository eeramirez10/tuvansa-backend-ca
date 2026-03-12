"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactEntity = void 0;
class ContactEntity {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.jobTitle = data.jobTitle;
        this.phone = data.phone;
        this.email = data.email;
        this.mobile = data.mobile;
    }
}
exports.ContactEntity = ContactEntity;
