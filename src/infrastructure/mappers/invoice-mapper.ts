import { InvoiceEntity } from "../../domain/entities/invoice-entity";

export class InvoiceMapper {


  static jsonToEntity(json: any) {

    return new InvoiceEntity({
      client: json['client'],
      rfc: json['rfc'],
      invoiceNumber: json['invoiceNumber'],
      reference: json['reference'],
      invoiceDate: json['invoiceDate'],
      dueDate: json['dueDate'],
      orderDate: json['orderDate'],
      grossAmount: json['grossAmount'],
      vatAmount: json['vatAmount'],
      totalAmount: json['totalAmount'],
      balance: json['balance'],
      exchangeRate: json['exchangeRate'],
      statusCfd: json['statusCfd'],
      currency: json['currency'],
    })

  }
}