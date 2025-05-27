import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { CreateClientDto } from "../../domain/dto/client/create-client.dto";
import { ClientEntity } from "../../domain/entities/client.entity";
import { UserEntity } from "../../domain/entities/user";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { JwtAdapter } from "../../infrastructure/adapters/jwt-adapter";



export class RegisterClientUseCase {


  constructor(
    private readonly authRepository: AuthRepository<ClientEntity, CreateClientDto>,
    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }


  async execute(createDto: CreateClientDto) {


    const { id, password, ...rest } = await this.authRepository.create(createDto)

    const token = await this.signToken({ id })

    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      token,
      client: {
        id,
        ...rest
      }

    }




  }

}