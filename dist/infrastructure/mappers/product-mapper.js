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
        var _a, _b, _c;
        const saleCurrency = (_a = json.saleCurrency) !== null && _a !== void 0 ? _a : json.currency;
        const averageCostMxn = parseFloat((_b = json.averageCostMxn) !== null && _b !== void 0 ? _b : json.averageCost);
        const lastCostMxn = parseFloat((_c = json.lastCostMxn) !== null && _c !== void 0 ? _c : json.lastCost);
        return new get_by_ean_response_dto_1.GetByEanResponseDto({
            id: json.id,
            code: json.code,
            ean: json.ean,
            description: json.description,
            stock: parseFloat(json.stock),
            unit: json.unit,
            currency: saleCurrency,
            saleCurrency,
            costCurrency: "MXN",
            averageCost: averageCostMxn,
            lastCost: lastCostMxn,
            averageCostMxn,
            lastCostMxn,
            warehouseId: json.warehouseId,
            warehouseName: json.warehouseName
        });
    }
}
exports.ProductMapper = ProductMapper;
