
export interface BranchOffice {
  id: string
  name: string
  cost: number
  stock: number
}




export abstract class BranchOfficeDatasource {


  abstract getByEan(ean: string): Promise<BranchOffice[]>

}