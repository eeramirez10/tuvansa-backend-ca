import { json } from "stream/consumers";
import { SalesEntity } from "../../domain/entities/sales.entity";

export class SalesMapper {


  static jsonToEntity = (json: any) => new SalesEntity({

    branch: json['branch'],
    month: json['month'],
    type: json['type'],
    client: json['client'],
    monthNumber: json['monthNumber'],
    year: json['year'],
    date: json['date'],
    document: json['document'],
    code: json['code'],
    ean: json['ean'],
    description: json['description'],
    family: json['family'],
    agent: json['agent'],
    quantity: json['quantity'],
    salesAmount: json['salesAmount'],
    costAmount: json['costAmount'],
    profit: json['profit'],
    percentage: json['percentage'],
  })

}