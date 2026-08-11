"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByEanResponseDto = void 0;
class GetByEanResponseDto {
    constructor(option) {
        this.id = option.id;
        this.code = option.code;
        this.ean = option.ean;
        this.description = option.description;
        this.stock = option.stock;
        this.unit = option.unit;
        this.currency = option.currency;
        this.saleCurrency = option.saleCurrency;
        this.costCurrency = option.costCurrency;
        this.averageCost = option.averageCost;
        this.lastCost = option.lastCost;
        this.averageCostMxn = option.averageCostMxn;
        this.lastCostMxn = option.lastCostMxn;
        this.warehouseId = option.warehouseId;
        this.warehouseName = option.warehouseName;
    }
}
exports.GetByEanResponseDto = GetByEanResponseDto;
