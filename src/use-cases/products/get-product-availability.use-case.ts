import { ProductAvailabilityDto } from "../../domain/dto/products/product-availability.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";

export class GetProductAvailabilityUseCase {
  constructor(private readonly repository: ProductsRepository) {}

  public execute(ean: string): Promise<ProductAvailabilityDto | null> {
    return this.repository.findAvailabilityByEan(ean);
  }
}
