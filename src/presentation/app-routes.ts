import { Router } from "express";
import { BillingRoutes } from "./billing/routes";
import { AuthRoutes } from "./auth/routes";
import { SalesRoutes } from "./sales/routes";
import { BranchOfficeRoutes } from "./branch-office/routes";
import { WarehouseRoutes } from "./warehouse/routes";
import { AccountStetementsRoutes } from "./account-statements/routes";
import { CustomerRoutes } from "./customers/routes";


export class AppRoutes {


  static routes(): Router {

    const router = Router()


    router.use('/api/billing', BillingRoutes.routes())
    router.use('/api/auth', AuthRoutes.routes())
    router.use('/api/sales', SalesRoutes.routes())
    router.use('/api/branch-office', BranchOfficeRoutes.routes())
    router.use('/api/warehouse', WarehouseRoutes.routes())
    router.use('/api/account-statements', AccountStetementsRoutes.routes())
    router.use('/api/customers', CustomerRoutes.routes())


    return router;

  }
}