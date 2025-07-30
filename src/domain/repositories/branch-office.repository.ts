import { BranchOffice } from "../datasource/branch-office.datasource";

export abstract class BranchOfficeRepository {
  abstract getByEan(ean: string): Promise<BranchOffice[]>
}