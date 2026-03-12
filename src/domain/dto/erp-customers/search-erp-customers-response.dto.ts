interface SearchErpCustomersResponseDtoOptions {
  externalId: string
  code: string
  displayName: string
  firstName: string
  lastName: string
  whatsapp: string
  phone: string
  email: string
  taxId: string
  companyName: string
  isActive: boolean
  source: 'ERP'
  branchCode: string
  salesmanCode: string
  billingStreet: string
  billingColony: string
  billingCity: string
  billingState: string
  billingPostalCode: string
  billingCountry: string
  lastSyncedAt: string
}

export class SearchErpCustomersResponseDto {
  public readonly externalId: string
  public readonly code: string
  public readonly displayName: string
  public readonly firstName: string
  public readonly lastName: string
  public readonly whatsapp: string
  public readonly phone: string
  public readonly email: string
  public readonly taxId: string
  public readonly companyName: string
  public readonly isActive: boolean
  public readonly source: 'ERP'
  public readonly branchCode: string
  public readonly salesmanCode: string
  public readonly billingStreet: string
  public readonly billingColony: string
  public readonly billingCity: string
  public readonly billingState: string
  public readonly billingPostalCode: string
  public readonly billingCountry: string
  public readonly lastSyncedAt: string

  constructor(options: SearchErpCustomersResponseDtoOptions) {
    this.externalId = options.externalId
    this.code = options.code
    this.displayName = options.displayName
    this.firstName = options.firstName
    this.lastName = options.lastName
    this.whatsapp = options.whatsapp
    this.phone = options.phone
    this.email = options.email
    this.taxId = options.taxId
    this.companyName = options.companyName
    this.isActive = options.isActive
    this.source = options.source
    this.branchCode = options.branchCode
    this.salesmanCode = options.salesmanCode
    this.billingStreet = options.billingStreet
    this.billingColony = options.billingColony
    this.billingCity = options.billingCity
    this.billingState = options.billingState
    this.billingPostalCode = options.billingPostalCode
    this.billingCountry = options.billingCountry
    this.lastSyncedAt = options.lastSyncedAt
  }
}
