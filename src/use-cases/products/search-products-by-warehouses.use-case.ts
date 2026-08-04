import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";

export class SearchProductsByWarehousesUseCase {
  constructor(private readonly repository: ProductsRepository) {}

  execute(term: string, warehouseCodes: string[]): Promise<GetByEanResponseDto[]> {
    return this.repository.findByTermAndWarehouses(term, warehouseCodes);
  }
}
