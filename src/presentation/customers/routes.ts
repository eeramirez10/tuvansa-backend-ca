import { Router } from "express";
import { CustomerController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CustomerRepositoryImpl } from "../../infrastructure/repositories/customer.repository-impl";
import { ProscaiCustomerDatasource } from "../../infrastructure/datasource/proscai-customer.datasource";

export class CustomerRoutes {


  static routes(): Router {

    const router = Router()

    const datasource = new ProscaiCustomerDatasource()

    const repository = new CustomerRepositoryImpl(datasource);

    const controller = new CustomerController(repository)


    router.get('/'
      ,
      // AuthMiddleware.validateJWT,
      controller.getCustomers
    )

    router.get('/:customerId'
      ,
      // AuthMiddleware.validateJWT,
      controller.getById
    )

   


    return router

  }


}