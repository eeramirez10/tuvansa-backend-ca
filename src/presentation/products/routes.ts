import { Router } from "express"
import { ProductsController } from "./controller"

import { ProscaiProductsRepository } from "../../infrastructure/datasource/proscai_products.datasource"
import { ProductsRepositoryImpl } from "../../infrastructure/repositories/products.repository-impl"
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware"

export class ProductsRoutes {

  static routes = (): Router => {

    const app = Router()

    const datasource = new ProscaiProductsRepository()

    const repository = new ProductsRepositoryImpl(datasource)

    const controller = new ProductsController(repository)

    app.get('/search/mexico', controller.searchMexicoProducts)
    app.get('/by-code/:code/mexico', controller.getMexicoProductByCode)
    app.get('/by-ean/:ean/branch/:branchId', controller.getProductByEanAndBranch)
    app.get('/:ean/availability', InternalApiKeyMiddleware.validate, controller.getAvailability)
    app.post('/availability/batch', InternalApiKeyMiddleware.validate, controller.getAvailabilityBatch)

    return app
  }
}
