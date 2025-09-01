interface ContactOptions {
  id:string
  name: string
  jobTitle?: string
  phone?: string

  email?: string
  mobile?: string

}



export class ContactEntity {
  id:string
  name: string
  jobTitle?: string
  phone?: string
 
  email?: string
  mobile?: string

  constructor(data: ContactOptions) {
    this.id = data.id
    this.name = data.name
    this.jobTitle = data.jobTitle
    this.phone = data.phone
    this.email = data.email
    this.mobile = data.mobile
  }
}