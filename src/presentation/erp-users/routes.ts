import { Router } from "express";
import { ProscaiErpUsersDatasource } from "../../infrastructure/datasource/proscai-erp-user.datasoutce";
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { ErpUsersRepositoryImpl } from "../../infrastructure/repositories/erp-users.repository-impl";
import { ErpUsersController } from "./controller";
import { SearchErpUsersUseCase } from "../../use-cases/erp-users/search-erp-users.use-case";
import { GetErpUserByCodeUseCase } from "../../use-cases/erp-users/get-erp-user-by-code-use-cÏase";

export class ErpUsersRoutes {

  static routes(): Router {
    const router = Router()
    const datasource = new ProscaiErpUsersDatasource();
    const repository = new ErpUsersRepositoryImpl(datasource)

    const searchErpUsersUseCase = new SearchErpUsersUseCase(repository)
    const getErpUserByCodeUseCase = new GetErpUserByCodeUseCase(repository)

    const controller = new ErpUsersController(
      searchErpUsersUseCase,
      getErpUserByCodeUseCase
    )


    router.get("/", controller.search);
    router.get("/:code", controller.getByCode);

    return router
  }
}