import { ContactEntity } from "../../domain/entities/contact.entity";
import { CustomerEntity } from "../../domain/entities/customer.entity";


export class CustomerMapper {


  static jsonToEntity(json: any): CustomerEntity {



    return new CustomerEntity({
      id:  json.id.toString(),
      agent: json.agent,
      customerId: json.customerId,
      name: json.name,
      state: json.state,
      paymentTermDays: json.paymentTermDays,
      creditLimit: json.creditLimit,
      currentBalance: json.currentBalance,
      contacts:json.contacts,

    })
  }
}