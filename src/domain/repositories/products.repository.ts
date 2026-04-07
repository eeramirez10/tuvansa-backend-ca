import { GetByEanAndBranchRequestDto } from "../dto/products/get-by-ean-and-branch-request.dto";
import { GetByEanResponseDto } from "../dto/products/get-by-ean-response.dto";

export abstract class ProductsRepository {
  abstract findByEanAndBranch(
    request: GetByEanAndBranchRequestDto
  ): Promise<GetByEanResponseDto[]>
}
