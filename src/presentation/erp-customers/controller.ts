import { Request, Response } from "express";
import { SearchErpCustomersRequestDto } from "../../domain/dto/erp-customers/search-erp-customers-request.dto";
import { ErpCustomersRepository } from "../../domain/repositories/erp-customers.repository";
import { SearchErpCustomersUseCase } from "../../use-cases/erp-customers/search-erp-customers.use-case";

export class ErpCustomersController {
  constructor(private readonly repository: ErpCustomersRepository) {}

  search = async (req: Request, res: Response) => {
    const [error, dto] = SearchErpCustomersRequestDto.execute(
      req.query as Record<string, string | string[] | undefined>
    )

    if (error) {
      res.status(400).json({ error })
      return
    }

    try {
      const customers = await new SearchErpCustomersUseCase(this.repository).execute(dto!)
      res.json(customers)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Internal error' })
    }
  }
}
