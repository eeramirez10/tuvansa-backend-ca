"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsAvailabilityBatchUseCase = void 0;
class GetProductsAvailabilityBatchUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(eans, warehouseCodes) {
        return this.repository.findAvailabilityByEans(eans, warehouseCodes !== null && warehouseCodes !== void 0 ? warehouseCodes : undefined);
    }
}
exports.GetProductsAvailabilityBatchUseCase = GetProductsAvailabilityBatchUseCase;
