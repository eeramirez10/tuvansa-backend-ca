import { AuthDatasource } from "../../domain/datasource/auth.datasource";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user";
import { AuthRepository } from "../../domain/repositories/auth.repository";

export class UserAuthRepositoryImpl extends AuthRepository<UserEntity, CreateUserDto> {

  constructor(private readonly userAuthDatasource: AuthDatasource<UserEntity, CreateUserDto>){super()}

  
  login(loginDto: LoginDto): Promise<UserEntity | null> {
    return this.userAuthDatasource.login(loginDto);
  }
  create(dto: CreateUserDto): Promise<UserEntity> {
    return this.userAuthDatasource.create(dto);
  }
  checkField(checkFieldDto: CheckFieldDto): Promise<Boolean> {
    return this.checkField(checkFieldDto)
  }

}