import { Router } from "express";
import { WarehouseController } from "./controller";
import { ProscaiBranchOfficeDatasource } from "../../infrastructure/datasource/proscai-branch-office.datasource";
import { BranchOfficeRepositoryImpl } from "../../infrastructure/repositories/branch-office.repositoryImpl";


export class WarehouseRoutes {

  static routes = (): Router => {

    const app = Router()

    const datasource = new ProscaiBranchOfficeDatasource()

    const repository = new BranchOfficeRepositoryImpl(datasource)


    const controller = new WarehouseController(repository)

    app.post('/', controller.getByEan)

    return app;

  }
}