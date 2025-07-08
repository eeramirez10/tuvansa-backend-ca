import { Validators } from '../../../config/utils/validators';
import { BRANCHS } from './create-user.dto';
import { Branch, $Enums } from '@prisma/client';

interface OptionsUpdateUserDto {
  id: string
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  lastname?: string;
  role?: 'USER' | 'ADMIN';
  branch?: string;
  accesibleBranches?: string[]; // e.g. ['MEXICO', 'QUERETARO']
  isActive?: boolean;

}


export class UpdateUserDto {

  public readonly id: string
  public readonly username?: string;
  public readonly email?: string;
  public readonly password?: string;
  public readonly name?: string;
  public readonly lastname?: string;
  public readonly role?: 'USER' | 'ADMIN';
  public readonly branch?: string;
  public readonly accesibleBranches?: string[]; // e.g. ['MEXICO', 'QUERETARO']
  public readonly isActive?: boolean;

  constructor(options: OptionsUpdateUserDto) {

    this.id = options.id
    this.username = options.username
    this.email = options.email
    this.password = options.password
    this.name = options.name
    this.lastname = options.lastname
    this.role = options.role
    this.branch = options.branch
    this.accesibleBranches = options.accesibleBranches
    this.isActive = options.isActive
  }


  static execute(options: OptionsUpdateUserDto): [string?,  Record<string, any>?] {

    const {
      id,
      username,
      email,
      password,
      name,
      lastname,
      role,
      branch,
      isActive,
      accesibleBranches
    } = options;

 

    const data: any = {}

    const validBranches = ["MEXICO", "MONTERREY", "VERACRUZ", "MEXICALI", "QUERETARO", "CANCUN","CABOS"];
    const validRoles = ["USER", "ADMIN"];

    if (!id) return ['id is Required']
    if(!Validators.isUUID(id)) return ['Id is not valid']
    if (username !== undefined) data.username = username;
    if (email !== undefined) data.email = email;
    if (name !== undefined) data.name = name;
    if (lastname !== undefined) data.lastname = lastname;
    if (role !== undefined && validRoles.includes(role.toUpperCase())) data.role = role.toUpperCase();
    if (branch !== undefined && validBranches.includes(branch)) data.branch = branch.toUpperCase();
    if (isActive !== undefined) data.isActive = isActive;
    if (password !== undefined) data.password = password
    if (accesibleBranches !== undefined) {
      if (
        !Array.isArray(accesibleBranches) ||
        !accesibleBranches.every((b) => validBranches.includes(b.toUpperCase()))
      ) {
        return ['Branchs no valid'];
      }
      data.accesibleBranches = accesibleBranches;
    }

    data.id = id;

    return [undefined, data]
  }

}