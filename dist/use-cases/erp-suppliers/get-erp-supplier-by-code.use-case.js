"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetErpSupplierByCodeUseCase = void 0;
class GetErpSupplierByCodeUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(code) { return this.repository.findByCode(code); }
}
exports.GetErpSupplierByCodeUseCase = GetErpSupplierByCodeUseCase;
