import { CreateUserDto } from "../../domain/dto/auth/create-user.dto";
import { LoginDto } from "../../domain/dto/auth/login-user.dto";
import { UserEntity } from "../../domain/entities/user";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { JwtAdapter } from "../../infrastructure/adapters/jwt-adapter";



export class LoginUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository<UserEntity, CreateUserDto>,
    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }


  async execute(loginUserDto: LoginDto) {


    const user = await this.authRepository.login(loginUserDto)

    if (!user) throw CustomError.notFound('User not found')

    const { id, password, ...rest } = user


    const token = await this.signToken({ id })

    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      token,
      user: {
        id,
        ...rest
      }

    }
  }
}