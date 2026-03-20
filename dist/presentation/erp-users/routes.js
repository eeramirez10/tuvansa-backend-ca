"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpUsersRoutes = void 0;
const express_1 = require("express");
const proscai_erp_user_datasoutce_1 = require("../../infrastructure/datasource/proscai-erp-user.datasoutce");
const erp_users_repository_impl_1 = require("../../infrastructure/repositories/erp-users.repository-impl");
const controller_1 = require("./controller");
const search_erp_users_use_case_1 = require("../../use-cases/erp-users/search-erp-users.use-case");
const get_erp_user_by_code_use_c_ase_1 = require("../../use-cases/erp-users/get-erp-user-by-code-use-c\u00CFase");
class ErpUsersRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const datasource = new proscai_erp_user_datasoutce_1.ProscaiErpUsersDatasource();
        const repository = new erp_users_repository_impl_1.ErpUsersRepositoryImpl(datasource);
        const searchErpUsersUseCase = new search_erp_users_use_case_1.SearchErpUsersUseCase(repository);
        const getErpUserByCodeUseCase = new get_erp_user_by_code_use_c_ase_1.GetErpUserByCodeUseCase(repository);
        const controller = new controller_1.ErpUsersController(searchErpUsersUseCase, getErpUserByCodeUseCase);
        router.get("/", controller.search);
        router.get("/:code", controller.getByCode);
        return router;
    }
}
exports.ErpUsersRoutes = ErpUsersRoutes;
