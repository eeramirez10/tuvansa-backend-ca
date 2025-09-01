import { CustomerEntity } from "../entities/customer.entity";
import { PaginationResult } from "../entities/pagination-result";
import { CustomerPaginationDto } from '../dto/customer-pagination.dto';

export abstract class CustomerDatasource {


  abstract getList(customerPaginationDto: CustomerPaginationDto): Promise<PaginationResult<CustomerEntity>>

  abstract getById(customerId: string): Promise<CustomerEntity>


}