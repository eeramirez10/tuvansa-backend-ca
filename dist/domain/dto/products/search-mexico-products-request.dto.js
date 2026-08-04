"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMexicoProductsRequestDto = void 0;
class SearchMexicoProductsRequestDto {
    constructor(term) {
        this.term = term;
    }
    static execute(value) {
        if (typeof value !== "string" || !value.trim()) {
            return ["Search term is required"];
        }
        return [, new SearchMexicoProductsRequestDto(value.trim().toUpperCase())];
    }
}
exports.SearchMexicoProductsRequestDto = SearchMexicoProductsRequestDto;
