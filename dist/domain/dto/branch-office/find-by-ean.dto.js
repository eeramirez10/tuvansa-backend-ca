"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindByEanDto = void 0;
class FindByEanDto {
    constructor(ean) {
        this.ean = ean;
    }
    static execute(ean) {
        if (!ean)
            return ['Ean is required'];
        return [, new FindByEanDto(ean)];
    }
}
exports.FindByEanDto = FindByEanDto;
