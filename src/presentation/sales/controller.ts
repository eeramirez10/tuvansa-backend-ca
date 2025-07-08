import { SalesRepository } from '../../domain/repositories/sales.repository';
import { SalesDto } from '../../domain/dto/sales/sales.dto';
import { Request, Response } from 'express';
export class SalesController {


  constructor(private readonly salesRepository: SalesRepository) { }


  getSales = (req: Request, res: Response) => {

    const [error, salesDto] = SalesDto.execute({ ...req.query })

    if (error) {
      res.status(400).json({ error })
      return
    }

    this.salesRepository.getSales(salesDto!)
      .then(resp => {
        res.json(resp)
      })
      .catch((error) => {

        res.status(500).json(error)
      })




  }


}