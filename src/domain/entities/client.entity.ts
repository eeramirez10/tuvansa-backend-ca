import { Client } from "@prisma/client";


interface Option {
  name: string | null;
  id: string;
  username: string;
  email: string;
  rfc: string;
  businessName: string;
  taxRegime: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

}

export class ClientEntity implements Client {
  readonly name: string | null;
  readonly id: string;
  readonly email: string;
  readonly rfc: string;
  readonly businessName: string;
  readonly taxRegime: string;
  readonly password: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(options: Option) {
    this.name = options.name
    this.id = options.id
    this.email = options.email
    this.rfc = options.rfc
    this.businessName = options.businessName
    this.taxRegime = options.taxRegime
    this.password = options.password
    this.isActive = options.isActive
    this.createdAt = options.createdAt
    this.updatedAt = options.updatedAt
  }
}