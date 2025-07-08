import { Router } from "express";
import { BillingController } from "./controller";
import { ProscaiInvoicesDatasourceImpl } from "../../infrastructure/datasource/ProscaiInvoicesDatasourceImpl";
import { InvoiceRepositoryImpl } from "../../infrastructure/repositories/invoice-repositoryImpl";
import { TuvansaDocumentService } from "../../infrastructure/services/tuvansa-document.service";
import { BasicFtpStorageAdapter } from "../../infrastructure/adapters/basic-ftp-storage.adapter";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class BillingRoutes {


  static routes(): Router {

    const router = Router()

    const datasource = new ProscaiInvoicesDatasourceImpl()

    const repository = new InvoiceRepositoryImpl(datasource);

    const ftpAdapter = new BasicFtpStorageAdapter()

    const controller = new BillingController(repository, new TuvansaDocumentService(ftpAdapter))


    router.get('/invoices', AuthMiddleware.validateJWT, controller.getInvoices)

    router.post('/invoices/file', controller.getInvoiceFile)


    return router

  }


}