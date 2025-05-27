import { UserEntity } from "../../domain/entities/user";
import { CustomError } from "../../domain/errors/custom-error";
import { JwtAdapter } from "../../infrastructure/adapters/jwt-adapter";


export class RenewTokenUseCase {

  constructor(

    private readonly signToken: (payload: Object, duration?: string) => Promise<string | null> = JwtAdapter.generateToken
  ) { }

  async execute(user: UserEntity) {

    const { password, ...rest } = user

    const token = await this.signToken({ id: user.id })

    if (!token) throw CustomError.internalServer('Error generating token');


    return {
      token,
      user: {
        ...rest
      }
    }
  }


}