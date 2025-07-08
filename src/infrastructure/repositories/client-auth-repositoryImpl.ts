import { AuthPaginationDto } from "../../domain/dto/auth/auth-pagination.dto";
import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { CreateClientDto } from "../../domain/dto/client/create-client.dto";
import { ClientEntity } from "../../domain/entities/client.entity";
import { PaginationResult } from "../../domain/entities/pagination-result";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { ClientAuthDatasource } from "../datasource/client-auth-tuvansa.datasource";

export class ClientAuthRepositoryImpl extends AuthRepository<ClientEntity, CreateClientDto> {
  getAll(authPaginationDto: AuthPaginationDto): Promise<PaginationResult<ClientEntity>> {
    throw new Error("Method not implemented.");
  }
  getOne(id: string): Promise<ClientEntity | null> {
    throw new Error("Method not implemented.");
  }

  
  updateUser(updateUserDto: Record<string, any>): Promise<ClientEntity> {
    throw new Error("Method not implemented.");
  }

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