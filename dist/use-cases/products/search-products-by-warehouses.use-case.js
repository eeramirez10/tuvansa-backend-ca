"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductsByWarehousesUseCase = void 0;
class SearchProductsByWarehousesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(term, warehouseCodes) {
        return this.repository.findByTermAndWarehouses(term, warehouseCodes);
    }
}
exports.SearchProductsByWarehousesUseCase = SearchProductsByWarehousesUseCase;
