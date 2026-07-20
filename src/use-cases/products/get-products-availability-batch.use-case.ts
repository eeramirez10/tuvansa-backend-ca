import { ProductAvailabilityDto } from "../../domain/dto/products/product-availability.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";

export class GetProductsAvailabilityBatchUseCase {
  constructor(private readonly repository: ProductsRepository) {}

  public execute(eans: string[]): Promise<ProductAvailabilityDto[]> {
    return this.repository.findAvailabilityByEans(eans);
  }
}
