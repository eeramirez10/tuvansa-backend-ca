import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { CreateClientDto } from "../../domain/dto/client/create-client.dto";
import { ClientEntity } from "../../domain/entities/client.entity";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { JwtAdapter } from "../../infrastructure/adapters/jwt-adapter";



export class LoginClientUseCase {

  constructor(
    private readonly authRepository: AuthRepository<ClientEntity, CreateClientDto>,
    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }


  async execute(loginUserDto: LoginDto) {

    const client = await this.authRepository.login(loginUserDto)

    if(!client) throw CustomError.BadRequest('Client not found')

    const { id, password, ...rest } = client

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