import { $Enums, User } from "@prisma/client"


interface Option {

  name: string;
  id: string;
  username: string;
  lastname: string;
  email: string;
  password: string;
  role: $Enums.Role;
  branch: $Enums.Branch;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

}

export class UserEntity implements User {
  readonly name: string;
  readonly lastname: string;
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: $Enums.Role;
  readonly branch: $Enums.Branch;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;


  constructor(options: Option) {
    this.name = options.name
    this.id = options.id
    this.username = options.username
    this.email = options.email
    this.password = options.password
    this.role = options.role
    this.branch = options.branch
    this.isActive = options.isActive
    this.createdAt = options.createdAt
    this.updatedAt = options.updatedAt
    this. lastname = options.lastname
  }



}