import { ProductsDatasource } from "../../domain/datasource/products.datasource";
import { GetByEanAndBranchRequestDto } from "../../domain/dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductAvailabilityDto } from "../../domain/dto/products/product-availability.dto";

import { ProductsRepository } from "../../domain/repositories/products.repository";


export class ProductsRepositoryImpl implements ProductsRepository {

  constructor(private readonly datasource:ProductsDatasource){}

  findByEanAndBranch(request:GetByEanAndBranchRequestDto): Promise<GetByEanResponseDto[]> {
    return this.datasource.findByEanAndBranch(request)
  }

  findByCodeInMexico(code: string): Promise<GetByEanResponseDto | null> {
    return this.datasource.findByCodeInMexico(code)
  }

  findAvailabilityByEan(ean: string): Promise<ProductAvailabilityDto | null> {
    return this.datasource.findAvailabilityByEan(ean)
  }

  findAvailabilityByEans(eans: string[]): Promise<ProductAvailabilityDto[]> {
    return this.datasource.findAvailabilityByEans(eans)
  }
  
}
