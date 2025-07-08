import { CheckFieldDto } from "../dto/auth/check-field.dto";
import { CreateAuthDto } from "../dto/auth/create-auth.dto";
import { LoginDto } from "../dto/auth/login-user.dto";
import { UpdateUserDto } from "../dto/auth/update-user.dto";
import { PaginationResult } from "../entities/pagination-result";
import { AuthPaginationDto } from '../dto/auth/auth-pagination.dto';


export abstract class AuthDatasource<T, CDto extends CreateAuthDto> {

  abstract login(loginDto: LoginDto): Promise<T | null>

  abstract create(dto: CDto): Promise<T>

  abstract checkField(checkFieldDto: CheckFieldDto): Promise<Boolean>

  abstract updateUser(updateUserDto: Record<string, any>): Promise<T>

  abstract getAll(authPaginationDto: AuthPaginationDto): Promise<PaginationResult<T>>

  abstract getOne(id: string): Promise<T | null>
}