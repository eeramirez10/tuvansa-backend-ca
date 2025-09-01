import { ContactEntity } from "../../domain/entities/contact.entity";

export class ContactMapper {

  static jsonToEntity(json: any): ContactEntity {

    return new ContactEntity({
      id: json.id.toString(),
      name: json.name,
      jobTitle: json.jobTitle,
      phone: json.phone,
      email: json.email,
      mobile: json.mobile,
    })
  }
}