"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMexicoProductsUseCase = void 0;
class SearchMexicoProductsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    execute(term) {
        return this.repository.findByEanAndBranch({ ean: term, branchId: "01" });
    }
}
exports.SearchMexicoProductsUseCase = SearchMexicoProductsUseCase;
