import { Router } from "express";
import { BillingRoutes } from "./billing/routes";
import { AuthRoutes } from "./auth/routes";
import { SalesRoutes } from "./sales/routes";


export class AppRoutes {


  static routes(): Router {

    const router = Router()


    router.use('/api/billing', BillingRoutes.routes() )
    router.use('/api/auth', AuthRoutes.routes() )
    router.use('/api/sales', SalesRoutes.routes())


    return router;

  }
}