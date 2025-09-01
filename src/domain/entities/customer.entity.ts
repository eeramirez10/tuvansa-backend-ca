import { ContactEntity } from "./contact.entity"


interface CustomerEntityOption {

  id: string
  agent: string
  customerId: string
  name: string
  state?: string
  paymentTermDays?: number
  creditLimit?: number
  currentBalance?: number
  contacts: ContactEntity[]

}


export class CustomerEntity {

  id: string
  agent: string
  customerId: string
  name: string
  state?: string
  paymentTermDays?: number
  creditLimit?: number
  currentBalance?: number
  contacts: ContactEntity[]     // CONTCEL

  constructor(data: CustomerEntityOption) {
    this.id = data.id
    this.agent = data.agent
    this.customerId = data.customerId
    this.name = data.name
    this.state = data.state
    this.paymentTermDays = data.paymentTermDays
    this.creditLimit = data.creditLimit
    this.currentBalance = data.currentBalance
    this.contacts = data.contacts
  }


}