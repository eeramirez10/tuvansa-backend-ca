"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchOfficeRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const proscai_branch_office_datasource_1 = require("../../infrastructure/datasource/proscai-branch-office.datasource");
const branch_office_repositoryImpl_1 = require("../../infrastructure/repositories/branch-office.repositoryImpl");
class BranchOfficeRoutes {
}
exports.BranchOfficeRoutes = BranchOfficeRoutes;
BranchOfficeRoutes.routes = () => {
    const app = (0, express_1.Router)();
    const datasource = new proscai_branch_office_datasource_1.ProscaiBranchOfficeDatasource();
    const repository = new branch_office_repositoryImpl_1.BranchOfficeRepositoryImpl(datasource);
    const controller = new controller_1.BranchOfficeController(repository);
    app.get('/:ean', controller.getByEan);
    return app;
};
