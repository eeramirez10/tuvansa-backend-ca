import { GetByEanAndBranchRequestDto } from '../../domain/dto/products/get-by-ean-and-branch-request.dto';
import { ProductsRepository } from '../../domain/repositories/products.repository';
export class GetErpProductByEanAndBranchUseCase {

  constructor(private readonly repository: ProductsRepository) { }

  async execute(request: GetByEanAndBranchRequestDto) {

    const { ean, branchId } = request

    console.log({ request })

    return await this.repository.findByEanAndBranch({ ean, branchId })

  }

}