import { CheckFieldDto } from "../../domain/dto/auth/check-field.dto";
import { AuthRepository } from "../../domain/repositories/auth.repository";



export class CheckFieldUseCase {

  constructor(private readonly authRepository: AuthRepository<any, any>) {

  }
  async execute(checkFieldDto: CheckFieldDto) {

    return this.authRepository.checkField(checkFieldDto)

  }
}