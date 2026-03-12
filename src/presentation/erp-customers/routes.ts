import { Router } from "express";
import { ProscaiErpCustomersDatasource } from "../../infrastructure/datasource/proscai-erp-customers.datasource";
import { ErpCustomersRepositoryImpl } from "../../infrastructure/repositories/erp-customers.repository-impl";
import { ErpCustomersController } from "./controller";

export class ErpCustomersRoutes {
  static routes = (): Router => {
    const app = Router()

    const datasource = new ProscaiErpCustomersDatasource()
    const repository = new ErpCustomersRepositoryImpl(datasource)
    const controller = new ErpCustomersController(repository)

    app.get('/search', controller.search)

    return app
  }
}
