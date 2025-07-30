import { BranchOffice, BranchOfficeDatasource } from '../../domain/datasource/branch-office.datasource';
import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";


export class BranchOfficeRepositoryImpl implements BranchOfficeRepository {

  constructor(private readonly branchOfficeDatasource: BranchOfficeDatasource) { }


  getByEan(ean: string): Promise<BranchOffice[]> {
    return this.branchOfficeDatasource.getByEan(ean)
  }

}