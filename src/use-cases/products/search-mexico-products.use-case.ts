import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";

export class SearchMexicoProductsUseCase {
  constructor(private readonly repository: ProductsRepository) {}

  execute(term: string): Promise<GetByEanResponseDto[]> {
    return this.repository.findByEanAndBranch({ ean: term, branchId: "01" });
  }
}
