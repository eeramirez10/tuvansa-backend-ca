import { Validators } from "../../../config/utils/validators"


interface ExecuteOptions {

  email: string
  password: string

}



export class LoginDto {

  constructor(public readonly email: string, public readonly password: string) { }


  static execute(options: { [key: string]: any }): [string?, LoginDto?] {


    const { email, password } = options

    if (!email) return ['El email es requerido']
    if (!Validators.email.test(email)) return ['No es un correo valido ']
    if (!password) return ['La contraseña es requerida']
    if (password.length < 5) ['La contraseña es muy corta']


    return [undefined, new LoginDto(email, password)]
  }
}