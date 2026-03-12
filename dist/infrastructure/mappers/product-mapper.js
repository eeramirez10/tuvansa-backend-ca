"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMapper = void 0;
const get_by_ean_response_dto_1 = require("../../domain/dto/products/get-by-ean-response.dto");
const product_entity_1 = require("../../domain/entities/product.entity");
class ProductMapper {
    static toEntity(json) {
        return new product_entity_1.Product({
            id: json.id,
            source: json.source,
            code: json.code,
            ean: json.ean,
            description: json.description,
            family: json.family,
            stock: parseFloat(json.stock),
            unit: json.unit,
            purchaseCurrency: json.purchaseCurrency,
            costs: json.costs,
            warehouseId: json.warehouseId,
            warehouseName: json.warehouseName,
            raw: json.raw,
        });
    }
    static toGetByEanResponseDto(json) {
        return new get_by_ean_response_dto_1.GetByEanResponseDto({
            id: json.id,
            code: json.code,
            ean: json.ean,
            description: json.description,
            stock: parseFloat(json.stock),
            unit: json.unit,
            currency: json.currency,
            averageCost: parseFloat(json.averageCost),
            lastCost: parseFloat(json.lastCost),
            warehouseId: json.warehouseId,
            warehouseName: json.warehouseName
        });
    }
}
exports.ProductMapper = ProductMapper;
