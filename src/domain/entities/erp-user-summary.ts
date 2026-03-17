

export interface ErpUserSummaryOption {
  code: string
  description: string
}

export class ErpUserSummary {

  public readonly code: string
  public readonly description: string

  constructor(options: ErpUserSummaryOption) {
    this.code = options.code
    this.description = options.description
  }


}