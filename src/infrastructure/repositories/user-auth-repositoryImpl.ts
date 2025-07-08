import { AuthDatasource } from "../../domain/datasource/auth.datasource";
import { AuthPaginationDto } from "../../domain/dto/auth/auth-pagination.dto";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { UpdateUserDto } from "../../domain/dto/auth/update-user.dto";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { UserEntity } from "../../domain/entities/user";
import { AuthRepository } from "../../domain/repositories/auth.repository";

export class UserAuthRepositoryImpl extends AuthRepository<UserEntity, CreateUserDto> {
  getOne(id: string): Promise<UserEntity | null> {
    return this.userAuthDatasource.getOne(id)
  }



  getAll(authPaginationDto: AuthPaginationDto): Promise<PaginationResult<UserEntity>> {
    return this.userAuthDatasource.getAll(authPaginationDto)
  }

  constructor(private readonly userAuthDatasource: AuthDatasource<UserEntity, CreateUserDto>) { super() }


  login(loginDto: LoginDto): Promise<UserEntity | null> {
    return this.userAuthDatasource.login(loginDto);
  }
  create(dto: CreateUserDto): Promise<UserEntity> {
    return this.userAuthDatasource.create(dto);
  }
  checkField(checkFieldDto: CheckFieldDto): Promise<Boolean> {
    return this.checkField(checkFieldDto)
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userAuthDatasource.updateUser(updateUserDto)
  }

 

}