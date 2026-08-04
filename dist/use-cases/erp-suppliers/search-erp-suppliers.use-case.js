"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchErpSuppliersUseCase = void 0;
class SearchErpSuppliersUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(request) { return this.repository.search(request); }
}
exports.SearchErpSuppliersUseCase = SearchErpSuppliersUseCase;
