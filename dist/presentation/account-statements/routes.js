"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStetementsRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const proscai_account_statement_impl_datasource_1 = require("../../infrastructure/datasource/proscai-account-statement-impl.datasource");
const account_statement_impl_reporitory_1 = require("../../infrastructure/repositories/account-statement-impl.reporitory");
const mail_service_1 = require("../../infrastructure/services/mail.service");
class AccountStetementsRoutes {
    static routes() {
        const router = (0, express_1.Router)();
        const datasource = new proscai_account_statement_impl_datasource_1.ProscaiAccountStatementDatasourceImpl();
        const repository = new account_statement_impl_reporitory_1.AccountStatementRepositoryImpl(datasource);
        const { getAll, sendAccountStatements } = new controller_1.AccountStetementsController(repository, new mail_service_1.EmailService());
        router.get('/', getAll);
        router.post('/send-email', sendAccountStatements);
        return router;
    }
}
exports.AccountStetementsRoutes = AccountStetementsRoutes;
