import { ProductsDatasource } from "../../domain/datasource/products.datasource";
import { GetByEanAndBranchRequestDto } from "../../domain/dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";


export class ProductsRepositoryImpl implements ProductsRepository {

  constructor(private readonly datasource:ProductsDatasource){}

  findByEanAndBranch(request:GetByEanAndBranchRequestDto): Promise<GetByEanResponseDto[]> {
    return this.datasource.findByEanAndBranch(request)
  }
  
}