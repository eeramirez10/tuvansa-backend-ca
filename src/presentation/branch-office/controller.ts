import { Request, Response } from "express";
import { FindByEanDto } from "../../domain/dto/branch-office/find-by-ean.dto";
import { BranchOfficeRepository } from '../../domain/repositories/branch-office.repository';
import { GetBranchsByEanUseCase } from "../../use-cases/branch-office/get-branchs-by-ean.use-case";


export class BranchOfficeController {


  constructor(private readonly branchOfficeRepository: BranchOfficeRepository) { }


  getByEan = async (req: Request, res: Response) => {

    const ean =   encodeURIComponent(req.params.ean)  as string

    const [error, eanDto] = FindByEanDto.execute(ean)


    if (error) {

      res.status(400).json({ error })
      return
    }

    const branchOffices = await new GetBranchsByEanUseCase(this.branchOfficeRepository).execute(eanDto!)

    res.json(branchOffices )




  }
}