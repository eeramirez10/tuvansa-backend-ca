import { GetErpUserByCodeParamsDto } from '../../domain/dto/erp-users/get-erp-user-by-code-params.dto';
import { ErpUserRepository } from '../../domain/repositories/erp-user.repository';


export class GetErpUserByCodeUseCase {

  constructor(private readonly repository: ErpUserRepository){}


  async execute(dto:GetErpUserByCodeParamsDto){


    return this.repository.findByCode(dto.code)


  }
}