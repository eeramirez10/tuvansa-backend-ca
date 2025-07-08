import { Router } from "express";
import { SalesController } from "./controller";
import { SalesRepository } from "../../domain/repositories/sales.repository";
import { SalesRepositoryImpl } from "../../infrastructure/repositories/sales-respositoryImpl";
import { ProscaiSalesDatasource } from "../../infrastructure/datasource/proscai-sales.datasource";


export class SalesRoutes {

  static routes = (): Router => {

    const app = Router()

    const datasource = new ProscaiSalesDatasource()

    const repository = new SalesRepositoryImpl(datasource)

    const controller = new SalesController(repository)


    app.get('/', controller.getSales)

    return app
  }
}