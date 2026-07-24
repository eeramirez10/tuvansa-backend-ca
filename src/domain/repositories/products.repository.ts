import { GetByEanAndBranchRequestDto } from "../dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../dto/products/get-by-ean-response.dto";
import { ProductAvailabilityDto } from "../dto/products/product-availability.dto";

export abstract class ProductsRepository {
  abstract findByEanAndBranch(
    request: GetByEanAndBranchRequestDto
  ): Promise<GetByEanResponseDto[]>

  abstract findByCodeInMexico(code: string): Promise<GetByEanResponseDto | null>

  abstract findAvailabilityByEan(ean: string): Promise<ProductAvailabilityDto | null>

  abstract findAvailabilityByEans(eans: string[]): Promise<ProductAvailabilityDto[]>
}
