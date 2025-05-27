import { CheckFieldDto } from "../dto/auth/check-field.dto";
import { CreateAuthDto } from "../dto/auth/create-auth.dto";
import { LoginDto } from "../dto/auth/login-user.dto";


export abstract class AuthDatasource<T , CDto extends CreateAuthDto> {

  abstract login(loginDto: LoginDto): Promise<T | null>

  abstract create(dto: CDto): Promise<T>

  abstract checkField(checkFieldDto: CheckFieldDto): Promise<Boolean>
}