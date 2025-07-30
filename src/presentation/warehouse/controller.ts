import { Request, Response } from "express";
import { FindByEanDto } from "../../domain/dto/branch-office/find-by-ean.dto";
import { BranchOfficeRepository } from '../../domain/repositories/branch-office.repository';
import { GetBranchsByEanUseCase } from "../../use-cases/branch-office/get-branchs-by-ean.use-case";


export class WarehouseController {


  constructor(private readonly branchOfficeRepository: BranchOfficeRepository) { }


  getByEan = async (req: Request, res: Response) => {

    const ean = req.body.ean as string

    const [error, eanDto] = FindByEanDto.execute(ean)

    if (error) {

      res.status(400).json({ error })
      return
    }

    new GetBranchsByEanUseCase(this.branchOfficeRepository)
      .execute(eanDto!)
      .then((warehouses) => {
        res.json(warehouses)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error' })
      })






  }
}