import { Request, Response } from "express";
import { SearchErpUsersQueryDto } from '../../domain/dto/erp-users/search-erp-users-query.dto';
import { GetErpUserByCodeUseCase } from '../../use-cases/erp-users/get-erp-user-by-code-use-cÏase';
import { SearchErpUsersUseCase } from "../../use-cases/erp-users/search-erp-users.use-case";
import { GetErpUserByCodeParamsDto } from "../../domain/dto/erp-users/get-erp-user-by-code-params.dto";

export class ErpUsersController {

  constructor(
    private readonly searchErpUsersUseCase: SearchErpUsersUseCase,
    private readonly getErpUserByCodeUseCase: GetErpUserByCodeUseCase

  ) { }

  search = async (req: Request, res: Response) => {

    const [error, dto] = SearchErpUsersQueryDto.create(req.query)
    if (error) return void res.status(400).json({ error });

    try {

      this.searchErpUsersUseCase.execute(dto!)
        .then((items) => {
          res.status(200).json({ items });
        })


    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error while searching ERP users.";
      res.status(500).json({ error: message });
    }

  }

  getByCode = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = GetErpUserByCodeParamsDto.create(req.params);
    if (error) return void res.status(400).json({ error });

    try {
      const user = await this.getErpUserByCodeUseCase.execute(dto!);
      if (!user) return void res.status(404).json({ error: "ERP user not found." });
      res.status(200).json(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error while getting ERP user.";
      res.status(500).json({ error: message });
    }
  };

}