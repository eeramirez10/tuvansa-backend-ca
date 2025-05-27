
import { CreateAuthDto, Role } from './create-auth.dto';
import { Validators } from '../../../config/utils/validators';
import { Branch, $Enums } from '@prisma/client';

const BRANCHS = [
  'MEXICO',
  'MONTERREY',
  'VERACRUZ',
  'MEXICALI',
  'QUERETARO',
  'CANCUN',
]


interface Options {
  name: string
  lastname: string
  email: string
  password: string
  isActive: boolean
  branch: Branch;
  username: string
  role?: $Enums.Role
}


export class CreateUserDto extends CreateAuthDto {

  public readonly name: string
  public readonly lastname: string
  public readonly username: string
  public readonly email: string
  public readonly password: string
  public readonly isActive: boolean
  public readonly branch: Branch
  public readonly role?: $Enums.Role



  constructor(options: Options) {
    super(options);
    this.name = options.name
    this.lastname = options.lastname
    this.email = options.email
    this.password = options.password
    this.isActive = options.isActive
    this.username = options.username
    this.branch = options.branch
    this.role = options.role
  }

  static execute(options: Options): [string?, CreateUserDto?] {

    const {
      name,
      lastname,
      email,
      password,
      role,
      isActive = true,
      branch,
      username
    } = options


    if (!name) return ['Missing name'];
    if (!lastname) return ['Missing lastname'];
    if (!username) return ['Missing username'];
    if (!email) return ['Missing email'];
    if (!branch) return ['Missing branch'];
    if (!BRANCHS.includes(branch.toUpperCase())) return [`${branch} is not a valid branch`]
    if (!Validators.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];


    return [
      undefined,
      new CreateUserDto({
        name,
        lastname,
        email,
        password,
        role,
        isActive,
        branch: branch.toUpperCase() as Branch,
        username
      })]
  }
}