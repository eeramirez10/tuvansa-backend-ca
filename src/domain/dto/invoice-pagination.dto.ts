
interface Option {
  page: number
  pageSize: number
  startDate: string
  endDate: string
  rfc: string
  search?: string
  branchOffice: BranchOfficeType
}

type BranchOfficeType = 'MEXICO' | 'MONTERREY' | 'VERACRUZ' | 'MEXICALI' | 'QUERETARO' | 'CANCUN' | 'CABOS'




export class InvoicePaginationDto {

  public readonly page: number
  public readonly pageSize: number
  public readonly startDate?: string
  public readonly endDate?: string
  public readonly rfc?: string
  public readonly search?: string
  public readonly branchOffice: BranchOfficeType

  constructor(options: Option) {
    this.page = options.page
    this.pageSize = options.pageSize
    this.startDate = options.startDate
    this.endDate = options.endDate
    this.rfc = options.rfc
    this.search = options.search
    this.branchOffice = options.branchOffice
  }

  static execute(values: { [key: string]: any; }): [string?, InvoicePaginationDto?] {


    const {
      page = 1,
      pageSize =  30,
      startDate,
      endDate,
      rfc,
      search,
      branchOffice
    } = values


    if (page < 0) return ['the page cannot be less than zero ']
    if (pageSize < 0 ) return ['Page size cannot be less than zero']

    return [, new InvoicePaginationDto({ page: Number(page), pageSize: Number(pageSize), startDate, endDate, rfc, search, branchOffice })]

  }
}