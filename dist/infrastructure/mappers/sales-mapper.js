"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesMapper = void 0;
const sales_entity_1 = require("../../domain/entities/sales.entity");
class SalesMapper {
}
exports.SalesMapper = SalesMapper;
SalesMapper.jsonToEntity = (json) => new sales_entity_1.SalesEntity({
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
});
