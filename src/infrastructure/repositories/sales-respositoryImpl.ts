import { SalesDto } from '../../domain/dto/sales/sales.dto';
import { SalesEntity } from '../../domain/entities/sales.entity';
import { SalesRepository } from '../../domain/repositories/sales.repository';
import { SalesDatasource } from '../../domain/datasource/sales.datasourece';
export class SalesRepositoryImpl extends SalesRepository {

  constructor(private readonly salesDatasource:SalesDatasource){
    super()
  }

  getSales(filters: SalesDto): Promise<SalesEntity[]> {
   return this.salesDatasource.getSales(filters)
  }

}