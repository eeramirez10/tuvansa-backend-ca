import { Request, Response } from "express";
import { GetByEanAndBranchRequestDto } from '../../domain/dto/products/get-by-ean-and-branch-request.dto';
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductsRepository } from '../../domain/repositories/products.repository';


export class ProductsController {

  constructor(private readonly repository: ProductsRepository) { }


  getProductByEanAndBranch = async (req: Request, res: Response) => {

    console.log(req.params)

    const [error, dto] = GetByEanAndBranchRequestDto.execute({ ...req.params })

    if (error) {

      res.status(400).json({ error })
      return
    }


    this.repository.findByEanAndBranch(dto!)
      .then((products: GetByEanResponseDto[]) => {
        res.json(products )
      })
      .catch((error: unknown) => {

        console.log(error)

        res.status(500).json({
          error:'Internal error'
        })
      })



  }
}
