


export interface PaginationOptions {
  page: number
  pageSize: number
  search?: string
}

export class PaginationDto {

  public readonly page: number
  public readonly pageSize: number
  public readonly search?: string


  constructor(data: PaginationOptions) {

    this.page = data.page
    this.pageSize = data.pageSize
    this.search = data.search

  }

  static execute(option: { [key: string]: any; }): [string?, PaginationDto?] {

    const {
      page,
      pageSize,
      search
    } = option

    const pageNumber = page ?  Number(page) : 1
    const pageSizeNumber = pageSize ? Number(pageSize) : 10

    if (pageNumber < 0) return ['the page cannot be less than zero ']
    if (pageSizeNumber < 0) return ['Page size cannot be less than zero']

    return [, new PaginationDto({ page: pageNumber, pageSize: pageSizeNumber })]

  }



}