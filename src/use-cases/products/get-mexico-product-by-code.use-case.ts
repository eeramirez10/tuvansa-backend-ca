import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { ProductsRepository } from "../../domain/repositories/products.repository";

export class GetMexicoProductByCodeUseCase {
  constructor(private readonly repository: ProductsRepository) {}

  execute(code: string): Promise<GetByEanResponseDto | null> {
    return this.repository.findByCodeInMexico(code);
  }
}
