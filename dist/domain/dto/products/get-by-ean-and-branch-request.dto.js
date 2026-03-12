"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByEanAndBranchRequestDto = void 0;
class GetByEanAndBranchRequestDto {
    constructor(option) {
        this.ean = option.ean;
        this.branchId = option.branchId;
    }
    static execute(request) {
        const { ean, branchId } = request;
        if (!request.ean)
            return ['Ean is required'];
        if (!request.branchId)
            return ['Branch is requred'];
        return [, new GetByEanAndBranchRequestDto({ ean, branchId })];
    }
}
exports.GetByEanAndBranchRequestDto = GetByEanAndBranchRequestDto;
