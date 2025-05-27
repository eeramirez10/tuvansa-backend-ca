import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { CreateClientDto } from "../../domain/dto/client/create-client.dto";
import { ClientEntity } from "../../domain/entities/client.entity";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { ClientAuthDatasource } from "../datasource/client-auth-tuvansa.datasource";

export class ClientAuthRepositoryImpl extends AuthRepository<ClientEntity, CreateClientDto> {

  constructor(private readonly clientAuthDatasource: ClientAuthDatasource){
    super();
  }
  
  login(loginDto: LoginDto): Promise<ClientEntity> {
    return this.clientAuthDatasource.login(loginDto)
  }
  create(dto: CreateClientDto): Promise<ClientEntity> {
    return this.clientAuthDatasource.create(dto)
  }
  checkField(checkFieldDto: CheckFieldDto): Promise<Boolean> {
    return this.clientAuthDatasource.checkField(checkFieldDto)
  }

}