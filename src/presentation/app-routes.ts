import { Router } from "express";
import { BillingRoutes } from "./billing/routes";
import { AuthRoutes } from "./auth/routes";


export class AppRoutes {


  static routes(): Router {

    const router = Router()


    router.use('/api/billing', BillingRoutes.routes() )
    router.use('/api/auth', AuthRoutes.routes() )


    return router;

  }
}