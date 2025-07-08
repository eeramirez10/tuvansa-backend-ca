
interface Option {
  page: number
  pageSize: number
  startDate?: string
  endDate?: string
  search?: string
}

export class AuthPaginationDto {


  public readonly page: number
  public readonly pageSize: number
  public readonly startDate?: string
  public readonly endDate?: string
  public readonly search?: string

  constructor(option: Option) {

    this.page = option.page
    this.pageSize = option.pageSize
    this.startDate = option.startDate
    this.endDate = option.endDate
    this.search = option.search
  }

  static execute(options: { [key: string]: any; }): [string?, AuthPaginationDto?] {

    const {
      page = 1,
      pageSize = 10,
      search
    } = options

    if (page < 0) return ['the page cannot be less than zero ']
    if (pageSize < 0) return ['Page size cannot be less than zero']

    return [undefined, new AuthPaginationDto({ page: parseInt(page) , pageSize: parseInt(pageSize), search })]

  }



}