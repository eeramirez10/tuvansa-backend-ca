import { Router } from "express";
import { BillingRoutes } from "./billing/routes";
import { AuthRoutes } from "./auth/routes";
import { SalesRoutes } from "./sales/routes";
import { BranchOfficeRoutes } from "./branch-office/routes";
import { WarehouseRoutes } from "./warehouse/routes";


export class AppRoutes {


  static routes(): Router {

    const router = Router()


    router.use('/api/billing', BillingRoutes.routes())
    router.use('/api/auth', AuthRoutes.routes())
    router.use('/api/sales', SalesRoutes.routes())
    router.use('/api/branch-office', BranchOfficeRoutes.routes())
    router.use('/api/warehouse', WarehouseRoutes.routes())


    return router;

  }
}