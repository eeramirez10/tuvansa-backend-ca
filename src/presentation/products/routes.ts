import { ProscaiProductIdentityDatasource } from "../../infrastructure/datasource/proscai-product-identity.datasource"
import { Router } from "express"
import { inventoryRoutes } from "./inventory.routes"
import { ProductsController } from "./controller"

import { ProscaiProductsRepository } from "../../infrastructure/datasource/proscai_products.datasource"
import { ProductsRepositoryImpl } from "../../infrastructure/repositories/products.repository-impl"
import { InternalApiKeyMiddleware } from "../middlewares/internal-api-key.middleware"
import { ProscaiProductCatalogsDatasource } from "../../infrastructure/datasource/proscai-product-catalogs.datasource"
import { ProductCatalogsController } from "./product-catalogs.controller"
import { parseEanReferencePrefixes, ProscaiEanLookupDatasource } from "../../infrastructure/datasource/proscai-ean-lookup.datasource"

export class ProductsRoutes {

  static routes = (): Router => {

    const app = Router()
    app.use('/inventory', inventoryRoutes())

    const datasource = new ProscaiProductsRepository()

    const repository = new ProductsRepositoryImpl(datasource)

    const controller = new ProductsController(repository)
    const catalogs = new ProductCatalogsController(new ProscaiProductCatalogsDatasource())
    const eanLookup = new ProscaiEanLookupDatasource()

    const identity = new ProscaiProductIdentityDatasource()
    app.get('/identity/:code', InternalApiKeyMiddleware.validateRequired, async (req, res) => {
      const code = String(req.params.code ?? '').trim().toUpperCase()
      const account = req.query.primaryAccount
      if (!/^[A-Z0-9][A-Z0-9./_-]{0,12}$/.test(code) || typeof account !== 'string' || !/^111500[1-68]$/.test(account)) {
        return void res.status(400).json({ error: 'Invalid product code or primary account' })
      }
      try {
        const product = await identity.find(code, account)
        if (!product) return void res.status(404).json({ error: 'Product not found in the branch catalog' })
        res.json(product)
      } catch (error) {
        console.error('erp_product_identity_failed', error)
        res.status(500).json({ error: 'Could not verify ERP product identity' })
      }
    })

    app.get('/catalogs', InternalApiKeyMiddleware.validateRequired, catalogs.list)
    app.post('/ean-references', InternalApiKeyMiddleware.validateRequired, async (req, res) => {
      const prefixes = parseEanReferencePrefixes(req.body?.prefixes)
      if (!prefixes) return void res.status(400).json({ error: 'Invalid EAN reference prefixes' })
      try {
        res.status(200).json(await eanLookup.findMexicoReferences(prefixes))
      } catch (error) {
        console.error('erp_ean_references_failed', error)
        res.status(500).json({ error: 'Could not load Mexico EAN references' })
      }
    })
    app.get('/ean-exact/:ean', InternalApiKeyMiddleware.validateRequired, async (req, res) => {
      const ean = String(req.params.ean ?? '').trim()
      if (!ean || ean.length > 120) return void res.status(400).json({ error: 'Invalid EAN' })
      try {
        res.status(200).json(await eanLookup.findExact(ean))
      } catch (error) {
        console.error('erp_ean_lookup_failed', error)
        res.status(500).json({ error: 'Could not check ERP EAN' })
      }
    })
    app.post('/search/warehouses', InternalApiKeyMiddleware.validateRequired, controller.searchByWarehouses)
    app.get('/search/mexico', controller.searchMexicoProducts)
    app.get('/by-code/:code/mexico', controller.getMexicoProductByCode)
    app.get('/by-ean/:ean/branch/:branchId', controller.getProductByEanAndBranch)
    app.get('/:ean/availability', InternalApiKeyMiddleware.validate, controller.getAvailability)
    app.post('/availability/batch', InternalApiKeyMiddleware.validate, controller.getAvailabilityBatch)

    return app
  }
}
