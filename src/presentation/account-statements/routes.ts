import { Router } from "express";
import { AccountStetementsController } from "./controller";
import { ProscaiAccountStatementDatasourceImpl } from "../../infrastructure/datasource/proscai-account-statement-impl.datasource";
import { AccountStatementRepositoryImpl } from '../../infrastructure/repositories/account-statement-impl.reporitory';
import { EmailService } from "../../infrastructure/services/mail.service";

export class AccountStetementsRoutes {

  static routes():Router {

    const router = Router()

    const datasource = new ProscaiAccountStatementDatasourceImpl()
    const repository = new AccountStatementRepositoryImpl(datasource)
    const { getAll,sendAccountStatements } = new AccountStetementsController(repository, new EmailService())

    router.get('/', getAll)
    router.post('/send-email', sendAccountStatements)


    return router
  }
}