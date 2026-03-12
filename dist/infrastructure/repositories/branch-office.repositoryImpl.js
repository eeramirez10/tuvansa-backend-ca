"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchOfficeRepositoryImpl = void 0;
class BranchOfficeRepositoryImpl {
    constructor(branchOfficeDatasource) {
        this.branchOfficeDatasource = branchOfficeDatasource;
    }
    getByEan(ean) {
        return this.branchOfficeDatasource.getByEan(ean);
    }
}
exports.BranchOfficeRepositoryImpl = BranchOfficeRepositoryImpl;
