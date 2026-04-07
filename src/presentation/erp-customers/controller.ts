import { Request, Response } from "express";
import { GetMonthlySalesSummaryRequestDto } from "../../domain/dto/erp-customers/get-monthly-sales-summary-request.dto";
import { SearchErpCustomersRequestDto } from "../../domain/dto/erp-customers/search-erp-customers-request.dto";
import { ErpCustomersRepository } from "../../domain/repositories/erp-customers.repository";
import { GetMonthlySalesSummaryUseCase } from "../../use-cases/erp-customers/get-monthly-sales-summary.use-case";
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

  getMonthlySalesSummary = async (req: Request, res: Response) => {
    const [error, dto] = GetMonthlySalesSummaryRequestDto.execute(
      req.query as Record<string, string | string[] | undefined>
    )

    if (error) {
      res.status(400).json({ error })
      return
    }

    try {
      const summary = await new GetMonthlySalesSummaryUseCase(this.repository).execute(dto!)
      res.json(summary)
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Internal error' })
    }
  }
}
