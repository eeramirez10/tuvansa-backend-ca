interface GetMonthlySalesSummaryResponseDtoOptions {
  year: number
  month: number
  customerCode: string
  customerName: string
  taxId: string
  subtotalAmount: number
  totalAmount: number
}

export class GetMonthlySalesSummaryResponseDto {
  public readonly year: number
  public readonly month: number
  public readonly customerCode: string
  public readonly customerName: string
  public readonly taxId: string
  public readonly subtotalAmount: number
  public readonly totalAmount: number

  constructor(options: GetMonthlySalesSummaryResponseDtoOptions) {
    this.year = options.year
    this.month = options.month
    this.customerCode = options.customerCode
    this.customerName = options.customerName
    this.taxId = options.taxId
    this.subtotalAmount = options.subtotalAmount
    this.totalAmount = options.totalAmount
  }
}
