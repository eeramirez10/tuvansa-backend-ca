"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMapper = void 0;
const contact_entity_1 = require("../../domain/entities/contact.entity");
class ContactMapper {
    static jsonToEntity(json) {
        return new contact_entity_1.ContactEntity({
            id: json.id.toString(),
            name: json.name,
            jobTitle: json.jobTitle,
            phone: json.phone,
            email: json.email,
            mobile: json.mobile,
        });
    }
}
exports.ContactMapper = ContactMapper;
