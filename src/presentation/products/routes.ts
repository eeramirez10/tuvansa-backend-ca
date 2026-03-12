import { Router } from "express"
import { ProductsController } from "./controller"

import { ProscaiProductsRepository } from "../../infrastructure/datasource/proscai_products.datasource"
import { ProductsRepositoryImpl } from "../../infrastructure/repositories/products.repository-impl"

export class ProductsRoutes {

  static routes = (): Router => {

    const app = Router()

    const datasource = new ProscaiProductsRepository()

    const repository = new ProductsRepositoryImpl(datasource)

     const controller = new ProductsController(repository)

    app.get('/by-ean/:ean/branch/:branchId', controller.getProductByEanAndBranch)

    return app
  }
}