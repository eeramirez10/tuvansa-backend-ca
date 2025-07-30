import { Router } from "express";
import { BranchOfficeController } from "./controller";
import { ProscaiBranchOfficeDatasource } from "../../infrastructure/datasource/proscai-branch-office.datasource";
import { BranchOfficeRepositoryImpl } from "../../infrastructure/repositories/branch-office.repositoryImpl";


export class BranchOfficeRoutes {

  static routes = (): Router => {

    const app = Router()

    const datasource = new ProscaiBranchOfficeDatasource()

    const repository = new BranchOfficeRepositoryImpl(datasource)


    const controller = new BranchOfficeController(repository)

    app.get('/:ean', controller.getByEan)

    return app;

  }
}