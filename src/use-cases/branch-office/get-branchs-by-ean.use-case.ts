import { FindByEanDto } from "../../domain/dto/branch-office/find-by-ean.dto";
import { BranchOfficeRepository } from '../../domain/repositories/branch-office.repository';


export class GetBranchsByEanUseCase {

  constructor(readonly branchOfficeRepository: BranchOfficeRepository) { }

  async execute(findByEanDto: FindByEanDto) {

    const { ean } = findByEanDto
    const branchs = await this.branchOfficeRepository.getByEan(ean)

    return branchs


  }
}