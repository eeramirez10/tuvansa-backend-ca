import { BranchOfficeType } from "../invoice-pagination.dto"

export type statusAccountStatementType = "OVERDUE" | "DUESOON" | "CURRENT"
const statusAccountStatement = ["OVERDUE", "DUESOON", "CURRENT"]

interface AccountStatementPaginationOptions {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  id?: string                 // Nuevo: id del estado de cuenta
  customerId?: string
  search?: string
  branchOffice: BranchOfficeType
  status: statusAccountStatementType
  hasDebt?: boolean
 view?: 'summary' | 'detail'
  accesibleBranches?: string[]
}

export class AccountStatementPaginationDto {

  public readonly page: number
  public readonly pageSize: number
  public readonly startDate?: string
  public readonly endDate?: string
  public readonly id?: string
  public readonly customerId?: string
  public readonly search?: string
  public readonly branchOffice: BranchOfficeType
  public readonly status: statusAccountStatementType
  public readonly hasDebt?: boolean
  public readonly view?: 'summary' | 'detail'

  
  public readonly accesibleBranches?: string[]

  constructor(options: AccountStatementPaginationOptions) {
    this.page = options.page
    this.pageSize = options.pageSize
    this.startDate = options.startDate
    this.endDate = options.endDate
    this.id = options.id
    this.customerId = options.customerId
    this.search = options.search
    this.branchOffice = options.branchOffice
    this.status = options.status
    this.accesibleBranches = options.accesibleBranches
    this.hasDebt = options.hasDebt
    this.view = options.view
  }

  static execute(values: { [key: string]: any; }): [string?, AccountStatementPaginationDto?] {
    const {
      page = 1,
      pageSize = 30,
      startDate,
      endDate,
      id,
      customerId,
      search,
      branchOffice,
      accesibleBranches,
      status,
      hasDebt,
      view
    } = values

    let tieneDeuda:boolean = false
  

    if (page < 0) return ['The page cannot be less than zero']
    if (pageSize < 0) return ['Page size cannot be less than zero']

    if (status != undefined || status) {

      if (!statusAccountStatement.includes(status.toUpperCase())) return ['Invalid Status']
    }

    if(hasDebt){
        tieneDeuda = /^true|1|yes$/i.test(hasDebt)
    }

    

    return [, new AccountStatementPaginationDto({
      page: Number(page),
      pageSize: Number(pageSize),
      startDate,
      endDate,
      id,
      customerId,
      search,
      branchOffice,
      status,
      accesibleBranches,
      hasDebt: tieneDeuda,
      view,
    })]
  }
}
