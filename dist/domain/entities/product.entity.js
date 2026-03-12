"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(options) {
        this.id = options.id;
        this.source = options.source;
        this.code = options.code;
        this.ean = options.ean;
        this.description = options.description;
        this.family = options.family;
        this.stock = options.stock;
        this.unit = options.unit;
        this.purchaseCurrency = options.purchaseCurrency;
        this.costs = options.costs;
        this.warehouseId = options.warehouseId;
        this.warehouseName = options.warehouseName;
        this.raw = options.raw;
    }
}
exports.Product = Product;
