import { Validators } from "../../../config/utils/validators";
import { CreateAuthDto } from "../auth/create-auth.dto";



interface Options {
  name: string;
  email: string;
  rfc: string;
  businessName: string;
  taxRegime: string;
  password: string;
}


export class CreateClientDto extends CreateAuthDto {

  readonly name: string;
  readonly email: string;
  readonly rfc: string;
  readonly businessName: string;
  readonly taxRegime: string;
  readonly password: string;

  constructor(options: Options) {
    super(options);
    this.name = options.name
    this.email = options.email
    this.rfc = options.rfc
    this.businessName = options.businessName
    this.taxRegime = options.taxRegime
    this.password = options.password

  }


  static execute(object: { [key: string]: any }): [string?, CreateClientDto?] {
    const {
      name,
      email,
      rfc,
      businessName,
      taxRegime = '',
      password,

    } = object
    if (!rfc) return ['Missing RFC']
    if(!businessName) return ['Missing Business Name']
    if (!name) return ['Missing name'];
    if (!email) return ['Missing email'];
    if (!Validators.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password too short'];

    return [undefined, new CreateClientDto({
      name,
      email,
      rfc,
      businessName,
      taxRegime,
      password,
    })]

  }

}