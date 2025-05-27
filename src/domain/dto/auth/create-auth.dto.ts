

export enum Role {
  USER,
  ADMIN
}

export enum Branch {
  MEXICO,
  MONTERREY,
  VERACRUZ,
  MEXICALI,
  QUERETARO,
  CANCUN,
}




export interface CreateAuthDtoOption {
  email: string;
  password: string;
  name?: string;
}

export class CreateAuthDto {

  public email: string;
  public password: string;
  public name?: string;

  constructor(options: CreateAuthDtoOption) {

    this.email = options.email
    this.password = options.password
    this.name = options.name
  }


}