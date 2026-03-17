import { SearchErpUsersQueryDto } from '../../domain/dto/erp-users/search-erp-users-query.dto';
import { ErpUserRepository } from '../../domain/repositories/erp-user.repository';


export class SearchErpUsersUseCase {

  constructor(private readonly repository: ErpUserRepository) { }

  async execute(dto: SearchErpUsersQueryDto) {

    const { query, by, limit } = dto
    const users = this.repository.search(query, { by, limit })


    return users

  }
}