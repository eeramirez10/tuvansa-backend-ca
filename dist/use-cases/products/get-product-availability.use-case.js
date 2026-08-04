"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductAvailabilityUseCase = void 0;
class GetProductAvailabilityUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(ean) {
        return this.repository.findAvailabilityByEan(ean);
    }
}
exports.GetProductAvailabilityUseCase = GetProductAvailabilityUseCase;
